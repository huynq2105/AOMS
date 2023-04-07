import api from './API'
import { parseCookie } from '../utils/Cookies'
import PersistentStorageActions from '../stores/actions/PersistentStorageActions'
import LoadingActions from '../stores/actions/LoadingActions';
import { Alert } from 'react-native';
import AppActions from '../stores/actions/AppActions';
import moment from 'moment';
export function initAPIInterceptor(store) {
  api.interceptors.request.use(
    async request => {
      const {
        persistentStorage: {token,language, tenant, verifyToken,cookie},
      } = store.getState();
      if (!request.headers.RequestVerificationToken && verifyToken) {
        request.headers.RequestVerificationToken = verifyToken;
      }
      if (!request.headers['Cookie'] && cookie) {
        request.headers['Cookie'] = '.AOMS.AspNetCore.Identity.Application=' + cookie;
      }
     /*  if (request.url==='/api/account/login' && verifyTokenLogin) {
        console.log('Da chay vao set VerifyToken Login')
        request.headers.RequestVerificationToken = verifyTokenLogin;
      } */
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
      console.log('Request After========================================',request)
      return request;
    },
  
    error => console.error(error)
  );

  api.interceptors.response.use(
    (response) => {
      try {
        const {headers} = response;
        let cookies = headers['set-cookie'];
        console.log('header=============================================================',headers);
        let cookiesCheck;
        if (cookies && cookies.length > 0) cookies = cookies[0].split(',');
        if (!cookies || !cookies.length) cookies = [];
        let cookieTmp = '';
        let cookieDt = '';
        let cookieRequest = '';
        if(cookies[0] && (cookies[0]?.indexOf('idsrv.session')>=0 || cookies[0]?.indexOf('AspNetCore.Culture')>=0)){
          for (let i = 0; i < cookies.length; i++) {
            if (cookies[i].indexOf('path') >= 0) cookieDt = cookies[i];
          }
        }
        for (let i = 0; i < cookies.length; i++) {
          if (cookies[i].indexOf('XSRF-TOKEN') >= 0) cookieTmp = cookies[i];
        }
        for (let i = 0; i < cookies.length; i++) {
          if (cookies[i].indexOf('.AOMS.AspNetCore.Identity.Application') >= 0) cookieRequest = cookies[i];
        }
     //   console.log('cookieRequest=============================================================',cookieRequest);
        let cookieObject = parseCookie(cookieTmp);
        let cookieRequestObj = parseCookie(cookieRequest);
        //console.log('cookieRequestObj=============================================================',cookieRequestObj);
       // console.log('cookieRequestObj Vryfi=============================================================',cookieRequestObj['.AOMS.AspNetCore.Identity.Application']);
        if (cookieObject["XSRF-TOKEN"]) {
        //if(cookieObject["XSRF-TOKEN"].length == 155) store.dispatch(PersistentStorageActions.setVerifyTokenLogin(cookieObject["XSRF-TOKEN"]));
         //store.dispatch(PersistentStorageActions.setVerifyToken(cookieRequestObj['.AOMS.AspNetCore.Identity.Application']));
          store.dispatch(PersistentStorageActions.setVerifyToken(cookieObject["XSRF-TOKEN"]));
         /*  store.dispatch(PersistentStorageActions.setToken({
            "access_token": cookieObject["XSRF-TOKEN"],
            "expires_in": 1800000,
            "token_type": "Bearer",
            "refresh_token": "",
            "expire_time": new Date().valueOf() + 1800000,
            "scope": undefined,
          })); */
        }
        if (cookieRequestObj['.AOMS.AspNetCore.Identity.Application']) {
           store.dispatch(PersistentStorageActions.setCookie(cookieRequestObj['.AOMS.AspNetCore.Identity.Application']));
         
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
         // store.dispatch(AppActions.logoutAsync());
          Alert.alert('Phiên làm việc của bạn đã hết hạn')
        }
        //showError({ error: errorRes.data.error || {}, status: errorRes.status });
      } else {
        console.log('An unexpected error has occurred')
      }

      return Promise.reject(error);
    },
  );
}
  function showError({error = {}, status}) {
    let message = '';
    let title = 'DefaultErrorMessage';
  
    if (typeof error === 'string') {
      // message = error;
      message = 'Network error';
    } else if (error.details) {
      // message = error.details;
      message = error.message;
      title = 'Error details:';
    } else if (error.message) {
      message = '';
     // console.log('Network error with message')
      // message = error.message;
    } else {
      switch (status) {
        case 401:
          title = 'DefaultErrorMessage401';
          message ='DefaultErrorMessage401Detail';
          break;
        case 403:
          title = 'DefaultErrorMessage403';
          message = 'DefaultErrorMessage403Detail';
          break;
        case 404:
          title = 'DefaultErrorMessage404';
          message = 'DefaultErrorMessage404Detail';
          break;
        case 500:
          title = '500Message';
          message = 'InternalServerErrorMessage';
          break;
        default:
          break;
      }
    }
  console.log( `${title}\n${message}`)
  }