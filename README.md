# synthetic-redux
Sets up Redux boilerplate: actions, reducers and redux-saga for common API communication use cases

![JavaScript](https://img.shields.io/badge/-JavaScript-gray?logo=javascript)
[![Redux](https://img.shields.io/badge/-Redux-gray?logo=redux)](https://github.com/reduxjs/redux)
[![License: MIT](https://img.shields.io/badge/License-MIT-red.svg)](https://opensource.org/licenses/MIT)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)
![](coverage/badge-functions.svg)

Given an _action type_ and reducer key and uses that to generate:
  1. **Redux Actions**: Success and Error action types
  2. **Reducers**: Updates Store with loading, success and error states
  3. **Redux-Saga**: Generates saga-effect that communicates with API and handles success and error responses

## Purpose
An application can have multiple API calls. Redux + Redux-Saga is a popular tool to handle these side effects. 
The redux bits become repetitive over the numerous API calls. This library  The use-case the library solves
for is -
  1. API call needs to be made
  2. Success response should be reflected in the Redux Store
  3. Error response should be reflected in the Redux Store
  4. Differentiate between Success and Error responses
  5. Handle exceptions in communication (eg. network error)
  6. Reflect exception in the Redux Store



## Synthetic Redux
Provides an abstraction over 3 bits of boilerplate-ish code: 
  1. `SyntheticAction` - Access to _success_ and _error_ actions and their generators
  2. `SyntheticReducers` - Access to loading, error and success States from Redux Store
  3. `SyntheticSaga` - Generates redux-saga effect that handles Success & Error API responses 
### API
Initialize => 
```jsx
const synRedux = new SyntheticRedux(
  {type: <action>, url: <string>, payload: <any> }, 
  reducerKey
);
``` 

Kick off synthetic action   =>  `synRedux.ignite()`

Access synthetic reducer => `synRedux.reducer`

Access synthetic sagaEffect => `synRedux.sagaEffect`

Set custom defaults for synthetic action(optional) =>
```jsx
  synRedux.ignite = (customUrl) => synRedux.actions.ignite({
    url: customUrl,
    errorHandler: (err) => CustomLogger.error(err)
  });
```

Access SyntheticActions => `synRedux.actions`

Extends SyntheticAction APIs: 
`igniteName`,`suffixSyntheticActions`,`suffixNames`
### Example Usage

```jsx
import {dispatch} from 'jest-circus/build/state';


const FETCH_TODOS = 'FETCH_TODOS';
export const synRedux = new SyntheticRedux({
  payload: {filter: {isDeleted: false}},
  type: FETCH_TODOS,
  url: '/api/v1/todo/list',
}, 'list');

// RootReducer.js
const RootReducer = combineReducers({
  todos: synRedux.reducer
});

// RootSaga.js
export default function* RootSaga() {
  const allSagas = [
    synRedux.sagaEffect,
  ]
  yield all(allSagas.map(fork));
}

// React Component
export default TodoList = () => {
  const listResponse = useSelector(state => state.todos.list);
  React.useEffect(() => {
    dispatch(synRedux.ignite());
  }, [dispatch])
  
  if (listResponse[CATEGORY_NAMES].IGNITE) {
    return <LoadingState/>;
  } else if (listResponse.error) {
    return <ErrorHandler error={listResponse.error}/>;
  } else {
    return <ShowTodos list={listResponse.list}/>;
  }
};
```

## Synthetic Actions
  Redux requires actions as the basis of asynchronous communication. 
  The modus operandi for redux actions is to define:
  1. an _Action type_ (e.g. in `Type.js`)
  2. a function that generates an object using `type: <action>` and some payload

Synthetic Actions take in a _Base Action Type_ and generate:
  1. `<action>_SUCCESS` `<action>_ERROR` types
  2. functions that generate the desired Action Object

### API
Kick off the action       -> synAction.ignite();    
Access base action string -> synAction.igniteName;  // string
Access suffix actions     -> synAction.suffixNames; // [string]
Access suffix action generators
    -> synAction.suffixSyntheticActions; // [ { type: string, generator: fn } ]
### Example
```jsx
const FETCH_TODOS = 'FETCH_TODOS';
export const synAction = new SyntheticAction({ 
  type: FETCH_TODOS, 
  url: '/api/v1/todo/list', 
});
```

## Synthetic Reducer
Companion reducer piece to SyntheticActions. 
Takes in a _SyntheticAction_ and reducer key & returns Redux State handler.
### Example

```jsx
import { CATEGORY_NAMES } from 'src/constants';


const synReducer = SyntheticReducer(synAction, 'list')
const RootReducer = combineReducers({
  todos: synReducer
});

/* Usage in React Component */
const listResponse = useSelector(state => state.todos.list);
if (listResponse[CATEGORY_NAMES].IGNITE) { return <LoadingState />; }
else if (listResponse.error) { return <ErrorHandler error={listResponse.error} />; }
else { return <ShowTodos list={listResponse.list} />; }
```

## Synthetic Redux-Saga Effect
Companion redux-saga with SyntheticActions and SyntheticReducer
Given a _SyntheticAction_ it returns a sagaEffect.
The sagaEffect comes embedded with Error & Success Handling
### Opinions
1. Uses `takeLatest` to execute the effect
2. Requires the API to respond with `{ error: <any> }` to indicate error
3. Expects action to be set with an `url` and `payload(opt)` for the API call
### API
```jsx
const sagaEffect = SyntheticSagaEffect(synAction);
const todoSaga = yield all([sagaEffect]);
export default function* RootSaga() {
  const allSagas = [todoSaga];
  yield all(allSagas.map(fork));
}

```
