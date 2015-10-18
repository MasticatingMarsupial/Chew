'use strict';

var React = require('react-native');

var {
  StyleSheet,
  Platform,
  View,
  Text,
} = React;

var FoodSearchResultView = require('./FoodSearchResultView');
var SearchBar = require('react-native-search-bar');
if (Platform.OS === 'android'){
  SearchBar = require('./SearchBar');
}

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
    if (Platform.OS === 'ios'){
      this.props.navigator.push({
      title: 'Results',
      component: FoodSearchResultView,
      // Need to pass search text
      // passProps: {foods},
      });
    } else { 
      this.props.navigator.push({
        title: 'Results',
        name: 'results',
        // Need to pass search text
        // food: {food},
      });
    }
  },
  render: function () {
    console.log('rendering homepage for ' + Platform.OS)
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