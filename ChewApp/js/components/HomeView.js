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
    return {};
  },

  searchString: function (food) {
    console.log(this.state);
    // Executes query to DB for possible foods by string
    if (Platform.OS === 'ios'){
      this.props.navigator.push({
        title: 'Results',
        component: FoodSearchResultView,
        // Need to pass search text
        passProps: {
          food: food,
          searchQueued: true,
        },
      });
    } else {
      console.log(this.state);
      this.props.navigator.push({
        title: 'Results',
        name: 'results',
        // Need to pass search text
        food: {food},
        searchQueued: true,
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
