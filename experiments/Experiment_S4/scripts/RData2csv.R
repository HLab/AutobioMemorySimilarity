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

load("results/free_choice_tv_series_regression_rf_univariate.RData")

mse.rf <- aperm(mse.rf, c(1L, 3L, 2L))

mse.chance <- chance.mse

rsq.mat <- 1 - matrix(mse.rf, prod(dim(mse.rf)[1:2]), dim(mse.rf)[3L])/c(mse.chance)
colnames(rsq.mat) <- matcols

load("results/free_choice_tv_series_regression_rf_feature_selection_oob.RData")

mse.chance <- mse.chance.train[[1]]

rsq <- lapply(mse, FUN = function(x) 1 - x/mse.chance)
rsq.mv <- sapply(rsq, FUN = median)
best.idx <- which(rsq.mv == max(rsq.mv))
# best.idx <- 4L
if (length(best.idx) > 1L) {
  rsq.mv <- sapply(rsq[best.idx], FUN = mean)
  best.idx2 <- which(rsq.mv == max(rsq.mv))
  if (length(best.idx2) > 1L) {
    best.idx2 <- sample(best.idx2, 1L)
  }
  best.idx <- best.idx[best.idx2]
}

rsq.mat <- cbind(rsq.mat, c(rsq[[best.idx]]))
perm.imp.rf <- perm.imp[[best.idx]]

matcols <- features[[best.idx]]
colnames(rsq.mat)[ncol(rsq.mat)] <- "multivariate"

load("results/free_choice_tv_series_regression_rf_emotionSimilarity_activitySimilarity.RData")

mse.chance <- mse.chance.train

rsq <- 1 - mse/mse.chance
rsq.mat <- cbind(rsq.mat, c(rsq))
colnames(rsq.mat)[ncol(rsq.mat)] <- "emotion+activity"

rsq.mean <- apply(rsq.mat, 2L, mean)
rsq.median <- apply(rsq.mat, 2L, median)
sort.idx <- sort.secondary(rsq.median, rsq.mean, decreasing = TRUE)
rsq.mat <- rsq.mat[, sort.idx]

write.csv(rsq.mat,
          file = "results/free_choice_tv_series_regression_rsquared_rf_oob.csv",
          row.names = FALSE,
          quote = FALSE
         )

rank.mat <- t(apply(-rsq.mat, 1L, rank))
rank.mat <- rank.mat[, !(colnames(rank.mat) %in% c("multivariate", "emotion+activity"))]
write.csv(rank.mat,
          file = "results/free_choice_tv_series_regression_rsquared_rank_oob.csv",
          row.names = FALSE,
          quote = FALSE
         )

perm.imp.rf <- aperm(perm.imp.rf, c(1L, 3L, 2L))
perm.imp.rf <- matrix(perm.imp.rf, prod(dim(perm.imp.rf)[1:2]), dim(perm.imp.rf)[3L])
imp.mean <- apply(perm.imp.rf, 2L, mean, na.rm = TRUE)
imp.median <- apply(perm.imp.rf, 2L, median, na.rm = TRUE)
imp.sd <- apply(perm.imp.rf, 2L, sd, na.rm = TRUE)
imp.sem <- apply(perm.imp.rf, 2L, sd, na.rm = TRUE)/sqrt(nrow(perm.imp.rf))
imp.q25 <- apply(perm.imp.rf, 2L, function(x) median(x, na.rm = TRUE) - quantile(x, 1/4, na.rm = TRUE))
imp.q75 <- apply(perm.imp.rf, 2L, function(x) quantile(x, 3/4, na.rm = TRUE) - median(x, na.rm = TRUE))

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
write.csv(D, file= "results/free_choice_tv_series_regression_rf_permutation_importance_oob.csv", row.names=F, quote=F)

colnames(perm.imp.rf) <- matcols
D <- melt(perm.imp.rf)[2:3]
colnames(D) <- c("Feature", "Importance")
write.csv(D, file= "results/free_choice_tv_series_regression_rf_permutation_importance_raw_oob.csv", row.names=F, quote=F)

rank.mat <- t(apply(-perm.imp.rf, 1L, rank))
rank.mean <- apply(rank.mat, 2L, mean)
rank.median <- apply(rank.mat, 2L, median)
sort.idx <- sort.secondary(rank.median, rank.mean, decreasing = FALSE)
rank.mat <- rank.mat[, sort.idx]
D <- melt(rank.mat)[2:3]
colnames(D) <- c("Feature", "Importance")
write.csv(D,
          file = "results/free_choice_tv_series_regression_rf_importance_rank_raw.csv",
          row.names = FALSE,
          quote = FALSE
         )
