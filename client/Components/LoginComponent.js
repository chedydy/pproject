import React from 'react';
import {
    StyleSheet,
    Text,
    View,
    Button,
    Image,
    AsyncStorage
} from 'react-native';
import Expo from 'expo';
import firebase from 'firebase';
import axios from 'axios';
import Icon from 'react-native-vector-icons/FontAwesome';
import {Permissions, Notifications} from 'expo';
var flag = false;
export default class LoginComponent extends React.Component {
    async onLoginSuccess(user) {
        try {
            let token = await AsyncStorage.getItem('pushtoken');
            if (!token) {
                let {status} = await Permissions.askAsync(Permissions.REMOTE_NOTIFICATIONS)
                if (status !== 'granted') {
                    return;
                }
                let token = await Notifications.getExponentPushTokenAsync();
                flag = true;
                AsyncStorage.setItem('pushtoken', token);
            }
            var uid = await axios.post('/register', {
                idToken: user.uid,
                pushToken: token
            })
            axios.defaults.headers.post['authorization'] = uid;
            AsyncStorage.setItem('logintoken', uid);
            console.log(this.props.navigation);
            const {navigate} = this.props.navigation;

            navigate('queue');
        } catch (error) {
            console.log(error);
        }
    }
    async onPressLogin() {
        console.log(this.props);

        try {
            const result = await Expo
                .Google
                .logInAsync({
                    androidClientId: '1069851885439-111csankufmlr9u46mk3h0ipmvi5lcc9.apps.googleusercontent.com',
                    scopes: ['profile', 'email']
                });
            if (result.type === 'success') {
                var credential = firebase
                    .auth
                    .GoogleAuthProvider
                    .credential(result.idToken);
                firebase
                    .auth()
                    .signInWithCredential(credential)
                    .then((user) => this.onLoginSuccess(user))
                    .catch(function (error) {
                        console.log(error.message);
                    });
                return result.accessToken;
            } else {
                return {cancelled: true};
            }
        } catch (e) {
            return {error: true};
        }
    }

    async logInFb() {
        const {type, token} = await Expo
            .Facebook
            .logInWithReadPermissionsAsync('169097840310974', {permissions: ['public_profile']});

        if (type === 'success') {
            const response = await fetch(`https://graph.facebook.com/me?access_token=${token}`);
            var credential = firebase
                .auth
                .FacebookAuthProvider
                .credential(token);
            firebase
                .auth()
                .signInWithCredential(credential)
                .then((user) => this.onLoginSuccess(user))
                .catch(function (error) {
                    console.log(error.message);
                });

        }
    }
    render() {
        return (
            <View style={styles.container}>
                <View style={styles.content}>
                    <Text style={styles.header}>
                        Welcome to CoffeeQ!
                    </Text>
                    <View style={styles.avatar}>
                        <Image
                            source={{
                            uri: "http://www.free-icons-download.net/images/hot-coffee-icon-68966.png"
                        }}
                            style={styles.avatarImage}/>
                    </View>
                </View>
                <View style={styles.buttons}>
                    <Icon.Button
                        name="facebook"
                        backgroundColor="#3b5998"
                        onPress={this
                        .logInFb
                        .bind(this)}
                        {...iconStyles}>
                        Login with Facebook
                    </Icon.Button>
                    <Icon.Button
                        name="google"
                        backgroundColor="#DD4B39"
                        onPress={this
                        .onPressLogin
                        .bind(this)}
                        {...iconStyles}>
                        Or with Google
                    </Icon.Button>
                </View>
            </View>
        );
    }
}

const iconStyles = {
    borderRadius: 10,
    iconStyle: {
        paddingVertical: 5
    }
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF'
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    avatar: {
        margin: 20
    },
    avatarImage: {
        borderRadius: 50,
        height: 100,
        width: 100
    },
    header: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10
    },
    text: {
        textAlign: 'center',
        color: '#333',
        marginBottom: 5
    },
    buttons: {
        justifyContent: 'space-between',
        flexDirection: 'row',
        margin: 20,
        marginBottom: 30
    }
});
