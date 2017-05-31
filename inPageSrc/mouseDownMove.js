import {TypeCheckUtil, ElementClassNameUtil} from './util';

let _eventListenerInit = Symbol('eventListenerInit'),
  _getMouseDeltaXY = Symbol('getMouseDeltaXY'),
  _checkInMoveTarget = Symbol('checkInMoveTarget'),
  _moveTheTarget = Symbol('moveTheTarget'),
  _triggerMoveListener = Symbol('triggerMoveListener');

class ElementMouseMove {
  constructor(wrapper, mouseTarget, moveTarget) {
    if (!TypeCheckUtil.isNode(wrapper) || !TypeCheckUtil.isNode(mouseTarget) || !TypeCheckUtil.isNode(moveTarget)) {
      throw new TypeError('param error: except 3 params and all param is Node or it\'s sub class');
    }
    this.wrapper = wrapper;
    this.mouseTarget = mouseTarget;
    this.moveTarget = moveTarget;

  // wrapper 属性 需要left，top  moveTarget的暂时不使用，因为这个rect是静态的
    this.wrapperRect = this.wrapper.getBoundingClientRect();

  // 鼠标是否按下
    this.isMoveDown = false;

  // 鼠标按下的位置，方便计算delta x 与 y
    this.mouseDownPoint = {x: 0, y: 0};

  // moveTaregt移动的回调函数
    this.moveCallbackList = [];

    this[_eventListenerInit]();
  }

/**
 * getTopLeft: 返回moveTarget元素距离wrapper元素的左上角的距离(正值)
 * @return {Object} the topLeft delta(Width)
 */
  getTopLeft() {
    var moveTargetRect = this.moveTarget.getBoundingClientRect();
    return {x: moveTargetRect.left, y: moveTargetRect.top};
  }

/**
 * addMoveListenerCallback: 添加移动事件的监听回调函数
 * @param {Function} callback 移动监听回调函数
 * @param {Object}   context  回调函数执行上下文
 */
  addMoveListenerCallback(callback, context) {
    this.moveCallbackList.push({callback: callback, context: context});
  }

/**
 * _triggerMoveListener: 触发所有当前movetarget对象移动的监听器，将当前movetarget相对于wrapper的左上角的位置传给回调{x: , y: }
 *
 */
  [_triggerMoveListener](curPos) {
    this.moveCallbackList.map((item) => item.callback.call(item.context, curPos));
  }

  [_checkInMoveTarget](position) {
    var moveTargetRect = this.moveTarget.getBoundingClientRect();
    if (position.x < moveTargetRect.left || position.x > moveTargetRect.left + moveTargetRect.width || position.y < moveTargetRect.top || position.y > moveTargetRect.top + moveTargetRect.height) { return false; }
    return true;
  }

/**
 * _getMouseDeltaXY: 根据当前鼠标的位置计算鼠标自按下后移动的距离，可负值
 * @return {Object} the detlaX and deltaY
 */
  [_getMouseDeltaXY](curPostion) {
    let delta = {};
    delta.x = curPostion.x - this.mouseDownPoint.x;
    delta.y = curPostion.y - this.mouseDownPoint.y;

    return delta;
  }

  [_moveTheTarget](delta) {
    var rect = this.moveTarget.getBoundingClientRect();
    this.moveTarget.style.left = rect.left + delta.x + 'px';
    this.moveTarget.style.top = rect.top + delta.y + 'px';
  }

/**
 * _eventListenerInit: 初始化事件监听
 */
  [_eventListenerInit]() {
    var self = this;
    this.mouseTarget.addEventListener('mousedown', function (event) {
      if (self[_checkInMoveTarget]({x: event.clientX, y: event.clientY})) {
        // 定制版 start
        self.mouseTarget.style.zIndex = "99999";
        // 定制版 end
        self.isMoveDown = true;
      }
      self.mouseDownPoint.x = event.clientX;
      self.mouseDownPoint.y = event.clientY;
    });

  // 鼠标作用dom上的移动事件监听，注意是否跑出有效区域
    this.mouseTarget.addEventListener('mousemove', function (event) {
      if (!self[_checkInMoveTarget]({x: event.clientX, y: event.clientY})) {  // 跑出有效区域
        return;
      }
      if (!self.isMoveDown) return;
      var delta = self[_getMouseDeltaXY]({x: event.clientX, y: event.clientY + window.scrollY});

    // 1px为一个移动单位，"节流"
      if (Math.abs(delta.x) <= 1 && Math.abs(delta.y) <= 1) return;

    // console.log(delta);
      self[_moveTheTarget](delta);

      self.mouseDownPoint.x = event.clientX;
      self.mouseDownPoint.y = event.clientY;

      self[_triggerMoveListener](self.getTopLeft());
    });

  // 鼠标跑出mouseTarget区域，取消mousedowm
    this.mouseTarget.addEventListener('mouseout', function (event) {
      self.isMoveDown = false;
      // 定制版 start
      self.mouseTarget.style.zIndex = "9999";
      // 定制版 end
    });

    this.mouseTarget.addEventListener('mouseup', function (event) {
      self.isMoveDown = false;
      // 定制版 start
      self.mouseTarget.style.zIndex = "9999";
      // 定制版 end
    });
  }
}

export default ElementMouseMove;
