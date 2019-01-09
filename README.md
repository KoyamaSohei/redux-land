redux-land
=============

intuitive middleware for redux.  

[![Build Status](https://travis-ci.org/KoyamaSohei/redux-land.svg?branch=master)](https://travis-ci.org/KoyamaSohei/redux-land) 
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

```js
yarn add redux-land
```

## Features

- dispatch multiple actions with [async-generator-functions](https://github.com/tc39/proposal-async-iteration)
- intuitive (**important!**)
- type safe (with typescript. you can see [example](https://github.com/KoyamaSohei/redux-land-example))

## Usage

```js
import { createStore, applyMiddleware } from 'redux';
import createLandMiddleware from 'redux-land';

// action types 
const INC      = "INC";
const ASYNCINC = "ASYNCINC";

// reducer
const reducer = (state = {counter: 0}, action) => {
  switch(action.type){
    case INC:
      return {...state, counter: state.counter + 1 }
    default:
      return {...state}
  }
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

const asyncInc = async function* ({state,action}) {
  await sleep(1000);
  yield {type: INC}; // this action will be dispatched.
  await sleep(action.payload);
  yield {type: INC};// you can dispatch action, any number of times
}


const landMiddleware = createLandMiddleware({
  [ASYNCINC] : asyncInc, // object-with-dynamic-keys
});

const store = createStore(reducer,applyMiddleware(landMiddleware));

// later
store.dispatch({
  type: ASYNCINC,
  payload: 3000,
});

```

## License

MIT