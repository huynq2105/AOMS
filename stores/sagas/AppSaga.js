import {call, put, takeLatest, takeEvery, all} from 'redux-saga/effects';
import { logout } from '../../api/loginApi';
import AppActions from '../actions/AppActions';
import PersistentStorageActions from '../actions/PersistentStorageActions';
import LoadingActions from '../actions/LoadingActions';
import { getApplicationConfiguration } from '../../api/ApplicationConfigurationAPI';
import i18n from 'i18n-js';

function* fetchAppConfig({payload: {showLoading, callback}}) {
  if (showLoading) yield put(LoadingActions.start({key: 'appConfig', opacity: 1}));
  const data = yield call(getApplicationConfiguration);
  yield put(AppActions.setAppConfig(data));
  if (data?.currentUser && data?.currentUser?.userName) {
    yield put(PersistentStorageActions.setCurrentUser(data?.currentUser));
  }
  yield put(PersistentStorageActions.setLanguage(data?.localization?.currentCulture?.cultureName ?? 'en'));
  if (showLoading) yield put(LoadingActions.stop({key: 'appConfig'}));
  if (callback) callback();
}
function* setAppConfigWatcher(action) {
  const config = action.payload ?? {};

  const {cultureName} = config?.localization?.currentCulture ?? 'vi';
  i18n.locale = cultureName;
  Object.keys(config?.localization?.values ?? {}).forEach(key => {
    const resource = config.localization.values[key];

    if (typeof resource !== 'object') return;

    Object.keys(resource).forEach(key2 => {
      if (/'{|{/g.test(resource[key2])) {
        resource[key2] = resource[key2].replace(/'{|{/g, '{{').replace(/}'|}/g, '}}');
      }
    });
  });

  i18n.translations[i18n.locale] = {
    ...config?.localization?.values,
    ...(i18n.translations[i18n.locale] || {}),
  };
}

function* logoutWatcher() {
    yield put(PersistentStorageActions.setToken({}));
    yield call(logout);
    yield put(AppActions.fetchAppConfigAsync());
  }
  export default function* () {
    yield all([
      //takeLatest(AppActions.setLanguageAsync.type, setLanguage),
      takeLatest(AppActions.fetchAppConfigAsync.type, fetchAppConfig),
      takeLatest(AppActions.setAppConfig.type, setAppConfigWatcher),
      takeLatest(AppActions.logoutAsync.type, logoutWatcher),
    ]);
  }