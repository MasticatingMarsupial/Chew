'use strict';

var React = require('react-native');

var {
  StyleSheet,
  Platform,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableNativeFeedback,
  Modal,
  ScrollView,
} = React;

var Button = require('react-native-button');
var {Icon,} = require('react-native-icons');
var StarRating = require('./StarRating');

var MakeReviewModalView = React.createClass({
  getInitialState: function () {
    return {
      visible: this.props.visible,
    };
  },
  componentWillReceiveProps: function (nextProps) {
    this.setState({
      visible: nextProps.visible,
    });
  },
  onStarRatingPress: function (value) {
    console.log('Rated ' + value + ' stars!');
  },
  onSubmitReview: function () {
    console.log('Submitting review!')
  },
  blurReviewInput: function () {
    this.refs.review.blur();
  },
  render: function () {
    var TouchableElement = TouchableOpacity;
    if (Platform.OS === 'android') {
      TouchableElement = TouchableNativeFeedback;
    }
    return (
      <Modal animated={true} visible={this.state.visible} transparent={true}>
        <ScrollView scrollEnabled={false} contentContainerStyle={styles.container}>
          <View style={styles.solidContent}>
            <View style={styles.foodTitleContainer}>
              <Text style={styles.foodTitle}>{this.props.food.name}</Text>
            </View>
            <View style={styles.reviewContainer}>
              <View style={styles.headerContainer}>
                <Text style={styles.headerText}>Write a Review</Text>
              </View>
              <View style={styles.starRatingContainer}>
                <StarRating maxStars={5}
                  rating={parseFloat(this.props.food.rating)}
                  disabled={false}
                  starSize={40}
                  selectedStar={this.onStarRatingPress}
                  style={styles.starRating}
                />
              </View>
              <View style={styles.reviewTextInputContainer}>
                <TextInput ref="review" multiline={true} returnKeyType={this.dismissKeyboard} style={styles.reviewTextInput} />
              </View>
              <TouchableElement onPress={this.props.onSubmitReview} style={styles.submitButton}>
                <Text style={styles.submit}>Submit</Text>
              </TouchableElement>
            </View>
            <View style={styles.closeButtonContainer}>
              <Button activeOpacity={0.20} onPress={this.props.onCloseReviewButtonPress} style={styles.closeButton}>
                <Icon
                  name="ion|android-close"
                  size={60}
                  color="white"
                  style={styles.close}
                />
              </Button>
            </View>
          </View>
          
        </ScrollView>
      </Modal>
    );
  }
});

var styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    alignItems: 'center',
  },
  solidContent: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  foodTitleContainer: {
    marginTop: 70,
    flexDirection: 'row',
  },
  foodTitle:{
    fontSize: 30,
    fontWeight: 'bold',
    color: 'white',
  },
  reviewContainer: {
    marginTop: 20,
    borderRadius: 10,
    backgroundColor: 'white',
    height: 400,
    width: 300,
    alignItems: 'center',
  },
  headerContainer: {
    width: 300,
    height: 50,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    backgroundColor: 'red',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: {
    color: 'white',
    fontSize: 25,
    fontWeight: 'bold',
  },
  starRatingContainer: {
    width: 300,
    marginTop: 10,
    alignItems: 'center',  
  },
  starRating: {

  },
  reviewTextInputContainer: {
    width: 260,
    backgroundColor: 'white',
    borderRadius: 10,
    borderColor: 'gray',
    borderWidth: 2,
    marginTop: 10,
    alignItems: 'stretch',
    padding: 10,
  },
  reviewTextInput: {
    backgroundColor: 'white',
    fontSize: 14,
    height: 195,
  },
  submitButton: {
    backgroundColor: 'red',
    marginTop: 10,
    borderRadius: 10,
    width: 150,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submit: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 24,
  },
  closeButtonContainer: {
    marginTop: 50,
  },
  closeButton: {
    width: 60,
    height: 60,
  },
  close: {
    width: 60,
    height: 60,
  },

});

module.exports = MakeReviewModalView;