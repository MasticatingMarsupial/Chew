'use strict';

var AppDispatcher = require('../dispatchers/AppDispatcher');
var FoodConstants = require('../constants/FoodConstants');

var API_URL = 'http://chewmast.herokuapp.com/api/';
// var API_URL = 'http://localhost:8000/api/';

var UserActions = {

  populate: function (account, token) {
    AppDispatcher.dispatch({
      actionType: FoodConstants.USER_SIGNIN,
      account: account,
      token: token,
    });
  },

  updateAccount: function(id, updates) {
    console.log(id);
    AppDispatcher.dispatch({
      actionType: FoodConstants.USER_UPDATE,
      username: username,
      updates: updates,
    });
  },

  updateAccountLikes: function (username, updates, item) {
    var endpoint, subArray;
    if (item.hasOwnProperty('image')) {
      updates.images_liked.push(item);
      endpoint = '/likes/images/';
      subArray = 'images_liked';
    }

    if (item.hasOwnProperty('price')) {
      updates.food_liked.push(item);
      endpoint = '/likes/foods/'      
      subArray = 'food_liked';
    }

    fetch(API_URL + 'users/' + updates.id + endpoint, {
      method: 'PUT',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(updates)
    })
      .then((res) => res.json())
      .catch((err) => console.error('Update requested failed: ' + err))
      .then((responseData) => {
        if (updates[subArray].length === responseData[subArray].length) {
          AppDispatcher.dispatch({
            actionType: FoodConstants.USER_UPDATE,
            username: username,
            updates: updates,
          })
        } else {
          updates[subArray].pop();
        }
      })
      .done();
  },

  signout: function() {
    AppDispatcher.dispatch({
      actionType: FoodConstants.USER_SIGNOUT,
    });
  }
};

module.exports = UserActions;
