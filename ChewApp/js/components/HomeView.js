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
      position: 'unknown'
    };
  },
  componentDidMount: function () {
    // Get home page stuff from DB
    if (Platform.OS === 'ios'){
      navigator.geolocation.getCurrentPosition(
        (position) => this.setState({position}),
        (error) => console.error(error.message),
        {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000}
      );
    }
  },
  searchString: function (food) {
    // Executes query to DB for possible foods by string
    if (Platform.OS === 'ios'){
      this.props.navigator.push({
        title: 'Results',
        component: FoodSearchResultView,
        // Need to pass search text
        passProps: {
          food: food,
          position: this.state.position
        },
      });
    } else {
      this.props.navigator.push({
        title: 'Results',
        name: 'results',
        // Need to pass search text
        food: {food},
        position: this.state.position,
      });
    }
  },
  render: function () {
    console.log('rendering homepage for ' + Platform.OS);
    return (
      <View style={styles.container}>
        <SearchBar
          placeholder="Find your food"
          onSearchButtonPress={this.searchString}
          onMenuButtonPress={() => {this.props.navigator.props.openMenuSlider();}}
          style={styles.searchBar}
        />
        <Text style={styles.welcome}>
          Welcome to Chew!
        </Text>
        <Text style={styles.instructions}>
          We help you find the food you crave
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
