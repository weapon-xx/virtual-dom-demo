"use strict";
(function(global) {
  /**
   * Diff two list in O(N).
   * @param {Array} oldList - Original List
   * @param {Array} newList - List After certain insertions, removes, or moves
   * @return {Object} - {moves: <Array>}
   *                  - moves is a list of actions that telling how to remove and insert
   */
  function diff (oldList, newList, key) {
    var oldMap = makeKeyIndexAndFree(oldList, key)    // {keyIndex: {}, free: []}
    var newMap = makeKeyIndexAndFree(newList, key)

    var newFree = newMap.free

    var oldKeyIndex = oldMap.keyIndex
    var newKeyIndex = newMap.keyIndex

    var moves = []  // 需要注意 moves 和 children 对象

    // a simulate list to manipulate
    var children = []
    var i = 0
    var item
    var itemKey
    var freeIndex = 0     // newMap.free 指针

    // fist pass to check item in old list: if it's removed or not  检查当前 item 是否被删除
    while (i < oldList.length) { 1
      item = oldList[i]
      itemKey = getItemKey(item, key)   // 获取 key 属性
      if (itemKey) {
        if (!newKeyIndex.hasOwnProperty(itemKey)) {
          // 如果新列表中不存在，则插入 null 到数组
          children.push(null)
        } else {
          // 如果存在，首先根据 key 找到新列表中节点的 index，然后 push 到数组中
          var newItemIndex = newKeyIndex[itemKey]
          children.push(newList[newItemIndex])
        }
      } else {
        var freeItem = newFree[freeIndex++]
        children.push(freeItem || null)
      }
      i++
    }

    var simulateList = children.slice(0)

    // remove items no longer exist   删除不存在的节点
    i = 0
    while (i < simulateList.length) {
      if (simulateList[i] === null) {
        remove(i)           // 针对于真实 dom 节点
        removeSimulate(i)   // 针对于 simulateList 数组
      } else {
        i++
      }
    }

    // i is cursor pointing to a item in new list       新列表指针
    // j is cursor pointing to a item in simulateList   模拟列表指针
    var j = i = 0
    while (i < newList.length) {
      item = newList[i]
      itemKey = getItemKey(item, key)     // 新列表 item 的 key

      var simulateItem = simulateList[j]
      var simulateItemKey = getItemKey(simulateItem, key)   // 模拟列表 item 的 key
      if (simulateItem) {
        // 假如 key 相同
        if (itemKey === simulateItemKey) {
          j++
        } else {
          // new item, just inesrt it
          if (!oldKeyIndex.hasOwnProperty(itemKey)) {
            insert(i, item)
          } else {
            // if remove current simulateItem make item in right place
            // then just remove it
            var nextItemKey = getItemKey(simulateList[j + 1], key)
            if (nextItemKey === itemKey) {
              remove(i)           // 针对于真实 dom 节点
              removeSimulate(j)   // 针对于 simulateList 数组
              j++    // after removing, current j is right, just jump to next one
            } else {
              // else insert item
              insert(i, item)
            }
          }
        }
      } else {
        // 如果 simulateItem 不存在，则是新增节点直接插入到 moves 中
        insert(i, item)
      }

      i++
    }

    function remove (index) {
      var move = {index: index, type: 0}                // 删除类型
      moves.push(move)
    }

    function insert (index, item) {
      var move = {index: index, item: item, type: 1}    // 插入/新增类型
      moves.push(move)
    }

    function removeSimulate (index) {
      simulateList.splice(index, 1)
    }

    return {
      moves: moves,
      children: children
    }
  }

  /**
   * Convert list to key-item keyIndex object.
   * @param {Array} list
   * @param {String|Function} key
   */
  function makeKeyIndexAndFree (list, key) {
    var keyIndex = {}
    var free = []
    // 遍历列表
    for (var i = 0, len = list.length; i < len; i++) {
      var item = list[i]
      var itemKey = getItemKey(item, key)   // 获取 item 中的 key
      if (itemKey) {
        keyIndex[itemKey] = i    // key 和 index 对应起来，存在 keyIndex 对象
      } else {
        free.push(item)          // 如果 key 不存在的话，push 到 free 数组
      }
    }
    return {
      keyIndex: keyIndex,
      free: free
    }
  }

  function getItemKey (item, key) {
    if (!item || !key) return void 666
    return typeof key === 'string'
      ? item[key]
      : key(item)
  }

  global.listDiff = diff
})(window)
