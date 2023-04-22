import React from 'react';
import {createDrawerNavigator} from '@react-navigation/drawer';
import DrawerContent from '../components/DrawerContent/DrawerContent';

import HomeNavigator from './HomeNavigation/HomeNavigator';
import OutboundNavigator from './OutboundNavigation/OutboundNavigator';
import InboundNavigator from './InboundNavigation/InboundNavigator';
import OutboundScreen from '../screens/Outbound/OutboundScreen';
import { connectToRedux } from '../utils/ReduxConnect';
import AppActions from '../stores/actions/AppActions';
import PersistentStorageActions from '../stores/actions/PersistentStorageActions';
const Drawer = createDrawerNavigator();

function DrawerNavigator({logoutAsync,setTokenExpired}) {
  const logOutHandle = () =>{
    setTokenExpired(null);
    //setVerifyToken('');
    logoutAsync();
  }
  return (
    <Drawer.Navigator
     initialRouteName="HomeNav" 
     useLegacyImplementation={true}
     drawerContent={(props)=><DrawerContent logOutHandle={logOutHandle} navigation={props.navigation} state={props.state} />}
     screenOptions={{
     }}
     >
      <Drawer.Screen name="HomeNav" component={HomeNavigator} options={{headerShown: false}} />
      <Drawer.Screen
        name="OutboundNav"
        component={OutboundNavigator}
        options={{headerShown: false}}
      />
        <Drawer.Screen
        name="InboundNav"
        component={InboundNavigator}
        options={{headerShown: false}}
      />
    </Drawer.Navigator>
  );
}
export default connectToRedux({
  component: DrawerNavigator,
      dispatchProps: {
        logoutAsync: AppActions.logoutAsync,
        setTokenExpired: PersistentStorageActions.setTokenExpired,
        setVerifyToken: PersistentStorageActions.setVerifyToken
      },
    });