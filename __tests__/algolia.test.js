import getAlgoliaIndex from '../src/algolia'

describe('Algolia helper', ()=> {
  let mockIndex = 'index'
  let indexName = 'the-index-name'
  let algoliaClient = {
    initIndex: jest.fn().mockReturnValue(mockIndex)
  }
  it('returns algolia index', () => {
    let index = getAlgoliaIndex({ algoliaClient, indexName })
    expect(algoliaClient.initIndex).toBeCalledWith(indexName)
    expect(index).toBe(mockIndex)
  })
  it('makes sure to only init once', () => {
    getAlgoliaIndex({ algoliaClient, indexName })
    getAlgoliaIndex({ algoliaClient, indexName })
    let index = getAlgoliaIndex({ algoliaClient, indexName })
    expect(algoliaClient.initIndex.mock.calls.length).toBe(1)
    expect(index).toBe(mockIndex)
  })
})

