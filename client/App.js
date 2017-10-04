import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Button,
  Image,
  AsyncStorage
} from 'react-native';
import {TabNavigator, StackNavigator} from 'react-navigation';
import Expo from 'expo';
import firebase from 'firebase';
import axios from 'axios';
import Icon from 'react-native-vector-icons/FontAwesome';
import LoginComponent from './Components/LoginComponent';
import HistoryComponent from './Components/HistoryComponent';
import QueueComponent from './Components/QueueComponent';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoggedIn: false
    };
  }
  componentWillMount() {
    var config = {
      apiKey: "AIzaSyBtQyqE1vEIKXvY3TV-z-7JXhf3_F4xbUY",
      authDomain: "coffeequeue-1bf68.firebaseapp.com",
      databaseURL: "https://coffeequeue-1bf68.firebaseio.com",
      projectId: "coffeequeue-1bf68",
      storageBucket: "coffeequeue-1bf68.appspot.com",
      messagingSenderId: "1069851885439"
    };
    firebase.initializeApp(config);
    axios.defaults.baseURL = 'http://192.168.0.87:5000';
    axios.defaults.headers.post['Content-Type'] = 'application/json';
    var isLoggedIn = true;
    AsyncStorage
      .getItem('logintoken')
      .then((value) => {
        console.log(value);
        token = value;
        if (!token) {
          this.setState({isLoggedIn: false});
        } else {
          axios.defaults.headers.post['authorization'] = token;
          this.setState({isLoggedIn: true});
        }
        console.log(this.state);
      });

  }

  render() {

    const MainNavigator = StackNavigator({
      login: {
        screen: LoginComponent
      },
      main: {
        screen: TabNavigator({
          queue: {
            screen: QueueComponent
          },
          history: {
            screen: HistoryComponent
          }
        }, {
          tabBarPosition: 'bottom',
          navigationOptions: {
            tabBarVisible: true
          },
          lazy: true
        })
      }
    }, {
      initialRouteName: this.state.isLoggedIn
        ? 'main'
        : 'login',
      headerMode: "none",
      navigationOptions: {
        gesturesEnabled: false
      }
    });

    // return (   <View>     <MainNavigator/>   </View> );
    return (
      <View style={styles.container}>
        <MainNavigator/>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF'
  }
});