'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ALGOLIA = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _algolia = require('./algolia');

var _algolia2 = _interopRequireDefault(_algolia);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

var ALGOLIA = exports.ALGOLIA = '__REDUX_ALGOLIA__';

var defaultTransformIndex = function defaultTransformIndex(name) {
  return name;
};
var defaultTransformResponse = function defaultTransformResponse(res) {
  return res;
};

exports.default = function () {
  var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      algoliaClient = _ref.algoliaClient,
      _ref$transformIndexNa = _ref.transformIndexName,
      transformIndexName = _ref$transformIndexNa === undefined ? defaultTransformIndex : _ref$transformIndexNa,
      _ref$transformRespons = _ref.transformResponse,
      transformResponse = _ref$transformRespons === undefined ? defaultTransformResponse : _ref$transformRespons;

  if (!algoliaClient) {
    throw new Error('algoliaClient is required');
  }

  return function (_ref2) {
    var dispatch = _ref2.dispatch;
    return function (next) {
      return function (action) {

        if (!action[ALGOLIA]) {
          return next(action);
        }

        var algoliaAction = action[ALGOLIA],
            payload = _objectWithoutProperties(action, [ALGOLIA]);

        var method = algoliaAction.method,
            indexName = algoliaAction.indexName,
            options = algoliaAction.options,
            requestType = algoliaAction.requestType,
            successType = algoliaAction.successType,
            failureType = algoliaAction.failureType;


        var params = _extends({ method: method, indexName: indexName, options: options }, payload);

        if (requestType) {
          dispatch(_extends({
            type: requestType
          }, params));
        }

        var algoliaIndex = (0, _algolia2.default)({
          algoliaClient: algoliaClient,
          indexName: transformIndexName(indexName)
        });

        var query = options.query,
            otherOptions = _objectWithoutProperties(options, ['query']);

        return algoliaIndex[method](query, otherOptions).then(function (response) {
          next(_extends({
            type: successType,
            response: transformResponse(response)
          }, params));
        }, function (error) {
          if (failureType) {
            next(_extends({
              type: failureType,
              error: error
            }, params));
          }
        });
      };
    };
  };
};