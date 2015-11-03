'use strict';

var AppDispatcher = require('../dispatchers/AppDispatcher');
var FoodConstants = require('../constants/FoodConstants');

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
      account_id: id,
      updates: updates
    });
  },

  signout: function() {
    AppDispatcher.dispatch({
      actionType: FoodConstants.USER_SIGNOUT,
    });
  }
};

module.exports = UserActions;
