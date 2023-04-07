import {createAction} from '@reduxjs/toolkit'

const setVerifyToken = createAction('persistentStorage/setVerifyToken');
const setCookie = createAction('persistentStorage/setCookie');
const setCurrentUser = createAction('persistentStorage/setCurrentUser');
const setToken = createAction('persistentStorage/setToken')
const setTenant = createAction('persistentStorage/setTenant');
const setTokenDevice = createAction('persistentStorage/setTokenDevice');
const setLanguage = createAction('persistentStorage/setLanguage');
const setTokenExpired = createAction('persistentStorage/setTokenExpired');
const setLocalConfig = createAction('persistentStorage/setLocalConfig');
export default {
    setVerifyToken,
    setCookie,
    setToken,
    setTenant,
    setTokenDevice,
    setCurrentUser,
    setLanguage,
    setTokenExpired
}