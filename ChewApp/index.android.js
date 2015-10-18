/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
'use strict';

var React = require('react-native');
var {
  AppRegistry,
  BackAndroid,
  Navigator,
  StyleSheet,
  ToolbarAndroid,
  Text,
  View,
} = React;

var HomeView = require('./js/components/HomeView');
var SearchBar = require('./js/components/SearchBar');
var FoodSearchResult = require('./js/components/FoodSearchResultView');

//Keeps track of which page we are on
var _navigator;

//Checks to see if we can use the Android Back Button
BackAndroid.addEventListener('hardwareBackPress', () => {
  if (_navigator && _navigator.getCurrentRoutes().length > 1) {
    _navigator.pop();
    return true;
  }
  return false;
});

var RouteMapper = function(route, navigationOperations, onComponentRef) {
  _navigator = navigationOperations;
  console.log("RouteMapper")
  console.log("Route is:",route);
 if (route.name === 'home') {
    console.log('rendering the HomeView');
    return (
      <HomeView navigator={navigationOperations} />
    );
  } 
  else if (route.name === 'results') {
    console.log('rerouting to results');
    return (
      <View style={{flex: 1}}>
        <ToolbarAndroid
          actions={[]}
          navIcon={{uri: 'https://cdn3.iconfinder.com/data/icons/google-material-design-icons/48/ic_arrow_back_48px-128.png'}}
          onIconClicked={navigationOperations.pop}
          style={styles.toolbar}
          titleColor="white"
          title='Cool title' />
        <FoodSearchResultView
          style={{flex: 1}}
          navigator={navigationOperations}
          
        />
      </View>
    );
  }
};


var ChewApp = React.createClass({
  render: function() {
    var initialRoute = {name: 'home'};
    return (
      <Navigator
        style={styles.navigator}
        initialRoute={initialRoute}
        configureScene={() => Navigator.SceneConfigs.FadeAndroid}
        renderScene={RouteMapper}
        />
    );
  }
});

var styles = StyleSheet.create({
  navigator: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
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

AppRegistry.registerComponent('ChewApp', () => ChewApp);
