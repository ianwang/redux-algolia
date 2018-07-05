const _indexStore = {}

export default ({
  algoliaClient,
  indexName
}) => {
  let created = _indexStore[indexName]
  if (created) {
    return created
  }
  let index = algoliaClient.initIndex(indexName)
  _indexStore[indexName] = index
  return index
}
