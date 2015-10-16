'use strict';

var React = require('react-native');

var {
  StyleSheet,
  View,
  Text,
} = React;

var FoodSearchResultView = require('./FoodSearchResultView');
var SearchBar = require('react-native-search-bar');

var HomeView = React.createClass({
  getInitialState: function () {
    return {

    };
  },
  componentDidMount: function () {
    // Get home page stuff from DB
  },
  searchString: function (string) {
    // Executes query to DB for possible foods by string
    this.props.navigator.push({
      title: 'Food Search Result',
      component: FoodSearchResultView,
      // Need to pass search text
      // passProps: {foods},
    });
  },
  render: function () {
    return (
      <View style={styles.container}>
        <SearchBar 
          placeholder='Find your food'
          onSearchButtonPress={this.searchString}
          style={styles.searchBar} 
        />
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

module.exports = HomeView;