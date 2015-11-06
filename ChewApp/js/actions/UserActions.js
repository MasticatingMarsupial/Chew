'use strict';

var AppDispatcher = require('../dispatchers/AppDispatcher');
var UserConstants = require('../constants/UserConstants');

var API_URL = 'http://chewmast.herokuapp.com/api/';
// var API_URL = 'http://localhost:8000/api/';

var UserActions = {

  populate: function (account, token) {
    AppDispatcher.dispatch({
      actionType: UserConstants.USER_SIGNIN,
      account: account,
      token: token,
    });
  },

  updateProfile: function(id, updates) {
    AppDispatcher.dispatch({
      actionType: UserConstants.PROFILE_UPDATE,
      account_id: id,
      updates: updates,
    });
  },

  updateAccountLikes: function (username, updates, item) {
    var endpoint, userPrefs;
    if (item.hasOwnProperty('image')) {
      for (var image in updates.images_liked) {
        if (updates.images_liked[image].id === item.id) {
          updates.images_liked = [item];
          endpoint = '/unlikes/images/';
          break;
        }
      }
      updates.images_liked.push(item);
      endpoint = endpoint || '/likes/images/';
      userPrefs = 'images';
    }

    if (item.hasOwnProperty('price')) {
      updates.food_liked.push(item);
      endpoint = '/likes/foods/';
      userPrefs = 'food';
    }
    
    fetch(API_URL + 'users/' + updates.id + endpoint, {
      method: 'PUT',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(updates)
    })
      .then((res) => res.json())
      .catch((err) => console.error('Update requested failed: ' + err))
      .then((responseData) => {
        AppDispatcher.dispatch({
          actionType: UserConstants.USER_UPDATE,
          username: username,
          updates: responseData,
        });
        if (userPrefs === 'images') {
          updates.images_liked = responseData.images_liked;
        } else if (userPrefs === 'food') {
          console.log('food favorited');
        } else {
          console.log('nothing');
        }
      })
      .done();
  },

  signout: function() {
    AppDispatcher.dispatch({
      actionType: UserConstants.USER_SIGNOUT,
    });
  }
};

module.exports = UserActions;
