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

var FoodSearchResultView = React.createClass({
  getInitialState: function () {
    return {
      dataSource: new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2
    }),

    };
  },
  componentDidMount: function () {
    // Get home page stuff from DB
    this.fetchData();
  },

  fetchData: function () {
    //Initially using mocked Data
    this.setState({
      dataSource: this.state.dataSource.cloneWithRows(mockData)
    })

  },
  searchString: function (string) {
    // Executes query to DB for possible foods by string
    // Refreshes the list of foods by changing the list of foods
    // this.setState({
    //   dataSource: this.state.dataSource.cloneWithRows(newData)
    // });
  },
  selectFood: function (rowId, food) {
    console.log('Food pressed!');
    console.log(food);
    //This needs a conditional to make the app cross platform
    this.props.navigator.push({
        title: food.name,
        component: FoodDetailView,
        passProps: {food},
      });
  },
  renderRow: function (rowData, sectionId, rowId) {
    console.log(arguments);
    
    return (
      <FoodCell
        food={rowData}
        onPress={() => this.selectFood(rowId, rowData)}
      />
        
    )
  },
  render: function () {
    return (
      <View style={styles.container}>
        <SearchBar 
          placeholder='Find your food'
          onSearchButtonPress={this.searchString}
          style={styles.searchBar} 
        />
        <ListView
          dataSource={this.state.dataSource}
          renderRow={this.renderRow}
          automaticallyAdjustContentInsets={false}
          keyboardDismissMode="on-drag"
          keyboardShouldPersistTaps={false}
          showsVerticalScrollIndicator={false}
        />
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
    //REFACTOR: the below return is an ugly hack for iOS, and the css for text container should be fixed
    //This needs to be done when we worry about the UI more
    //MAYBE TOUCHABLEOPACITY OR TOUCHABLEHIGHLIGHT COULD SOLVE THIS?
    return (
      <View>
        <TouchableElement 
          onPress={this.props.onPress}
          onShowUnderlay={this.props.onHighlight}
          onHideUnderlay={this.props.onUnhighlight}  
        >
          <View style={styles.row}>{}
            <Image
              source={{uri: this.props.food.image[0]}}
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

var styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
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