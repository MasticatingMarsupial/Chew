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
  Platform,
} = React;

var FoodDetailView = require('./FoodDetailView');
var SearchBar = require('react-native-search-bar');
if (Platform.OS === 'android'){
  SearchBar = require('./SearchBar');
}

//TODO: Update to production URL's when ready
var API_URL = 'http://chewmast.herokuapp.com/api/'

var FoodSearchResultView = React.createClass({
  getInitialState: function () {
    return {
      dataSource: new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2
    }),

    };
  },
  componentDidMount: function () {
    // Call the search with the search term from the homepage
    console.log(this.props.food);
    //NOTE: This may break on android?
    this.searchString(this.props.food);
  },
  searchString: function (query) {
    console.log('trying to search');
    //build the URL for the search
    var url =  API_URL + 'search/' + query
    console.log(url);
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
      .done();
  },
  onSearchChange: function (event) { 
    console.log('search change', event);
    var filter = event.nativeEvent.text.toLowerCase();
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
          placeholder='Find your food'
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
      console.log("Android Touch Elements")
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
            <View style={styles.textContainer}>
              <Text style={styles.title}>{this.props.food.name}</Text>
              <Text style={styles.text}>Rating: {this.props.food.rating} stars</Text>
              <Text style={styles.text}># of Reviews: {this.props.food.numRatings}</Text>
              <Text style={styles.text}>Resturant: {this.props.food.restaurant}</Text>
            </View>
            </Image>
          </View>
        </TouchableElement>
      </View>
    );
  }
});

var NoFood = React.createClass({
  render: function() { 
    return (
      <View style={[styles.container, styles.centerText]}>
        <Text style={styles.noFoodText}>Sorry, we can't find that food.</Text>
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
  },
  row: {
    flex:1,
    justifyContent: 'center',
  },
  textContainer: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  title: {
    flex: 1,
    fontSize: 32,
    fontWeight: '500',
    marginBottom: 2,
    textAlign: 'center',
  },
  text: {
    color: '#F0F8FF',
  },
  cellImage: {
    backgroundColor: '#dddddd',
    height: 200,
    marginBottom: 1,
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