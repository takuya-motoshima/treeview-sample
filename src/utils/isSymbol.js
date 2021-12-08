import getType from './getType.js';

/**
 * Returns whether the payload is a Symbol
 *
 * @param {*} payload
 * @returns {payload is symbol}
 */
export default function(payload) {
  return getType(payload) === 'Symbol'
}