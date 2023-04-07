import React,{useState,useMemo,useEffect} from "react";
import {View,Text,PermissionsAndroid,Platform,StatusBar, Alert} from 'react-native'
import { getEnvVars } from "../Environment";
import {requestMultiple, PERMISSIONS} from 'react-native-permissions';
import LoginScreen from "../screens/Auth/LoginScreen";
import HomeScreen from "../screens/Home/HomeScreen";
import {createTokenSelector} from '../stores/selectors/PersistentStorageSelectors'
import { connectToRedux } from "../utils/ReduxConnect";
import PersistentStorageActions from "../stores/actions/PersistentStorageActions";
import Loading from "../components/Loading/Loading";
import { isTokenValid } from "../utils/TokenUtils";
import AppActions from "../stores/actions/AppActions";
import { useToast } from "react-native-toast-notifications";
import { createAppConfigSelector, createLanguageSelector } from "../stores/selectors/AppSelectors";
import {createTokenExpiredSelector} from '../stores/selectors/PersistentStorageSelectors'
import AppNavigator from "../navigation/AppNavigator";
import i18n from 'i18n-js';
import AuthNavigator from "../navigation/AuthNavigator/AuthNavigator";
//initAPIInterceptor(store);

const requestCameraPermission = async () => {
  if (Platform.OS === 'ios') {
    requestMultiple([
      PERMISSIONS.IOS.CAMERA, PERMISSIONS.IOS.MEDIA_LIBRARY, PERMISSIONS.IOS.PHOTO_LIBRARY
      ]).then((statuses) => {
      console.log('Camera', statuses[PERMISSIONS.IOS.CAMERA]);
      console.log('MEDIA_LIBRARY', statuses[PERMISSIONS.IOS.MEDIA_LIBRARY]);
      console.log('MEDIA_LIBRARY', statuses[PERMISSIONS.IOS.PHOTO_LIBRARY]);
    });
    return;
  }
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.CAMERA,
      {
        title: "App Camera Permission",
        message:
          "This App needs access to your camera so you can take awesome pictures.",
        buttonNeutral: "Later",
        buttonNegative: "Cancel",
        buttonPositive: "OK"
      }
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      console.log('PermissionsAndroid.RESULTS.GRANTED')
    } else {
      console.log('Camera permissions not granted')
    /*   Toast.show({
        text: 'Camera permissions not granted',
        buttonText: 'x',
        duration: 10000,
        type: 'danger',
        textStyle: {textAlign: 'center'}, swipeDisabled: false
      }); */
    }
  } catch (err) {
    console.log(err)
 /*    Toast.show({
      text: err,
      buttonText: 'x',
      duration: 10000,
      type: 'danger',
      textStyle: {textAlign: 'center'}, swipeDisabled: false
    }); */
  }
};
const AppContainer = ({language,token,setToken,logoutAsync,fetchAppConfig,appConfig,tokenExpired}) => {
  const now = new Date().valueOf();
/*   console.log('token=======================',token)
  console.log('token het han Expired=======================',token?.expire_time)
  console.log('token  Expired=======================',tokenExpired) */
    const isValid = useMemo(() => isTokenValid(token,tokenExpired), [token]);
    const localizationContext = useMemo(
      () => ({
        t: i18n.t,
        locale: (language || {}).cultureName,
      }),
      [language],
    );
/*     console.log('Token is valid',isTokenValid(token))
    console.log('da chay vao App Container',isValid) */
    const toast = useToast()
    useEffect(() => {
      //setTokenDevice(tokenDevice)
      if (!isValid && token) {
          setToken({});
          //logoutAsync()
        }
      }, [isValid]);
      useEffect(() => {
        requestCameraPermission();
      //  fetchAppConfig();
      }, []);
    
    return(
        <>
         {isValid ? <AppNavigator /> : <AuthNavigator />}
         <Loading />
        </>
    )
}

export default connectToRedux({
    component: AppContainer,
    stateProps: state => ({
      token: createTokenSelector()(state),
      appConfig: createAppConfigSelector()(state),
      tokenExpired: createTokenExpiredSelector()(state),
      language:createLanguageSelector()(state)
    }),
    dispatchProps: {
      setToken: PersistentStorageActions.setToken,
      logoutAsync: AppActions.logoutAsync,
      //setTokenDevice : PersistentStorageActions.setTokenDevice,
      fetchAppConfig: AppActions.fetchAppConfigAsync,
    },
  });