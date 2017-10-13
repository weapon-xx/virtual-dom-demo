"use strict";

(function(global) {
  global.patchType = {
    REPLACE: 0,  // 替换节点类型
    REORDER: 1,  // 移动、删除、新增子节点(只针对子节点)
    PROPS: 2,    // 修改节点属性
    TEXT: 3      // 修改文本节点
  }

  function patch(node, patches) {
    const walker = {index: 0}
    dfsWalk(node, walker, patches)
  }

  function dfsWalk(node, walker, patches) {
    const currentPatch = patches[walker.index]

    const len = node.childNodes ? node.childNodes.length : 0

    for(let i = 0; i < len; i++) {
      const child = node.childNodes[i]
      walker.index++
      dfsWalk(child, walker, patches)
    }

    if(currentPatch) {
      applyPatches(node, currentPatch)
    }
  }

  function applyPatches(node, currentPatch) {
    currentPatch.forEach(patch => {
      switch(patch.type) {
        case 0:
          // 替换
          const newNode = typeof patch.node === 'object' ? patch.node.render() : document.createTextNode(patch.node)
          node.parentNode.replaceChild(newNode, node)
          break
        case 1:
          // 移动、删除、新增子节点
          reorderChildren(node, patch.moves)
          break
        case 2:
          // 属性
          setProps(node, patch.props)
          break
        default:
          // 文本
          if(node.textContent) {
            node.textContent = patch.content
          } else {
            // 兼容ie
            node.nodeValue = patch.content
          }
      }
    })
  }

  function reorderChildren(node, moves) {
    const staticNodeList = _.toArray(node.childNodes)
    const maps = {}

    // key-node map
    staticNodeList.forEach(node => {
      if(node.nodeType === 1) {
        const key = node.getAttribute('key')
        if(key) {
          map[key] = node
        }
      }
    })

    moves.forEach(move => {
      const index = move.index
      if(move.type === 0) {
        // 删除
        if(staticNodeList[index] === node.childNodes[index]) {
          // 可能被插入操作删除掉了
          node.removeChild(staticNodeList[index])
        }
        staticNodeList.splice(index, 1)                  // 移除 index 节点
      } else if(move.type === 1) {
        // 插入
        const insertNode =  maps[move.item.key] ? maps[move.item.key].cloneNode(true) : (typeof move.item === 'object' ? move.item.render() : document.createTextNode(move.item))
        node.insertBefore(insertNode, node.childNodes[index] || null)
        staticNodeList.splice(index, 0, insertNode)         // 插入 index 节点
      }
    })

  }

  function setProps() {

  }

  global.patch = patch

})(window)
