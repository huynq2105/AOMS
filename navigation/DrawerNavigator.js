import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import DrawerContent from '../components/DrawerContent/DrawerContent';
const Drawer = createDrawerNavigator();
import HomeScreen from '../screens/Home/HomeScreen';
import OutboundNavigator from './OutboundNavigation/OutboundNavigator';
export default function DrawerNavigator() {
  return (
    <Drawer.Navigator initialRouteName='Home' drawerContent={DrawerContent}>
      <Drawer.Screen name='Home' component={HomeScreen} />
      <Drawer.Screen name='OutboundNav' component={OutboundNavigator} options={{headerShown:false}} />
    </Drawer.Navigator>
  );
}
