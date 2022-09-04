import getType from './getType.js';

/**
 * Returns whether the payload is a Symbol
 */
export default payload => {
  return getType(payload) === 'Symbol'
}