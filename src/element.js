"use strict";

(function(global) {
  function Element(tagName, props, children) {
    this.tagName = tagName
    this.props = props
    this.children = children

    this.key = props ? props.key : void 0

    // 统计子节点
    let count = 0

    this.children.forEach((child, index) => {
      if(child instanceof Element) {
        count += child.count
      } else {
        child = '' + child  // 文本节点转字符串
      }
      count++
    })

    this.count = count
  }

  Element.prototype.render = function() {
    const el = document.createElement(this.tagName)

    for(let key in this.props) {
      el.setAttribute(key, this.props[key])
    }

    this.children.forEach(child => {
      const childEl = child instanceof Element ? child.render() : document.createTextNode(child);
      el.appendChild(childEl);
    })

    return el
  }

  global.Element = Element

  global.el = function(tagName, props, children) {
    return new Element(tagName, props, children)
  }

})(window)
