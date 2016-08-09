import test from 'ava'
import fromGenerator from './'
import { takeEvery, takeLatest } from 'redux-saga'
import { take, put, call, cps, fork, spawn, join, cancel, select } from 'redux-saga/effects'
import { createMockTask } from 'redux-saga/utils'

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))
const request = (data, cb) => cb(null, data)

function * bgSync () {
  while (true) {
  }
}

const getFromState = function () {
  return 'SELECTED'
}

function * testSaga () {
  try {
    yield take('ACTION')
    yield put({type: 'NEXTIS'})
    yield put({type: 'PUT'})
    yield call(delay, 0)
    yield cps(request, 'CPS')
    const forkedTask = yield fork(bgSync)
    const sndTask = yield spawn(bgSync)
    yield join(forkedTask)
    yield cancel(sndTask)
    const selected = yield select(getFromState)
    yield put(selected)
  } catch (e) {
    yield put({type: 'ERROR'})
  }
}

test('saga', (t) => {
  const expect = fromGenerator(t, testSaga())

  expect.next().take('ACTION')
  expect.nextIs(put({type: 'NEXTIS'}))
  expect.next().put({type: 'PUT'})
  expect.next().call(delay, 0)
  expect.next().cps(request, 'CPS')
  expect.next().fork(bgSync)
  const mockTask1 = createMockTask()
  expect.next(mockTask1).spawn(bgSync)
  const mockTask2 = createMockTask()
  expect.next(mockTask2).join(mockTask1)
  expect.next().cancel(mockTask2)
  expect.next().select(getFromState)
  expect.next(getFromState()).put('SELECTED')
  expect.throwNext().put({type: 'ERROR'})
})

function * watchEvery () {
  yield * takeEvery('TEST_ACTION', testSaga)
}

function * watchLatest () {
  yield * takeLatest('TEST_ACTION', testSaga)
}

test('takeEvery', (t) => {
  const expect = fromGenerator(t, watchEvery())

  expect.takeEvery('TEST_ACTION', testSaga)
})

test('takeLatest', (t) => {
  const expect = fromGenerator(t, watchLatest())

  expect.takeLatest('TEST_ACTION', testSaga)
})
