'use strict'
var saga = require('redux-saga')
var effects = require('redux-saga/effects')

module.exports = function fromGenerator (t, generator) {
  var _next = function () {
    var args = Array.prototype.slice.call(arguments)
    return generator.next.apply(generator, args)
  }

  var _throw = function () {
    var args = Array.prototype.slice.call(arguments)
    return generator.throw.apply(generator, args)
  }
  var _nextIs = function (fn, mock, effect) {
    return function () {
      var args = Array.prototype.slice.call(arguments)
      return t.deepEqual(fn(mock).value, effect.apply(null, args))
    }
  }
  function wrap (fn) {
    return function (mock) {
      return {
        put: _nextIs(fn, mock, effects.put),
        call: _nextIs(fn, mock, effects.call),
        cps: _nextIs(fn, mock, effects.cps),
        fork: _nextIs(fn, mock, effects.fork),
        spawn: _nextIs(fn, mock, effects.spawn),
        join: _nextIs(fn, mock, effects.join),
        cancel: _nextIs(fn, mock, effects.cancel),
        select: _nextIs(fn, mock, effects.select),
        actionChannel: _nextIs(fn, mock, effects.actionChannel),
        cancelled: _nextIs(fn, mock, effects.cancelled)
      }
    }
  }
  return {
    callNext: _next,
    nextIs: function (effect) {
      return t.deepEqual(_next().value, effect)
    },
    throwNext: wrap(_throw),
    next: wrap(_next),
    takeEvery: function () {
      var args = Array.prototype.slice.call(arguments)
      return t.deepEqual(_next().value, saga.takeEvery.apply(null, args).next().value)
    },
    takeLatest: function () {
      var args = Array.prototype.slice.call(arguments)
      return t.deepEqual(_next().value, saga.takeLatest.apply(null, args).next().value)
    }
  }
}
