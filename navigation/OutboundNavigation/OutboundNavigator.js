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
import AddPoDoScreen from '../../screens/Outbound/FactoryPickup/TruckDetail/AddPoDoScreen';
import TruckDetailScreen from '../../screens/Outbound/FactoryPickup/TruckDetail/TruckDetailScreen';
import ScanDOScreen from '../../screens/Outbound/FactoryPickup/AddDoFromSo/ScanDOScreen';
import TruckSealScreen from '../../screens/Outbound/TruckSeal/TruckSealScreen';
import AddTruckScreenAnd from '../../screens/Outbound/FactoryPickup/AddTruck/AddTruckScreenAnd';
import AddTruckScreenIos from '../../screens/Outbound/FactoryPickup/AddTruck/AddTruckScreenIos';
import SecurityScreen from '../../screens/Outbound/Security/SecurityScreen';
import MoveShipmentScreen from '../../screens/Outbound/MoveShipment/MoveShipmentScreen';
import TruckLoadingScreen from '../../screens/Outbound/TruckLoading/TruckLoadingScreen';
import AwbByTruckLoadingScreen from '../../screens/Outbound/TruckLoading/AwbByTruckLoading/AwbByTruckLoadingScreen';
import MawbCheckOutScreen from '../../screens/Outbound/TruckLoading/MawbCheckOut/MawbCheckOutScreen';
import {truncate} from 'lodash';
const Stack = createNativeStackNavigator();
const OutboundNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
      initialRouteName="Outbound">
      {/*      <Stack.Screen
        name={'Home'} component={HomeScreen}
        options={({navigation}) => ({
          headerLeft: () => <MenuIcon onPress={() => navigation.openDrawer()}/>,
          title: 'Home',
        })}/> */}
      <Stack.Screen name="Outbound" component={OutboundScreen} />
      <Stack.Screen
        name="AlsxUnloading"
        component={AlsxUnloadingScreen}
        options={({navigation}) => ({
          headerLeft: () => (
            <MenuIcon onPress={() => navigation.openDrawer()} />
          ),
          title: 'AlsxUnloading',
        })}
      />
      <Stack.Screen
        name="FactoryPickup"
        component={FactoryPickupScreen}
        options={({navigation}) => ({
          headerLeft: () => (
            <MenuIcon onPress={() => navigation.openDrawer()} />
          ),
          title: 'FactoryPickup',
        })}
      />
      <Stack.Screen name="NBAUnloading" component={NBAUnloadingScreen} />
      <Stack.Screen name="TruckTransit" component={TruckTransitScreen} />
      <Stack.Screen
        name="ALSXUnloadingDetail"
        component={ALSXUnloadingDetailScreen}
      />
      <Stack.Screen
        name="NBAUnloadingDetail"
        component={NBAUnloadingDetailScreen}
      />
      <Stack.Screen name="AddTruck" component={AddTruckScreen} />
      <Stack.Screen name="AddTruckAnd" component={AddTruckScreenAnd} />
      <Stack.Screen name="AddTruckIos" component={AddTruckScreenIos} />
      <Stack.Screen name="TruckDetail" component={TruckDetailScreen} />
      <Stack.Screen name="AddPoDo" component={AddPoDoScreen} />
      <Stack.Screen name="ScanDO" component={ScanDOScreen} />
      <Stack.Screen name="TruckSeal" component={TruckSealScreen} />
      <Stack.Screen name="Security" component={SecurityScreen} />
      <Stack.Screen name="MoveShipment" component={MoveShipmentScreen} />
      <Stack.Screen name="TruckLoading" component={TruckLoadingScreen} />
      <Stack.Screen name="AwbByTruckLoading" component={AwbByTruckLoadingScreen} />
      <Stack.Screen name="MawbCheckOut" component={MawbCheckOutScreen} />
    </Stack.Navigator>
  );
};

export default OutboundNavigator;
