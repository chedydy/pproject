import React, { Component } from 'react';
import { Text, View, Image, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import { requestTrade, reserveCoffee } from '../actions';

class QueueItem extends Component {

    onRowPress() {
        const { available } = this.props.coffeeItem;
        if (available) {
            this.props.reserveCoffee({ id: this.props.coffeeItem.uid });
        } else {
            this.props.requestTrade({ id: this.props.coffeeItem.uid });
        }
    }

    render() {
        const { reservedBy, available } = this.props.coffeeItem;
        const { cardSectionStyle, thumbnailStyle, titleStyle, titleViewStyle, imageViewStyle } = styles;
        return (
            <TouchableOpacity
                onPress={this
                    .onRowPress
                    .bind(this)}>
                <View style={cardSectionStyle}>
                    <View style={imageViewStyle}>
                        <Image
                            source={{
                                uri: 'https://image.flaticon.com/icons/png/512/11/11118.png'
                            }}
                            style={thumbnailStyle} />
                    </View>
                    {
                        available ?
                            <View style={titleViewStyle}>
                                <Text style={titleStyle}>
                                    Free coffee.
                                </Text>
                                <Text style={titleStyle}>
                                    Touch to reserve
                                </Text>
                            </View>
                            :
                            <View style={titleViewStyle}>
                                <Text style={titleStyle}>
                                    Reserved by: {reservedBy}.
                                </Text>
                                <Text style={titleStyle}>
                                    Touch to request coffee trade
                                </Text>
                            </View>
                    }
                </View>
            </TouchableOpacity>
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
        flex: 85
    },
    imageViewStyle: {
        flex: 15,
        paddingRight: 15
    },

    thumbnailStyle: {
        flex: 1,
    }
};

export default connect(null, { requestTrade, reserveCoffee })(QueueItem)