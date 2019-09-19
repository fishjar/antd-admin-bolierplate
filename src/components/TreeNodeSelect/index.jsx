import React, { useState, forwardRef } from 'react';
import { Tree } from 'antd';
const { TreeNode } = Tree;

function TreeNodeSelect({ value = [], allMenus = [], onChange }, ref) {
  const handleCheck = e => {
    onChange && onChange(e.checked);
  };

  const buildMenuNode = (menus, pid) =>
    menus
      .filter(item => item.parentId === pid)
      .map(item => (
        <TreeNode title={item.name} key={item.id}>
          {buildMenuNode(menus, item.id)}
        </TreeNode>
      ));

  return (
    <Tree
      defaultExpandAll
      checkStrictly
      checkable
      selectable={false}
      onCheck={handleCheck}
      defaultCheckedKeys={value}
      ref={ref}
    >
      {buildMenuNode(allMenus, null)}
    </Tree>
  );
}

// https://ant.design/components/form-cn/#components-form-demo-customized-form-controls
// https://reactjs.org/docs/forwarding-refs.html
export default forwardRef(TreeNodeSelect);
