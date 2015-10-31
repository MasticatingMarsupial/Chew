'use strict';

var React = require('react-native');

var {
  StyleSheet,
  Platform,
  View,
} = React;

var FoodSearchResultView = require('./FoodSearchResultView');
var DiscoveryView = require('./DiscoveryView');
var AndroidGeolocation = require('./AndroidGeolocation');
var SearchBar = require('react-native-search-bar');
if (Platform.OS === 'android'){
  SearchBar = require('./SearchBar');
}

var HomeView = React.createClass({
  getInitialState: function () {
    if( Platform.OS === 'android' ) {
    }
    return {
      position: 'unknown',
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
    if( Platform.OS === 'android' ) {
      AndroidGeolocation.getCurrentLocation((position) => this.setState({position}))
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
    // if( Platform.OS === 'android' ) {
    //   AndroidGeolocation.getCurrentLocation(
    //       (position) => console.log(position),
    //       (error) => console.error(error));
    //   AndroidGeolocation.getConnection(
    //       (position) => console.log(position));
    // }
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
        <DiscoveryView navigator={this.props.navigator} />
      </View>
    );
  }
});

var styles = StyleSheet.create({
  scroll: {
    height: 50
  },
  container: {
    flex: 1,
    backgroundColor: 'white',
    flexDirection: 'column',
    alignItems: 'stretch',
    borderWidth: 0
  },
  searchBar: {
    marginTop: 64,
    height: 44,
  }
});

module.exports = HomeView;
