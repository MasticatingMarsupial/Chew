'use strict';

var React = require('react-native');

var {
  StyleSheet,
  View,
  Text,
} = React;

var FoodDetailView = require('./FoodDetailView');
var SearchBar = require('react-native-search-bar');

var FoodSearchResultView = React.createClass({
  getInitialState: function () {
    console.log("WOOH, this is where we are", this)
    return {

    };
  },
  componentDidMount: function () {
    // Get home page stuff from DB
  },
  searchString: function (string) {
    // Executes query to DB for possible foods by string
    // Refreshes the list of foods by changing the list of foods
  },
  selectFood: function (food) {
    this.props.navigator.push({
        title: 'Food Detail',
        component: FoodDetailView,
        // Need to pass food to next view
        // passProps: {food},
      });
  },
  render: function () {
    return (
      <View style={styles.container}>
        <SearchBar 
          placeholder='Find your food'
          // onSearchButtonPress={this.searchString}
          style={styles.searchBar} />
        <Text style={styles.welcome}>
          Welcome to Chew!
        </Text>
        <Text style={styles.instructions}>
          We'll help you find the food you crave
        </Text>
        <Text style={styles.instructions}>
          Press Cmd+R to reload,{'\n'}
          Cmd+D or shake for dev menu
        </Text>
      </View>
    );
  }
});

var styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  searchBar: {
    marginTop: 64,
    height: 44,
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});

module.exports = FoodSearchResultView;