# redux-algolia-middlware

[Redux middleware](https://redux.js.org/docs/advanced/Middleware.html) for [Algolia Search](https://github.com/algolia/algoliasearch-client-javascript).



## Installation

1. Install the package via npm
```
npm install redux-algolia-middleware --save
```
or yarn
```
yarn add redux-algolia-middlware
```

2. Combine with store in `configureStore.js`
Make sure you have `algoliasearch` installed
```
import { createStore, applyMiddleware, combineReducers } from 'redux'
import createAlgoliaMiddleware from 'redux-redux-middleware'
import reducers from './reducers'

import algoliasearch from 'algoliasearch'
const algoliaClient = algoliasearch(
  config.algoliaAppId,
  config.algoliaSearchApiKey
)

const reducer = combineReducers(reducers)
const middlewares = [
  // ...other middlewares,
  createAlgoliaMiddleware({
    algoliaClient, // required
    transformIndexName: (name) => name,
    transformResponse: (res) => res
  })
]

const createStoreWithMiddleware = applyMiddleware(
  ...middlewares
)(createStore)

export default function configureStore(initialState) {
  return createStoreWithMiddleware(reducer, initialState)
}
```

## Usage

### `actions/search.js`
```
import { ALGOLIA } from 'redux-algolia-middleware'

export const SEARCH_REQUEST = '@@algolia/SEARCH_REQUEST'
export const SEARCH_SUCCESS = '@@algolia/SEARCH_SUCCESS'
export const SEARCH_FAILURE = '@@algolia/SEARCH_FAILURE'

export const queryAlgolia = ({ query, filters }) => {
  return {
    [ALGOLIA]: {
      indexName: 'YOUR_ALGOLIA_INDEX_NAME',
      method: 'search',
      options: {
        query,
        filters
      },
      requestType: SEARCH_REQUEST,
      successType: SEARCH_SUCCESS,
      failureType: SEARCH_FAILURE
    }
  }
}
```
