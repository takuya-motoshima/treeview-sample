import getType from './getType.js';

/**
 * Returns whether the payload is a plain JavaScript object (excluding special classes or objects with other prototypes)
 *
 * @param {*} payload
 * @returns {payload is PlainObject}
 */
export default function(payload) {
  if (getType(payload) !== 'Object')
    return false;
  return payload.constructor === Object && Object.getPrototypeOf(payload) === Object.prototype;
}