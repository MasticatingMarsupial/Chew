'use strict';

var React = require('react-native');
var {
  StyleSheet,
  Image,
  Text,
  View,
  TouchableHighlight,
  TouchableNativeFeedback,
  Platform,
} = React;

var DrawerView = React.createClass({
  render: function() {
    console.log(this);
    var TouchableElement = TouchableHighlight;
      if (Platform.OS === 'android') {
      TouchableElement = TouchableNativeFeedback;
    }
    return (
      <View style={styles.container}>
        <View style={styles.imageContainer}>
          <Image source={{uri: 'https://media.licdn.com/mpr/mpr/shrinknp_400_400/AAEAAQAAAAAAAAKYAAAAJDJkMWJkNjIwLTljMWMtNDQ0MC04ZWZmLWQ1ZjgyMjQ5OTE0Nw.jpg'}}
                 style={styles.profileImage}
          />
        </View>
        <Text style={styles.name}>Kyle Cho</Text>
        <TouchableElement
          onPress={this.props.onPress}
          onShowUnderlay={this.props.onHighlight}
          onHideUnderlay={this.props.onUnhighlight}
        >
          <View style={styles.textContainer}>
            <Text style={styles.listText}>Home</Text>
          </View>
        </TouchableElement>
        <TouchableElement
          onPress={this.props.onPress}
          onShowUnderlay={this.props.onHighlight}
          onHideUnderlay={this.props.onUnhighlight}
        >
          <View style={styles.textContainer}>
            <Text style={styles.listText}>Favourites</Text>
          </View>
        </TouchableElement>
        <TouchableElement
          onPress={this.props.onPress}
          onShowUnderlay={this.props.onHighlight}
          onHideUnderlay={this.props.onUnhighlight}
        >
          <View style={[styles.textContainer, styles.textContainerLast]}>
            <Text style={styles.listText}>Logout</Text>
          </View>
        </TouchableElement>
      </View>
    );
  }
});

var styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  imageContainer: {
    paddingTop: 15,
    paddingBottom: 10,
  },
  profileImage: {
    alignSelf: 'center',
    height: 150,
    width: 150,
    borderRadius: 75,
  },
  name: {
    alignSelf: 'center',
    fontSize: 20,
    fontWeight: '500',
    paddingBottom: 15,
  },
  textContainer: {
    paddingTop: 10,
    paddingBottom: 10,
    borderTopWidth: 1,
    borderStyle: 'solid',
    borderTopColor: '#c0c0c0',
  },
  textContainerLast: {
    borderBottomWidth: 1,
    borderBottomColor: '#c0c0c0'
  },
  listText: {
    margin: 10,
    fontSize: 15,
    textAlign: 'center',
    paddingLeft: 5,
  },
});

module.exports = DrawerView;
