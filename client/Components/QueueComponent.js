import React, {Component} from 'react';
import {ListView, View, StyleSheet, Text, Image} from 'react-native';
import Swiper from 'react-native-swiper';
import QueueItem from './QueueItem';

export default class QueueComponent extends Component {
    coffeeQueue = [];
    componentWillMount() {
        this.coffeeQueue = [
            {
                name: 'test'
            }, {
                name: 'test2'
            }
        ]
        this.createDataSource(this.coffeeQueue);
    }

    // componentWillReceiveProps(nextprops) {     this.createDataSource(nextprops);
    // }
    componentWillReceiveProps(nextprops) {
        this.createDataSource(this.coffeeQueue);
    }

    createDataSource(coffeeQueue) {
        const ds = new ListView.DataSource({
            rowHasChanged: (r1, r2) => r1 !== r2
        });

        this.dataSource = ds.cloneWithRows(coffeeQueue);
    }

    renderRow(coffeeItem) {
        return <QueueItem coffeeItem={coffeeItem}/>;
    }

    render() {
        return (
            <View
                style={{
                paddingTop: 30,
                flex: 1
            }}>
                <View style={{
                    flex: 1
                }}>
                    <ListView
                        enableEmptySections
                        dataSource={this.dataSource}
                        renderRow={this.renderRow}></ListView>
                </View>
                {/* <View style={{
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

                </View> */}

            </View>

        );

    }
}

var styles = StyleSheet.create({
    container: {
        flex: 3
    },
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
// const mapStateToProps = state => {     const plants = _.map(state.plants,
// (val, uid) => {         return {             ...val,             uid }; });
// return {plants}; }; export default connect(mapStateToProps,
// {plantsFetch})(PlantList);