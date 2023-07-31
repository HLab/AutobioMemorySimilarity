# evaluate MV RF models and compute feature importances

rm(list = ls())
library(rerf)
library(caret)
set.seed(20211009L)


# read in free_choice-week regression data and 10-fold partitioning
mydf <- read.table(file="data/free_choice_tv_series_distance_features.csv", sep=",", header=T)
Y <- mydf$overallSimilarity
mydf <- mydf[, c("activitySimilarity", "emotionalSimilarity")]
X <- as.matrix(mydf)
matcols <- colnames(X)


num.folds <- 10L
num.trials <- 5L
n <- nrow(X)
p <- ncol(X)

features <- matcols

# RerF params
num.cores <- 4L
num.trees <- 500L
min.parent <- c(4L, 8L, 16L, 32L)
max.depth <- 0L
random.matrix <- RandMatRF
d <- 1:p # number of random features evaluated at each split node
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
mse <- matrix(NA, num.folds, num.trials)
perm.imp <- array(dim = c(num.folds, p, num.trials))
mse.chance <- matrix(NA, num.folds, num.trials)
mse.chance.train <- matrix(NA, num.folds, num.trials)
mse.chance.val <- matrix(NA, num.folds, num.trials)

for (trial in 1:num.trials) {
  cat(paste0("Current Trial: ", trial, "\n"))
  load(paste0("data/free_choice_tv_series_regression_partitions_", trial, ".RData")) # loads partitions object
  for (fold in 1:num.folds) {
    # perform regression on current data partition
    cat(paste0("Current Fold: ", fold, "\n"))

    # mse.chance
    mse.chance[fold, trial] <- mean((mean(Y) - Y[partitions[[fold]]])^2)

    # mse.chance.train
    chance.pred <- mean(Y[-partitions[[fold]]])
    mse.chance.train[fold, trial] <- mean((chance.pred - Y[partitions[[fold]]])^2)

    # mse.chance.val
    chance.pred <- mean(Y[partitions[[fold]]])
    mse.chance.val[fold, trial] <- mean((chance.pred - Y[partitions[[fold]]])^2)

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
      mse[fold, trial] <- mean((predictions - Y[partitions[[fold]]])^2)
      go <- is.nan(mse[fold, trial])
   }
   cat(paste0("RF R^2 = ", 1 - mse[fold, trial]/mse.chance[fold, trial], "\n"))
   # compute important summary statistics
   cat("Computing permutation feature importance on withheld data\n")
   perm.imp[fold, , trial] <- FeatureImportance(forest, num.cores, "P", X[-partitions[[fold]], , drop = FALSE], Y[-partitions[[fold]]], OOB = TRUE)
   cat("\n")
  }
}

save("features", "perm.imp", "mse", "mse.chance", "mse.chance.train", "mse.chance.val", file = "results/free_choice_tv_series_regression_rf_emotionSimilarity_activitySimilarity.RData", version = 2)
