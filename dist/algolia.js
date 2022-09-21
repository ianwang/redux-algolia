"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _indexStore = {};

exports.default = function (_ref) {
  var algoliaClient = _ref.algoliaClient,
      indexName = _ref.indexName;

  var created = _indexStore[indexName];
  if (created) {
    return created;
  }
  var index = algoliaClient.initIndex(indexName);
  _indexStore[indexName] = index;
  return index;
};