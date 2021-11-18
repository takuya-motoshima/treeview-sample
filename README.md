# treeview-sample

This is a sample code for JS tree view drawing and operation.

<img src="https://raw.githubusercontent.com/takuya-motoshima/treeview-sample/main/screencaps/tree.png" height="500">

## Installation

Clone the project.  

```sh
git clone https://github.com/takuya-motoshima/treeview-sample.git;
```

Install dependent packages.  

```sh
cd treeview-sample;
npm install;
```

You can try the tree view by accessing the installed directory from your browser.

## Changelog

All notable changes to this project will be documented in this file.


### [1.0.11] - 2021-11-18

- The text of the folder name can now be wrapped, and the folder name tooltip can now be displayed by mouse over.
  <table>
    <thead>
      <tr>
        <th></th>
        <th>New version</th>
        <th>Previous version</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>Display</td>
        <td><img src="https://raw.githubusercontent.com/takuya-motoshima/treeview-sample/main/screencaps/After folder name wrap.png"></td>
        <td><img src="https://raw.githubusercontent.com/takuya-motoshima/treeview-sample/main/screencaps/Before folder name wrap.png"></td>
      </tr>
      <tr>
        <td>Folder DOM element</td>
        <td><img src="https://raw.githubusercontent.com/takuya-motoshima/treeview-sample/main/screencaps/After folder name wrap DOM.png"></td>
        <td><img src="https://raw.githubusercontent.com/takuya-motoshima/treeview-sample/main/screencaps/Before folder name wrap DOM.png"></td>
      </tr>
    </tbody>
  </table>

### [1.0.10] - 2021-11-17
#### Fixed
- Center the text in the context menu.

### [1.0.9] - 2021-11-17
#### Fixed
- Adjusted context menu size and margins.

### [1.0.8] - 2021-11-17
#### Fixed
- Added folder selection method to Tree module.
  ```js
  // Select root folder.
  tree.selectNode('root');
  ```

### [1.0.7] - 2021-11-16
#### Fixed
- Fixed context menu design to improve user interactivity.

### [1.0.6] - 2021-11-15
#### Fixed
- Added a function that returns an array of tree nodes converted to JSON.

### [1.0.5] - 2021-11-12
#### Fixed
- Added an example to change the theme.

### [1.0.4] - 2021-11-12
#### Fixed
- Fixed a bug that the close icon disappears when the folder is closed.

### [1.0.3] - 2021-11-10
#### Fixed
- Fix package .json.

### [1.0.2] - 2021-11-10
#### Fixed
- Fix mergeConfig bug.

### [1.0.1] - 2021-11-10
#### Fixed
- Classify tree JS.

### [1.0.0] - 2021-6-18
#### Fixed
- Released.

## Reference
- [jsTree API](https://www.jstree.com/api/)
- [jstree type definitions](https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/jstree/index.d.ts)

## License

[MIT](LICENSE)