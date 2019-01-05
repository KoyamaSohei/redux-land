redux-land
=============

intuitive middleware for redux.


```js
yarn add redux-land
```

## Features

- dispatch multiple actions with [async-generator-functions](https://github.com/tc39/proposal-async-iteration)
- intuitive (**important!**)

## Usage

```js
import { createStore, applyMiddleware } from 'redux';
import createLandMiddleware from 'redux-land';

// action types 
const INCC      = "INCC";
const ASYNCINCC = "ASYNCINCC";

// reducer
const reducer = (state = {counter: 0}, action) => {
  switch(action.type){
    case INCC:
      return {...state, counter: state.counter++}
    default:
      return {...state}
  }
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

const asyncIncc = async function* ({state,action}) {
  await sleep(1000);
  yield await {type: INCC}; // this action will be dispatched.
  await sleep(action.payload);
  yield await {type: INCC};// you can dispatch action, any number of times
}


const landMiddleware = createLandMiddleware({
  [ASYNCINCC] : asyncIncc, // object-with-dynamic-keys
});

const store = createStore(reducer,applyMiddleware(landMiddleware));

// later
dispatch({
  type: ASYNCINCC,
  payload: 3000,
});


```

## License

MIT