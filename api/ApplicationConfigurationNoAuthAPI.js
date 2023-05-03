import api from './API'
import conf from '../utils/default_conf.json';
import {parseCookie} from "../aw/awutils/cookie_utils";

/* export const getApplicationConfigurationNoAuthAPI = () => {
  return api
    .get('/api/abp/application-configuration',{withCredentials:false})
    // .then(({data, headers}) => ({data, headers}))
    .then(async ({data}) => {
      return data;
    })
    .catch(function (e) {
      return conf;
    });
} */
export const getApplicationConfigurationNoAuthAPI = async () => {
  try {
    await api.get('/abp/Swashbuckle/SetCsrfCookie',{withCredentials:false})
  } catch (e) {
    console.log(e)
  }
}

