import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import HomeNavigator from './HomeNavigation/HomeNavigator';
import DrawerNavigator from './DrawerNavigator';
const AppNavigator = () => {
  
  return (
    <NavigationContainer>
      <DrawerNavigator />
    </NavigationContainer>
  );
};

export default AppNavigator;
