'use strict';

var React = require('react-native');
var {
  StyleSheet,
  Image,
  Text,
  View,
  TouchableOpacity,
  TouchableNativeFeedback,
  AsyncStorage,
  Platform,
} = React;

var API_URL = 'http://chewmast.herokuapp.com/api/';
var UserActions = require('../actions/UserActions');
var UserStore = require('../stores/UserStore');



var DrawerView = React.createClass({
  getInitialState: function () {
    return {'token': 'none'};
  },
  componentWillMount: function () {
    // Get home page stuff from DB
    AsyncStorage.getItem('token').then((value) => {
      console.log(value);
      if (value !== null){
        //TODO: Needs a validation check
        fetch(API_URL + 'token-check/' + this.state.token)
          .then((res) => res.json())
          .catch((err) => console.error('Fetching token data failed. Check the network connection: ' + err))
          .then((responseData) => {
            console.log('response data:', responseData);
            //UserActions.populate(responseData.account);
          })
          .done(
            console.log('Finished populating user data'));
        this.setState({'token': value});
      }
    }).done();
  },
  saveData: function(key, value) {
    AsyncStorage.setItem(key, value);
    this.setState({key: value});
  },
  onHomeButtonPress: function () {
    // console.log('Home button pressed!');
    this.props.onMenuButtonPress('Home');
  },
  onFavouritesButtonPress: function () {
    // console.log('Favourites button pressed!');
    this.props.onMenuButtonPress('Favourites');
  },
  onSignInLogOutButtonPress: function () {
    // console.log('Sign In/Log Out button pressed!');
    this.saveData('token', 'none');
    this.props.onMenuButtonPress('SignInSignOut');
  },
  onLoginButtonPress: function () {
    this.props.onMenuButtonPress('Login');
  },
  render: function() {
    var TouchableElement = TouchableOpacity;
    if (Platform.OS === 'android') {
      TouchableElement = TouchableNativeFeedback;
    }
    //TODO: Enable loading of actual data when api call is available && line #36
    // var account = UserStore.getAccount();
    // {account.user.first_name + account.user.last_name}
    var component = this.state.token !== 'none' ?
    <View>
    <View style={styles.imageContainer}>
      <Image source={{uri: 'https://media.licdn.com/mpr/mpr/shrinknp_400_400/AAEAAQAAAAAAAAKYAAAAJDJkMWJkNjIwLTljMWMtNDQ0MC04ZWZmLWQ1ZjgyMjQ5OTE0Nw.jpg'}}
      style={styles.profileImage}
      />
    </View>
    <Text style={styles.name}>Kyle Cho</Text>
    <TouchableElement
      onPress={this.onHomeButtonPress}
      onShowUnderlay={this.props.onHighlight}
      onHideUnderlay={this.props.onUnhighlight}
    >
      <View style={styles.textContainer}>
        <Text style={styles.listText}>Home</Text>
      </View>
    </TouchableElement>
    <TouchableElement
      onPress={this.onFavouritesButtonPress}
      onShowUnderlay={this.props.onHighlight}
      onHideUnderlay={this.props.onUnhighlight}
    >
      <View style={styles.textContainer}>
        <Text style={styles.listText}>Favourites</Text>
      </View>
    </TouchableElement>
    <TouchableElement
      onPress={this.onSignInLogOutButtonPress}
      onShowUnderlay={this.props.onHighlight}
      onHideUnderlay={this.props.onUnhighlight}
    >
      <View style={[styles.textContainer, styles.textContainerLast]}>
        <Text style={styles.listText}>Logout</Text>
      </View>
    </TouchableElement>
    </View>
    :
    <View>
    <Text style={styles.name}>Login to access your information</Text>
      <TouchableElement
        onPress={this.onLoginButtonPress}
        onShowUnderlay={this.props.onHighlight}
        onHideUnderlay={this.props.onUnhighlight}
      >
        <View style={styles.textContainer}>
          <Text style={styles.listText}>Login</Text>
        </View>
      </TouchableElement>
    </View>;

    return (
      <View style={styles.container}>{component}</View>
    );
  },
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
