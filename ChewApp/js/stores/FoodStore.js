'use strict';

var AppDispatcher = require('../dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var FoodConstants = require('../constants/FoodConstants');
var assign = require('object-assign');

var CHANGE_EVENT = 'change';

var _foods = {};

/**
 * Create a FOOD item.
 * @param  {string} text The content of the FOOD
 */
function create(text) {
  // Hand waving here -- not showing how this interacts with XHR or persistent
  // server-side storage.
  // Using the current timestamp + random number in place of a real id.
  var id = (+new Date() + Math.floor(Math.random() * 999999)).toString(36);
  _foods[id] = {
    id: id,
    complete: false,
    text: text
  };
}

/**
 * Update a FOOD item.
 * @param  {string} id
 * @param {object} updates An object literal containing only the data to be
 *     updated.
 */
function update(id, updates) {
  _foods[id] = assign({}, _foods[id], updates);
}

/**
 * Update all of the FOOD items with the same object.
 * @param  {object} updates An object literal containing only the data to be
 *     updated.
 */
function updateAll(updates) {
  for (var id in _foods) {
    update(id, updates);
  }
}

/**
 * Delete a FOOD item.
 * @param  {string} id
 */
function destroy(id) {
  delete _foods[id];
}

/**
 * Delete all the completed FOOD items.
 */
function destroyCompleted() {
  for (var id in _foods) {
    if (_foods[id].complete) {
      destroy(id);
    }
  }
}

var FoodStore = assign({}, EventEmitter.prototype, {

  /**
   * Tests whether all the remaining FOOD items are marked as completed.
   * @return {boolean}
   */
  areAllComplete: function() {
    for (var id in _foods) {
      if (!_foods[id].complete) {
        return false;
      }
    }
    return true;
  },

  /**
   * Get the entire collection of FOODs.
   * @return {object}
   */
  getAll: function() {
    return _foods;
  },

  emitChange: function() {
    this.emit(CHANGE_EVENT);
  },

  /**
   * @param {function} callback
   */
  addChangeListener: function(callback) {
    this.on(CHANGE_EVENT, callback);
  },

  /**
   * @param {function} callback
   */
  removeChangeListener: function(callback) {
    this.removeListener(CHANGE_EVENT, callback);
  }
});

// Register callback to handle all updates
AppDispatcher.register(function(action) {
  var text;

  switch (action.actionType) {
    case FoodConstants.FOOD_CREATE:
      text = action.text.trim();
      if (text !== '') {
        create(text);
        FoodStore.emitChange();
      }
      break;

    case FoodConstants.FOOD_TOGGLE_COMPLETE_ALL:
      if (FoodStore.areAllComplete()) {
        updateAll({complete: false});
      } else {
        updateAll({complete: true});
      }
      FoodStore.emitChange();
      break;

    case FoodConstants.FOOD_UNDO_COMPLETE:
      update(action.id, {complete: false});
      FoodStore.emitChange();
      break;

    case FoodConstants.FOOD_COMPLETE:
      update(action.id, {complete: true});
      FoodStore.emitChange();
      break;

    case FoodConstants.FOOD_UPDATE_TEXT:
      text = action.text.trim();
      if (text !== '') {
        update(action.id, {text: text});
        FoodStore.emitChange();
      }
      break;

    case FoodConstants.FOOD_DESTROY:
      destroy(action.id);
      FoodStore.emitChange();
      break;

    case FoodConstants.FOOD_DESTROY_COMPLETED:
      destroyCompleted();
      FoodStore.emitChange();
      break;

    default:
      // no op
  }
});

module.exports = FoodStore;
