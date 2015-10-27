'use strict';

var React = require('react-native');
var {
  AppRegistry,
  StyleSheet,
  NavigatorIOS,
  View,
} = React;

var Drawer = require('react-native-drawer');

var HomeView = require('./js/components/HomeView');

var ChewApp = React.createClass({
  getInitialState() {
    return {};
  },
  showMenuSlider: function () {
    console.log('Showing slider');
  },
  hideMenuSlider: function(){
    this.refs.drawer.close()
  },
  showMenuSlider: function(){
    this.refs.drawer.open()
  },
  render: function() {
    var navigationView = (
      <NavigatorIOS 
        style={styles.container} 
        barTintColor='red'
        titleTextColor='white'
        tintColor='white'
        initialRoute={{
          title: 'Home',
          component: HomeView,
          leftButtonTitle: 'Menu',
          // leftButtonIcon: require('image!back_button'),
          onLeftButtonPress: () => this.showMenuSlider(),
        }}
      />
    );

    return (
      <Drawer
        type="overlay"
        openDrawerOffset={50}
        panCloseMask={1}
        ref="drawer"
        tweenEasing={'linear'}
        content={<View style={styles.test} />}
      >
        {navigationView}
      </Drawer>
    );
  }
});

var styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  test: {
    backgroundColor: 'black'
  }
});

AppRegistry.registerComponent('ChewApp', () => ChewApp);