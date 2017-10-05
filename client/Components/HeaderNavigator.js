import React, { Component } from 'react';
import { ListView, View, StyleSheet, Text, Image, Alert } from 'react-native';
import { TabNavigator } from 'react-navigation';
import { Notifications } from 'expo';
import { connect } from 'react-redux';
import HistoryComponent from './HistoryComponent';
import QueueComponent from './QueueComponent';
import { reserve, acceptTrade, queueFetch } from '../actions';

class HeaderNavigatorComponent extends Component {
    _handleNotification = (notification) => {
        console.log(notification.data);
        switch (notification.data.type) {
            case 'reserve': this.props.reserve(notification.data.body); break;
            case 'trade':
                Alert.alert(
                    'Trade request',
                    `${notification.data.body.name} has requested a trade. Accept?`,
                    [
                        { text: 'Yes', onPress: () => this.props.acceptTrade(notification.data.body) },
                        { text: 'No', onPress: () => console.log('Cancel Pressed'), style: 'cancel' }
                    ],
                    { cancelable: false }
                )
                break;
            case 'trade-complete': this.props.queueFetch(); break;
        }
    };

    componentWillMount() {

        this._notificationSubscription = Notifications.addListener(this._handleNotification);
    }
    render() {
        var TabNavigation = TabNavigator({
            queue: {
                screen: QueueComponent
            },
            history: {
                screen: HistoryComponent
            }
        }, {
                tabBarPosition: 'bottom',
                navigationOptions: {
                    tabBarVisible: true,
                },
                lazy: true
            });
        const { cardSectionStyle, thumbnailStyle, text, titleViewStyle, imageViewStyle } = styles;
        const { name, photoUrl } = this.props.screenProps;
        return (
            <View
                style={{
                    flex: 1
                }}>
                <View style={cardSectionStyle}>
                    <View style={imageViewStyle}>
                        <Image
                            source={{
                                uri: photoUrl
                            }}
                            style={thumbnailStyle} />
                    </View>
                    <View style={titleViewStyle}>
                        <Text style={text}>
                            {name}
                        </Text>
                    </View>
                </View>
                <View style={{
                    flex: 9
                }}>
                    <TabNavigation />
                </View>
            </View>
        );
    }
}

var styles = StyleSheet.create({
    headerStyle: {
        paddingTop: 30,
        flex: 1,
        backgroundColor: 'lightblue'
    },
    text: {
        color: 'blue',
        fontSize: 20,
        fontWeight: 'bold'
    },
    cardSectionStyle: {
        flexDirection: 'row',
        flex: 1,
        borderBottomWidth: 0,
        padding: 15,
        paddingTop: 5,
        paddingBottom: 5,
        paddingTop: 30,
        backgroundColor: 'lightblue',
        borderBottomColor: '#bdbdbd',
        borderBottomWidth: 1
    },
    titleViewStyle: {
        flex: 8,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    imageViewStyle: {
        flex: 2,
        paddingRight: 15
    },

    thumbnailStyle: {
        flex: 1,
        borderRadius: 100
    }
})


export default connect(null, { acceptTrade, reserve, queueFetch })(HeaderNavigatorComponent);