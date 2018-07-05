import createAlgoliaMiddleware, {
  ALGOLIA
} from 'redux-algolia'

const middlewares = [
  createAlgoliaMiddleware({
    algoliaClient: 'algolia-client',
    transformIndexName: (name) => 'name',
    transformResponse: (res) => res
  })
]

const action = () => {
  return {
    [ALGOLIA]: {
      indexName: 'name',
      method: 'search',
      options: {
        query: 'query'
      }
    }
  }
}
