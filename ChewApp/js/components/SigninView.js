'use strict';

var React = require('react-native');
var Button = require('react-native-button');
var UserActions = require('../actions/UserActions');
var UserStore = require('../stores/UserStore.js');

var {
  StyleSheet,
  Platform,
  View,
  Text,
  TextInput,
  Image
} = React;

var HomeView = require('./HomeView');
// var API_URL = 'http://chewmast.herokuapp.com/api/'
var API_URL = 'http://localhost:8000/api/'

var SigninView = React.createClass({
  getInitialState: function () {
    return {
      username: null,
      password: null
    };
  },

  componentDidMount: function () {
    UserStore.addChangeListener(this._onChange);
   },

  componentWillUnmount: function () {
    UserStore.removeChangeListener(this._onChange);
  },
  _onChange: function () {
    this.setState({account: UserStore.getAccount()});
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
      .catch((err) => console.error("Signin failed: " + err))
      .then((data) => {
        UserActions.populate(data.account);
      })
      .done(this.routeToNextPage);
  },

  render: function () {
    console.log('rendering signin page for ' + Platform.OS);
    return (
      <View>
        <View style={styles.logoContainer}>
          <Image 
            source={{uri: 'http://3.bp.blogspot.com/-I1W6mGh5z-M/U771MY6_TEI/AAAAAAAAKPA/tfbZuptLJmY/s1600/cute-koala.png'}}
            style={styles.logo}
          />
        </View>
        <View style={styles.container}>
          <View style={styles.authContainer}>
            <TextInput
              style={styles.input}
              autoCorrect={false}
              onChangeText={(text => this.setState({username: text}))}
              onSubmitEditing={this.handleSignin}
              value={this.state.username}
            />
            <TextInput
              style={styles.input}
              autoCorrect={false}
              onChangeText={(text => this.setState({password: text}))}
              onSubmitEditing={this.handleSignin}
              secureTextEntry={true}
              value={this.state.password}
            />
            <View style={styles.buttonsContainer}>
              <Button 
                onPress={this.handleSignin}
                style={styles.button}
              >
                SIGNIN
              </Button>
              <Button 
                onPress={this.handleSignup}
                style={styles.button}
              >
                SIGNUP
              </Button>
            </View>
            <Text style={styles.welcome}>
              {this.state.account}
            </Text>
          </View>
        </View>
      </View>
    );
  }
});

var styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    flexDirection: 'row',
  },
  logoContainer: {
    paddingTop: 64,
    flex: 1,
    alignItems: 'center',
    flexDirection: 'column'
  },
  authContainer: {
    flex: 1,
    alignItems: 'center'
  },
  buttonsContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  button: {
    margin: 10,
    textAlign: 'center',
    backgroundColor: 'red',
    color: 'black'
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  input: {
    height: 40, 
    borderColor: 'gray', 
    borderWidth: 1
  },
  logo: {
    height: 200,
    width: 200,
    margin: 10
  }
});

module.exports = SigninView;
