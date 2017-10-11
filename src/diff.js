"use strict";

(function(global) {
  function diff(oldTree, newTree) {
    let index = 0
    let patches = {}
    dfsWalk(oldTree, newTree, index, patches)
    return patches
  }

  function dfsWalk(oldNode, newNode, index, patches) {
    // 当前路径？
    let currentPath = []

    if(newNode === null) {

    } else if(_.isString(oldNode) && _.isString(newNode)) {
      if(newNode !== oldNode) {
        currentPatch.push({ type: patch.TEXT, content: newNode })
      }
    } else if( oldNode.tagName === newNode.tagName && oldNode.key === newNode.key) {
      
    }
  }

  function diffChildren() {

  }
})(window)
