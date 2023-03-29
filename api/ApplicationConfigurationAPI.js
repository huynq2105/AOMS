import api from './API'
import conf from '../utils/default_conf.json';
import {parseCookie} from "../aw/awutils/cookie_utils";

export const getApplicationConfiguration = () => {
  return api
    .get('/api/abp/application-configuration')
    // .then(({data, headers}) => ({data, headers}))
    .then(async ({data}) => {
      return data;
    })
    .catch(function (e) {
      console.log('da chay vao day=====================================getApplicationConfiguration')
      return conf;
    });
}
