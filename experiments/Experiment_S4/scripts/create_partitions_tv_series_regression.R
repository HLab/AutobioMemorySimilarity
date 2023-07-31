rm(list = ls())
library(caret)
set.seed(555L)

# read in free_choice-week regression data and 10-fold partitioning
mydf <- read.table(file="data/free_choice_tv_series_distance_features.csv", sep=",", header=T)
Yreg <- mydf$overallSimilarity

num.folds <- 10L
num.trials <- 5L

# k-fold cross-validation partitions for regression
for (trial in 1:num.trials) {
  partitions <- createFolds(Yreg, k = num.folds)
  save(partitions, file = paste0("data/free_choice_tv_series_regression_partitions_", trial, ".RData"), version = 2)
}
