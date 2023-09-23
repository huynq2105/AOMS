import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import HomeScreen from '../../screens/Home/HomeScreen';
import ToolScreen from '../../screens/Tools/ToolScreen';
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
    </Stack.Navigator>
  );
};

export default HomeNavigator;
