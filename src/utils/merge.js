import isPlainObject from './isPlainObject.js';

/**
 * Merge nested objects.
 */
function merge(target, sources) {
  if (!isPlainObject(target))
    throw new TypeError('Target must be object');
  else if (!isPlainObject(sources)) {
    console.log('Returns the target because the source is not an object');
    return target;
  }
  for (let [key, source] of Object.entries(sources)) {
    if (!(key in target))
      target[key] = source;
    else if (isPlainObject(target[key]) && isPlainObject(source))
      target[key] = merge(target[key], source);
    else
      target[key] = source;
  }
  return target;
}
export default merge;