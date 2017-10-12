"use strict";

(function(global) {
  function diff(oldTree, newTree) {
    let index = 0       // 节点下标
    let patches = {}    // 所有差异都存在这个对象下
    dfsWalk(oldTree, newTree, index, patches)
    return patches
  }

  function dfsWalk(oldNode, newNode, index, patches) {
    let currentPatch = []   // 每两个对应节点相互比较，所有差异都放在差异数组中

    if(newNode === null) {
      // 假如新节点不存在则不需要做任何事情
    } else if(_.isString(oldNode) && _.isString(newNode)) {
      // 节点文本类型
      if(newNode !== oldNode) {
        currentPatch.push({ type: patch.TEXT, content: newNode })   // 直接使用新节点文本  3
      }
    } else if( oldNode.tagName === newNode.tagName && oldNode.key === newNode.key) {
      // diff props
      let propsPatches = diffProps(oldNode, newNode)      // 属性差异 2
      if(propsPatches) {
        currentPatch.push({ type: patch.PROPS, props: propsPatches })
      }
      // 假如有 ignore 属性则不会进行 diff children
      if(!(newNode.props && newNode.props.hasOwnProperty('ignore'))) {
        diffChildren(oldNode.children, newNode.children, index, patches, currentPatch)
      }
    } else {
      // 节点不一样，用新节点直接替换
      currentPatch.push({ type: patch.REPLACE, node: newNode })   // 替换类型 0
    }

    if(currentPatch.length) {
      patches[index] = currentPatch     // 以下标值（index）作为每个节点差异对象的 key 存入 patches 对象
    }
  }

  function diffChildren(oldChildren, newChildren, index, patches, currentPatch) {
    let diffs = listDiff(oldChildren, newChildren, 'key')  // 对比新旧子节点
    newChildren = diffs.children

    if(diffs.moves.length) {
      currentPatch.push({ type: patch.REORDER, moves: diffs.moves })  // 1 移动/新增类型
    }

    let leftNode = null
    let currentNodeIndex = index

    oldChildren.forEach((child, index) => {
      let newChild = newChildren[index]
      currentNodeIndex = (leftNode && leftNode.count)
      ? currentNodeIndex + leftNode.count + 1
      : currentNodeIndex + 1

      dfsWalk(child, newChild, currentNodeIndex, patches)   // 递归子节点

      leftNode = child    // 将当前节点赋值给 leftNode
    })


  }

  function diffProps(oldNode, newNode) {
    // 节点属性的位置变换没有关系，所以只需要找出，哪些属性值改变（删除）/新增
    let count = 0
    let oldProps = oldNode.props
    let newProps = newNode.props
    let propPatches = {}

    // 找出改变的属性
    for(let key in oldProps) {
      if(newProps[key] !== oldProps[key]) {
        count++
        propPatches[key] = newProps[key]
      }
    }

    // 找出新的属性
    for(let key in newProps) {
      if(!oldProps.hasOwnProperty(key)) {
        count++
        propPatches[key] = newProps[key]
      }
    }

    if(count === 0) {
      return null
    }
    return propPatches
  }

  global.diff = diff
})(window)
