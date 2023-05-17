const ENV = {
    constant: {
      version: 'v1.3.5 - v1.1.1b6',
    },
    dev: {
      apiUrl: 'https://aoms-alsb.alssys.vn',
      oAuthConfig: {
        issuer: 'https://aoms-alsb.alssys.vn',
        issuerDev: 'https://aoms-alsb.alssys.vn',
        issuerUat: 'https://aoms-alsb.alssys.vn',
        clientId: 'AOMS_App',
        clientSecret: '1q2w3E*',
        scope: 'offline_access AOMS',
      },
      localization: {
        defaultResourceName: 'AOMS',
      },
    },
    prod: {
      apiUrl: 'https://aoms-alsb.alssys.vn',
      oAuthConfig: {
        issuer: 'https://aoms-alsb.alssys.vn',
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
    {id:0,value:'https://aoms-alsb.alssys.vn',label:'uat PRODUCT'},
    {id:0,value:'https://aoms.alssys.vn',label:'ALSW PRODUCT'},
    {id:0,value:'https://aoms-alsb.alssys.vn',label:'ALSW UAT'},
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
  