import isPlainObject from './isPlainObject.js';

/**
 * Merge nested objects.
 */
export default function deepMerge(target, sources) {
  // Returns an error if the target is not an object.
  if (!isPlainObject(target))
    throw new TypeError('Target must be object');
  // If sources is not an object, return target.
  else if (!isPlainObject(sources)) {
    console.log('Returns the target because the source is not an object');
    return target;
  }

  // Merge the elements of the source one by one into the same element of the target.
  for (let [key, source] of Object.entries(sources)) {
    // console.log(`key=${key}`);
    if (!(key in target))
      target[key] = source;
    else if (isPlainObject(target[key]) && isPlainObject(source))
      target[key] = deepMerge(target[key], source);
    else
      target[key] = source;
   }
  return target;
}