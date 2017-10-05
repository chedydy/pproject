import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Button,
  Image,
  AsyncStorage
} from 'react-native';
import { TabNavigator, StackNavigator } from 'react-navigation';
import Expo from 'expo';
import firebase from 'firebase';
import axios from 'axios';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Provider } from 'react-redux';
import store from './store';
import LoginComponent from './Components/LoginComponent';
import HistoryComponent from './Components/HistoryComponent';
import QueueComponent from './Components/QueueComponent';
import HeaderNavigatorComponent from './Components/HeaderNavigator';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoggedIn: false,
      user: {}
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
    axios.defaults.baseURL = 'http://10.12.20.122:3000';
    axios.defaults.headers.post['Content-Type'] = 'application/json';
    AsyncStorage
      .getItem('logintoken')
      .then((value) => {
        token = value;
        if (!token) {
          this.setState({ isLoggedIn: false });
        } else {
          axios.defaults.headers.post['authorization'] = token;
          axios.defaults.headers.get['authorization'] = token;
          axios.post('/users', { token })
            .then((response) => { this.setState({ isLoggedIn: true, user: response.data }); })
            .catch(() => { console.log('not logged'); this.setState({ isLoggedIn: false }); });
        }
      });

  }

  render() {
    const MainNavigator = StackNavigator({
      login: {
        screen: LoginComponent
      },
      main: {
        screen: HeaderNavigatorComponent
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

    return (
      <Provider store={store}>
        <View style={styles.container}>
          <MainNavigator screenProps={this.state.isLoggedIn ? this.state.user : {}} />
        </View>
      </Provider>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF'
  }
});
