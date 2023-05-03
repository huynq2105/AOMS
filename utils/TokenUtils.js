import {dateFormat} from './dateHelpers'
import moment from 'moment';
export function isTokenValid(token,tokenExpired) {
    if (!token || typeof token !== 'object' || !token.expire_time) {
      return false;
    }
  
    const now = new Date().valueOf();
    return now < tokenExpired;
  }
  