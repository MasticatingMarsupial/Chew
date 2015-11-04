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
  AsyncStorage,
} = React;

var HomeView = require('./HomeView');
var API_URL = 'http://chewmast.herokuapp.com/api/';
// var API_URL = 'http://localhost:8000/api/';
// var {width, height} = Dimensions.get('window');
if (Platform.OS === 'android'){
  var dismissKeyboard = require('dismissKeyboard');
}


var SigninView = React.createClass({
  getInitialState: function () {
    return {
      username: null,
      password: null
    };
  },

  routeToNextPage: function () {
    console.log('Platform:', Platform.OS);
    if (Platform.OS === 'ios'){
      this.props.navigator.pop();
    } else {
      console.log('re-routing to home', this.props.navigator);
      this.props.navigator.push({
        title: 'Home',
        name: 'home',
      });
    }
  },

  handleSignin: function () {
    if (Platform.OS === 'android') {
      dismissKeyboard();
    }
    this.sendAuthRequest('signin/');
  },

  handleSignup: function () {
    if (Platform.OS === 'android') {
      dismissKeyboard();
    }
    this.sendAuthRequest('signup/');
  },

  sendAuthRequest: function (path) {
    var loginSuccess = true;
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
        if (data === 'Username or password is invalid'){
          //TODO: Handle error notification
          console.log('Bad Login');
          loginSuccess = false;
        }
        else if (data === 'Username already taken') {
          loginSuccess = false;
        } else {
          console.log(data);
          this.saveData('token', data.token);
          UserActions.populate(data.account, data.token);
        }
      })
      .done(() => {
        if (loginSuccess) {
          console.log('redirecting', this);
          this.routeToNextPage();
        } else {
          this.setState({error: path});
        }
      });
  },
  saveData: function(key, value) {
    AsyncStorage.setItem(key, value);
    this.setState({key: value});
  },
  render: function () {
    console.log('rendering signin page for ' + Platform.OS);
    var error;
    if (this.state.error === 'signup/'){
      error = <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Sorry, that username has been taken</Text>
      </View>;
    } else if (this.state.error === 'signin/') {
      error = <View style={styles.errorContainer}>
        <Text style={styles.errorText}>An incorrect username or password was entered</Text>
      </View>;
    } else {
      error = <View/>;
    }
    return (
      <View>
        <View style={styles.container}>
        {error}
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
    flexDirection: 'column',
    paddingTop: 45,
  },
  authContainer: {
    flex: 1,
    paddingTop: 40,
    paddingLeft: 15,
    paddingRight: 15,
  },
  input: {
    flexDirection: 'row',
    height: 40,
    borderStyle: 'solid',
    borderColor: '#808080',
    borderBottomWidth: 1,
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
  errorContainer: {
  },
  errorText: {
    alignSelf: 'center',
    backgroundColor: '#FFCDD2',
    borderRadius: 10,
    color: 'red',
  },
});

module.exports = SigninView;
