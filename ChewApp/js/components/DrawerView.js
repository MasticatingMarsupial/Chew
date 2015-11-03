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

function getUserState() {
  return {
    account: UserStore.getAccount()
  };
}

var DrawerView = React.createClass({
  getInitialState: function () {
    return {'token': 'none',
            'account': ''};
  },
  componentWillMount: function () {
    // Get home page stuff from DB
    UserStore.addChangeListener(this._onChange);
    AsyncStorage.getItem('token').then((value) => {
      console.log(value);
      if (value !== null){
        //TODO: Needs a validation check
        console.log(API_URL + 'token-check/' + value);
        fetch(API_URL + 'token-check/' + value)
          .then((res) => res.json())
          .catch((err) => console.error('Fetching token data failed. Check the network connection: ' + err))
          .then((responseData) => {
            console.log('response data:', responseData);
            if (responseData !== 'Invalid token') {
              this.setState({token: value});
              console.log('populating');
              UserActions.populate(responseData, value);
            }
          })
          .done();
      }
    }).done();
  },
  saveData: function(key, value) {
    AsyncStorage.setItem(key, value);
    this.setState({key: value});
  },
  _onChange: function() {
    this.setState(getUserState());
  },
  onHomeButtonPress: function () {
    // console.log('Home button pressed!');
    this.props.onMenuButtonPress('Profile');
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
    var component = this.state.account ?
    <View>
    <View style={styles.imageContainer}>
      <Image source={{uri: 'https://media.licdn.com/mpr/mpr/shrinknp_400_400/AAEAAQAAAAAAAAKYAAAAJDJkMWJkNjIwLTljMWMtNDQ0MC04ZWZmLWQ1ZjgyMjQ5OTE0Nw.jpg'}}
      style={styles.profileImage}
      />
    </View>
    <Text style={styles.name}>{this.state.account.user.first_name + ' ' + this.state.account.user.last_name}</Text>
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
