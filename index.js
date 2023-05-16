/**
 * @format
 */

import {Alert, AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import CodePush from 'react-native-code-push';
import React from 'react';
function HeadlessCheck({isHeadless}) {
    if (isHeadless) {
      // App has been launched in the background by iOS, ignore
      return null;
    }
  
    return <App />;
  }
  function codePushDownloadDidProgress(progress) {
    Alert.alert(
      progress.receivedBytes + ' of ' + progress.totalBytes + ' received.',
    );
  }
  function codePushStatusDidChange(syncStatus) {
    switch (syncStatus) {
      case CodePush.SyncStatus.CHECKING_FOR_UPDATE:
        console.log("Checking for update.")
        break;
      case CodePush.SyncStatus.DOWNLOADING_PACKAGE:
        console.log("Download packaging....")
        break;
      case CodePush.SyncStatus.AWAITING_USER_ACTION:
        console.log("Awaiting user action....")
        break;
      case CodePush.SyncStatus.INSTALLING_UPDATE:
        console.log("Installing update")
        setProgress(false)
        break;
      case CodePush.SyncStatus.UP_TO_DATE:
        console.log("codepush status up to date")
        break;
      case CodePush.SyncStatus.UPDATE_IGNORED:
        console.log("update cancel by user")
        setProgress(false)
        break;
      case CodePush.SyncStatus.UPDATE_INSTALLED:
        console.log("Update installed and will be applied on restart.")
        setProgress(false)
        break;
      case CodePush.SyncStatus.UNKNOWN_ERROR:
        console.log("An unknown error occurred")
        setProgress(false)
        break;
    }
  }
  AppRegistry.registerComponent(appName, () =>
    CodePush({
      updateDialog: {
        optionalInstallButtonLabel: 'Cài đặt',
        optionalIgnoreButtonLabel: 'Bỏ qua',
        title: 'Cập nhật',
        mandatoryUpdateMessage: 'Đã có bản cập nhật, bạn có muốn cài đặt nó?',
        optionalUpdateMessage: 'Đã có bản cập nhật, bạn có muốn cài đặt nó?',
      },
      installMode: CodePush.InstallMode.IMMEDIATE,
      checkFrequency: CodePush.CheckFrequency.ON_APP_START,
    })(HeadlessCheck, codePushDownloadDidProgress),
    );

