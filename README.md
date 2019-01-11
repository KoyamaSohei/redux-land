redux-land
=============

intuitive middleware for redux.  

[![Build Status](https://travis-ci.org/KoyamaSohei/redux-land.svg?branch=master)](https://travis-ci.org/KoyamaSohei/redux-land) 
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

## Install

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

## Usage (TypeScript)

types.ts
```ts
import { Action } from "redux";

export type State = {
  loaded: boolean;
  status: boolean;
};

export enum ActionType {
  LOADING = "LOADING",
  LOADED  = "LOADED",
  SUCCESS = "SUCCESS",
  FAILED  = "FAILED",
}

export type LOADING = Action<ActionType.LOADING>;
export type LOADED  = Action<ActionType.LOADED>;
export type SUCCESS = Action<ActionType.SUCCESS>;
export type FAILED  = Action<ActionType.FAILED>;

export enum LandActionType {
  LOAD = "LOAD"
}

export type LOAD = Action<LandType.LOAD> & {
  payload: string;
};

export type Actions = LOADING | LOADED | SUCCESS | FAILED | LOAD;
```

module.ts

```ts
import { createStore, applyMiddleware } from "redux";
import createLandMiddleware, { Land } from "redux-land";
import axios from "axios";
import {
  State,
  ActionType,
  Actions,
  LandActionType,
  LOAD
} from "./types";

const load: Land<State, LOAD, Actions> = async function*({ state, action }) {
  yield {type: ActionType.LOADING};
  const status = (await axios(action.payload)).status;
  if (status >= 200 && status < 300) {
    yield {type: ActionType.SUCCESS};
  } else {
    yield {type: ActionType.FAILED};
  }
  yield {type: ActionType.LOADED};
};

const lands : Lands = {
  [LandType.LOAD]: load
}

const middleware = createLandMiddleware(lands);

const reducer = (state: State = { loaded: true, status: true }, action: Actions) => {
  switch (action.type) {
    case ActionType.LOADING:
      return { ...state, loaded: false };
    case ActionType.LOADED:
      return { ...state, loaded: true };
    case ActionType.SUCCESS:
      return { ...state, status: true };
    case ActionType.FAILED:
      return { ...state, status: false };
    default:
      return state;
  }
};

const store = createStore(reducer, applyMiddleware(middleware));

export default store;
```

index.ts
```ts
import store from "./module";
import { LandActionType } from "./types";

store.dispatch({type: LandActionType.LOAD});
```

## License

MIT