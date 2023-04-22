/**
 * @format
 */

import {AppRegistry} from 'react-native';
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
    console.log(
      progress.receivedBytes + ' of ' + progress.totalBytes + ' received.',
    );
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

