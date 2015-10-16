'use strict';

var React = require('react-native');
var {
  AppRegistry,
  StyleSheet,
  NavigatorIOS,
} = React;

var HomeView = require('./js/components/HomeView');

var ChewApp = React.createClass({
  render: function() {
    return (
      <NavigatorIOS style={styles.container} initialRoute={{
          title: 'Home',
          component: HomeView
        }} />
    );
  }
});

var styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  }
});

AppRegistry.registerComponent('ChewApp', () => ChewApp);