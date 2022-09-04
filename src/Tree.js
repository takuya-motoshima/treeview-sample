import hbs from '../node_modules/handlebars-extd/dist/build.esm.js';
import merge from './utils/merge.js';
import escape from './utils/escape.js';

export default class {
  #treeInstance;
  #options;
  #rootFolderId;
  constructor(context, options) {
    this.#options = merge({
      maxDepth: 3,
      language: {
        createMenu: 'Create a folder',
        renameMenu: 'Rename folder',
        removeMenu: 'Delete folder',
        confirmFolderCreation: 'Please enter a new folder name',
        confirmFolderNameChange: 'Please enter the folder name',
        folderNameRequired: 'Enter a folder name',
        deletionConfirmation: 'Delete %s folder?'
      }
    }, options);

    // Wrap the text of the added folder with a span element.
    const observer = new MutationObserver(mutationList => {
      for (const mutation of mutationList) {
        if (!mutation.addedNodes.length)
          continue;
        for (let node of mutation.addedNodes) {
          if (!(node instanceof HTMLElement))
            continue;
          const anchors = node.querySelectorAll('.jstree-anchor:not(.jstree-anchor-formatted)');
          for (let anchor of anchors) {
            const [_, folderIcon, folderName] = anchor.innerHTML.match(/^(..*<\/i>)(..*)$/);
            const level = parseInt(anchor.getAttribute('aria-level'), 10)
            const isRootFolder = level === 1;
            const isBottomFolder = level === this.#options.maxDepth;
            anchor.innerHTML = hbs.compile(
              `<!--begin::Folder icon-->
              {{{folderIcon}}}
              <!--end::Folder icon-->
              <!--begin::Folder Name-->
              <span class='jstree-anchor-text'>{{folderName}}</span>
              <!--end::Folder Name-->
              {{#if level}}
                <!--begin::Actions-->
                <div class="jstree-anchor-actions">
                  {{#if (or (eq isRootFolder true) (eq isBottomFolder false))}}
                    <button data-create-folder type="button" class="btn-icon">
                      <span class="svg-icon"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path opacity="0.3" d="M3 13V11C3 10.4 3.4 10 4 10H20C20.6 10 21 10.4 21 11V13C21 13.6 20.6 14 20 14H4C3.4 14 3 13.6 3 13Z" fill="currentColor"/>
                        <path d="M13 21H11C10.4 21 10 20.6 10 20V4C10 3.4 10.4 3 11 3H13C13.6 3 14 3.4 14 4V20C14 20.6 13.6 21 13 21Z" fill="currentColor"/>
                      </svg></span>
                    </button>
                  {{/if}}
                  {{#unless isRootFolder}}
                    <button data-rename-folder type="button" class="btn-icon">
                      <span class="svg-icon"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path opacity="0.3" fill-rule="evenodd" clip-rule="evenodd" d="M2 4.63158C2 3.1782 3.1782 2 4.63158 2H13.47C14.0155 2 14.278 2.66919 13.8778 3.04006L12.4556 4.35821C11.9009 4.87228 11.1726 5.15789 10.4163 5.15789H7.1579C6.05333 5.15789 5.15789 6.05333 5.15789 7.1579V16.8421C5.15789 17.9467 6.05333 18.8421 7.1579 18.8421H16.8421C17.9467 18.8421 18.8421 17.9467 18.8421 16.8421V13.7518C18.8421 12.927 19.1817 12.1387 19.7809 11.572L20.9878 10.4308C21.3703 10.0691 22 10.3403 22 10.8668V19.3684C22 20.8218 20.8218 22 19.3684 22H4.63158C3.1782 22 2 20.8218 2 19.3684V4.63158Z" fill="currentColor"/>
                        <path d="M10.9256 11.1882C10.5351 10.7977 10.5351 10.1645 10.9256 9.77397L18.0669 2.6327C18.8479 1.85165 20.1143 1.85165 20.8953 2.6327L21.3665 3.10391C22.1476 3.88496 22.1476 5.15129 21.3665 5.93234L14.2252 13.0736C13.8347 13.4641 13.2016 13.4641 12.811 13.0736L10.9256 11.1882Z" fill="currentColor"/>
                        <path d="M8.82343 12.0064L8.08852 14.3348C7.8655 15.0414 8.46151 15.7366 9.19388 15.6242L11.8974 15.2092C12.4642 15.1222 12.6916 14.4278 12.2861 14.0223L9.98595 11.7221C9.61452 11.3507 8.98154 11.5055 8.82343 12.0064Z" fill="currentColor"/>
                      </svg></span>
                    </button>
                    <button data-delete-folder type="button" class="btn-icon">
                      <span class="svg-icon svg-icon-muted svg-icon-2hx"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path opacity="0.3" d="M6.7 19.4L5.3 18C4.9 17.6 4.9 17 5.3 16.6L16.6 5.3C17 4.9 17.6 4.9 18 5.3L19.4 6.7C19.8 7.1 19.8 7.7 19.4 8.1L8.1 19.4C7.8 19.8 7.1 19.8 6.7 19.4Z" fill="currentColor"/>
                        <path d="M19.5 18L18.1 19.4C17.7 19.8 17.1 19.8 16.7 19.4L5.40001 8.1C5.00001 7.7 5.00001 7.1 5.40001 6.7L6.80001 5.3C7.20001 4.9 7.80001 4.9 8.20001 5.3L19.5 16.6C19.9 16.9 19.9 17.6 19.5 18Z" fill="currentColor"/>
                      </svg></span>
                    </button>
                  {{/unless}}
                </div>
                <!--end::Actions-->
              {{/if}}`
            )({folderName, folderIcon, level, isRootFolder, isBottomFolder, level});
            anchor.querySelector('[data-create-folder]')?.addEventListener('click', evnt => {
              evnt.stopPropagation();
              const anchor = evnt.currentTarget.closest('.jstree-anchor');
              this.#createFolder(this.#getNode(anchor.id))
            });
            anchor.querySelector('[data-rename-folder]')?.addEventListener('click', evnt => {
              evnt.stopPropagation();
              const anchor = evnt.currentTarget.closest('.jstree-anchor');
              this.#renameFolder(this.#getNode(anchor.id))
            });
            anchor.querySelector('[data-delete-folder]')?.addEventListener('click', evnt => {
              evnt.stopPropagation();
              const anchor = evnt.currentTarget.closest('.jstree-anchor');
              this.#deleteFolder(this.#getNode(anchor.id))
            });
            anchor.title = escape(folderName);
            anchor.classList.add('jstree-anchor-formatted');
          }
        }
      }
    });
    observer.observe(context, {
      attributes: false,
      childList: true,
      subtree: true
    });

    // Tree instance.
    this.#treeInstance = $(context).jstree({
      core: {
        data: {
          type: 'GET',
          url : node => `data/${encodeURIComponent(node.id)}.json?${+new Date}`,
          contentType: 'application/json; charset=utf-8',
          success: data => {
            if (!Array.isArray(data)) {
              // Save the root folder ID.
              if (data.parent === '#')
                this.#rootFolderId = data.id;
            } else {
              // Since jstree accepts only boolean type "children", if "children" is not boolean type, replace it with boolean type.
              for (let row of data) {
                // Save the root folder ID.
                if (row.parent === '#')
                  this.#rootFolderId = row.id;
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
        selFolder: {},
        unselFolder: {}
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
              label: this.#options.language.createMenu,
              _class: 'jstree-contextmenu-create',
              action: data => this.#createFolder(this.#getNode(data.reference))
              // action: data => this.#createFolder(data)
            },
            rename: {
              label: this.#options.language.renameMenu,
              _class: 'jstree-contextmenu-rename',
              action: data => this.#renameFolder(this.#getNode(data.reference))
            },
            remove: {
              label: this.#options.language.removeMenu,
              _class: 'jstree-contextmenu-remove',
              action: data => this.#deleteFolder(this.#getNode(data.reference))
            },
            createFile: false,
            cut: false,
            copy: false,
            paste: false
          };
          const currentDepth = this.getSelectedNodeDepth();
          if (currentDepth === 0) {
            // The root node disables renaming and deleting.
            delete menuItems.rename;
            delete menuItems.remove;
          } else if (currentDepth === this.#options.maxDepth - 1) {
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
      const selectedNode = this.getSelectedNode();
      if (!selectedNode)
          this.selectNode(this.#rootFolderId);
    })
    .on('after_close.jstree', (evnt, {node, instance}) => {
      // Triggered when a node is closed and the animation is complete.
      // Delete the cache so that when the folder is opened, the child folder information is queried to the server again.
      this.#treeInstance.delete_node(node.children);
      this.#treeInstance._model.data[node.id].state.loaded = false;

      // When the folder is closed, the ".jstree-closed" class is not set in the li element, so the close icon disappears, so set the ".jstree-closed" class in the li element.
      setTimeout(() => {
        this.#getNode(node.id, true)[0].classList.add('jstree-closed');
      }, 0);
    })
    // .on('select_node.jstree', (evnt, {node}) => {})
    // .on("close_node.jstree", (evnt, data) => {})
    // .on('load_node.jstree', (evnt, {node}) => {})
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
    this.#treeInstance.settings.core.data = data;
    this.refreshTree(skipLoading, forgetState);
  }

  /**
   * Refresh tree.
   * 
   * @param {boolean} skipLoading If true, display an in-progress message and icon.
   * @param {boolean} forgetState If true, do not keep the previous tree state.
   */
  refreshTree(skipLoading = false, forgetState = false) {
    this.#treeInstance.refresh(skipLoading, forgetState);
  }
  
  /**
   * Returns the selected node.
   */
  getSelectedNode() {
    return this.#treeInstance.get_selected(true)[0];
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
   * Create a new folder.
   */
  #createFolder(targetNode) {
    // Show folder name input box.
    let newFolderName = window.prompt(this.#options.language.confirmFolderCreation);
    if (newFolderName === null)
      return;

    // Remove the space names before and after the folder name.
    newFolderName = newFolderName.replace(/^\s+|\s+$/g, '');

    // Alert if the folder name is empty.
    if (newFolderName === '')    
      return void alert(this.#options.language.folderNameRequired);

    // Create a subfolder with the entered name in the selected folder.
    const newNodeId = btoa(unescape(encodeURIComponent(newFolderName))); 
    this.#treeInstance.create_node(targetNode, {
      id: newNodeId,
      text: newFolderName,
      type: 'unselFolder'
    }, 'last', newNode => {
      // Select the newly created folder.
      this.#treeInstance.deselect_node(targetNode);
      this.#treeInstance.select_node(newNode);
    });
  }

  /**
   * Delete the folder.
   */
  #deleteFolder(targetNode) {
    if (!window.confirm(this.#options.language.deletionConfirmation.replace('%s', targetNode.text.replace('\s+$', ''))))
      return;
    if (this.#treeInstance.is_selected(targetNode))
      return this.#treeInstance.delete_node(this.#treeInstance.get_selected());
    else
      return this.#treeInstance.delete_node(targetNode);
  }

  /**
   * Change to default theme
   */
  changeDefaultTheme() {
    this.#treeInstance.set_theme_variant(false);
  }

  /**
   * Change to large theme
   */
  changeLargeTheme() {
    this.#treeInstance.set_theme_variant('large');
  }

  /**
   * Select a node.
   * 
   * @param {any} obj an array can be used to select multiple nodes.
   * @param {boolean} supressEvent if set to true the changed.jstree event won't be triggered. 
   * @param {boolean} preventOpen if set to true parents of the selected node won't be opened.
   */
  selectNode(obj, supressEvent = false, preventOpen = false) {
    this.#treeInstance.select_node(obj, supressEvent, preventOpen);
  }

  /**
   * Returns an array of tree nodes converted to JSON.
   */
  getJson() {
  	return this.#treeInstance.get_json('#', {flat: true});
  }

  /**
   * Returns the root node.
   */
  getRootNode() {
    this.#getNode(this.#rootFolderId);
  }

  /**
   * Returns the full folder path.
   * 
   * @example
   * const tree = new Tree(document.querySelector('#tree));
   *
   * // Get the full path of the selected folder.
   * // Output example: /Root folder/Subfolder 1
   * const folderPath = tree.getFolderPath(tree.getSelectedNode());
   *
   * @param   {mixed}   obj node
   * @return  {string}      Full path of the folder.
   */
  getFolderPath(obj) {
    return this.#treeInstance.get_path(obj, '/');
  }

  /**
   * get the JSON representation of a node (or the actual jQuery extended DOM node) by using any input (child DOM element, ID string, selector, etc)
   * 
   * @param   {mixed}         obj 
   * @param   {boolean}       asDom 
   * @return  {object|jQuery}
   */
  #getNode(obj, asDom = false) {
    return this.#treeInstance.get_node(obj, asDom);
  }

  /**
   * Rename the folder.
   */
  #renameFolder(targetNode) {
    const currentFolderName = targetNode.text.replace('\s+$', '');
    let newFolderName = window.prompt(this.#options.language.confirmFolderNameChange, currentFolderName);
    if (newFolderName === null)
      return;
    newFolderName = newFolderName.replace(/^\s+|\s+$/g, '');
    if (newFolderName === '')
      return void alert(this.#options.language.folderNameRequired);
    this.#treeInstance.rename_node(targetNode, newFolderName);
  }

  /**
   * Returns the names of all child folders.
   *
   * @param  {any}      node Target folder node
   * @return {string[]}      Child folder name.
   */
  #getChildFolders(node) {
    return this.#treeInstance
      .get_json(node)
      .children
      .flatMap(child => ['unselFolder', 'selFolder'].includes(child.type) ? child.text.replace(/\s+$/, '') : []);
  }
}