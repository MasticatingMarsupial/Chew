'use strict';

var AppDispatcher = require('../dispatchers/AppDispatcher');
var ReviewConstants = require('../constants/ReviewConstants');

var API_URL = 'http://chewmast.herokuapp.com/api/';

var ReviewActions = {

  create: function(rating, reviewText, userId, foodId) {
    var object = {  
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Origin': ''
        // 'Host': 'api.producthunt.com'
      }, 
      body: JSON.stringify({
        "foodRating": rating,
        "text": reviewText,
        "owner": 2,
        "reviewRating": 0,
        "food": foodId
      })
    };

    // http://richardkho.com/making-ajax-calls-in-react-native/
    // http://stackoverflow.com/questions/25630611/should-flux-stores-or-actions-or-both-touch-external-services

    console.log(API_URL + 'reviews');
    
    fetch(API_URL + 'reviews', object)
      .then((res) => res.json())
      .catch((err) => console.error('Fetching query failed: ' + err))
      .then((responseData) => {
        console.log('responseData', responseData);
        // AppDispatcher.dispatch({
        //   actionType: ReviewConstants.REVIEW_CREATE,
        //   rating: rating,
        //   reviewText: reviewText
        // });
      })
      .done();

  }

};

module.exports = ReviewActions;
