import getAlgoliaIndex from './algolia'
export const ALGOLIA = '__REDUX_ALGOLIA__'

const defaultTransformIndex = (name) => name
const defaultTransformResponse = (res) => res

export default ({
  algoliaClient,
  transformIndexName = defaultTransformIndex,
  transformResponse = defaultTransformResponse
} = {}) => {
  if (!algoliaClient) {
    throw new Error('algoliaClient is required')
  }

  return ({ dispatch }) => next => action => {

    if (!action[ALGOLIA]) {
      return next(action)
    }

    let { [ALGOLIA]: algoliaAction, ...payload } = action
    let {
      method,
      indexName,
      options,
      requestType,
      successType,
      failureType
    } = algoliaAction

    let params = { method, indexName, options, ...payload }

    if (requestType) {
      dispatch({
        type: requestType,
        ...params
      })
    }

    let algoliaIndex = getAlgoliaIndex({
      algoliaClient,
      indexName: transformIndexName(indexName)
    })

    let { query, ...otherOptions } = options
    return algoliaIndex[method](query, otherOptions).then((response) => {
      next({
        type: successType,
        response: transformResponse(response),
        ...params
      })
    }, (error) => {
      if (failureType) {
        next({
          type: failureType,
          error,
          ...params
        })
      }
    })
  }
}
