/**
 * Escape HTML entities.
 */
export default str=> {
  return str.replace(/[&'`"<>]/g, match => ({
    '&': '&amp;',
    "'": '&#x27;',
    '`': '&#x60;',
    '"': '&quot;',
    '<': '&lt;',
    '>': '&gt;',}[match]));
}