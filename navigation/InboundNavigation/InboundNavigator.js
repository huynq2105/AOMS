import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import InboundScreen from '../../screens/Inbound/InboundScreen';
import PickupAwbScreen from '../../screens/Inbound/PickupAwb/PickupAwbScreen';
import PickupAwbDetailScreen from '../../screens/Inbound/PickupAwb/PickupAwbDetail/PickupAwbDetailScreen';
import TruckUnloadingScreen from '../../screens/Inbound/TruckUnloading/TruckUnloadingScreen';
import TruckUnloadingDetailScreen from '../../screens/Inbound/TruckUnloading/TruckUnloadingDetail/TruckUnloadingDetailScreen';
const Stack = createNativeStackNavigator();
const InboundNavigator = () => {
  return (
    <Stack.Navigator
    
      screenOptions={{
        headerShown: false,
      }}
      initialRouteName="Inbound"
    
      >
   {/*      <Stack.Screen
        name={'Home'} component={HomeScreen}
        options={({navigation}) => ({
          headerLeft: () => <MenuIcon onPress={() => navigation.openDrawer()}/>,
          title: 'Home',
        })}/> */}
      <Stack.Screen name="Inbound" component={InboundScreen}  />
  {/*     <Stack.Screen name="AlsxUnloading" component={AlsxUnloadingScreen} options={({navigation}) => ({
          headerLeft: () => <MenuIcon onPress={() => navigation.openDrawer()}/>,
          title: 'AlsxUnloading',
        })}/> */}
      <Stack.Screen name="PickupAwb" component={PickupAwbScreen} />
      <Stack.Screen name="PickupAwbDetail" component={PickupAwbDetailScreen} />  
      <Stack.Screen name="TruckUnloading" component={TruckUnloadingScreen} />
      <Stack.Screen name="TruckUnloadingDetail" component={TruckUnloadingDetailScreen} />
    </Stack.Navigator>
  );
};

export default InboundNavigator;
