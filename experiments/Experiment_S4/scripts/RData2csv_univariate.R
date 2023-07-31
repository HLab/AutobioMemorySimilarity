# writes MSEs and R^2 values for each univariate model and multivariate model as columns

rm(list = ls())
library(reshape2)

# function to compute R^2
compute.rsquared <- function(chance.mse, model.mse) {
  rsq <- 1 - model.mse/chance.mse
  return(rsq)
}

# define function to sort tied values of an array by the order of a second array
sort.secondary <- function(x, y, decreasing = FALSE) {
  # x is primary array
  # y is secondary array

  # sort indices by x
  sort.idx <- order(x, decreasing = decreasing)

  x.sort <- x[sort.idx]
  y.sort <- y[sort.idx]
  x.unique <- unique(x.sort)

  # if there are repeat values, sort the corresponding indices by y
  if (length(x.unique) < length(x.sort)){
    for (xval in x.unique) {
      idx.rep <- which((x.sort == xval))
      if (length(idx.rep) > 1L) {
        sort.idx2 <- order(y.sort[idx.rep], decreasing = decreasing)
        sort.idx[idx.rep] <- sort.idx[idx.rep[sort.idx2]]
      }
    }
  }
  return(sort.idx)
}

args <- commandArgs(trailingOnly=TRUE)
inPath.uni <- args[1L]
inPath.multi <- args[2L]
outPath <- args[3L]
outPath2 <- args[4L]


load(inPath.uni)

mse.uni <- aperm(mse.rf, c(1L, 3L, 2L))

load(inPath.multi)
mse.chance <- mse.chance.train[[1L]]

rsquared.uni <- apply(mse.uni, 3, function(x) compute.rsquared(mse.chance, x))
colnames(rsquared.uni) <- dimnames(mse.uni)[[3L]]
mse.uni <- matrix(mse.uni, nrow=nrow(mse.uni)*ncol(mse.uni))
colnames(mse.uni) <- colnames(rsquared.uni)

num.models <- length(mse)
rsquared <- lapply(1:num.models, FUN = function(x) compute.rsquared(mse.chance.train[[x]], mse[[x]]))
rsquared.median <- sapply(rsquared, FUN = median)
mse.median <- sapply(mse, FUN = median)
best.idx <- which(rsquared.median == max(rsquared.median))
if (length(best.idx) > 1L) {
  # if more than one best model wrt median rsquared, apply Occam's razor
  best.idx <- max(best.idx)
}
rsquared.multi <- rsquared[[best.idx]]
mse.multi <- mse[[best.idx]]

rsquared.mat <- cbind(rsquared.uni, c(rsquared.multi))
colnames(rsquared.mat)[ncol(rsquared.mat)] <- "multivariate"
mse.mat <- cbind(mse.uni, c(mse.multi))
colnames(mse.mat) <- colnames(rsquared.mat)
rsquared.mean <- apply(rsquared.mat, 2L, mean)
rsquared.median <- apply(rsquared.mat, 2L, median)
sort.idx <- sort.secondary(rsquared.median, rsquared.mean, decreasing = TRUE)
rsquared.mat <- rsquared.mat[, sort.idx]
mse.mat <- mse.mat[, sort.idx]

write.csv(rsquared.mat, file = outPath, row.names = F, quote = F)
write.csv(mse.mat, file = outPath2, row.names = F, quote = F)
