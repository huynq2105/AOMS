import {createAction} from '@reduxjs/toolkit';

const fetchAppConfigAsync = createAction(
  'app/fetchAppConfigAsync',
  ({
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
  setAppModal,
  setAppConfig,
  setLanguageAsync,
  logoutAsync,
};
