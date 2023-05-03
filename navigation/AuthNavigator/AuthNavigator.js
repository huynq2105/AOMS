import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {NavigationContainer} from '@react-navigation/native';
import SignupScreen from '../../screens/Auth/SignupScreen';
import LoginScreen from '../../screens/Auth/LoginScreen';
import React from 'react';
const Stack = createNativeStackNavigator();
export default function AuthStackNavigator() {

    return (
      <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={() => ({
             title:'Login',
            headerShown: false
          })}
        />
         <Stack.Screen
          name="Signup"
          component={SignupScreen}
          options={() => ({
             title:'Sign Up',
            headerShown: false
          })}
        />
      </Stack.Navigator>
      </NavigationContainer>
    );
  }
  