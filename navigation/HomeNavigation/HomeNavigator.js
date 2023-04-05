import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import HomeScreen from '../../screens/Home/HomeScreen';
import OutboundNavigator from '../OutboundNavigation/OutboundNavigator';
import AlsxUnloadingScreen from '../../screens/Outbound/ALSXUnloading/AlsxUnloadingScreen';
import FactoryPickupScreen from '../../screens/Outbound/FactoryPickup/FactoryPickupScreen';
import NBAUnloadingScreen from '../../screens/Outbound/NBAUnloading/NBAUnloadingScreen';
import TruckTransitScreen from '../../screens/Outbound/TruckTransit/TruckTransitScreen';
const Stack = createNativeStackNavigator();
const HomeNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
      initialRouteName="Home">
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="OutboundNav" component={OutboundNavigator} />
    </Stack.Navigator>
  );
};

export default HomeNavigator;
