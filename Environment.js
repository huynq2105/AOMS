const ENV = {
    constant: {
      version: 'v1.3.5 - v1.1.1b6',
    },
    dev: {
      apiUrl: 'https://aoms-uat.alssys.vn',
      oAuthConfig: {
        issuer: 'https://aoms-uat.alssys.vn',
        issuerDev: 'https://aoms-uat.alssys.vn',
        issuerUat: 'https://aoms-uat.alssys.vn',
        clientId: 'AOMS_App',
        clientSecret: '1q2w3E*',
        scope: 'offline_access AOMS',
      },
      localization: {
        defaultResourceName: 'AOMS',
      },
    },
    prod: {
      apiUrl: 'https://aoms-uat.alssys.vn',
      oAuthConfig: {
        issuer: 'https://aoms-uat.alssys.vn',
        clientId: 'AOMS_App',
        clientSecret: '1q2w3E*',
        scope: 'offline_access AOMS',
      },
      localization: {
        defaultResourceName: 'AOMS',
      },
    },
  };
  const EnvironmentList = [
    {id:0,value:'https://aoms-uat.alssys.vn',label:'uat PRODUCT'},
    {id:0,value:'https://aoms.alssys.vn',label:'ALSW PRODUCT'},
    {id:0,value:'https://aoms-uat.alssys.vn',label:'ALSW UAT'},
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
  