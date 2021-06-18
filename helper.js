import * as types from './types.js';

/**
 * Returns the names of all nodes.
 * 
 * @param  {JSTree}   tree jstree instance.
 * @return {string[]}      Names of all folders.
 */
function getAllFolderName(tree) {
  const folderTypes = [types.folder, types.selectedFolder];
  return tree
          .get_json('#', {flat: true})
          .flatMap(node => folderTypes.includes(node.type) ? node.text.replace(/\s+$/, '') : []);
}

/**
 * Returns the names of all child folders.
 *
 * @param  {JSTree}   tree jstree instance.
 * @param  {any}      node Target folder node
 * @return {string[]}      Child folder name.
 */
function getChildFolderName(tree, node) {
  const folderTypes = [types.folder, types.selectedFolder];
  return tree
          .get_json(node)
          .children
          .flatMap(child => folderTypes.includes(child.type) ? child.text.replace(/\s+$/, '') : []);
}

/**
 * Check if the child folder name is duplicated.
 * 
 * @param  {JSTree} tree              jstree instance.
 * @param  {any}    node              Target folder node
 * @param  {string} folderName        Folder name to check.
 * @param  {string} ignoreFolderName  Folder name that allows duplication.
 * @return {boolean}                  True if the child folder name is duplicated, false otherwise.
 */
function isDuplicateChildFolderName(tree, node, folderName, ignoreFolderName = undefined) {
  const childFolderNames = getChildFolderName(tree, node);
  if (ignoreFolderName) {
    const i = childFolderNames.indexOf(ignoreFolderName);
    if (i !== -1)
      childFolderNames.splice(i, 1);
  }
  return childFolderNames.includes(folderName);
}

export {getAllFolderName, isDuplicateChildFolderName, getChildFolderName};