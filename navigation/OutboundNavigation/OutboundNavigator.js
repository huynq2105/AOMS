import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import OutboundScreen from '../../screens/Outbound/OutboundScreen';
import AlsxUnloadingScreen from '../../screens/Outbound/ALSXUnloading/AlsxUnloadingScreen';
import FactoryPickupScreen from '../../screens/Outbound/FactoryPickup/FactoryPickupScreen';
import NBAUnloadingScreen from '../../screens/Outbound/NBAUnloading/NBAUnloadingScreen';
import TruckTransitScreen from '../../screens/Outbound/TruckTransit/TruckTransitScreen';
import ALSXUnloadingDetailScreen from '../../screens/Outbound/ALSXUnloading/ALSXUnloadingDetail/ALSXUnloadingDetailScreen';
import NBAUnloadingDetailScreen from '../../screens/Outbound/NBAUnloading/NBAUnloadingDetail/NBAUnloadingDetailScreen';
const Stack = createNativeStackNavigator();
const OutboundNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
      initialRouteName="Outbound">
      <Stack.Screen name="Outbound" component={OutboundScreen} />
      <Stack.Screen name="AlsxUnloading" component={AlsxUnloadingScreen} />
      <Stack.Screen name="FactoryPickup" component={FactoryPickupScreen} />
      <Stack.Screen name="NBAUnloading" component={NBAUnloadingScreen} />
      <Stack.Screen name="TruckTransit" component={TruckTransitScreen} />
      <Stack.Screen name="ALSXUnloadingDetail" component={ALSXUnloadingDetailScreen} />
      <Stack.Screen name="NBAUnloadingDetail" component={NBAUnloadingDetailScreen} />
    </Stack.Navigator>
  );
};

export default OutboundNavigator;
