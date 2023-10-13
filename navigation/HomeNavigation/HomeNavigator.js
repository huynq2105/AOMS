import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import HomeScreen from '../../screens/Home/HomeScreen';
import ToolScreen from '../../screens/Tools/ToolScreen';
import AwbSearchScreen from '../../screens/AwbDetail/AwbSearchScreen';
import AwbDetailInboundScreen from '../../screens/AwbDetail/Inbound/AwbDetailInboundScreen';
import AwbListInboundScreen from '../../screens/AwbDetail/Inbound/AwbListInboundScreen';
const Stack = createNativeStackNavigator();
const HomeNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
      initialRouteName="Home">
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Tool" component={ToolScreen} />
      <Stack.Screen name="AwbSearch" component={AwbSearchScreen} />
      <Stack.Screen name="AwbDetailInbound" component={AwbDetailInboundScreen} />
      <Stack.Screen name="AwbListInbound" component={AwbListInboundScreen} />
    </Stack.Navigator>
  );
};

export default HomeNavigator;
