'use strict';

var React = require('react-native');
var Button = require('react-native-button');
var UserActions = require('../actions/UserActions');

var {
  StyleSheet,
  Platform,
  View,
  Text,
  TextInput,
  // Dimensions,
} = React;

var HomeView = require('./HomeView');
var API_URL = 'http://chewmast.herokuapp.com/api/';
// var API_URL = 'http://localhost:8000/api/';
// var {width, height} = Dimensions.get('window');


var SigninView = React.createClass({
  getInitialState: function () {
    return {
      username: null,
      password: null
    };
  },

  routeToNextPage: function () {
    if (Platform.OS === 'ios'){
      this.props.navigator.push({
        title: 'Home',
        component: HomeView,
      });
    } else {
      this.props.navigator.push({
        title: 'Home',
        name: 'home',
      });
    }
  },

  handleSignin: function () {
    this.sendAuthRequest('signin/');
  },

  handleSignup: function () {
    this.sendAuthRequest('signup/');
  },

  sendAuthRequest: function (path) {
    fetch(API_URL + path, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        username: this.state.username,
        password: this.state.password
      })
    }).then((res) => res.json())
      .catch((err) => console.error('Signin failed: ' + err))
      .then((data) => {
        UserActions.populate(data.account);
      })
      .done(this.routeToNextPage);
  },

  render: function () {
    console.log('rendering signin page for ' + Platform.OS);
    return (
      <View>
        <View style={styles.container}>
          <View style={styles.authContainer}>
            <Text>Username</Text>
            <TextInput
              style={styles.input}
              autoCorrect={false}
              onChangeText={(text => this.setState({username: text}))}
              onSubmitEditing={this.handleSignin}
              value={this.state.username}
            />
            <Text>Password</Text>
            <TextInput
              style={styles.input}
              autoCorrect={false}
              onChangeText={(text => this.setState({password: text}))}
              onSubmitEditing={this.handleSignin}
              secureTextEntry={true}
              value={this.state.password}
            />
            <View style={styles.buttonContainer}>
              <View style={styles.button}>
                <Button
                  onPress={this.handleSignin}
                >
                  <Text style={styles.buttonText}>Log In</Text>
                </Button>
              </View>
              <View style={[styles.button, styles.signup]}>
                <Button
                  style={styles.signup}
                  onPress={this.handleSignup}
                >
                  <Text style={styles.buttonText}>Sign Up</Text>
                </Button>
              </View>
            </View>
          </View>
        </View>
      </View>
    );
  }
});

var styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    paddingTop: 45,
  },
  authContainer: {
    flex: 1,
    paddingTop: 90,
    paddingLeft: 15,
    paddingRight: 15,
  },
  input: {
    flexDirection: 'row',
    height: 40,
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 15,
    marginLeft: 10,
    marginRight: 10,
  },
  button: {
    borderWidth: 1,
    marginLeft: 15,
    marginRight: 15,
    paddingTop: 2,
    paddingBottom: 2,
    paddingLeft: 10,
    paddingRight: 10,
    borderStyle: 'solid',
    borderColor: '#808080',
  },
  signup: {
  },
  buttonText: {
    marginTop: 5,
    marginBottom: 5,
    fontSize: 16,
  },
});

module.exports = SigninView;
