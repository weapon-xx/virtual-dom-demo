"use strict";

(function(global) {
  function Element(tagName, props, children) {
    this.tagName = tagName
    this.props = props
    this.children = children
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


  global.el = function(tagName, props, children) {
    return new Element(tagName, props, children)
  }

})(window)
