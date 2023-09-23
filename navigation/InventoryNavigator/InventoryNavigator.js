import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import MoveShipmentScreen from '../../screens/Outbound/MoveShipment/MoveShipmentScreen';

import InventoryScreen from '../../screens/Outbound/Inventory/InventoryScreen';
import InventoryHomeScreen from '../../screens/Inventory/InventoryHomeScreen';
const Stack = createNativeStackNavigator();
const InventoryNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
      initialRouteName="InventoryHome">

      <Stack.Screen name="InventoryHome" component={InventoryHomeScreen} />
     
      
      <Stack.Screen name="MoveShipment" component={MoveShipmentScreen} />
      
      <Stack.Screen name="Inventory" component={InventoryScreen} />
    </Stack.Navigator>
  );
};

export default InventoryNavigator;
