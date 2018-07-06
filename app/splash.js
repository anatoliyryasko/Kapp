/**
* Sample React Native App
* https://github.com/facebook/react-native
* @flow
*/

import React, { Component } from 'react';
import {
	AppRegistry,
	StyleSheet,
	AsyncStorage,
	Text,
	View,
	BackHandler,
	Image,
    Platform,
    ImageBackground,
    ViewPropTypes
} from 'react-native';
import {BubblesLoader, TextLoader} from 'react-native-indicator';

export default class SplashScreen extends React.Component {
	componentDidMount() {
        const { navigate } = this.props.navigation;
        setTimeout(function(){
            navigate('Home');
        }, 2000);
	}

	render() {
		return(
			<ImageBackground source={require('./images/splash.png')} style={styles.container}>
				<View style={{flex:1}}/>
				<View style={{flex:2,justifyContent:'center',
                    alignItems:'center',}}>
					<BubblesLoader
						color={'#1e90ff'}/>
					<TextLoader text="Loading" textStyle={{color:'#ffffff'}}/>
				</View>
			</ImageBackground>
		);
	}
}

const styles = StyleSheet.create({
	
	container: {
		backgroundColor: "#ffffff",
		flex: 1,
		justifyContent:'center',
		alignItems:'center',
		flexDirection: "column",
	},
	splashLogo: {
		flex:1,

	}

});

AppRegistry.registerComponent('App', () => App);
