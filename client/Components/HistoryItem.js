import React, { Component } from 'react';
import { Text, View, Image } from 'react-native';

export default class HistoryItem extends Component {

    render() {
        const { reservedBy, completedOn } = this.props.coffeeHistoryItem;
        const { cardSectionStyle, thumbnailStyle, titleStyle, titleViewStyle, imageViewStyle } = styles;
        return (
            <View style={cardSectionStyle}>
                <View style={imageViewStyle}>
                    <Image
                        source={{
                            uri: 'https://image.flaticon.com/icons/png/512/11/11118.png'
                        }}
                        style={thumbnailStyle} />
                </View>
                <View style={titleViewStyle}>
                    <Text style={titleStyle}>
                        Reserved by: {reservedBy}
                    </Text>
                    <Text style={titleStyle}>
                        Picked up on: {completedOn}
                    </Text>
                </View>
            </View>
        );
    }
}

const styles = {
    cardSectionStyle: {
        flexDirection: 'row',
        borderBottomWidth: 0,
        padding: 15,
        paddingTop: 5,
        paddingBottom: 5,
        borderBottomColor: '#bdbdbd',
        borderBottomWidth: 1
    },
    titleStyle: {
        fontSize: 15,
        paddingLeft: 20,
        paddingTop: 2,
        paddingBottom: 2,
        flex: 1
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
        //borderRadius: 100
    }
};
