'use strict'

var React = require('react-native');

var {
  StyleSheet,
  View,
  Text,
  ProgressBarAndroid,
  ActivityIndicatorIOS,
  Platform,
} = React;


var Loading = React.createClass({
  render: function() {
    var spinner = Platform.OS === 'ios' ?
      <ActivityIndicatorIOS
          animating={this.props.isLoading}
          style={styles.spinner}
        />
      :
        <ProgressBarAndroid
          styleAttr="Large"
          style={styles.spinner}
        />;
    return (
      <View style={[styles.container, styles.centerText]}>
        <Text style={styles.noFoodText}>
          Finding the best food
        </Text>
        {spinner}
      </View>
      );
  }
});

var styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  centerText: {
    alignItems: 'center',
  },
  noFoodText: {
    marginTop: 80,
    color: '#888888',
  },
  spinner: {
    width: 100,
    height: 100,
    alignItems: 'center',
  },
});

module.exports = Loading;
