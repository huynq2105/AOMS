import { createSelector } from 'reselect';

const getApp = state => state.app;


export function createAppConfigSelector() {
  return createSelector([getApp], state => state.appConfig);
}

