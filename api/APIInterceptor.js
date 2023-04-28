import api from './API'
import { parseCookie } from '../utils/Cookies'
import PersistentStorageActions from '../stores/actions/PersistentStorageActions'
import LoadingActions from '../stores/actions/LoadingActions';
import i18n from 'i18n-js';
import { Alert } from 'react-native';
import AppActions from '../stores/actions/AppActions';
import moment from 'moment';
export function initAPIInterceptor(store) {
  api.interceptors.request.use(
    async request => {
      const {
        persistentStorage: {token,language, tenant, verifyToken},
      } = store.getState();
      if (!request.headers.RequestVerificationToken && verifyToken) {
        request.headers.RequestVerificationToken = verifyToken;
      }
      if (!request.headers.Authorization && token && token.access_token) {
        request.headers.Authorization = `${token.token_type} ${token.access_token}`;
      }

      if (!request.headers['Content-Type']) {
        request.headers['Content-Type'] = 'application/json';
      }
      if (!request.headers['Accept-Language'] && language) {
        request.headers['Accept-Language'] = language;
      }
      if (!request.headers.__tenant && tenant && tenant.tenantId) {
        request.headers.__tenant = tenant.tenantId;
      }
      return request;
    },
  
    error => console.error(error)
  );

  api.interceptors.response.use(
    (response) => {
      try {
        const {headers} = response;
        let cookies = headers['set-cookie'];
        let cookiesCheck;
        if (cookies && cookies.length > 0) cookies = cookies[0].split(',');
        if (!cookies || !cookies.length) cookies = [];
        let cookieTmp = '';
        let cookieDt = '';
        if(cookies[0] && (cookies[0]?.indexOf('idsrv.session')>=0 || cookies[0]?.indexOf('AspNetCore.Culture')>=0)){
          for (let i = 0; i < cookies.length; i++) {
            if (cookies[i].indexOf('path') >= 0) cookieDt = cookies[i];
          }
        }
        for (let i = 0; i < cookies.length; i++) {
          if (cookies[i].indexOf('XSRF-TOKEN') >= 0) cookieTmp = cookies[i];
        }
        let cookieObject = parseCookie(cookieTmp);
        if (cookieObject["XSRF-TOKEN"]) {
         store.dispatch(PersistentStorageActions.setVerifyToken(cookieObject["XSRF-TOKEN"]));
        }
        if(cookieDt){
          const a = cookieDt.split(';')[0].substring(0,25);
          const dt = moment(a);
          store.dispatch(PersistentStorageActions.setTokenExpired(dt));
        }
      
      } catch (e) {
        console.log('APIC58', e.toString());
      }
      return response;
    },
    error => {
   
      store.dispatch(LoadingActions.clear());
      const errorRes = error.response;
      if (errorRes) {
        if (errorRes.headers._abperrorformat && errorRes.status === 401) {
          store.dispatch(PersistentStorageActions.setToken({}));
          //Alert.alert('Phiên làm việc của bạn đã hết hạn')
        }
        showError({ error: errorRes.data.error || {}, status: errorRes.status });
      } else {
        Alert.alert('An unexpected error has occurred')
      }

      return Promise.reject(error);
    },
  );
}
function showError({ error = {}, status }) {
  let message = '';
  let title = 'Thông báo';
  if(status == 401){
    message = 'Phiên làm việc của bạn đã hết hạn';
  }else{
    if (typeof error === 'string') {
      message = 'Code ' + status + ': '+ error;
    } else if (error.details) {
      message = 'Code ' +status + ': '+  error.details;
    } else if (error.message) {
      message = 'Code ' +status + ': ' + error.message;
    } else {
      console.log('da chay vao 4',status)
      switch (status) {
        case 400:
          message = '400 Bad Request';
          break;
        case 401:
          title = 'Thông báo';
          message = 'Phiên làm việc của bạn đã hết hạn';
          break;
        case 403:
          message = '403 Forbidden';
          break;
        case 404:
          message = '404 Not Found';
          break;
        case 500:
          message = '500 Server Error';
          break;
        default:
          break;
      }
    }
  }
  
Alert.alert(`${title}\n${message}`)
 /*  Toast.show({
    text: `${title}\n${message}`,
    buttonText: 'x',
    duration: 10000,
    type: 'danger',
    textStyle: { textAlign: 'center' },
  }); */
}
