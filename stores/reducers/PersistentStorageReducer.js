import {createReducer} from '@reduxjs/toolkit'
import PersistentStorageActions from '../actions/PersistentStorageActions'
//import { isTokenValid } from '../../utils/TokenUtils'

const inititalState = {
    config:{apiUrl:''},
    "currentUser": {
        "isAuthenticated": null,
        "id": "",
        "tenantId": null,
        "userName": "",
        "name": "",
        "surName": null,
        "email": "",
        "emailVerified": null,
        "phoneNumber": null,
        "phoneNumberVerified": null,
        "roles": [],
        "password": "",
      },
      token: {}, language: null, tenant: {},tokenDevice:{},verifyToken:'',cookie:null,tokenExpired:null,
      truckAddred:{
        id:'',
        bsx:'',
        driver:''
      }
}


export default createReducer(inititalState,builder =>
    builder
    .addCase(PersistentStorageActions.setToken,(state,action)=>{
        // if(!isTokenValid(action.payload)){
        //     const oldUserId = state?.currentUser?.id;
        //     const oldTenant = state.tenant;
        // }
        state.token = action.payload;
    })
    .addCase(PersistentStorageActions.setVerifyToken, (state, action) => {
        state.verifyToken = action.payload;
      })
      .addCase(PersistentStorageActions.setCookie, (state, action) => {
        state.cookie = action.payload;
      })
      .addCase(PersistentStorageActions.setTenant, (state, action) => {
        state.tenant = action.payload;
      })
      .addCase(PersistentStorageActions.setTokenDevice, (state, action) => {
        state.tokenDevice = action.payload;
      })
      .addCase(PersistentStorageActions.setLanguage, (state, action) => {
        state.language = action.payload;
      })
      .addCase(PersistentStorageActions.setCurrentUser, (state, action) => {
        state.currentUser = action.payload
      })
      .addCase(PersistentStorageActions.setTokenExpired, (state, action) => {
        state.tokenExpired = action.payload
      })
      .addCase(PersistentStorageActions.setTruckAdded, (state, action) => {
        state.truckAddred = action.payload
      })
    )