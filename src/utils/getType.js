/**
 * Returns the object type of the given payload
 *
 * @param {*} payload
 * @returns {string}
 */
export default function(payload) {
  return Object.prototype.toString.call(payload).slice(8, -1)
}