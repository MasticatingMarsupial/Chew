'use strict';

var React = require('react-native');

var {
  StyleSheet,
  View,
  ListView,
  TouchableHighlight,
  Text,
} = React;

var FoodDetailView = require('./FoodDetailView');
var SearchBar = require('react-native-search-bar');

var FoodSearchResultView = React.createClass({
  getInitialState: function () {
    var ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2
    });
    return {
      dataSource: ds.cloneWithRows(mockData)
    };
  },
  componentDidMount: function () {
    // Get home page stuff from DB
  },
  searchString: function (string) {
    // Executes query to DB for possible foods by string
    // Refreshes the list of foods by changing the list of foods
    // this.setState({
    //   dataSource: this.state.dataSource.cloneWithRows(newData)
    // });
  },
  selectFood: function (rowId) {
    console.log('Food pressed!');
    this.props.navigator.push({
        title: 'Food Detail',
        component: FoodDetailView,
        // Need to pass food to next view
        // passProps: {food},
      });
  },
  renderRow: function (rowData, sectionId, rowId) {
    console.log(rowData);
    return (
      <TouchableHighlight
        onPress={() => this.selectFood(rowId)}
      >
        <View 
          style={styles.row}
        >
          <Text>
            Hellow
          </Text>
        </View>
      </TouchableHighlight>
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
          style={styles.listView}
        />
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
  listView: {
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    padding: 10,
    backgroundColor: '#F6F6F6',
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