import * as helper from './helper.js';
import * as types from './types.js';

const tree = $('#tree')
  .on('ready.jstree', (e, data) => {
    // Triggered after all nodes are finished loading.
    $('#output').prepend(`<p>All nodes have been loaded</p>`);
  })
  .on('changed.jstree', (e, data) => {
    // Triggered when selection changes.
    // Exit if it is not a Node selection action.
    if (data.action !== 'select_node')
      return;
    $('#output').prepend(`<p>${data.node.text} was selected</p>`);
    // Toggle the node selection state.
    for (let node of tree.get_json('#', {flat: true}))
      data.instance.set_type(node, node.id === data.node.id ? types.selectedFolder : types.folder);
  })
  .on('open_node.jstree', (e, data) => {
    $('#output').prepend(`<p>${data.node.text} was expanded</p>`);
  })
  .on('close_node.jstree', (e, data) => {
    $('#output').prepend(`<p>${data.node.text} was collapsed</p>`);
  })
  .jstree({
    core : {
      multiple: false,
      check_callback: true,
      // check_callback : (operation, node, node_parent, node_position, more) => true;
      //   // operation can be 'create_node', 'rename_node', 'delete_node', 'move_node', 'copy_node' or 'edit'  in case of 'rename_node' node_position is filled with the new node name
      //   return operation === 'rename_node' ? true : false;
      // },
      themes : {
        variant: 'large',
        dots: false,
        stripes: false
      }
    },
    types: {
      // I decided to control the folder icon image with CSS.
      [types.selectedFolder]: {/*icon: 'img/selected-node.svg'*/},
      [types.folder]: {/*icon: 'img/Folder.svg'*/}
    },
    plugins: ['types', 'contextmenu', 'state', 'themes'],
    contextmenu:{
      items: node => {
        // Depth level of selected node.
        const level = node.parents.length;
        console.log(`Depth level: ${level}`);

        // Context menu items.
        const items = {
          createFolder: {
            label: 'Create Folder',
            icon: 'img/Folder-plus.svg',
            action: data => {
              // Show folder name input box.
              let name;
              if (!(name = window.prompt('Please enter the folder name')))
                return;

              // Remove the space names before and after the folder name.
              name = name.replace(/^\s+|\s+$/g, '');

              // Alert if the folder name is empty.
              if (name === '')
                return void alert('The folder name is required');

              // Alert if the folder name is duplicated.
              if (helper.isDuplicateChildFolderName(tree, data.reference, name))
                return void alert('This folder name is already in use');

              // Currently selected node.
              const selectedNode = tree.get_node(data.reference);
              // const selectedNode = tree.get_selected()[0] ?? null;

              // Create a subfolder with the entered name in the selected folder.
              tree.create_node(selectedNode, {text: name, type: types.folder}, 'last', newNode => {
                // Select the newly created folder.
                tree.deselect_node(selectedNode);
                tree.select_node(newNode);
              });
            }
          },
          rename: {
            label: 'Rename',
            icon: 'img/Edit.svg',
            action: data => {
              // Node object for the selected folder.
              const node = tree.get_node(data.reference);

              // Selected folder name.
              const currentName = node.text.replace('\s+$', '');
              console.log(`Current folder name: ${currentName}`);

              // Show folder name input box.
              let name;
              if (!(name = window.prompt('Please enter the folder name', currentName)))
                return;

              // Remove the space names before and after the folder name.
              name = name.replace(/^\s+|\s+$/g, '');

              // Alert if the folder name is empty.
              if (name === '')
                return void alert('The folder name is required');

              // Alert if the folder name is duplicated.
              if (helper.isDuplicateChildFolderName(tree, node.parent, name, currentName))
                return void alert('This folder name is already in use');

              // Rename the folder.
              tree.rename_node(node, name);
            }
          },
          remove:{
            label: 'Delete',
            icon: 'img/Trash.svg',
            action: data => {
              // Selected node.
              const node = tree.get_node(data.reference);

              // Deletion confirmation.
              if (!window.confirm(`Do you want to delete the "${node.text.replace('\s+$', '')}" folder?`))
                return;

              // Delete folder.
              if (tree.is_selected(node))
                tree.delete_node(tree.get_selected());
              else
                tree.delete_node(node);
            }
          },
          createFile: false,
          cut: false,
          copy: false,
          paste: false
        };
        if (level === 1) {
          // The root node disables renaming and deleting.
          delete items.rename;
          delete items.remove;
        } else if (level === 3) {
          // Level 3 nodes disable folder creation.
          delete items.createFolder;
        }
        // Returns a context menu item.
        return items;
      }
    },
    // This plugin saves all opened and selected nodes in the user's browser, so when returning to the same tree the previous state will be restored.
    state : {
      // Key name for state data stored in local storage
      key : 'treeViewState'
    }
  })
  .jstree(true);
