const ENV = {
    constant: {
      version: 'v1.4.8 - 12102023',
    },
    dev: {
      apiUrl: 'https://aoms.alssys.vn',
      oAuthConfig: {
        issuer: 'https://aoms.alssys.vn',
        issuerDev: 'https://aoms.alssys.vn',
        issuerUat: 'https://aoms.alssys.vn',
        clientId: 'aoms_App',
        clientSecret: '1q2w3E*',
        scope: 'offline_access aoms',
      },
      localization: {
        defaultResourceName: 'aoms',
      },
    },
    prod: {
      apiUrl: 'https://aoms.alssys.vn',
      oAuthConfig: {
        issuer: 'https://aoms.alssys.vn',
        clientId: 'aoms_App',
        clientSecret: '1q2w3E*',
        scope: 'offline_access aoms',      
      },
      localization: {
        defaultResourceName: 'aoms',
      },
    },
  };
  const EnvironmentList = [
    {id:0,value:'https://aoms.alssys.vn',label:'uat PRODUCT'},
    {id:0,value:'https://aoms.alssys.vn',label:'ALSW PRODUCT'},
    {id:0,value:'https://aoms.alssys.vn',label:'ALSW UAT'},
  ]
  export const getEnvVars = () => {
    // eslint-disable-next-line no-undef
    // return __DEV__ ? ENV.dev : ENV.prod;
    return ENV.dev;
  };
  export default EnvironmentList;
  export const getEnvConst = () => {
    return ENV.constant;
  };
  