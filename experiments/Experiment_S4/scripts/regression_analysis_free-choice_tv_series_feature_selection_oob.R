# evaluate MV RF models and compute feature importances

rm(list = ls())
library(rerf)
library(caret)
set.seed(20211012L)

# function to compute mode of factor array
compute.mode <- function(x) {
  cts <- tabulate(x)
  ct.max <- max(cts)
  md <- levels(x)[match(ct.max, cts)]
  return(md)
}

# function to compute cohen's kappa
compute.kappa <- function(chance.acc, model.acc) {
  kp <- (model.acc - chance.acc)/(1 - chance.acc)
  return(kp)
}

# function to apply one-sided sign rank test on feature importances
runWilcox <- function(feature.imp) {
  p <- dim(feature.imp)[2L]
  r <- apply(-feature.imp, c(1L,3L), rank)
  r.chance <- mean(c(1, p))
  pvals <- apply(r.chance - r, 1L, function(x) wilcox.test(x, alternative="greater")$p.value)
  return(pvals)
}

# function to compute number of feature subset iterations
n.iter <- function(p, threshold) {
  i <- 0L
  z <- ceiling(p/2)
  while (z >= threshold) {
    z <- ceiling(z/2)
    i <- i + 1L
  }
  return(i - 1L)
}

# read in free_choice-week regression data and 10-fold partitioning
mydf <- read.table(file="data/free_choice_tv_series_distance_features.csv", sep=",", header=T)
rmcols <- c('overallSimilarity', 'moreRecent')
Y <- mydf$overallSimilarity
mydf <- mydf[, !(names(mydf) %in% rmcols)]
Xall <- as.matrix(mydf)
matcols <- colnames(Xall)

num.folds <- 10L
num.trials <- 5L
n <- nrow(Xall)
p <- ncol(Xall)
niter <- n.iter(p, 5L)

perm.imp <- vector(mode="list", niter + 1L)
features <- vector(mode="list", niter + 1L)
mse <- vector(mode="list", niter + 1L)
mse.chance <- vector(mode="list", niter + 1L)
mse.chance.train <- vector(mode="list", niter + 1L)
mse.chance.val <- vector(mode="list", niter + 1L)

# iteratively select the best 50% of features
for (it in 1:(niter+1L)) {
  cat(paste0("running feature subset iteration ", it, "\n"))
  # if first iteration, run full feature set, else select features based on rankings from previous iteration
  if (it == 1L) {
    features[[it]] <- matcols
  } else {
    pvals <- runWilcox(perm.imp[[it-1L]])
    sort.idx <- order(pvals)
    keep.idx <- sort.idx[1:ceiling(p/2)]
    features[[it]] <- features[[it-1L]][keep.idx]
  }
  X <- Xall[, features[[it]], drop = FALSE]
  p <- ncol(X)

  # RerF params
  num.cores <- 4L
  num.trees <- 500L
  min.parent <- c(4L, 8L, 16L, 32L)
  max.depth <- 0L
  random.matrix <- RandMatRF
  d <- unique(round(p^c(1/4, 1/2, 3/4, 1))) # p^d random features evaluated at each split node
  sparsity <- 1/p
  num.models <- length(d)
  replacement <- TRUE
  bagging <- 0.2
  eps <- 0
  model.grid <- vector("list", length(d)*length(min.parent))
  k <- 1L
  for (i in seq_along(min.parent)) {
    for (j in seq_along(d)) {
      model.grid[[k]] <- c(d[j], min.parent[i])
      k <- k + 1L
    }
  }
  num.models <- length(model.grid)

  # initialize variables for storing results
  mse[[it]] <- matrix(NA, num.folds, num.trials)
  perm.imp[[it]] <- array(dim = c(num.folds, p, num.trials))
  mse.chance[[it]] <- matrix(NA, num.folds, num.trials)
  mse.chance.train[[it]] <- matrix(NA, num.folds, num.trials)
  mse.chance.val[[it]] <- matrix(NA, num.folds, num.trials)

  for (trial in 1:num.trials) {
    cat(paste0("Current Trial: ", trial, "\n"))
    load(paste0("data/free_choice_tv_series_regression_partitions_", trial, ".RData")) # loads partitions object
    for (fold in 1:num.folds) {
      # perform regression on current data partition
      cat(paste0("Current Fold: ", fold, "\n"))

      # mse.chance
      mse.chance[[it]][fold, trial] <- mean((mean(Y) - Y[partitions[[fold]]])^2)

      # mse.chance.train
      chance.pred <- mean(Y[-partitions[[fold]]])
      mse.chance.train[[it]][fold, trial] <- mean((chance.pred - Y[partitions[[fold]]])^2)

      # mse.chance.val
      chance.pred <- mean(Y[partitions[[fold]]])
      mse.chance.val[[it]][fold, trial] <- mean((chance.pred - Y[partitions[[fold]]])^2)

      # sample random seed for SPORF, fixed per trial
      seed <- sample.int(10000L, 1L)

      cat("performing grid search hyperparameter optimization\n")
      go <- TRUE
      while (go) {
        forests <- rep(list(NULL), num.models)
        oob.error <- rep(NA, num.models)
        for (i in seq.int(num.models)) {
          cat(paste0("d = ", model.grid[[i]][1L], "\n"))
          cat(paste0("min.parent = ", model.grid[[i]][2L], "\n"))
          forests[[i]] <- RerF(X[-partitions[[fold]], , drop = FALSE], Y[-partitions[[fold]]], FUN = random.matrix,
                               paramList = list(p, model.grid[[i]][1L], sparsity, 0.5),
                               min.parent = model.grid[[i]][2L], max.depth = max.depth,
                               num.cores = num.cores, store.impurity = FALSE,
                               store.oob = TRUE, task = "regression", seed = seed
                              )
          predictions <- OOBPredict(X[-partitions[[fold]], , drop = FALSE], forests[[i]], num.cores)
          oob.error[i] <- mean((predictions - Y[-partitions[[fold]]])^2)
        }
        # remove all regressors except for the one with lowest oob error
        best.idx <- order(oob.error)[1L]
        forest <- forests[[best.idx]]
        rm("forests")
        gc() # run garbage collection after forests are trained

        cat("Computing regression performance metrics\n")
        predictions <- Predict(X[partitions[[fold]], , drop = FALSE], forest, OOB = FALSE, num.cores = num.cores)
        mse[[it]][fold, trial] <- mean((predictions - Y[partitions[[fold]]])^2)
        go <- is.nan(mse[[it]][fold, trial])
     }
     cat(paste0("RF R^2 = ", 1 - mse[[it]][fold, trial]/mse.chance[[it]][fold, trial], "\n"))
     # compute important summary statistics
     cat("Computing permutation feature importance on withheld data\n")
     perm.imp[[it]][fold, , trial] <- FeatureImportance(forest, num.cores, "P", X[-partitions[[fold]], , drop = FALSE], Y[-partitions[[fold]]], OOB = TRUE)
     cat("\n")
    }
  }

  save("features", "perm.imp", "mse", "mse.chance", "mse.chance.train", "mse.chance.val", file = "results/free_choice_tv_series_regression_rf_feature_selection_oob.RData", version = 2)
}
