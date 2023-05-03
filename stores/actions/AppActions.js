import {createAction} from '@reduxjs/toolkit';

const fetchAppConfigAsync = createAction(
  'app/fetchAppConfigAsync',
  ({
     callback = () => {
     }, showLoading = true
   } = {}) => ({payload: {callback, showLoading}}),
);
const fetchAppConfigNoAuthAsync = createAction(
  'app/fetchAppConfigNoAuthAsync',({
    callback = () => {
    }, showLoading = true
  } = {}) => ({payload: {callback, showLoading}}),
);
const setAppModal = createAction('app/setAppModal');

const setAppConfig = createAction('app/setAppConfig');

const setLanguageAsync = createAction('app/setLanguageAsync');

const logoutAsync = createAction('app/logoutAsync');

export default {
  fetchAppConfigAsync,
  fetchAppConfigNoAuthAsync,
  setAppModal,
  setAppConfig,
  setLanguageAsync,
  logoutAsync,
};
