import React, { Component } from 'react';
import { ListView, View } from 'react-native';
import { connect } from 'react-redux';
import _ from 'lodash';
import { historyFetch } from '../actions';
import HistoryItem from './HistoryItem';

class HistoryComponent extends Component {
    componentWillMount() {
        this.props.historyFetch();
        this.createDataSource(this.props)
    }

    componentWillReceiveProps(nextprops) {
        this.createDataSource(nextprops);
    }

    createDataSource({ coffeeHistory }) {
        const ds = new ListView.DataSource({
            rowHasChanged: (r1, r2) => r1 !== r2
        });

        this.dataSource = ds.cloneWithRows(coffeeHistory);
    }

    renderRow(coffeeHistoryItem) {
        return <HistoryItem coffeeHistoryItem={coffeeHistoryItem} />;
    }

    render() {
        return (
            <ListView
                enableEmptySections
                dataSource={this.dataSource}
                renderRow={this.renderRow}></ListView>
        );

    }
}

const mapStateToProps = state => {
    const coffeeHistory = _.map(state.history,
        (val, uid) => { return { ...val, uid }; });
    return { coffeeHistory };
};

export default connect(mapStateToProps, { historyFetch })(HistoryComponent);