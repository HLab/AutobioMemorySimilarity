#!/usr/bin/bash

### Similar vs Dissimilar - Remind only ###
# multivariate
RPATH="scripts/RData2csv_multivariate.R"
INPATH="results/free_choice_tv_series_regression_rf_feature_selection_oob.RData"
OUTPATH1="results/free_choice_tv_series_regression_rf_permutation_importance.csv"
OUTPATH2="results/free_choice_tv_series_regression_rf_permutation_importance_raw.csv"
OUTPATH3="results/free_choice_tv_series_regression_rf_importance_rank_raw.csv"
Rscript $RPATH $INPATH $OUTPATH1 $OUTPATH2 $OUTPATH3

# univariate
RPATH="scripts/RData2csv_univariate.R"
INPATH="results/free_choice_tv_series_regression_rf_univariate.RData"
INPATH2="results/free_choice_tv_series_regression_rf_feature_selection_oob.RData"
OUTPATH1="results/free_choice_tv_series_regression_rsquared.csv"
OUTPATH2="results/free_choice_tv_series_regression_mse.csv"
Rscript $RPATH $INPATH $INPATH2 $OUTPATH1 $OUTPATH2
