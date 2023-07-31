rm(list = ls())
library(rerf)
library(caret)
set.seed(20211012L)

# read in free_choice-week regression data and 10-fold partitioning
mydf <- read.table(file="data/free_choice_tv_series_distance_features.csv", sep=",", header=T)
rmcols <- c('overallSimilarity', 'moreRecent')
Y <- mydf$overallSimilarity
mydf <- mydf[, !(names(mydf) %in% rmcols)]
X <- as.matrix(mydf)
matcols <- colnames(X)

num.folds <- 10L
num.trials <- 5L
n <- nrow(X)
p <- ncol(X)

# RerF params
num.cores <- 4L
num.trees <- 500L
min.parent <- c(4L, 8L, 16L, 32L)
max.depth <- 0L
random.matrix <- RandMatRF
d <- 1L
sparsity <- 1/p
num.models <- length(min.parent)
replacement <- TRUE
bagging <- 0.2
eps <- 0

# initialize variables for storing results
mse.rf <- array(dim = c(num.folds, p, num.trials), dimnames = list(paste0("Fold.", 1:num.folds), matcols, paste0("Trial.", 1:num.trials)))
chance.mse <- matrix(rep(NA, num.folds*num.trials), num.folds, num.trials)

for (trial in 1:num.trials) {
  cat(paste0("Current Trial: ", trial, "\n"))
  load(paste0("data/free_choice_tv_series_regression_partitions_", trial, ".RData")) # loads partitions object
  for (fold in 1:num.folds) {
    # perform regression on current data partition
    cat(paste0("Current Fold: ", fold, "\n"))

    chance.pred <- mean(Y[-partitions[[fold]]])
    chance.mse[fold, trial] <- mean((chance.pred - Y[partitions[[fold]]])^2)

    for (feature in matcols) {
      # cat(paste0("Assesing feature: ", feature, "\n"))

      forests <- rep(list(NULL), num.models)
      oob.error <- rep(NA, num.models)
      for (i in seq.int(num.models)) {
        # cat(paste0("min.parent = ", min.parent[i], "\n"))
        forests[[i]] <- RerF(X[-partitions[[fold]], feature, drop = FALSE], Y[-partitions[[fold]]], FUN = random.matrix,
                             paramList = list(p = 1L, d = d, sparsity = sparsity, prob = 0.5),
                             min.parent = min.parent[i], max.depth = max.depth, trees = num.trees,
                             replacement = replacement, bagging = bagging,
                             num.cores = num.cores, store.impurity = FALSE,
                             store.oob = TRUE, task="regression", eps=0, honesty = FALSE)

        predictions <- Predict(X[-partitions[[fold]], feature, drop = FALSE], forests[[i]], OOB = TRUE, num.cores)
        oob.error[i] <- mean((predictions - Y[-partitions[[fold]]])^2)
        # cat(paste0("oob.error = ", oob.error[i], "\n"))
      }
      # remove all regressors except for the one with lowest oob error
      best.idx <- order(oob.error)[1L]
      # cat(paste0("best min parent: ", min.parent[best.idx], "\n"))
      forest <- forests[[best.idx]]
      rm("forests")

      # compute important summary statistics
      # cat("Computing regression performance metrics\n")
      predictions <- Predict(X[partitions[[fold]], feature, drop = FALSE], forest, OOB = FALSE, num.cores = num.cores)
      mse.rf[fold, feature, trial] <- mean((predictions - Y[partitions[[fold]]])^2)
      # cat(paste0("RF R^2 = ", 1 - mse.rf[fold, feature, trial]/chance.mse[fold, trial], "\n"))
      # cat("\n")
    }
  }
}

save("matcols", "mse.rf", "chance.mse", file = "results/free_choice_tv_series_regression_rf_univariate.RData", version = 2)
