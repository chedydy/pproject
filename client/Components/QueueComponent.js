import React, { Component } from 'react';
import { ListView, View, StyleSheet, Text, Image } from 'react-native';
import { connect } from 'react-redux';
import Swiper from 'react-native-swiper';
import _ from 'lodash';
import QueueItem from './QueueItem';
import { queueFetch } from '../actions';

class QueueComponent extends Component {

    componentWillMount() {
        this.props.queueFetch();
        this.createDataSource(this.props)
    }

    componentWillReceiveProps(nextprops) {
        this.createDataSource(nextprops);
    }

    createDataSource({ coffeeQueue }) {
        const ds = new ListView.DataSource({
            rowHasChanged: (r1, r2) => r1 !== r2
        });
        this.dataSource = ds.cloneWithRows(coffeeQueue);
    }

    renderRow(coffeeItem) {
        return <QueueItem coffeeItem={coffeeItem} />;
    }

    render() {
        return (
            <View
                style={{
                  flex: 1
                }}>
                <View >
                    <ListView
                        style={styles.listStyle}
                        dataSource={this.dataSource}
                        renderRow={this.renderRow}></ListView>
                </View>
                <View style={{
                    flex: 1
                }}>
                    <Swiper style={styles.wrapper} showsButtons={true}>
                        <View style={styles.slide1}>
                            <Text style={styles.text}>Hello Swiper</Text>
                        </View>
                        <View style={styles.slide2}>
                            <Text style={styles.text}>Beautiful</Text>
                        </View>
                        <View style={styles.slide3}>
                            <Text style={styles.text}>And simple</Text>
                        </View>
                    </Swiper>
                </View>
            </View>
        );
    }
}

var styles = StyleSheet.create({
    listStyle: { backgroundColor: 'white' },
    wrapper: {
        flex: 1
    },
    slide1: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#9DD6EB'
    },
    slide2: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#97CAE5'
    },
    slide3: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#92BBD9'
    },
    text: {
        color: 'blue',
        fontSize: 30,
        fontWeight: 'bold'
    }
})
const mapStateToProps = state => {
    const coffeeQueue = _.map(state.queue,
        (val, uid) => { return { ...val, uid }; });
    return { coffeeQueue };
};

export default connect(mapStateToProps, { queueFetch })(QueueComponent);