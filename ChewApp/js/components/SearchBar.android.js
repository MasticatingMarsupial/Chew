'use strict';

var React = require('react-native');
var {
  Image,
  Platform,
  ProgressBarAndroid,
  TextInput,
  StyleSheet,
  TouchableNativeFeedback,
  View,
} = React;
var dismissKeyboard = require('dismissKeyboard');


var SearchBar = React.createClass({
  onSubmitEditing: function(event: Object) {
    var filter = event.nativeEvent.text.toLowerCase();
    console.log(event.nativeEvent);
    dismissKeyboard();
    this.setState({
      name: filter,
    })
    this.props.onSearchButtonPress(filter);
      
  },
  render: function() {
    console.log('Android SearchBar is rendering', this);
    var loadingView = <View style={styles.spinner} />;
    return (
      <View style={styles.searchBar}>
        <TouchableNativeFeedback
            background={(TouchableNativeFeedback.SelectableBackgroundBorderless())}
            onPress={() => this.refs.input && this.refs.input.focus()}>
          <View>
            <Image
              source={require('image!android_search_white')}
              style={styles.icon}
            />
          </View>
        </TouchableNativeFeedback>
        <TextInput
          ref="input"
          autoCapitalize="none"
          autoCorrect={false}
          autoFocus={false}
          onSubmitEditing={this.onSubmitEditing}
          placeholder="Search for a type of food..."
          placeholderTextColor="rgba(255, 255, 255, 0.5)"
          onFocus={this.props.onFocus}
          style={styles.searchBarInput}
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
    backgroundColor: 'transparent'
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
});

module.exports = SearchBar;
