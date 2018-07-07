import createAlgoliaMiddlware, { ALGOLIA } from '../src'
import getAlgoliaIndex from '../src/algolia'

jest.mock('../src/algolia', () => jest.fn())

describe('Redux Algolia', ()=> {

  describe('When algoliaClient is not provided', () => {
    it('throws an error', () => {
      expect(() => createAlgoliaMiddlware()).toThrow(
        'algoliaClient is required'
      )
    })
  })

  describe('Middlware behavior', ()=> {
    let algoliaClient, middleware
    let dispatch, next, action

    beforeEach(()=> {
      algoliaClient = jest.fn()
      middleware = createAlgoliaMiddlware({ algoliaClient })
      dispatch = jest.fn()
      next = jest.fn()
    })

    it('skips to next action if not containing ALGOLIA key', ()=> {
      let nextResult = 'next-result'
      next.mockReturnValue(nextResult)
      action = { type: 'other type' }
      let result = middleware({ dispatch })(next)(action)

      expect(result).toEqual(nextResult)
    })

    describe('when action payload is valid', () => {
      let payload, algoParams
      let mockSearch, response
      beforeEach(() => {
        payload = {
          method: 'search',
          options: {
            query: 'query',
            page: 2
          },
          indexName: 'ALGOLIA_INDEX',
          requestType: 'THE_REQUEST_TYPE',
          successType: 'THE_SUCCESS_TYPE',
          failureType: 'THE_FAILURE_TYPE'
        }
        action = {
          [ALGOLIA]: payload
        }
        algoParams = {
          method: payload.method,
          indexName: payload.indexName,
          options: payload.options
        }
        response = {
          hits: [{ id_next: 1 }],
          hitsPerPage: 10,
          nbHits: 20,
          nbPages: 30,
          page: 1
        }
        mockSearch = jest.fn().mockReturnValue(
          Promise.resolve(response)
        )
        getAlgoliaIndex.mockImplementation(() => {
          return {
            [payload.method]: mockSearch
          }
        })
        middleware({ dispatch })(next)(action)
      })
      it('init algolia index', () => {
        expect(getAlgoliaIndex).toBeCalledWith({
          algoliaClient,
          indexName: payload.indexName
        })
      })

      it('calls algolia[method] with options', () => {
        expect(mockSearch).toBeCalledWith(payload.options)
      })
      it('dispatches sending type', () => {
        expect(dispatch).toBeCalledWith({
          type: payload.requestType,
          ...algoParams
        })
      })
      it('passes success type with response', () => {
        let { method, indexName, options } = payload
        expect(next).toBeCalledWith({
          type: payload.successType,
          response,
          ...algoParams
        })
      })
      it('dispatches failureType', () => {})
    })
  })
})
