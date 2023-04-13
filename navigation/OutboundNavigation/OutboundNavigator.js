import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import OutboundScreen from '../../screens/Outbound/OutboundScreen';
import AlsxUnloadingScreen from '../../screens/Outbound/ALSXUnloading/AlsxUnloadingScreen';
import FactoryPickupScreen from '../../screens/Outbound/FactoryPickup/FactoryPickupScreen';
import NBAUnloadingScreen from '../../screens/Outbound/NBAUnloading/NBAUnloadingScreen';
import TruckTransitScreen from '../../screens/Outbound/TruckTransit/TruckTransitScreen';
import ALSXUnloadingDetailScreen from '../../screens/Outbound/ALSXUnloading/ALSXUnloadingDetail/ALSXUnloadingDetailScreen';
import NBAUnloadingDetailScreen from '../../screens/Outbound/NBAUnloading/NBAUnloadingDetail/NBAUnloadingDetailScreen';
import AddTruckScreen from '../../screens/Outbound/FactoryPickup/AddTruck/AddTruckScreen';
import HomeScreen from '../../screens/Home/HomeScreen';
import MenuIcon from '../../components/MenuIcon/MenuIcon';
import TruckDetailScreen from '../../screens/Outbound/FactoryPickup/TruckDetail/TruckDetailScreen';
const Stack = createNativeStackNavigator();
const OutboundNavigator = () => {
  return (
    <Stack.Navigator
    
      screenOptions={{
        headerShown: false,
      }}
      initialRouteName="Outbound"
    
      >
   {/*      <Stack.Screen
        name={'Home'} component={HomeScreen}
        options={({navigation}) => ({
          headerLeft: () => <MenuIcon onPress={() => navigation.openDrawer()}/>,
          title: 'Home',
        })}/> */}
      <Stack.Screen name="Outbound" component={OutboundScreen}  options={({navigation}) => ({
          headerLeft: () => <MenuIcon onPress={() => navigation.openDrawer()}/>,
          title: 'Outbound',
        })} />
      <Stack.Screen name="AlsxUnloading" component={AlsxUnloadingScreen} options={({navigation}) => ({
          headerLeft: () => <MenuIcon onPress={() => navigation.openDrawer()}/>,
          title: 'AlsxUnloading',
        })}/>
      <Stack.Screen name="FactoryPickup" component={FactoryPickupScreen}   options={{unmountOnBlur: true,headerShown:false }} />
      <Stack.Screen name="NBAUnloading" component={NBAUnloadingScreen} />
      <Stack.Screen name="TruckTransit" component={TruckTransitScreen} />
      <Stack.Screen name="ALSXUnloadingDetail" component={ALSXUnloadingDetailScreen} />
      <Stack.Screen name="NBAUnloadingDetail" component={NBAUnloadingDetailScreen} />
      <Stack.Screen name="AddTruck" component={AddTruckScreen} />
      <Stack.Screen name="TruckDetail" component={TruckDetailScreen} />
    </Stack.Navigator>
  );
};

export default OutboundNavigator;
