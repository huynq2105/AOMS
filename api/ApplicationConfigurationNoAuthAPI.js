import api from './API'
import conf from '../utils/default_conf.json';
import {parseCookie} from "../aw/awutils/cookie_utils";

export const getApplicationConfigurationNoAuthAPI = () => {
  console.log('==========================getApplicationConfigurationNoAuthAPI=============================')
  return api
    .get('/api/abp/application-configuration',{withCredentials:false})
    // .then(({data, headers}) => ({data, headers}))
    .then(async ({data}) => {
      return data;
    })
    .catch(function (e) {
      return conf;
    });
}

