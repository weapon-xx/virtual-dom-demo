"use strict";

(function(global) {
  function diff(oldTree, newTree) {
    let index = 0
    let patches = {}
    dfsWalk(oldTree, newTree, index, patches)
    return patches
  }

  function dfsWalk(oldNode, newNode, index, patches) {
    debugger
    let currentPatch = []

    if(newNode === null) {
      //
    } else if(_.isString(oldNode) && _.isString(newNode)) {
      // 节点文本类型
      if(newNode !== oldNode) {
        currentPatch.push({ type: patch.TEXT, content: newNode })
      }
    } else if( oldNode.tagName === newNode.tagName && oldNode.key === newNode.key) {
      // diff props
      let propsPatches = diffProps(oldNode, newNode)
      if(propsPatches) {
        currentPatch.push({ type: patch.PROPS, props: propsPatches })
      }
      // 假如有 ignore 属性则不会进行 diff children
      if(!(newNode.props && newNode.props.hasOwnProperty('ignore'))) {
        diffChildren(oldNode.children, newNode.children, index, patches, currentPatch)
      }
    } else {
      // 节点不一样，用新节点直接替换
      currentPatch.push({ type: patch.REPLACE, node: newNode })
    }

    if(currentPath.length) {
      patches[index] = currentPatch
    }
  }

  function diffChildren(oldChildren, newChildren, index, patches, currentPatch) {
    debugger
    let diffs = listDiff(oldChildren, newChildren, 'key')


  }

  function diffProps(oldNode, newNode) {
    let count = 0
    let oldProps = oldNode.props
    let newProps = newNode.props
    let propPatches = {}

    // 找出不同的属性
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
