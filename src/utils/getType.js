/**
 * Returns the object type of the given payload
 */
export default payload => {
  return Object.prototype.toString.call(payload).slice(8, -1)
}