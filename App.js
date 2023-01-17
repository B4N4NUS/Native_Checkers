
import { StyleSheet, Text, View, Button, TouchableOpacity, Image } from 'react-native';
import { Game } from './Game'
import React, { useState } from 'react'
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient'
import { Selection } from './Selection';
import { AddressSettings } from './Settings.js';


function HomeScreen({ navigation }) {
  return (
    <>
      <LinearGradient start={{ x: 0, y: 0.75 }} end={{ x: 1, y: 0.25 }} colors={['#1FA2FF', '#12D8FA', '#A6FFCB']} style={{ flex: 1, alignItems: 'center', justifyContent: 'center', }}>
        
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('2 Players Local')}>
          <Text style={styles.text}>
            2 Players Local 
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('4 Players Local')}>
          <Text style={styles.text}>
            4 Players Local
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('4 Players Online')}>
          <Text style={styles.text}>
            4 Players Online
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Smoll')}>
          <Text style={styles.text}>
            4 Players Small Local
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Queens Gambit')}>
          <Text style={styles.text}>
            Queen's Gambit
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('All Hail The Queen')}>
          <Text style={styles.text}>
            All Hail The Queen
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Mann')}>
          <Text style={styles.text}>
            Mann vs. Machine
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('MannHard')}>
          <Text style={styles.text}>
            Mann vs. Machine (Hard)
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Mann1v1')}>
          <Text style={styles.text}>
            Mann vs. Machine Duel
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('MannCoop')}>
          <Text style={styles.text}>
            Mann vs. Machine Coop
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Bullying Stupid Machine')}>
          <Text style={styles.text}>
            Bullying Dumb Machine
          </Text>
        </TouchableOpacity>
      </LinearGradient>

      <TouchableOpacity style={styles.button_corner} onPress={() => navigation.navigate('Settings')}>
        <Image style={{ flex: 1, alignContent: 'center', width: 40, height: undefined, resizeMode: 'contain', }} source={require('./setting.png')} />
      </TouchableOpacity>
    </>
  );
}

function PlayGame4PLSmoll({ navigation }) {
  return (
    <LinearGradient start={{ x: 0, y: 0.75 }} end={{ x: 1, y: 0.25 }} colors={['#a7f542', '#22c1c3', '#fdbb2d']} style={{ flex: 1, alignItems: 'center', justifyContent: 'center', }}>
      <Game mode={'Smoll'} />
    </LinearGradient>
  );
}
function PlayGameBullying({ navigation }) {
  return (
    <LinearGradient start={{ x: 0, y: 0.75 }} end={{ x: 1, y: 0.25 }} colors={['#1FA2FF', '#7e42f5', '#f542dd']} style={{ flex: 1, alignItems: 'center', justifyContent: 'center', }}>
      <Game mode={'Bullying Stupid Machine'} />
    </LinearGradient>
  );
}
function PlayGameQueen({ navigation }) {
  return (
    <LinearGradient start={{ x: 0, y: 0.75 }} end={{ x: 1, y: 0.25 }} colors={['#f55142', '#bf665e', '#967774']} style={{ flex: 1, alignItems: 'center', justifyContent: 'center', }}>
      <Game mode={'All Hail The Queen'} />
    </LinearGradient>
  );
}
function PlayGameGambit({ navigation }) {
  return (
    <LinearGradient start={{ x: 0, y: 0.75 }} end={{ x: 1, y: 0.25 }} colors={['#3e02f0', '#5e3dbf', '#7c7496']} style={{ flex: 1, alignItems: 'center', justifyContent: 'center', }}>
      <Game mode={'Queens Gambit'} />
    </LinearGradient>
  );
}
function PlayGame4PL({ navigation }) {
  return (
    <LinearGradient start={{ x: 0, y: 0.75 }} end={{ x: 1, y: 0.25 }} colors={['#1FA2FF', '#22c1c3', '#fdbb2d']} style={{ flex: 1, alignItems: 'center', justifyContent: 'center', }}>
      <Game mode={'4PL'} />
    </LinearGradient>
  );
}
function PlayGame2PL({ navigation }) {

  return (
    <LinearGradient start={{ x: 0, y: 0.75 }} end={{ x: 1, y: 0.25 }} colors={['#1FA2FF', '#78ffd6', '#a8ff78',]} style={{ flex: 1, alignItems: 'center', justifyContent: 'center', }}>
      <Game mode={'2PL'} />
    </LinearGradient>
  );
}
function PlayGameMann({ navigation }) {
  return (
    <LinearGradient start={{ x: 0, y: 0.75 }} end={{ x: 1, y: 0.25 }} colors={['#f00289', '#a17fe0', '#5D26C1']} style={{ flex: 1, alignItems: 'center', justifyContent: 'center', }}>
      <Game mode={'Mann'} />
    </LinearGradient>
  );
}
function PlayGameMannHard({ navigation }) {
  return (
    <LinearGradient start={{ x: 0, y: 0.75 }} end={{ x: 1, y: 0.25 }} colors={['#1a000f', '#a17fe0', '#a17fe0', '#1e0238']} style={{ flex: 1, alignItems: 'center', justifyContent: 'center', }}>
      <Game mode={'MannHard'} />
    </LinearGradient>
  );
}
function PlayGameMann1v1({ navigation }) {
  return (
    <LinearGradient start={{ x: 0, y: 0.75 }} end={{ x: 1, y: 0.25 }} colors={['#7841fa', '#4df7ec', '#3afc61']} style={{ flex: 1, alignItems: 'center', justifyContent: 'center', }}>
      <Game mode={'Mann1V1'} />
    </LinearGradient>
  );
}
function PlayGameMannCoop({ navigation }) {
  return (
    <LinearGradient start={{ x: 0, y: 0.75 }} end={{ x: 1, y: 0.25 }} colors={['#754374', '#a17fe0', '#acba3d']} style={{ flex: 1, alignItems: 'center', justifyContent: 'center', }}>
      <Game mode={'MannCoop'} />
    </LinearGradient>
  );
}
function PlayGame4PO({ navigation }) {
  return (
    <LinearGradient start={{ x: 0, y: 0.75 }} end={{ x: 1, y: 0.25 }} colors={['#12c2e9', '#c471ed', '#E94057']} style={{ flex: 1, alignItems: 'center', justifyContent: 'center', }}>
      <Game mode={'4PO'} address={AddressSettings.address} />
    </LinearGradient>
  );
}


function GetSettings() {
  return <LinearGradient start={{ x: 0, y: 0.75 }} end={{ x: 1, y: 0.25 }} colors={['#12c2e9', '#c471ed', '#f64f59']} style={{ flex: 1, alignItems: 'center', justifyContent: 'center', }}>
    <Selection>
    </Selection>
  </LinearGradient>
}

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} options={{
          headerTransparent: true, animationTypeForReplace: 'pop',
          animation: 'fade'
        }} />
        <Stack.Screen name="4 Players Local" component={PlayGame4PL} options={{
          headerTransparent: true, animationTypeForReplace: 'pop',
          animation: 'fade'
        }} />
        <Stack.Screen name="2 Players Local" component={PlayGame2PL} options={{
          headerTransparent: true, animationTypeForReplace: 'pop',
          animation: 'fade'
        }} />
        <Stack.Screen name="4 Players Online" component={PlayGame4PO} options={{
          headerTransparent: true, animationTypeForReplace: 'pop',
          animation: 'fade'
        }} />
        <Stack.Screen name="Mann" component={PlayGameMann} options={{
          headerTransparent: true, animationTypeForReplace: 'pop',
          animation: 'fade'
        }} />
        <Stack.Screen name="MannHard" component={PlayGameMannHard} options={{
          headerTransparent: true, animationTypeForReplace: 'pop',
          animation: 'fade'
        }} />
        <Stack.Screen name="Mann1v1" component={PlayGameMann1v1} options={{
          headerTransparent: true, animationTypeForReplace: 'pop',
          animation: 'fade'
        }} />
        <Stack.Screen name="MannCoop" component={PlayGameMannCoop} options={{
          headerTransparent: true, animationTypeForReplace: 'pop',
          animation: 'fade'
        }} />
        <Stack.Screen name="Settings" component={GetSettings} options={{
          headerTransparent: true, animationTypeForReplace: 'pop',
          animation: 'fade'
        }} />
        
        <Stack.Screen name='Queens Gambit' component={PlayGameGambit} options={{
          headerTransparent: true, animationTypeForReplace: 'pop',
          animation: 'fade'
        }} />
        <Stack.Screen name='All Hail The Queen' component={PlayGameQueen} options={{
          headerTransparent: true, animationTypeForReplace: 'pop',
          animation: 'fade'
        }} />
        <Stack.Screen name="Smoll" component={PlayGame4PLSmoll} options={{
          headerTransparent: true, animationTypeForReplace: 'pop',
          animation: 'fade'
        }} />
        <Stack.Screen name='Bullying Stupid Machine' component={PlayGameBullying} options={{
          headerTransparent: true, animationTypeForReplace: 'pop',
          animation: 'fade'
        }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  // background: {
  //   background: [linearGradient("135deg", hsla("224", "75%,", "45%", "1"), "0%", hsla("324", "75%", "45%", "1"), "100%")]
  // },
  linearGradient: {
    flex: 1,
    paddingLeft: 15,
    paddingRight: 15,
    borderRadius: 5
  },
  buttonText: {
    fontSize: 18,
    fontFamily: 'Gill Sans',
    textAlign: 'center',
    margin: 10,
    color: '#ffffff',
    backgroundColor: 'transparent',
  },
  turnBackground: {
    position: 'absolute',
    width: 425,
    height: 425,
    margin: 0
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    margin: 6,
    paddingVertical: 10,
    paddingHorizontal: 28,
    borderRadius: 4,
    elevation: 3,
    backgroundColor: 'black',
  },
  button_corner: {
    maxHeight: 40,
    maxWidth: 40,
    height: 40,
    width: 40,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 10,
    padding: 5,
    borderRadius: 4,
    elevation: 3,
    backgroundColor: 'black',
    position: 'absolute',
    bottom: 10,
    left: 10,
    // zIndex: 9,
  },
  imageButton: {
    alignItems: 'center',
    justifyContent: 'center',
    margin: 10,
    padding: 5,
    borderRadius: 4,
    elevation: 3,
    backgroundColor: 'black',
  },
  text: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: 'bold',
    letterSpacing: 0.25,
    color: 'white',
  },
  container: {
    margin: 0,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'linear-gradient(to bottom, #6be569, #6d92d2)',
  },
  linearGradient: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
    height: 500,
    width: 500,
  },
});
