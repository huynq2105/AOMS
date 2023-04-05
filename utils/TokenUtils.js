import {dateFormat} from './dateHelpers'
import moment from 'moment';
export function isTokenValid(token,tokenExpired) {
  console.log
    if (!token || typeof token !== 'object' || !token.expire_time) {
      console.log('Token khong ton tai')
      return false;
    }
  
    const now = new Date().valueOf();
    return now < tokenExpired;
  }
  