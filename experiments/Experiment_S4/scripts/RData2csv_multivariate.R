rm(list = ls())
library(reshape2)

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

# function to compute R^2
compute.rsquared <- function(chance.mse, model.mse) {
  rsq <- 1 - model.mse/chance.mse
  return(rsq)
}

args <- commandArgs(trailingOnly=TRUE)
inPath <- args[1L]
outPath <- args[2L]
outPath2 <- args[3L]
outPath3 <- args[4L]

load(inPath)

num.models <- length(mse)
rsquared <- lapply(1:num.models, FUN = function(x) compute.rsquared(mse.chance.train[[x]], mse[[x]]))
rsquared.mv <- sapply(rsquared, FUN = median)
mse.mv <- sapply(mse, FUN = median)
best.idx <- which(rsquared.mv == max(rsquared.mv))
if (length(best.idx) > 1L) {
  # if more than one best model wrt median rsquared, apply Occam's razor
  best.idx <- max(best.idx)
}

cat(paste0("Best model rsquared: ", rsquared.mv[best.idx], "\n"))
cat(paste0("Best model mse: ", mse.mv[best.idx], "\n"))

perm.imp.rf <- perm.imp[[best.idx]]
matcols <- features[[best.idx]]

perm.imp.rf <- aperm(perm.imp.rf, c(1L, 3L, 2L))
perm.imp.rf <- matrix(perm.imp.rf, prod(dim(perm.imp.rf)[1:2]), dim(perm.imp.rf)[3L])
imp.mean <- apply(perm.imp.rf, 2L, mean, na.rm = TRUE)
imp.median <- apply(perm.imp.rf, 2L, median, na.rm = TRUE)
imp.sd <- apply(perm.imp.rf, 2L, sd, na.rm = TRUE)
imp.sem <- apply(perm.imp.rf, 2L, sd, na.rm = TRUE)/sqrt(nrow(perm.imp.rf))
imp.q25 <- apply(perm.imp.rf, 2L, function(x) median(x, na.rm = TRUE) - quantile(x, 1/4, na.rm = TRUE))
imp.q75 <- apply(perm.imp.rf, 2L, function(x) quantile(x, 3/4, na.rm = TRUE) - median(x, na.rm = TRUE))
sort.idx <- order(imp.median, decreasing = TRUE)

# sort tied median values by mean
sort.idx <- sort.secondary(imp.median, imp.mean, decreasing = TRUE)

matcols <- matcols[sort.idx]
imp.mean <- imp.mean[sort.idx]
imp.median <- imp.median[sort.idx]
imp.sd <- imp.sd[sort.idx]
imp.sem <- imp.sem[sort.idx]
imp.q25 <- imp.q25[sort.idx]
imp.q75 <- imp.q75[sort.idx]
perm.imp.rf <- perm.imp.rf[, sort.idx]
D <- data.frame(Feature=matcols, Importance.mean=imp.mean,
                Importance.median=imp.median, Importance.sd=imp.sd,
                Importance.sem=imp.sem, Importance.q25=imp.q25,
                Importance.q75=imp.q75
              )
write.csv(D, file= outPath, row.names=F, quote=F)

colnames(perm.imp.rf) <- matcols
D <- melt(perm.imp.rf)[2:3]
colnames(D) <- c("Feature", "Importance")
write.csv(D, file= outPath2, row.names=F, quote=F)

rank.mat <- t(apply(-perm.imp.rf, 1L, rank))
rank.mean <- apply(rank.mat, 2L, mean)
rank.median <- apply(rank.mat, 2L, median)
sort.idx <- sort.secondary(rank.median, rank.mean, decreasing = FALSE)
rank.mat <- rank.mat[, sort.idx]
D <- melt(rank.mat)[2:3]
colnames(D) <- c("Feature", "Importance")
write.csv(D,
          file = outPath3,
          row.names = FALSE,
          quote = FALSE
         )
