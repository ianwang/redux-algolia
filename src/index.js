import getAlgoliaIndex from './algolia'
export const ALGOLIA = Symbol('ALGOLIA')

const defaultOptions = {
  algoliaClient: null,
  transformIndexName: (name) => name,
  transformResponse: (res) => res
}

export default ({
  algoliaClient,
  transformIndexName,
  transformResponse
} = defaultOptions) => {
  if (!algoliaClient) {
    throw new Error('algoliaClient is required')
  }

  return ({ dispatch }) => next => action => {

    if (!action[ALGOLIA]) {
      return next(action)
    }

    let algoliaAction = action[ALGOLIA]
    let {
      method,
      indexName,
      options,
      successType,
      errorType,
      sendingType,
    } = algoliaAction

    let params = { method, indexName, options }

    if (sendingType) {
      dispatch({
        type: sendingType,
        ...params
      })
    }

    let algoliaIndex = getAlgoliaIndex({
      algoliaClient,
      indexName: transformIndexName(indexName)
    })

    return algoliaIndex[method](options).then((response) => {
      next({
        type: successType,
        response: transformResponse(response),
        ...params
      })
    }, (error) => {
      if (errorType) {
        next({
          type: errorType,
          error,
          ...params
        })
      }
    })
  }
}
