/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import {NavigationContainer, DefaultTheme} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import HomeScreen from './src/Home';
import ImageGalleryScreen from './src/Gallery';

const Stack = createNativeStackNavigator();

const navTheme = DefaultTheme;
navTheme.colors.background = '#FFFFFF';

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="HomeScreen">
        <Stack.Screen
          name="HomeScreen"
          component={HomeScreen}
          options={{
            title: 'React Camera',
            headerTitleAlign: 'center',
          }}
        />
        <Stack.Screen
          name="ImageGallery"
          component={ImageGalleryScreen}
          options={{
            title: 'Gallery',
            headerTitleAlign: 'center',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};


export default App;
