'use strict';

var React = require('react-native');
var {
  Image,
  TextInput,
  StyleSheet,
  TouchableNativeFeedback,
  View,
} = React;
var dismissKeyboard = require('dismissKeyboard');
var {Icon,} = require('react-native-icons');




var SearchBar = React.createClass({
  onSubmitEditing: function(event: Object) {
    var filter = event.nativeEvent.text.toLowerCase();
    console.log(event.nativeEvent);
    dismissKeyboard();
    this.setState({
      name: filter,
    });
    this.props.onSearchButtonPress(filter);
  },
  onMenuButtonPress: function(){
    console.log(this);
    this.props.onMenuButtonPress();
  },
  render: function() {
    console.log('Android SearchBar is rendering', this.props);
    var loadingView = <View style={styles.spinner} />;
    // var drawerView = <DrawerView/>;

    return (
      <View style={styles.searchBar}>
        <TouchableNativeFeedback
            background={(TouchableNativeFeedback.SelectableBackgroundBorderless())}
            onPress={() => { this.onMenuButtonPress(); }}>
          <View>
            <Image
              source={require('image!android_menu_white')}
              style={styles.icon}
            />
          </View>
        </TouchableNativeFeedback>
        <Icon
          name="ion|android-search"
          size={22}
          color="rgba(255, 255, 255, 0.75)"
          style={styles.search}
        />
        <TextInput
          ref="input"
          autoCapitalize="none"
          autoCorrect={false}
          autoFocus={false}
          onSubmitEditing={this.onSubmitEditing}
          placeholder="Search"
          placeholderTextColor="rgba(255, 255, 255, 0.75)"
          onFocus={this.props.onFocus}
          style={styles.searchBarInput}
          backgroundColor="blue"
        />
        {loadingView}
      </View>
    );
  }
});

var styles = StyleSheet.create({
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F44336',
    height: 56,
  },
  searchBarInput: {
    flex: 1,
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    height: 50,
    padding: 0,
    backgroundColor: '#F44336'
  },
  spinner: {
    width: 30,
    height: 30,
  },
  icon: {
    width: 24,
    height: 24,
    marginHorizontal: 8,
  },
  search: {
    width: 24,
    height: 24,
    marginTop: 2,
    marginHorizontal: 8,
    marginRight: 1,
  },
});

module.exports = SearchBar;
