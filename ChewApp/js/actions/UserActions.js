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

  updateAccount: function(username, updates) {
    AppDispatcher.dispatch({
      actionType: FoodConstants.USER_UPDATE,
      username: username,
      updates: updates,
    });
  },

  updateAccountImageLikes: function (username, updates, image) {
    updates.images_liked.push(image);
    fetch(API_URL + 'users/' + updates.id, {
      method: 'PUT',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(updates)
    })
      .then((res) => res.json())
      .catch((err) => console.error('Update requested failed: ' + err))
      .then((responseData) => {
        if (updates.images_liked.length === responseData.images_liked.length) {
          console.log('Like image successfully saved to account and db');
          AppDispatcher.dispatch({
            actionType: FoodConstants.USER_UPDATE,
            username: username,
            updates: updates,
          })
        } else {
          console.log('Liked image already existed in account');
          updates.images_liked.pop();
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
