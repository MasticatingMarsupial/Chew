'use strict';

var React = require('react-native');
var {
  StyleSheet,
  Platform,
  View,
  Text,
  TextInput,
  Image
} = React;
var Button = require('react-native-button');
var UserStore = require('../stores/UserStore');
var UserActions = require('../actions/UserActions');

var API_URL = 'http://chewmast.herokuapp.com/api/';
// var API_URL = 'http://localhost:8000/api/';

var getProfileState = function () {
  var account = UserStore.getAccount();
  return {
    id: account.id,
    profile: account.user,
  };
};

var ProfileView = React.createClass({
  getInitialState: function () {
    var profileState = getProfileState();
    return {
      id: profileState.id,
      profile: profileState.profile,
      editable: {
        'first_name': false,
        'last_name': false,
        'email': false
      },
      editMode: false
    };
  },

  componentWillMount: function () {
    UserStore.addChangeListener(() => this._onAccountChange);
  },

  _onAccountChange: function () {
    this.setState(UserStore.getProfileState());
  },

  _handlePress: function () {
    var editable = {};
    for (var key in this.state.editable) {
      editable[key] = !this.state.editable[key];
    }
    if (this.state.editMode) {
      UserActions.updateProfile(this.state.id, {user: this.state.profile});
    }
    this.setState({editable: editable, editMode: !this.state.editMode});
  },

  render: function () {
    var accountFields = [];
    var accountField, profileButtonText;
    if (Platform.OS === 'ios'){
      for (var key in this.state.editable) {
        this.state.profile[key] = this.state.profile[key] || '';
        accountField = (savedKey) => {
          return (
          <View style={styles.fieldContainer}>
            <Text style={styles.fieldText}>
              {savedKey.toUpperCase()}
            </Text>
            <TextInput
              style={styles.fieldInput}
              editable={this.state.editable[savedKey]}
              value={this.state.profile[savedKey]}
              onChangeText={(text) => {
                var profile = this.state.profile;
                profile[savedKey] = text;
                this.setState({profile: profile});
              }}
            />
          </View>
          );
        }(key);
        accountFields.push(accountField);
      }
    } else {
      for (var key in this.state.editable) {
        this.state.profile[key] = this.state.profile[key] || '';
        accountField = (savedKey) => {
          return (
          <View style={styles.fieldContainer}>
            <Text style={styles.fieldText}>
              {savedKey.toUpperCase()}
            </Text>
            <TextInput
              style={styles.fieldInputAndroid}
              editable={this.state.editable[savedKey]}
              value={this.state.profile[savedKey]}
              onChangeText={(text) => {
                var profile = this.state.profile;
                profile[savedKey] = text;
                this.setState({profile: profile});
              }}
            />
          </View>
          );
        }(key);
        accountFields.push(accountField);
      }
    }

    profileButtonText = this.state.editMode ? 'Save Profile' : 'Edit Profile';
    return (
      <View style={styles.container}>
        <View style={styles.imageContainer}>
          <Image source={{uri: 'https://media2.giphy.com/media/x1u507NMakkZG/200_s.gif'}}
          style={styles.profileImage}
          />
          <View>
            <Text style={styles.usernameText}>{this.state.profile.username}</Text>
            <Button
            style={styles.editProfileButton}
            onPress={this._handlePress}
            >
              {profileButtonText}
            </Button>
          </View>
        </View>
        <View style={styles.accountsContainer}>
          {accountFields}
        </View>
      </View>
    );
  }
});

var styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    top: 64,
  },
  accountsContainer: {
    flex: 3,
    paddingLeft: 10,
  },
  fieldInput: {
    fontSize: 16,
    height: 25,
  },
  fieldInputAndroid: {
    fontSize: 16,
  },
  fieldText: {
    fontSize: 16,
  },
  fieldContainer: {
    marginTop: 20,
  },
  imageContainer: {
    flex: 1,
    paddingTop: 15,
    paddingBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  profileImage: {
    height: 150,
    width: 150,
    borderRadius: 75,
  },
  usernameText: {
    fontSize: 48,
  },
  editProfileButton: {
    color: 'red',
  }
});

module.exports = ProfileView;
