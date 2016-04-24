# redux-saga-test [![Build Status](https://travis-ci.org/stoeffel/redux-saga-test.svg?branch=master)](https://travis-ci.org/stoeffel/redux-saga-test)

> A little helper to test [redux-saga][rs].


## Install

```
$ npm install --save-dev redux-saga-test
```


## Usage

The saga under test.
```js
function * testSaga () {
  try {
    yield put({type: 'FETCHING'})
    const data = yield call(loadData)
    yield put({type: 'FETCHED', payload: data})
  } catch (e) {
    yield put({type: 'FETCHED', payload: e})
  }
```

The test looks like this:

```js
const reduxSagaTest = require('redux-saga-test');

test('saga', (t) => {
  const expect = fromGenerator(t, testSaga()) // <= pass your assert library with a `deepEqual` method.

  expect.next().put({type: 'FETCHING'})
  expect.next().call(loadData)
  expect.next(mockData).put({type: 'FETCHED', payload: mockData})
})
```

To test a `watcher` you can use `expect.takeEvery/takeLatest`.

The watcher:
```js
function * watchEvery () {
  yield * takeEvery('TEST_ACTION', testSaga)
}
```

The test:
```js
test('takeEvery', (t) => {
  const expect = fromGenerator(t, watchEvery())
  expect.takeEvery('TEST_ACTION', testSaga)
})
```



For more examples look at the [tests](./test.js)


## License

MIT © [Stoeffel](http://stoeffel.github.io)
