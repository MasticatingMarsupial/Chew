'use strict';

var AppDispatcher = require('../dispatchers/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var FoodConstants = require('../constants/FoodConstants');
var assign = require('object-assign');

var CHANGE_EVENT = 'userChange';

var _currentAccount = {};

function populate (account) {
  _currentAccount  = account;
  console.log(_currentAccount);
}

function update (id, updates) {
  if ( _currentAccount.id === id ) {
    _currentAccount = assign({}, _currentAccount, updates);
  }
}

function destroy () {
  _currentAccount = {};
}

var UserStore = assign({}, EventEmitter.prototype, {

  getAccount: function () {
    return _currentAccount;
  },

  emitChange: function () {
    this.emit(CHANGE_EVENT);
  },

  addChangeListener: function (callback) {
    this.on(CHANGE_EVENT, callback);
  },

  removeChangeListener: function (callback) {
    this.removeListener(CHANGE_EVENT, callback);
  }
});

AppDispatcher.register(function(action) {
  var account, username, id;

  switch (action.actionType) {
    case FoodConstants.USER_SIGNIN:
      console.log(action);
      account = action.account;
      if( account.id ) {
        populate(account);
      }
      break;

    case FoodConstants.USER_SIGNOUT:
      destroy();
      break;

    case FoodConstants.USER_UPDATE:
      id = action.account_id;
      if ( username ) {
        update(id, action.updates);
      }
      break;

    default:
  }
});

module.exports = UserStore;
