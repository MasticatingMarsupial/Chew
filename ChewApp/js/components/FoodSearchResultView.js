'use strict';

var React = require('react-native');

var {
  StyleSheet,
  View,
  ListView,
  TouchableHighlight,
  TouchableNativeFeedback,
  Text,
  Image,
  ProgressBarAndroid,
  ActivityIndicatorIOS,
  Platform,
} = React;

var FoodDetailView = require('./FoodDetailView');
var SearchBar = require('react-native-search-bar');
if (Platform.OS === 'android'){
  SearchBar = require('./SearchBar');
  var dismissKeyboard = require('dismissKeyboard');
}


//TODO: Update to production URL's when ready
var API_URL = 'http://chewmast.herokuapp.com/api/'

var FoodSearchResultView = React.createClass({
  getInitialState: function () {
    return {
      dataSource: new ListView.DataSource({
        rowHasChanged: (r1, r2) => r1 !== r2
      }),
      position: this.props.position,
    };
  },
  componentDidMount: function () {
    // Call the search with the search term from the homepage
    if(Platform.OS === 'ios'){
      navigator.geolocation.getCurrentPosition(
        (position) => this.setState({position}),
        (error) => alert(error.message),
        {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000}
      );
    }
    console.log(this.props.food);
    //This needs an empty string case
    if(this.props.food !== undefined){
      this.searchString(this.props.food);
    } else { 
      console.log("EMPTY SEARCH INPUTTED");
    }
  },
  searchString: function (query) {
    console.log('trying to search');
    //build the URL for the search
    if(!query){
      console.log("EMPTY SEARCH INPUTTED")
      return;
    }

    var url =  API_URL + 'search/' + encodeURIComponent(query) + '/?coords=' + encodeURIComponent(this.state.position.coords.latitude) + ',' + encodeURIComponent(this.state.position.coords.longitude);

    console.log('url', url);
    //Fetches the data from the server with the passed search terms
    fetch(url)
      .then((res) => res.json())
      .catch((err) => console.error("Fetching query failed: " + err))
      .then((responseData) => {
        console.log('response data:', responseData);

        this.setState({
          dataSource: this.state.dataSource.cloneWithRows(responseData),
        });
      })
      .done(
        console.log('Finished writing to array'));
  },
  onSearchChange: function (event) { 
    console.log('search change', event);
    var filter = event.nativeEvent.text.toLowerCase();
    if(Platform.OS === 'android'){
      dismissKeyboard();
    }
  },
  selectFood: function (rowId, food) {
    console.log('Food pressed!');
    console.log(food);
    //This needs a conditional to make the app cross platform
    if(Platform.OS === 'ios'){
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
      })
    }
  },
  renderRow: function (rowData, sectionId, rowId) {    
    return (
      <FoodCell
        food={rowData}
        onPress={() => this.selectFood(rowId, rowData)}
      />
        
    )
  },
  render: function () {
    var content = this.state.dataSource.getRowCount() === 0 ?
      <NoFood/>
      :
      <ListView
        dataSource={this.state.dataSource}
        renderRow={this.renderRow}
        automaticallyAdjustContentInsets={false}
        keyboardDismissMode="on-drag"
        keyboardShouldPersistTaps={false}
        showsVerticalScrollIndicator={false}
      />;
      
    return (
      <View style={styles.container}>
        <SearchBar 
          placeholder='Pick-a-Chew'
          onSearchButtonPress={this.searchString}
          onSearchChange={() => this.onSearchChange()}
          style={styles.searchBar} 
        />
        {content}
      </View>
    );
  }
});

var FoodCell = React.createClass({
  render: function () {
    var TouchableElement = TouchableHighlight;
    if (Platform.OS === 'android') {
      TouchableElement = TouchableNativeFeedback;
    }
    return (
      <View>
        <TouchableElement 
          onPress={this.props.onPress}
          onShowUnderlay={this.props.onHighlight}
          onHideUnderlay={this.props.onUnhighlight}  
        >
          <View style={styles.row}>{}
            <Image
              source={{uri: this.props.food.preview_image.image}}
              style={styles.cellImage}> 
            </Image>
            <View style={styles.textContainer}>
              <Text style={styles.title}>{this.props.food.name}</Text>
              <Text style={styles.text}>Rating: {this.props.food.rating}</Text>
              <Text style={styles.text}>Resturant: {this.props.food.restaurant.name}</Text>
            </View>
          </View>
        </TouchableElement>
      </View>
    );
  }
});

var NoFood = React.createClass({
  render: function() { 
    var spinner = Platform.OS === 'ios' ?
      <ActivityIndicatorIOS
          animating={this.props.isLoading}
          style={styles.spinner}
        />
      :
        <ProgressBarAndroid
          styleAttr="Large"
          style={styles.spinner}
        />
      
    return (
      <View style={[styles.container, styles.centerText]}>
        
        <Text style={styles.noFoodText}>
          Fetching your options
        </Text>
        {spinner}
      </View>
      );
  }
})

var styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  centerText: {
    alignItems: 'center',
  },
  noFoodText: {
    marginTop: 80,
    color: '#888888',
  },
  searchBar: {
    marginTop: 64,
    height: 44,
    color: 'blue',
  },
  row: {
    flex:1,
    justifyContent: 'center',
    backgroundColor: 'black',
  },
  textContainer: {
    flex: 1,
    backgroundColor: 'transparent',
    opacity: 1,
    top: -150,
    marginBottom: -80,
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
    textAlign: 'center',
    color: 'white',
  },
  cellImage: {
    opacity: 0.6,
    height: 225,
    
  },
  spinner: {
    width: 100,
    height: 100,
    alignItems: 'center',
  },
});

var mockData = [
 {
   id: 1,
   name: "Hotdog",
   rating: 3,
   numRatings: 134,
   restaurant: "Jim's Dogs",
   image: ["http://www.jamesaltucher.com/wp-content/uploads/2013/03/HOT-DOG.jpg", "http://www.seriouseats.com/images/20081209-hot-dog.jpg"]
 },
 {
   id: 425,
   name:  "Dirty Dog",
   rating: 4,
   numRatings: 25,
   restaurant: "Hotdog Stand",
   image: ["http://www.seriouseats.com/images/20081209-hot-dog.jpg", "http://www.seriouseats.com/images/20081209-hot-dog.jpg"]
 },
 {
   id: 422,
   name:  "Breakfast Dog",
   rating: 5,
   numRatings: 245,
   restaurant: "Hotdog Stand",
   image: ["http://www.apinchofginger.com/uploads/6/0/3/9/6039210/2338231_orig.jpg", "http://www.seriouseats.com/images/20081209-hot-dog.jpg"]
 }
]

module.exports = FoodSearchResultView;