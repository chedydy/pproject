import React, {Component} from 'react';
import {ListView, View} from 'react-native';
import HistoryItem from './HistoryItem';

export default class HistoryComponent extends Component {
    coffeeHistory = [];
    componentWillMount() {
        this.coffeeHistory = [
            {
                completedDate: new Date().toLocaleDateString(),
                name: 'test'
            }, {
                completedDate: new Date().toLocaleDateString(),
                name: 'test2'
            }, {
                completedDate: new Date().toLocaleDateString(),
                name: 'test3'
            }
        ]
        this.createDataSource(this.coffeeHistory);
    }

    // componentWillReceiveProps(nextprops) {     this.createDataSource(nextprops);
    // }
    componentWillReceiveProps(nextprops) {
        this.createDataSource(this.coffeeHistory);
    }

    createDataSource(coffeeHistory) {
        const ds = new ListView.DataSource({
            rowHasChanged: (r1, r2) => r1 !== r2
        });

        this.dataSource = ds.cloneWithRows(coffeeHistory);
    }

    renderRow(coffeeHistoryItem) {
        return <HistoryItem coffeeHistoryItem={coffeeHistoryItem}/>;
    }

    render() {
        return (
            <ListView
                style={{
                paddingTop: 30
            }}
                enableEmptySections
                dataSource={this.dataSource}
                renderRow={this.renderRow}></ListView>
        );

    }
}

// const mapStateToProps = state => {     const plants = _.map(state.plants,
// (val, uid) => {         return {             ...val,             uid
// };     });     return {plants}; }; export default connect(mapStateToProps,
// {plantsFetch})(PlantList);