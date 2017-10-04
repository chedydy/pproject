import React, { Component } from 'react';
import { ListView, View, StyleSheet, Text, Image } from 'react-native';
import { TabNavigator } from 'react-navigation';
import { Notifications } from 'expo';
import { connect } from 'react-redux';
import HistoryComponent from './HistoryComponent';
import QueueComponent from './QueueComponent';
import { reserve, acceptTrade } from '../actions';

class HeaderNavigatorComponent extends Component {
    _handleNotification = (notification) => {
        console.log(notification.data);
        switch (notification.data.type) {
            case 'reserve': this.props.reserve(notification.data.body); break;
            case 'trade': this.props.acceptTrade(notification.data.body); break;
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
        return (
            <View
                style={{
                    flex: 1
                }}>
                <View style={cardSectionStyle}>
                    <View style={imageViewStyle}>
                        <Image
                            source={{
                                uri: 'https://image.flaticon.com/icons/png/512/11/11118.png'
                            }}
                            style={thumbnailStyle} />
                    </View>
                    <View style={titleViewStyle}>
                        <Text style={text}>
                            Test Name
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
        flex: 85,

    },
    imageViewStyle: {
        flex: 15,
        paddingRight: 15
    },

    thumbnailStyle: {
        flex: 1,
        borderRadius: 100
    }
})


export default connect(null, { acceptTrade, reserve })(HeaderNavigatorComponent);