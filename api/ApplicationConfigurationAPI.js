import api from './API';
import conf from '../utils/default_conf.json';
import {parseCookie} from '../aw/awutils/cookie_utils';

export const getApplicationConfiguration = async () => {
  try {
    await api.get('/abp/Swashbuckle/SetCsrfCookie')
  } catch (e) {
    console.log(e);
  }
};
