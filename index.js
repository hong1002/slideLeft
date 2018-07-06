const EventUtils = {
  addHandler (element, type, handler) {
      if (element.addEventListener) {
        // 第一次调用初始化
        element.addEventListener(type, handler, false)

        // 第一次之后调用直接使用更改的函数，无返回值，不能使用箭头函数
        this.addHandler = function (element, type, handler) {
          element.addEventListener(type, handler, false)
        }
      } else if (element.attachEvent) {
        element.attachEvent(`on${type}`, handler)

        this.addHandler = function (element, type, handler) {
          element.attachEvent(`on${type}`, handler)
        }
      } else {
        element[`on${type}`] = handler

        this.addHandler = function (element, type, handler) {
          element[`on${type}`] = handler
        }
      }
    },
  removeHandler (element, type, handler) {
    if (element.removeEventListener) {
      element.removeEventListener(type, handler, false)

      this.removeHandler = function (element, type, handler) {
        element.removeEventListener(type, handler, false)
      }
    } else if (element.detachEvent) {
      element.detachEvent(`on${type}`, handler)

      this.removeHandler = function (element, type, handler) {
        element.detachEvent(`on${type}`, handler)
      }
    } else {
      element[`on${type}`] = null
      this.removeHandler = function (element, type, handler) {
        element[`on${type}`] = null
      }
    }
  },
  getEvent (event) {
    if (event) {
      // 第一次调用之后惰性载入
      this.getEvent = event => event

      // 第一次调用使用
      return event
    } else {
      this.getEvent = () => window.event
      return window.event
    }
  },
  preventDefault (event) {
    if (event.preventDefault) {
      event.preventDefault()
    } else {
      event.returnValue = false
    }
  }
}
const Utils = {
  e(selector) {
    return document.querySelector(selector)
  },
  es(selector) {
    return document.querySelectorAll(selector)
  },
  getStyle(element, attr) {
    if (element.currentStyle) {
      return element.currentStyle[attr]
    } else {
      return getComputedStyle(element, null)[attr]
    }
  }
}
const log = console.log.bind(console)
const global = {
  startX: 0,
  movingBlock: '',
  btnWidth: 0
}
var handlerTouchStart = function(event) {
  global.startX = event.touches[0].pageX
  // 拿到当前点击区域的整个模块
  global.movingBlock = event.target.closest('.pro-content')
  let translate = Utils.getStyle(global.movingBlock, 'transform')
  let offsetX = translate.split(',')[4]
  if (offsetX < 0) {
    global.movingBlock.style.transform = 'translateX(0)'
    // 如果删除按钮出现了要阻止后续默认的事件
    EventUtils.preventDefault(event)
  }
}
var handlerTouchMove = function(event) {
  let endX = event.changedTouches[0].pageX
  // 拿到点击的模块的 transform 的偏移量
  let translate = Utils.getStyle(global.movingBlock, 'transform')
  let offsetX = translate.split(',')[4]
  if (endX < global.startX) {
    // 向左移动
    // 如果是向左的偏移量没有超过 btn 的宽度，那么 transform偏移的量加10
    if (offsetX > -Number(global.btnWidth)) {
      offsetX -= 10
    } else {
      offsetX = -Number(global.btnWidth)
    }
    global.movingBlock.style.transform = `translateX(${offsetX}px)`
  } else {
    global.movingBlock.style.transform = 'translateX(0)'
  }
}
var handlerTouchEnd = function(event) {
  console.log('touchend')
  let endX = event.changedTouches[0].pageX
  if (endX - global.startX < -10) {
    // 手指向左滑动，
    let offsetX = -Number(global.btnWidth)
    global.movingBlock.style.transform = `translateX(${offsetX}px)`
  } else {
    // 手指向右滑动，
  }
}
var handlerLoad = function() {
  console.log('加载完成')
  let btn = Utils.e('.delete-btn')
  global.btnWidth = Utils.getStyle(btn, 'width').split('px')[0]
}
var handlerClick = function(event) {
  let block = event.target.closest('.pro-content')
  let content = block.dataset.content
  console.log('click', content)
}
var bindEvent = function () {
  let articles = Utils.es('article')
  articles.forEach(function (div) {
    // 手指接触屏幕
    EventUtils.addHandler(div, 'touchstart', handlerTouchStart)
    // 手指在屏幕上滑动
    EventUtils.addHandler(div, 'touchmove', handlerTouchMove)
    // 手指离开屏幕
    EventUtils.addHandler(div, 'touchend', handlerTouchEnd)
    // click 事件
    EventUtils.addHandler(div, 'click', handlerClick)
  })
  EventUtils.addHandler(window, 'load', handlerLoad)
}


var __main = function() {
  bindEvent()
}
__main()
