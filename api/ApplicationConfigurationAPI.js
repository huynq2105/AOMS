import api from './API';
import conf from '../utils/default_conf.json';
import {parseCookie} from '../aw/awutils/cookie_utils';

export const getApplicationConfiguration = async () => {
  try {
    await api.get('/abp/Swashbuckle/SetCsrfCookie')
  } catch (e) {
    console.log("getApplicationConfiguration",e);
  }
  return api
    .get('/api/abp/application-configuration')
    // .then(({data, headers}) => ({data, headers}))
    .then(({ data }) => data)
  /*   .then(async ({data}) => {
      return data;
    }) */
    .catch(function (e) {
      return conf;
    });
};
