var TypeCheckUtil = TypeCheckUtil || {
  isElement: function (element) {
    return element instanceof Element;
  },
  isNode: function (node) {
    return node instanceof Node;
  },
  isFunction: function (func) {
    return typeof func === 'function';
  }
};

var ElementClassNameUtil = ElementClassNameUtil || {
  addClassName: function (element, className) {
    if (!TypeCheckUtil.isNode(element) || !className) throw new TypeError('params Error: except 2: element{Node}, className{String}');
    var oldClassName = element.className.trim();
    if (oldClassName.indexOf(className) >= 0) return false;
    className = oldClassName.length > 0 ? ' ' + className : className;
    element.className = oldClassName + className;
    return true;
  },
  removeClassName: function (element, className) {
    if (!TypeCheckUtil.isNode(element) || !className) throw new TypeError('params Error: except 2: element{Node}, className{String}');
    var oldClassName = element.className.trim();
    if (oldClassName.indexOf(className) < 0) return false;
    element.className = oldClassName.replace(className, '');
    return true;
  },
  include: function (element, className) {
    if (!TypeCheckUtil.isNode(element) || !className) throw new TypeError('params Error: except 2: element{Node}, className{String}');
    return element.className.indexOf(className) >= 0;
  }
};

function isObject(value) {
  const type = typeof value
  return value != null && (type == 'object' || type == 'function')
}

function debounce(func, wait, options) {
  let lastArgs,
    lastThis,
    maxWait,
    result,
    timerId,
    lastCallTime

  let lastInvokeTime = 0
  let leading = false
  let maxing = false
  let trailing = true

  if (typeof func != 'function') {
    throw new TypeError('Expected a function')
  }
  wait = +wait || 0
  if (isObject(options)) {
    leading = !!options.leading
    maxing = 'maxWait' in options
    maxWait = maxing ? Math.max(+options.maxWait || 0, wait) : maxWait
    trailing = 'trailing' in options ? !!options.trailing : trailing
  }

  function invokeFunc(time) {
    const args = lastArgs
    const thisArg = lastThis

    lastArgs = lastThis = undefined
    lastInvokeTime = time
    result = func.apply(thisArg, args)
    return result
  }

  function leadingEdge(time) {
    // Reset any `maxWait` timer.
    lastInvokeTime = time
    // Start the timer for the trailing edge.
    timerId = setTimeout(timerExpired, wait)
    // Invoke the leading edge.
    return leading ? invokeFunc(time) : result
  }

  function remainingWait(time) {
    const timeSinceLastCall = time - lastCallTime
    const timeSinceLastInvoke = time - lastInvokeTime
    const result = wait - timeSinceLastCall

    return maxing ? Math.min(result, maxWait - timeSinceLastInvoke) : result
  }

  function shouldInvoke(time) {
    const timeSinceLastCall = time - lastCallTime
    const timeSinceLastInvoke = time - lastInvokeTime

    // Either this is the first call, activity has stopped and we're at the
    // trailing edge, the system time has gone backwards and we're treating
    // it as the trailing edge, or we've hit the `maxWait` limit.
    return (lastCallTime === undefined || (timeSinceLastCall >= wait) ||
      (timeSinceLastCall < 0) || (maxing && timeSinceLastInvoke >= maxWait))
  }

  function timerExpired() {
    const time = Date.now()
    if (shouldInvoke(time)) {
      return trailingEdge(time)
    }
    // Restart the timer.
    timerId = setTimeout(timerExpired, remainingWait(time))
  }

  function trailingEdge(time) {
    timerId = undefined

    // Only invoke if we have `lastArgs` which means `func` has been
    // debounced at least once.
    if (trailing && lastArgs) {
      return invokeFunc(time)
    }
    lastArgs = lastThis = undefined
    return result
  }

  function cancel() {
    if (timerId !== undefined) {
      clearTimeout(timerId)
    }
    lastInvokeTime = 0
    lastArgs = lastCallTime = lastThis = timerId = undefined
  }

  function flush() {
    return timerId === undefined ? result : trailingEdge(Date.now())
  }

  function debounced(...args) {
    const time = Date.now()
    const isInvoking = shouldInvoke(time)

    lastArgs = args
    lastThis = this
    lastCallTime = time

    if (isInvoking) {
      if (timerId === undefined) {
        return leadingEdge(lastCallTime)
      }
      if (maxing) {
        // Handle invocations in a tight loop.
        timerId = setTimeout(timerExpired, wait)
        return invokeFunc(lastCallTime)
      }
    }
    if (timerId === undefined) {
      timerId = setTimeout(timerExpired, wait)
    }
    return result
  }
  debounced.cancel = cancel
  debounced.flush = flush
  return debounced
}

function throttle(func, wait, options) {
  let leading = true
  let trailing = true

  if (typeof func != 'function') {
    throw new TypeError('Expected a function')
  }
  if (isObject(options)) {
    leading = 'leading' in options ? !!options.leading : leading
    trailing = 'trailing' in options ? !!options.trailing : trailing
  }
  return debounce(func, wait, {
    'leading': leading,
    'maxWait': wait,
    'trailing': trailing
  })
}

export {TypeCheckUtil, ElementClassNameUtil, throttle};
