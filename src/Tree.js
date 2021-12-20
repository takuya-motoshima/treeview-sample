import merge from './utils/merge.js';

export default class {
  /**
   * Construct tree.
   */
  constructor(ctx, opts) {
    // Init options.
    this.opts = merge({
      maxDepth: 3,
      lang: {
        contextMenu: {
          create: 'Create',
          rename: 'Rename',
          remove: 'Delete',
        },
        prompt: {
          create: 'Please enter a new folder name',
          rename: 'Please enter the folder name'
        },
        valdn: {
          folderExists: 'This folder name is already in use',
          folderNameRequired: 'Folder name is required'
        }
      }
    }, opts);
    // console.log(JSON.stringify(this.opts, null, 2));

    // Root folder ID.
    this.rootFldrId = undefined;

    // Wrap the text of the added folder with a span element.
    const obs = new MutationObserver(muts => {
      for (const mut of muts) {
        if (!mut.addedNodes.length)
          continue;
        for (let node of mut.addedNodes) {
          if (!(node instanceof HTMLElement))
            continue;         
          const anchors = node.querySelectorAll('.jstree-anchor:not(.jstree-anchor-formatted)');
          for (let anchor of anchors) {
            // Wrap text with span.
            let [_, icon, text] = anchor.innerHTML.match(/^(..*<\/i>)(..*)$/);

            // Escape HTML entity for text.
            text = text.replace(/[&'`"<>]/g, match => ({'&': '&amp;', "'": '&#x27;', '`': '&#x60;', '"': '&quot;', '<': '&lt;', '>': '&gt;',}[match]));
            anchor.innerHTML = `${icon}<span class='jstree-anchor-text'>${text}</span>`;
            anchor.title = text;
            anchor.classList.add('jstree-anchor-formatted');
          }
        }
      }
    });
    obs.observe(ctx, {attributes: false, childList: true, subtree: true});

    // Tree instance.
    this.tree = $(ctx).jstree({
      core: {
        // data configuration.
        data: {
          type: 'GET',
          url : node => {
            const url = `data/${encodeURIComponent(node.id)}.json`;
            console.log(`Request ${url}`);
            return url;
          },
          contentType: 'application/json; charset=utf-8',
          success: data => {
            console.log('Response: ', data);
            if (!Array.isArray(data)) {
              // Save the root folder ID.
              if (data.parent === '#')
                this.rootFldrId = data.id;
            } else {
            // Since jstree accepts only boolean type "children", if "children" is not boolean type, replace it with boolean type.
              for (let row of data) {
                // Save the root folder ID.
                if (row.parent === '#')
                  this.rootFldrId = row.id;
                if ('children' in row && typeof row.children !== 'boolean')
                  row.children = row.children == 1 ? true : false;
              }
            }
          }
        },

        // determines what happens when a user tries to modify the structure of the tree.
        check_callback: true,

        // a boolean indicating if multiple nodes can be selected
        multiple: false,
        themes: {
          variant: 'large',
          dots: false,
          stripes: false
        }
      },
      plugins: [
        'types',// This plugin makes it possible to add predefined types for groups of nodes, which means to easily control nesting rules and icon for each group.
        'state',// This plugin saves all opened and selected nodes in the user's browser, so when returning to the same tree the previous state will be restored.
        'sort',// The sort enables jstree to automatically sort all nodes using a specified function. This means that when the user creates, renames or moves nodes around - they will automatically sort.
        'contextmenu',// This plugin makes it possible to right click nodes and shows a list of configurable actions in a menu.
        // 'unique'// Enforces that no nodes with the same name can coexist as siblings.
      ],
      types: {
        selFldr: {},
        unselFldr: {}
      },
      // sort : (a, b) => {
      //   a1 = this.get_node(a);
      //   b1 = this.get_node(b);
      //   if (a1.icon == b1.icon){
      //     return (a1.text > b1.text) ? 1 : -1;
      //   } else {
      //      return (a1.icon > b1.icon) ? 1 : -1;
      //   }
      // }
      contextmenu: {
        items: () => {
          // Context menu items.
          const menuItems = {
            createFolder: {
              label: this.opts.lang.contextMenu.create,
              _class: 'jstree-contextmenu-create',
              action: data => this.createAction(data)
            },
            rename: {
              label: this.opts.lang.contextMenu.rename,
              _class: 'jstree-contextmenu-rename',
              action: data => this.renameAction(data)
            },
            remove:{
              label: this.opts.lang.contextMenu.remove,
              _class: 'jstree-contextmenu-remove',
              action: data => this.removeAction(data)
            },
            createFile: false,
            cut: false,
            copy: false,
            paste: false
          };
          const curDepth = this.getSelectedNodeDepth();
          if (curDepth === 0) {
            // The root node disables renaming and deleting.
            delete menuItems.rename;
            delete menuItems.remove;
          } else if (curDepth === this.opts.maxDepth - 1) {
            // Disable folder creation for bottom node.
            delete menuItems.createFolder;
          } 
          // Returns a context menu item.
          return menuItems;
        }
      }
    })
    .on('state_ready.jstree', () => {
      // After initializing the tree. If the node is not selected after initializing the tree, make the root folder selected.
      const selNode = this.getSelectedNode();
      console.log('selNode=', selNode);
      if (!selNode)
          this.selectNode(this.rootFldrId);
    })
    .on('after_close.jstree', (evnt, {node, instance}) => {
      // triggered when a node is closed and the animation is complete.
      // console.log(`Close node widh id ${node.id}`);
      
      // Delete the cache so that when the folder is opened, the child folder information is queried to the server again.
      this.tree.delete_node(node.children);
      this.tree._model.data[node.id].state.loaded = false;

      // When the folder is closed, the ".jstree-closed" class is not set in the li element, so the close icon disappears, so set the ".jstree-closed" class in the li element.
      setTimeout(() => {
        const dom = this.getNode(node.id, true)[0];
        dom.classList.add('jstree-closed');
      }, 0);
    })
    .on('select_node.jstree', (evnt, {node}) => {
      // triggered when an node is selected.
      console.log(`Select node with ID ${node.id}`);
    })
    // .on("close_node.jstree", (evnt, data) => {
    //   console.log("close_node");
    // })
    // .on('load_node.jstree', (evnt, {node}) => {
    //   console.log(`Loaded ${node.id}`);
    // })
    .jstree(true);
  }

  /**
   * Update tree.
   * 
   * @param {{}|string} data Specify a tree-structured JSON or a URL that returns a tree-structured JSON
   * @param {boolean}   skipLoading If true, display an in-progress message and icon.
   * @param {boolean}   forgetState If true, do not keep the previous tree state.
   */
  async updateTree(data, skipLoading = false, forgetState = false) {
    if (typeof data === 'string')
      data = await (await fetch(data)).json();
    this.tree.settings.core.data = data;
    this.refreshTree(skipLoading, forgetState);
  }

  /**
   * Refresh tree.
   * 
   * @param {boolean} skipLoading If true, display an in-progress message and icon.
   * @param {boolean} forgetState If true, do not keep the previous tree state.
   */
  refreshTree(skipLoading = false, forgetState = false) {
    this.tree.refresh(skipLoading, forgetState);
  }
  
  /**
   * Returns the selected node.
   */
  getSelectedNode() {
    return this.tree.get_selected(true)[0];
  }

  /**
   * Returns the depth of the first node selected.
   * 
   * @return {number} 1 = root level, 2 = next level down, etc
   */
  getSelectedNodeDepth() {
    return this.getSelectedNode().parents.length - 1;
  }

  /**
   * Check if the child folder name is duplicated.
   * 
   * @param  {any}    node        Target folder node
   * @param  {string} fldr        Folder name to check.
   * @param  {string} ignoreFldr  Folder name that allows duplication.
   * @return {boolean}            True if the child folder name is duplicated, false otherwise.
   */
  isDupFldr(node, fldr, ignoreFldr = undefined) {
    const childFldrs = this.getChildFldrs(node);
    if (ignoreFldr) {
      const i = childFldrs.indexOf(ignoreFldr);
      if (i !== -1)
        childFldrs.splice(i, 1);
    }
    return childFldrs.includes(fldr);
  }

  /**
   * Returns the names of all child folders.
   *
   * @param  {any}      node Target folder node
   * @return {string[]}      Child folder name.
   */
  getChildFldrs(node) {
    return this.tree
      .get_json(node)
      .children
      .flatMap(child => ['unselFldr', 'selFldr'].includes(child.type) ? child.text.replace(/\s+$/, '') : []);
  }

  /**
   * Create a new folder.
   */
  createAction(data) {
    // Show folder name input box.
    let newFldrName = window.prompt(this.opts.lang.prompt.create);              
    if (newFldrName === null)
      return;

    // Remove the space names before and after the folder name.
    newFldrName = newFldrName.replace(/^\s+|\s+$/g, '');

    // Alert if the folder name is empty.
    if (newFldrName === '')    
      return void alert(this.opts.lang.valdn.folderNameRequired);

    // Alert if the folder name is duplicated.
    if (this.isDupFldr(data.reference, newFldrName))
      return void alert(this.opts.lang.valdn.folderExists);

    // Currently selected node.
    const parentNode = this.getNode(data.reference);
    // console.log('parentNode=', parentNode);

    // Create a subfolder with the entered name in the selected folder.
    const newNodeId = btoa(unescape(encodeURIComponent(newFldrName))); 
    // const newNodeId = btoa(newFldrName);// "Uncaught DOMException" occurs when converting characters including double-byte characters.

    this.tree.create_node(parentNode, {
      id: newNodeId,
      text: newFldrName,
      type: 'unselFldr'
    }, 'last', newNode => {
      // Select the newly created folder.
      this.tree.deselect_node(parentNode);
      this.tree.select_node(newNode);
      // console.log(`Create a node with ID ${newNode.id}`);
    });
  }

  /**
   * Rename the folder.
   */
  renameAction(data) {
    // Node object for the selected folder.
    const selNode = this.getNode(data.reference);

    // Selected folder name.
    const curFldrName = selNode.text.replace('\s+$', '');
    // console.log(`Current folder name: ${curFldrName}`);

    // Show folder name input box.
    let newFldrName = window.prompt(this.opts.lang.prompt.rename, curFldrName);
    if (newFldrName === null)
      return;

    // Remove the space names before and after the folder name.
    newFldrName = newFldrName.replace(/^\s+|\s+$/g, '');

    // Alert if the folder name is empty.
    if (newFldrName === '')
      return void alert(this.opts.lang.valdn.folderNameRequired);

    // Alert if the folder name is duplicated.
    if (this.isDupFldr(selNode.parent, newFldrName, curFldrName))
      return void alert(this.opts.lang.valdn.folderExists);

    // Rename the folder.
    this.tree.rename_node(selNode, newFldrName);
  }

  /**
   * Remove folder.
   */
  removeAction(data) {
    // Selected node.
    const selNode = this.getNode(data.reference);

    // Deletion confirmation.
    if (!window.confirm(`"${selNode.text.replace('\s+$', '')}" を削除しますか?`))
      return;

    // Delete folder.
    if (this.tree.is_selected(selNode))
      this.deleteNode(this.tree.get_selected());
    else
      this.deleteNode(selNode);
  }

  /**
   * get the JSON representation of a node (or the actual jQuery extended DOM node) by using any input (child DOM element, ID string, selector, etc)
   * 
   * @param   {mixed}         obj 
   * @param   {boolean}       asDom 
   * @return  {object|jQuery}
   */
  getNode(obj, asDom = false) {
    return this.tree.get_node(obj, asDom);
  }

  /**
   * 
   * @param {any} obj the node, you can pass an array to delete multiple nodes
   * @return {boolean}
   */
  deleteNode(obj) {
    return this.tree.delete_node(obj);
  }

  /**
   * Change to default theme
   */
  changeDefaultTheme() {
    this.tree.set_theme_variant(false);
  }

  /**
   * Change to large theme
   */
  changeLargeTheme() {
    this.tree.set_theme_variant('large');
  }

  /**
   * Select a node.
   * 
   * @param {any} obj an array can be used to select multiple nodes.
   * @param {boolean} supressEvent if set to true the changed.jstree event won't be triggered. 
   * @param {boolean} preventOpen if set to true parents of the selected node won't be opened.
   */
  selectNode(obj, supressEvent = false, preventOpen = false) {
    // console.log('Select a folder, ', obj);
    this.tree.select_node(obj, supressEvent, preventOpen);
  }

  /**
   * Returns an array of tree nodes converted to JSON.
   */
  getJson() {
  	return this.tree.get_json('#', {flat: true});
  }

  /**
   * Returns the root node.
   */
  getRootNode() {
    this.getNode(this.rootFldrId);
  }

  /**
   * Returns the full folder path.
   * 
   * @example
   * const tree = new Tree(document.querySelector('#tree));
   *
   * // Get the full path of the selected folder.
   * // Output example: /Root folder/Subfolder 1
   * const fldrPath = tree.getFldrFullpath(tree.getSelectedNode());
   * console.log(fldrPath);
   *
   * @param   {mixed}   obj node
   * @return  {string}      Full path of the folder.
   */
  getFldrFullpath(obj) {
    return this.tree.get_path(obj, '/');
  }
}