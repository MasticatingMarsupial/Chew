'use strict';

var React = require('react-native');

var {
  StyleSheet,
  View,
  ListView,
  TouchableOpacity,
  TouchableNativeFeedback,
  Text,
  Image,
  Platform,
} = React;

var FoodDetailView = require('./FoodDetailView');
var SearchBar = require('react-native-search-bar');
if (Platform.OS === 'android'){
  SearchBar = require('./SearchBar');
}
var Loading = require('./Loading');
var LocationStore = require('../stores/LocationStore');
var LocationActions = require('../actions/LocationActions');
var StarRating = require('./StarRating');
var resultsCache = [];

//TODO: Update to production URL's when ready
var API_URL = 'http://chewmast.herokuapp.com/api/';
// var API_URL = 'http://localhost:8000/api/';

var getPosition = function () {
  return {
    position: LocationStore.getPosition()
  }
}

var FoodSearchResultView = React.createClass({
  getInitialState: function () {
    return {
      dataSource: new ListView.DataSource({
        rowHasChanged: (r1, r2) => r1 !== r2
      }),
      position: getPosition(),
      searchQueued: this.props.searchQueued,
    };
  },
  componentWillMount: function () {
    LocationStore.addChangeListener(() => {
      this.setState(getPosition(), () => {
        if (this.state.searchQueued && this.props.food) {
          this.searchString(this.props.food)
          this.state.searchQueued = false;
        }
      });
    });
    LocationActions.updateLocation(Platform.OS);
  },
  searchString: function (query) {
    resultsCache = [];
    this.setState({query: query, dataSource: this.state.dataSource.cloneWithRows(resultsCache)});
    //build the URL for the search
    if (!query){
      console.log('EMPTY SEARCH INPUTTED');
      return;
    }
    var url =  API_URL + 'search/' + encodeURIComponent(query)
    var coordParams = '';
    if (this.state.position.coords) {
      coordParams = '/?coords=' + encodeURIComponent(this.state.position.coords.latitude) + ',' + encodeURIComponent(this.state.position.coords.longitude);
    }
    //Fetches the data from the server with the passed search terms
    fetch(url + coordParams)
      .then((res) => res.json())
      .catch((err) => console.error('Fetching query failed. Check the network connection: ' + err))
      .then((responseData) => {
        this._formatSearchResults(responseData.data);
        this.setState({
          dataSource: this.state.dataSource.cloneWithRows(resultsCache),
          pagination: responseData.pagination
        });
      })
      .done();
  },
  selectFood: function (rowId, food) {
    console.log('Food pressed!');
    //This needs a conditional to make the app cross platform
    if (Platform.OS === 'ios'){
      this.props.navigator.push({
        title: food.name,
        component: FoodDetailView,
        passProps: {food},
      });
    } else {
      this.props.navigator.push({
        title: food.name,
        name: 'food',
        food: food,
      });
    }
  },
  _formatSearchResults: function (results) {
    var result;
    var maxLen = 40;
    for( var i = 0; i < results.length; i++ ) {
      result = results[i];
      if( result.name.length > maxLen ) {
        result.displayName = result.name.slice(0, maxLen - 2) + '...'
      } else {
        result.displayName = result.name;
      }
      resultsCache.push(result);
    }
  },
  _onEndReached: function (event) {
    console.log(this.state);
    if( this.state.pagination.page_number < this.state.pagination.total_pages ) {
      fetch(API_URL + 'search/' + encodeURIComponent(this.state.query) + '/?page_number=' + (this.state.pagination.page_number + 1) + '&coords=' + encodeURIComponent(this.state.position.coords.latitude) + ',' + encodeURIComponent(this.state.position.coords.longitude))
        .then((res) => {console.log(res);return res.json()})
        .catch((err) => console.error('Failed to retrieve additional results:' + err))
        .then((res) => {
          this._formatSearchResults(res.data);
          this.setState({
            dataSource: this.state.dataSource.cloneWithRows(resultsCache),
            pagination: res.pagination
          });
        })
        .done();
    }
  },
  renderRow: function (rowData, sectionId, rowId) {
    return (
      <FoodCell
        food={rowData}
        onPress={() => this.selectFood(rowId, rowData)}
      />
    );
  },
  render: function () {
    var content = this.state.dataSource.getRowCount() === 0 ?
      <Loading/>
      :
      <ListView
        dataSource={this.state.dataSource}
        renderRow={this.renderRow}
        automaticallyAdjustContentInsets={false}
        keyboardDismissMode="on-drag"
        keyboardShouldPersistTaps={false}
        showsVerticalScrollIndicator={false}
        pageSize={3}
        onEndReachedThreshold={400}
        onEndReached={this._onEndReached}
      />;
    return (
      <View style={styles.container}>
        <SearchBar
          placeholder="Pick-a-Chew"
          onSearchButtonPress={this.searchString}
          onMenuButtonPress={() => {this.props.navigator.props.openMenuSlider();}}
          style={styles.searchBar}
        />
        {content}
      </View>
    );
  }
});

var FoodCell = React.createClass({
  render: function () {
    var TouchableElement = TouchableOpacity;
    if (Platform.OS === 'android') {
      TouchableElement = TouchableNativeFeedback;
    }
    return (
      <View style={styles.row}>
        <TouchableElement
          onPress={this.props.onPress}
          onShowUnderlay={this.props.onHighlight}
          onHideUnderlay={this.props.onUnhighlight}
        >
          <View>
            <Image
              source={{uri: this.props.food.preview_image.image}}
              style={styles.cellImage} />
            <View style={styles.textContainer}>
              <Text style={styles.title}>{this.props.food.displayName}</Text>
              <View style={styles.reviewStarContainer}>
                <StarRating maxStars={5}
                  rating={parseFloat(this.props.food.avgRating)}
                  disabled={true}
                  starColor={'white'}
                  styles={styles.reviewStarRating}
                  starSize={14}/>
              </View>
              <Text style={styles.text}>{this.props.food.distance} mi</Text>
            </View>
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
    flexDirection: 'column'
  },
  searchBar: {
    marginTop: 64,
    height: 44,
    color: 'blue',
  },
  row: {
    flex: 1,
    backgroundColor: 'black',
    height: 225
  },
  textContainer: {
    backgroundColor: 'transparent',
    opacity: 1,
    position: 'relative',
    top: -150
  },
  title: {
    fontSize: 32,
    fontWeight: '500',
    marginBottom: 2,
    textAlign: 'center',
    color: 'white',
    opacity: 1,
  },
  text: {
    fontSize: 18,
    textAlign: 'center',
    color: 'white',
  },
  cellImage: {
    opacity: 0.6,
    position: 'relative',
    height: 225
  },
  reviewStarContainer: {
    marginTop: 5,
    alignSelf: 'center',
  },
  reviewStarRating: {
  },
});

module.exports = FoodSearchResultView;
