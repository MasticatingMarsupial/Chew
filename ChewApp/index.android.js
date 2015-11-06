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
  DrawerLayoutAndroid,
  ToolbarAndroid,
  Text,
  View,
} = React;

var HomeView = require('./js/components/HomeView');
var FoodSearchResultView = require('./js/components/FoodSearchResultView');
var FoodDetailView = require('./js/components/FoodDetailView');
var DrawerView = require('./js/components/DrawerView');
var SigninView = require('./js/components/SigninView');
var FavouritesView = require('./js/components/FavouritesView');
var ProfileView = require('./js/components/ProfileView');

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
  // console.log(_navigator);
  // if (_navigator.getCurrentRoutes().length > 5) {
  //   navigator.shift();
  // }
  console.log('RouteMapper');
  console.log('Route is:',route);
 if (route.name === 'home') {
    console.log('rendering the HomeView');
    return (
      <HomeView navigator={navigationOperations} />
    );
  }
  else if (route.name === 'login') {
    return (
      <View style={{flex: 1}}>
        <ToolbarAndroid
          actions={[]}
          style={styles.toolbar}
          titleColor="white"
          title={"Chew"}
        />
        <SigninView navigator={navigationOperations} />
      </View>
    );
  }
  else if (route.name === 'results') {
    console.log('rerouting to results');
    return (
      <View style={{flex: 1}}>
        <FoodSearchResultView
          style={{flex: 1}}
          navigator={navigationOperations}
          food={route.food.food}
          searchQueued={route.searchQueued}
        />
      </View>
    );
  }
  else if (route.name === 'food') {
    console.log('rerouting to detail view');
    console.log(route.food);
    return (
      <View style={{flex: 1}}>
        <ToolbarAndroid
          actions={[]}
          navIcon={require('image!android_back_white')}
          onIconClicked={navigationOperations.pop}
          style={styles.toolbar}
          titleColor="white"
          title={route.food.name} />
        <FoodDetailView
          style={styles.navigator}
          navigator={navigationOperations}
          food={route.food}
        />
      </View>
    );
  }
  else if (route.name === 'favourites') {
    console.log('rerouting to favourites view');
    return (
      <View style={{flex: 1}}>
        <ToolbarAndroid
          actions={[]}
          navIcon={require('image!android_back_white')}
          onIconClicked={navigationOperations.pop}
          style={styles.toolbar}
          titleColor="white"
          title="Favourites" />
        <FavouritesView
          style={styles.navigator}
          navigator={navigationOperations}
        />
      </View>
    );
  }
  else if (route.name === 'profile') {
    console.log('opening the profile view');
    return (
      <View style={{flex: 1}}>
        <ToolbarAndroid
          actions={[]}
          navIcon={require('image!android_back_white')}
          onIconClicked={navigationOperations.pop}
          style={styles.toolbar}
          titleColor="white"
          title="Profile" />
        <ProfileView
          style={styles.navigator}
          navigator={navigationOperations}
        />
      </View>
    );
  }
  else {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>Sorry, an error occured.</Text>
      </View>
      );
  }
};


var ChewApp = React.createClass({
  openDrawer:function() {
    this.refs.DRAWER.openDrawer();

  },
  onMenuButtonPress: function (menuString) {
    console.log('Selected', menuString);
    var route = {name: menuString.toLowerCase()};
    this.refs.NAVIGATOR.push(route);
    this.refs.DRAWER.closeDrawer();
  },
  render: function() {
    var initialRoute = {name: 'home'};
    var drawerView = <DrawerView onMenuButtonPress={this.onMenuButtonPress} />;
    return (
      <DrawerLayoutAndroid
      drawerWidth={250}
      drawerPosition={DrawerLayoutAndroid.positions.Left}
      ref="DRAWER"
      renderNavigationView={() => drawerView}>
        <Navigator
          style={styles.navigator}
          ref="NAVIGATOR"
          initialRoute={initialRoute}
          renderScene={RouteMapper}
          openMenuSlider={this.openDrawer}
          />
      </DrawerLayoutAndroid>
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
  toolbar: {
    backgroundColor: '#F44336',
    height: 56,
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
