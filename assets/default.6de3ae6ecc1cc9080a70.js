/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./data/mazes/maze1.json":
/*!*******************************!*\
  !*** ./data/mazes/maze1.json ***!
  \*******************************/
/***/ ((module) => {

"use strict";
module.exports = JSON.parse('{"map":{"width":8,"height":8,"cells":[[1,1,1,1,1,1,1,3],[2,2,2,1,2,2,2,2],[1,1,1,1,1,1,1,1],[2,2,1,2,2,2,2,1],[1,1,1,2,1,2,1,1],[1,2,1,2,1,1,1,2],[1,2,2,2,2,2,1,2],[1,1,1,1,1,1,1,1]]}}');

/***/ }),

/***/ "./node_modules/events/events.js":
/*!***************************************!*\
  !*** ./node_modules/events/events.js ***!
  \***************************************/
/***/ ((module) => {

"use strict";
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.



var R = typeof Reflect === 'object' ? Reflect : null
var ReflectApply = R && typeof R.apply === 'function'
  ? R.apply
  : function ReflectApply(target, receiver, args) {
    return Function.prototype.apply.call(target, receiver, args);
  }

var ReflectOwnKeys
if (R && typeof R.ownKeys === 'function') {
  ReflectOwnKeys = R.ownKeys
} else if (Object.getOwnPropertySymbols) {
  ReflectOwnKeys = function ReflectOwnKeys(target) {
    return Object.getOwnPropertyNames(target)
      .concat(Object.getOwnPropertySymbols(target));
  };
} else {
  ReflectOwnKeys = function ReflectOwnKeys(target) {
    return Object.getOwnPropertyNames(target);
  };
}

function ProcessEmitWarning(warning) {
  if (console && console.warn) console.warn(warning);
}

var NumberIsNaN = Number.isNaN || function NumberIsNaN(value) {
  return value !== value;
}

function EventEmitter() {
  EventEmitter.init.call(this);
}
module.exports = EventEmitter;
module.exports.once = once;

// Backwards-compat with node 0.10.x
EventEmitter.EventEmitter = EventEmitter;

EventEmitter.prototype._events = undefined;
EventEmitter.prototype._eventsCount = 0;
EventEmitter.prototype._maxListeners = undefined;

// By default EventEmitters will print a warning if more than 10 listeners are
// added to it. This is a useful default which helps finding memory leaks.
var defaultMaxListeners = 10;

function checkListener(listener) {
  if (typeof listener !== 'function') {
    throw new TypeError('The "listener" argument must be of type Function. Received type ' + typeof listener);
  }
}

Object.defineProperty(EventEmitter, 'defaultMaxListeners', {
  enumerable: true,
  get: function() {
    return defaultMaxListeners;
  },
  set: function(arg) {
    if (typeof arg !== 'number' || arg < 0 || NumberIsNaN(arg)) {
      throw new RangeError('The value of "defaultMaxListeners" is out of range. It must be a non-negative number. Received ' + arg + '.');
    }
    defaultMaxListeners = arg;
  }
});

EventEmitter.init = function() {

  if (this._events === undefined ||
      this._events === Object.getPrototypeOf(this)._events) {
    this._events = Object.create(null);
    this._eventsCount = 0;
  }

  this._maxListeners = this._maxListeners || undefined;
};

// Obviously not all Emitters should be limited to 10. This function allows
// that to be increased. Set to zero for unlimited.
EventEmitter.prototype.setMaxListeners = function setMaxListeners(n) {
  if (typeof n !== 'number' || n < 0 || NumberIsNaN(n)) {
    throw new RangeError('The value of "n" is out of range. It must be a non-negative number. Received ' + n + '.');
  }
  this._maxListeners = n;
  return this;
};

function _getMaxListeners(that) {
  if (that._maxListeners === undefined)
    return EventEmitter.defaultMaxListeners;
  return that._maxListeners;
}

EventEmitter.prototype.getMaxListeners = function getMaxListeners() {
  return _getMaxListeners(this);
};

EventEmitter.prototype.emit = function emit(type) {
  var args = [];
  for (var i = 1; i < arguments.length; i++) args.push(arguments[i]);
  var doError = (type === 'error');

  var events = this._events;
  if (events !== undefined)
    doError = (doError && events.error === undefined);
  else if (!doError)
    return false;

  // If there is no 'error' event listener then throw.
  if (doError) {
    var er;
    if (args.length > 0)
      er = args[0];
    if (er instanceof Error) {
      // Note: The comments on the `throw` lines are intentional, they show
      // up in Node's output if this results in an unhandled exception.
      throw er; // Unhandled 'error' event
    }
    // At least give some kind of context to the user
    var err = new Error('Unhandled error.' + (er ? ' (' + er.message + ')' : ''));
    err.context = er;
    throw err; // Unhandled 'error' event
  }

  var handler = events[type];

  if (handler === undefined)
    return false;

  if (typeof handler === 'function') {
    ReflectApply(handler, this, args);
  } else {
    var len = handler.length;
    var listeners = arrayClone(handler, len);
    for (var i = 0; i < len; ++i)
      ReflectApply(listeners[i], this, args);
  }

  return true;
};

function _addListener(target, type, listener, prepend) {
  var m;
  var events;
  var existing;

  checkListener(listener);

  events = target._events;
  if (events === undefined) {
    events = target._events = Object.create(null);
    target._eventsCount = 0;
  } else {
    // To avoid recursion in the case that type === "newListener"! Before
    // adding it to the listeners, first emit "newListener".
    if (events.newListener !== undefined) {
      target.emit('newListener', type,
                  listener.listener ? listener.listener : listener);

      // Re-assign `events` because a newListener handler could have caused the
      // this._events to be assigned to a new object
      events = target._events;
    }
    existing = events[type];
  }

  if (existing === undefined) {
    // Optimize the case of one listener. Don't need the extra array object.
    existing = events[type] = listener;
    ++target._eventsCount;
  } else {
    if (typeof existing === 'function') {
      // Adding the second element, need to change to array.
      existing = events[type] =
        prepend ? [listener, existing] : [existing, listener];
      // If we've already got an array, just append.
    } else if (prepend) {
      existing.unshift(listener);
    } else {
      existing.push(listener);
    }

    // Check for listener leak
    m = _getMaxListeners(target);
    if (m > 0 && existing.length > m && !existing.warned) {
      existing.warned = true;
      // No error code for this since it is a Warning
      // eslint-disable-next-line no-restricted-syntax
      var w = new Error('Possible EventEmitter memory leak detected. ' +
                          existing.length + ' ' + String(type) + ' listeners ' +
                          'added. Use emitter.setMaxListeners() to ' +
                          'increase limit');
      w.name = 'MaxListenersExceededWarning';
      w.emitter = target;
      w.type = type;
      w.count = existing.length;
      ProcessEmitWarning(w);
    }
  }

  return target;
}

EventEmitter.prototype.addListener = function addListener(type, listener) {
  return _addListener(this, type, listener, false);
};

EventEmitter.prototype.on = EventEmitter.prototype.addListener;

EventEmitter.prototype.prependListener =
    function prependListener(type, listener) {
      return _addListener(this, type, listener, true);
    };

function onceWrapper() {
  if (!this.fired) {
    this.target.removeListener(this.type, this.wrapFn);
    this.fired = true;
    if (arguments.length === 0)
      return this.listener.call(this.target);
    return this.listener.apply(this.target, arguments);
  }
}

function _onceWrap(target, type, listener) {
  var state = { fired: false, wrapFn: undefined, target: target, type: type, listener: listener };
  var wrapped = onceWrapper.bind(state);
  wrapped.listener = listener;
  state.wrapFn = wrapped;
  return wrapped;
}

EventEmitter.prototype.once = function once(type, listener) {
  checkListener(listener);
  this.on(type, _onceWrap(this, type, listener));
  return this;
};

EventEmitter.prototype.prependOnceListener =
    function prependOnceListener(type, listener) {
      checkListener(listener);
      this.prependListener(type, _onceWrap(this, type, listener));
      return this;
    };

// Emits a 'removeListener' event if and only if the listener was removed.
EventEmitter.prototype.removeListener =
    function removeListener(type, listener) {
      var list, events, position, i, originalListener;

      checkListener(listener);

      events = this._events;
      if (events === undefined)
        return this;

      list = events[type];
      if (list === undefined)
        return this;

      if (list === listener || list.listener === listener) {
        if (--this._eventsCount === 0)
          this._events = Object.create(null);
        else {
          delete events[type];
          if (events.removeListener)
            this.emit('removeListener', type, list.listener || listener);
        }
      } else if (typeof list !== 'function') {
        position = -1;

        for (i = list.length - 1; i >= 0; i--) {
          if (list[i] === listener || list[i].listener === listener) {
            originalListener = list[i].listener;
            position = i;
            break;
          }
        }

        if (position < 0)
          return this;

        if (position === 0)
          list.shift();
        else {
          spliceOne(list, position);
        }

        if (list.length === 1)
          events[type] = list[0];

        if (events.removeListener !== undefined)
          this.emit('removeListener', type, originalListener || listener);
      }

      return this;
    };

EventEmitter.prototype.off = EventEmitter.prototype.removeListener;

EventEmitter.prototype.removeAllListeners =
    function removeAllListeners(type) {
      var listeners, events, i;

      events = this._events;
      if (events === undefined)
        return this;

      // not listening for removeListener, no need to emit
      if (events.removeListener === undefined) {
        if (arguments.length === 0) {
          this._events = Object.create(null);
          this._eventsCount = 0;
        } else if (events[type] !== undefined) {
          if (--this._eventsCount === 0)
            this._events = Object.create(null);
          else
            delete events[type];
        }
        return this;
      }

      // emit removeListener for all listeners on all events
      if (arguments.length === 0) {
        var keys = Object.keys(events);
        var key;
        for (i = 0; i < keys.length; ++i) {
          key = keys[i];
          if (key === 'removeListener') continue;
          this.removeAllListeners(key);
        }
        this.removeAllListeners('removeListener');
        this._events = Object.create(null);
        this._eventsCount = 0;
        return this;
      }

      listeners = events[type];

      if (typeof listeners === 'function') {
        this.removeListener(type, listeners);
      } else if (listeners !== undefined) {
        // LIFO order
        for (i = listeners.length - 1; i >= 0; i--) {
          this.removeListener(type, listeners[i]);
        }
      }

      return this;
    };

function _listeners(target, type, unwrap) {
  var events = target._events;

  if (events === undefined)
    return [];

  var evlistener = events[type];
  if (evlistener === undefined)
    return [];

  if (typeof evlistener === 'function')
    return unwrap ? [evlistener.listener || evlistener] : [evlistener];

  return unwrap ?
    unwrapListeners(evlistener) : arrayClone(evlistener, evlistener.length);
}

EventEmitter.prototype.listeners = function listeners(type) {
  return _listeners(this, type, true);
};

EventEmitter.prototype.rawListeners = function rawListeners(type) {
  return _listeners(this, type, false);
};

EventEmitter.listenerCount = function(emitter, type) {
  if (typeof emitter.listenerCount === 'function') {
    return emitter.listenerCount(type);
  } else {
    return listenerCount.call(emitter, type);
  }
};

EventEmitter.prototype.listenerCount = listenerCount;
function listenerCount(type) {
  var events = this._events;

  if (events !== undefined) {
    var evlistener = events[type];

    if (typeof evlistener === 'function') {
      return 1;
    } else if (evlistener !== undefined) {
      return evlistener.length;
    }
  }

  return 0;
}

EventEmitter.prototype.eventNames = function eventNames() {
  return this._eventsCount > 0 ? ReflectOwnKeys(this._events) : [];
};

function arrayClone(arr, n) {
  var copy = new Array(n);
  for (var i = 0; i < n; ++i)
    copy[i] = arr[i];
  return copy;
}

function spliceOne(list, index) {
  for (; index + 1 < list.length; index++)
    list[index] = list[index + 1];
  list.pop();
}

function unwrapListeners(arr) {
  var ret = new Array(arr.length);
  for (var i = 0; i < ret.length; ++i) {
    ret[i] = arr[i].listener || arr[i];
  }
  return ret;
}

function once(emitter, name) {
  return new Promise(function (resolve, reject) {
    function errorListener(err) {
      emitter.removeListener(name, resolver);
      reject(err);
    }

    function resolver() {
      if (typeof emitter.removeListener === 'function') {
        emitter.removeListener('error', errorListener);
      }
      resolve([].slice.call(arguments));
    };

    eventTargetAgnosticAddListener(emitter, name, resolver, { once: true });
    if (name !== 'error') {
      addErrorHandlerIfEventEmitter(emitter, errorListener, { once: true });
    }
  });
}

function addErrorHandlerIfEventEmitter(emitter, handler, flags) {
  if (typeof emitter.on === 'function') {
    eventTargetAgnosticAddListener(emitter, 'error', handler, flags);
  }
}

function eventTargetAgnosticAddListener(emitter, name, listener, flags) {
  if (typeof emitter.on === 'function') {
    if (flags.once) {
      emitter.once(name, listener);
    } else {
      emitter.on(name, listener);
    }
  } else if (typeof emitter.addEventListener === 'function') {
    // EventTarget does not have `error` event semantics like Node
    // EventEmitters, we do not listen for `error` events here.
    emitter.addEventListener(name, function wrapListener(arg) {
      // IE does not have builtin `{ once: true }` support so we
      // have to do it manually.
      if (flags.once) {
        emitter.removeEventListener(name, wrapListener);
      }
      listener(arg);
    });
  } else {
    throw new TypeError('The "emitter" argument must be of type EventEmitter. Received type ' + typeof emitter);
  }
}


/***/ }),

/***/ "./node_modules/js-yaml/index.js":
/*!***************************************!*\
  !*** ./node_modules/js-yaml/index.js ***!
  \***************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";



var loader = __webpack_require__(/*! ./lib/loader */ "./node_modules/js-yaml/lib/loader.js");
var dumper = __webpack_require__(/*! ./lib/dumper */ "./node_modules/js-yaml/lib/dumper.js");


function renamed(from, to) {
  return function () {
    throw new Error('Function yaml.' + from + ' is removed in js-yaml 4. ' +
      'Use yaml.' + to + ' instead, which is now safe by default.');
  };
}


module.exports.Type = __webpack_require__(/*! ./lib/type */ "./node_modules/js-yaml/lib/type.js");
module.exports.Schema = __webpack_require__(/*! ./lib/schema */ "./node_modules/js-yaml/lib/schema.js");
module.exports.FAILSAFE_SCHEMA = __webpack_require__(/*! ./lib/schema/failsafe */ "./node_modules/js-yaml/lib/schema/failsafe.js");
module.exports.JSON_SCHEMA = __webpack_require__(/*! ./lib/schema/json */ "./node_modules/js-yaml/lib/schema/json.js");
module.exports.CORE_SCHEMA = __webpack_require__(/*! ./lib/schema/core */ "./node_modules/js-yaml/lib/schema/core.js");
module.exports.DEFAULT_SCHEMA = __webpack_require__(/*! ./lib/schema/default */ "./node_modules/js-yaml/lib/schema/default.js");
module.exports.load                = loader.load;
module.exports.loadAll             = loader.loadAll;
module.exports.dump                = dumper.dump;
module.exports.YAMLException = __webpack_require__(/*! ./lib/exception */ "./node_modules/js-yaml/lib/exception.js");

// Re-export all types in case user wants to create custom schema
module.exports.types = {
  binary:    __webpack_require__(/*! ./lib/type/binary */ "./node_modules/js-yaml/lib/type/binary.js"),
  float:     __webpack_require__(/*! ./lib/type/float */ "./node_modules/js-yaml/lib/type/float.js"),
  map:       __webpack_require__(/*! ./lib/type/map */ "./node_modules/js-yaml/lib/type/map.js"),
  null:      __webpack_require__(/*! ./lib/type/null */ "./node_modules/js-yaml/lib/type/null.js"),
  pairs:     __webpack_require__(/*! ./lib/type/pairs */ "./node_modules/js-yaml/lib/type/pairs.js"),
  set:       __webpack_require__(/*! ./lib/type/set */ "./node_modules/js-yaml/lib/type/set.js"),
  timestamp: __webpack_require__(/*! ./lib/type/timestamp */ "./node_modules/js-yaml/lib/type/timestamp.js"),
  bool:      __webpack_require__(/*! ./lib/type/bool */ "./node_modules/js-yaml/lib/type/bool.js"),
  int:       __webpack_require__(/*! ./lib/type/int */ "./node_modules/js-yaml/lib/type/int.js"),
  merge:     __webpack_require__(/*! ./lib/type/merge */ "./node_modules/js-yaml/lib/type/merge.js"),
  omap:      __webpack_require__(/*! ./lib/type/omap */ "./node_modules/js-yaml/lib/type/omap.js"),
  seq:       __webpack_require__(/*! ./lib/type/seq */ "./node_modules/js-yaml/lib/type/seq.js"),
  str:       __webpack_require__(/*! ./lib/type/str */ "./node_modules/js-yaml/lib/type/str.js")
};

// Removed functions from JS-YAML 3.0.x
module.exports.safeLoad            = renamed('safeLoad', 'load');
module.exports.safeLoadAll         = renamed('safeLoadAll', 'loadAll');
module.exports.safeDump            = renamed('safeDump', 'dump');


/***/ }),

/***/ "./node_modules/js-yaml/lib/common.js":
/*!********************************************!*\
  !*** ./node_modules/js-yaml/lib/common.js ***!
  \********************************************/
/***/ ((module) => {

"use strict";



function isNothing(subject) {
  return (typeof subject === 'undefined') || (subject === null);
}


function isObject(subject) {
  return (typeof subject === 'object') && (subject !== null);
}


function toArray(sequence) {
  if (Array.isArray(sequence)) return sequence;
  else if (isNothing(sequence)) return [];

  return [ sequence ];
}


function extend(target, source) {
  var index, length, key, sourceKeys;

  if (source) {
    sourceKeys = Object.keys(source);

    for (index = 0, length = sourceKeys.length; index < length; index += 1) {
      key = sourceKeys[index];
      target[key] = source[key];
    }
  }

  return target;
}


function repeat(string, count) {
  var result = '', cycle;

  for (cycle = 0; cycle < count; cycle += 1) {
    result += string;
  }

  return result;
}


function isNegativeZero(number) {
  return (number === 0) && (Number.NEGATIVE_INFINITY === 1 / number);
}


module.exports.isNothing      = isNothing;
module.exports.isObject       = isObject;
module.exports.toArray        = toArray;
module.exports.repeat         = repeat;
module.exports.isNegativeZero = isNegativeZero;
module.exports.extend         = extend;


/***/ }),

/***/ "./node_modules/js-yaml/lib/dumper.js":
/*!********************************************!*\
  !*** ./node_modules/js-yaml/lib/dumper.js ***!
  \********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


/*eslint-disable no-use-before-define*/

var common              = __webpack_require__(/*! ./common */ "./node_modules/js-yaml/lib/common.js");
var YAMLException       = __webpack_require__(/*! ./exception */ "./node_modules/js-yaml/lib/exception.js");
var DEFAULT_SCHEMA      = __webpack_require__(/*! ./schema/default */ "./node_modules/js-yaml/lib/schema/default.js");

var _toString       = Object.prototype.toString;
var _hasOwnProperty = Object.prototype.hasOwnProperty;

var CHAR_BOM                  = 0xFEFF;
var CHAR_TAB                  = 0x09; /* Tab */
var CHAR_LINE_FEED            = 0x0A; /* LF */
var CHAR_CARRIAGE_RETURN      = 0x0D; /* CR */
var CHAR_SPACE                = 0x20; /* Space */
var CHAR_EXCLAMATION          = 0x21; /* ! */
var CHAR_DOUBLE_QUOTE         = 0x22; /* " */
var CHAR_SHARP                = 0x23; /* # */
var CHAR_PERCENT              = 0x25; /* % */
var CHAR_AMPERSAND            = 0x26; /* & */
var CHAR_SINGLE_QUOTE         = 0x27; /* ' */
var CHAR_ASTERISK             = 0x2A; /* * */
var CHAR_COMMA                = 0x2C; /* , */
var CHAR_MINUS                = 0x2D; /* - */
var CHAR_COLON                = 0x3A; /* : */
var CHAR_EQUALS               = 0x3D; /* = */
var CHAR_GREATER_THAN         = 0x3E; /* > */
var CHAR_QUESTION             = 0x3F; /* ? */
var CHAR_COMMERCIAL_AT        = 0x40; /* @ */
var CHAR_LEFT_SQUARE_BRACKET  = 0x5B; /* [ */
var CHAR_RIGHT_SQUARE_BRACKET = 0x5D; /* ] */
var CHAR_GRAVE_ACCENT         = 0x60; /* ` */
var CHAR_LEFT_CURLY_BRACKET   = 0x7B; /* { */
var CHAR_VERTICAL_LINE        = 0x7C; /* | */
var CHAR_RIGHT_CURLY_BRACKET  = 0x7D; /* } */

var ESCAPE_SEQUENCES = {};

ESCAPE_SEQUENCES[0x00]   = '\\0';
ESCAPE_SEQUENCES[0x07]   = '\\a';
ESCAPE_SEQUENCES[0x08]   = '\\b';
ESCAPE_SEQUENCES[0x09]   = '\\t';
ESCAPE_SEQUENCES[0x0A]   = '\\n';
ESCAPE_SEQUENCES[0x0B]   = '\\v';
ESCAPE_SEQUENCES[0x0C]   = '\\f';
ESCAPE_SEQUENCES[0x0D]   = '\\r';
ESCAPE_SEQUENCES[0x1B]   = '\\e';
ESCAPE_SEQUENCES[0x22]   = '\\"';
ESCAPE_SEQUENCES[0x5C]   = '\\\\';
ESCAPE_SEQUENCES[0x85]   = '\\N';
ESCAPE_SEQUENCES[0xA0]   = '\\_';
ESCAPE_SEQUENCES[0x2028] = '\\L';
ESCAPE_SEQUENCES[0x2029] = '\\P';

var DEPRECATED_BOOLEANS_SYNTAX = [
  'y', 'Y', 'yes', 'Yes', 'YES', 'on', 'On', 'ON',
  'n', 'N', 'no', 'No', 'NO', 'off', 'Off', 'OFF'
];

var DEPRECATED_BASE60_SYNTAX = /^[-+]?[0-9_]+(?::[0-9_]+)+(?:\.[0-9_]*)?$/;

function compileStyleMap(schema, map) {
  var result, keys, index, length, tag, style, type;

  if (map === null) return {};

  result = {};
  keys = Object.keys(map);

  for (index = 0, length = keys.length; index < length; index += 1) {
    tag = keys[index];
    style = String(map[tag]);

    if (tag.slice(0, 2) === '!!') {
      tag = 'tag:yaml.org,2002:' + tag.slice(2);
    }
    type = schema.compiledTypeMap['fallback'][tag];

    if (type && _hasOwnProperty.call(type.styleAliases, style)) {
      style = type.styleAliases[style];
    }

    result[tag] = style;
  }

  return result;
}

function encodeHex(character) {
  var string, handle, length;

  string = character.toString(16).toUpperCase();

  if (character <= 0xFF) {
    handle = 'x';
    length = 2;
  } else if (character <= 0xFFFF) {
    handle = 'u';
    length = 4;
  } else if (character <= 0xFFFFFFFF) {
    handle = 'U';
    length = 8;
  } else {
    throw new YAMLException('code point within a string may not be greater than 0xFFFFFFFF');
  }

  return '\\' + handle + common.repeat('0', length - string.length) + string;
}


var QUOTING_TYPE_SINGLE = 1,
    QUOTING_TYPE_DOUBLE = 2;

function State(options) {
  this.schema        = options['schema'] || DEFAULT_SCHEMA;
  this.indent        = Math.max(1, (options['indent'] || 2));
  this.noArrayIndent = options['noArrayIndent'] || false;
  this.skipInvalid   = options['skipInvalid'] || false;
  this.flowLevel     = (common.isNothing(options['flowLevel']) ? -1 : options['flowLevel']);
  this.styleMap      = compileStyleMap(this.schema, options['styles'] || null);
  this.sortKeys      = options['sortKeys'] || false;
  this.lineWidth     = options['lineWidth'] || 80;
  this.noRefs        = options['noRefs'] || false;
  this.noCompatMode  = options['noCompatMode'] || false;
  this.condenseFlow  = options['condenseFlow'] || false;
  this.quotingType   = options['quotingType'] === '"' ? QUOTING_TYPE_DOUBLE : QUOTING_TYPE_SINGLE;
  this.forceQuotes   = options['forceQuotes'] || false;
  this.replacer      = typeof options['replacer'] === 'function' ? options['replacer'] : null;

  this.implicitTypes = this.schema.compiledImplicit;
  this.explicitTypes = this.schema.compiledExplicit;

  this.tag = null;
  this.result = '';

  this.duplicates = [];
  this.usedDuplicates = null;
}

// Indents every line in a string. Empty lines (\n only) are not indented.
function indentString(string, spaces) {
  var ind = common.repeat(' ', spaces),
      position = 0,
      next = -1,
      result = '',
      line,
      length = string.length;

  while (position < length) {
    next = string.indexOf('\n', position);
    if (next === -1) {
      line = string.slice(position);
      position = length;
    } else {
      line = string.slice(position, next + 1);
      position = next + 1;
    }

    if (line.length && line !== '\n') result += ind;

    result += line;
  }

  return result;
}

function generateNextLine(state, level) {
  return '\n' + common.repeat(' ', state.indent * level);
}

function testImplicitResolving(state, str) {
  var index, length, type;

  for (index = 0, length = state.implicitTypes.length; index < length; index += 1) {
    type = state.implicitTypes[index];

    if (type.resolve(str)) {
      return true;
    }
  }

  return false;
}

// [33] s-white ::= s-space | s-tab
function isWhitespace(c) {
  return c === CHAR_SPACE || c === CHAR_TAB;
}

// Returns true if the character can be printed without escaping.
// From YAML 1.2: "any allowed characters known to be non-printable
// should also be escaped. [However,] This isn’t mandatory"
// Derived from nb-char - \t - #x85 - #xA0 - #x2028 - #x2029.
function isPrintable(c) {
  return  (0x00020 <= c && c <= 0x00007E)
      || ((0x000A1 <= c && c <= 0x00D7FF) && c !== 0x2028 && c !== 0x2029)
      || ((0x0E000 <= c && c <= 0x00FFFD) && c !== CHAR_BOM)
      ||  (0x10000 <= c && c <= 0x10FFFF);
}

// [34] ns-char ::= nb-char - s-white
// [27] nb-char ::= c-printable - b-char - c-byte-order-mark
// [26] b-char  ::= b-line-feed | b-carriage-return
// Including s-white (for some reason, examples doesn't match specs in this aspect)
// ns-char ::= c-printable - b-line-feed - b-carriage-return - c-byte-order-mark
function isNsCharOrWhitespace(c) {
  return isPrintable(c)
    && c !== CHAR_BOM
    // - b-char
    && c !== CHAR_CARRIAGE_RETURN
    && c !== CHAR_LINE_FEED;
}

// [127]  ns-plain-safe(c) ::= c = flow-out  ⇒ ns-plain-safe-out
//                             c = flow-in   ⇒ ns-plain-safe-in
//                             c = block-key ⇒ ns-plain-safe-out
//                             c = flow-key  ⇒ ns-plain-safe-in
// [128] ns-plain-safe-out ::= ns-char
// [129]  ns-plain-safe-in ::= ns-char - c-flow-indicator
// [130]  ns-plain-char(c) ::=  ( ns-plain-safe(c) - “:” - “#” )
//                            | ( /* An ns-char preceding */ “#” )
//                            | ( “:” /* Followed by an ns-plain-safe(c) */ )
function isPlainSafe(c, prev, inblock) {
  var cIsNsCharOrWhitespace = isNsCharOrWhitespace(c);
  var cIsNsChar = cIsNsCharOrWhitespace && !isWhitespace(c);
  return (
    // ns-plain-safe
    inblock ? // c = flow-in
      cIsNsCharOrWhitespace
      : cIsNsCharOrWhitespace
        // - c-flow-indicator
        && c !== CHAR_COMMA
        && c !== CHAR_LEFT_SQUARE_BRACKET
        && c !== CHAR_RIGHT_SQUARE_BRACKET
        && c !== CHAR_LEFT_CURLY_BRACKET
        && c !== CHAR_RIGHT_CURLY_BRACKET
  )
    // ns-plain-char
    && c !== CHAR_SHARP // false on '#'
    && !(prev === CHAR_COLON && !cIsNsChar) // false on ': '
    || (isNsCharOrWhitespace(prev) && !isWhitespace(prev) && c === CHAR_SHARP) // change to true on '[^ ]#'
    || (prev === CHAR_COLON && cIsNsChar); // change to true on ':[^ ]'
}

// Simplified test for values allowed as the first character in plain style.
function isPlainSafeFirst(c) {
  // Uses a subset of ns-char - c-indicator
  // where ns-char = nb-char - s-white.
  // No support of ( ( “?” | “:” | “-” ) /* Followed by an ns-plain-safe(c)) */ ) part
  return isPrintable(c) && c !== CHAR_BOM
    && !isWhitespace(c) // - s-white
    // - (c-indicator ::=
    // “-” | “?” | “:” | “,” | “[” | “]” | “{” | “}”
    && c !== CHAR_MINUS
    && c !== CHAR_QUESTION
    && c !== CHAR_COLON
    && c !== CHAR_COMMA
    && c !== CHAR_LEFT_SQUARE_BRACKET
    && c !== CHAR_RIGHT_SQUARE_BRACKET
    && c !== CHAR_LEFT_CURLY_BRACKET
    && c !== CHAR_RIGHT_CURLY_BRACKET
    // | “#” | “&” | “*” | “!” | “|” | “=” | “>” | “'” | “"”
    && c !== CHAR_SHARP
    && c !== CHAR_AMPERSAND
    && c !== CHAR_ASTERISK
    && c !== CHAR_EXCLAMATION
    && c !== CHAR_VERTICAL_LINE
    && c !== CHAR_EQUALS
    && c !== CHAR_GREATER_THAN
    && c !== CHAR_SINGLE_QUOTE
    && c !== CHAR_DOUBLE_QUOTE
    // | “%” | “@” | “`”)
    && c !== CHAR_PERCENT
    && c !== CHAR_COMMERCIAL_AT
    && c !== CHAR_GRAVE_ACCENT;
}

// Simplified test for values allowed as the last character in plain style.
function isPlainSafeLast(c) {
  // just not whitespace or colon, it will be checked to be plain character later
  return !isWhitespace(c) && c !== CHAR_COLON;
}

// Same as 'string'.codePointAt(pos), but works in older browsers.
function codePointAt(string, pos) {
  var first = string.charCodeAt(pos), second;
  if (first >= 0xD800 && first <= 0xDBFF && pos + 1 < string.length) {
    second = string.charCodeAt(pos + 1);
    if (second >= 0xDC00 && second <= 0xDFFF) {
      // https://mathiasbynens.be/notes/javascript-encoding#surrogate-formulae
      return (first - 0xD800) * 0x400 + second - 0xDC00 + 0x10000;
    }
  }
  return first;
}

// Determines whether block indentation indicator is required.
function needIndentIndicator(string) {
  var leadingSpaceRe = /^\n* /;
  return leadingSpaceRe.test(string);
}

var STYLE_PLAIN   = 1,
    STYLE_SINGLE  = 2,
    STYLE_LITERAL = 3,
    STYLE_FOLDED  = 4,
    STYLE_DOUBLE  = 5;

// Determines which scalar styles are possible and returns the preferred style.
// lineWidth = -1 => no limit.
// Pre-conditions: str.length > 0.
// Post-conditions:
//    STYLE_PLAIN or STYLE_SINGLE => no \n are in the string.
//    STYLE_LITERAL => no lines are suitable for folding (or lineWidth is -1).
//    STYLE_FOLDED => a line > lineWidth and can be folded (and lineWidth != -1).
function chooseScalarStyle(string, singleLineOnly, indentPerLevel, lineWidth,
  testAmbiguousType, quotingType, forceQuotes, inblock) {

  var i;
  var char = 0;
  var prevChar = null;
  var hasLineBreak = false;
  var hasFoldableLine = false; // only checked if shouldTrackWidth
  var shouldTrackWidth = lineWidth !== -1;
  var previousLineBreak = -1; // count the first line correctly
  var plain = isPlainSafeFirst(codePointAt(string, 0))
          && isPlainSafeLast(codePointAt(string, string.length - 1));

  if (singleLineOnly || forceQuotes) {
    // Case: no block styles.
    // Check for disallowed characters to rule out plain and single.
    for (i = 0; i < string.length; char >= 0x10000 ? i += 2 : i++) {
      char = codePointAt(string, i);
      if (!isPrintable(char)) {
        return STYLE_DOUBLE;
      }
      plain = plain && isPlainSafe(char, prevChar, inblock);
      prevChar = char;
    }
  } else {
    // Case: block styles permitted.
    for (i = 0; i < string.length; char >= 0x10000 ? i += 2 : i++) {
      char = codePointAt(string, i);
      if (char === CHAR_LINE_FEED) {
        hasLineBreak = true;
        // Check if any line can be folded.
        if (shouldTrackWidth) {
          hasFoldableLine = hasFoldableLine ||
            // Foldable line = too long, and not more-indented.
            (i - previousLineBreak - 1 > lineWidth &&
             string[previousLineBreak + 1] !== ' ');
          previousLineBreak = i;
        }
      } else if (!isPrintable(char)) {
        return STYLE_DOUBLE;
      }
      plain = plain && isPlainSafe(char, prevChar, inblock);
      prevChar = char;
    }
    // in case the end is missing a \n
    hasFoldableLine = hasFoldableLine || (shouldTrackWidth &&
      (i - previousLineBreak - 1 > lineWidth &&
       string[previousLineBreak + 1] !== ' '));
  }
  // Although every style can represent \n without escaping, prefer block styles
  // for multiline, since they're more readable and they don't add empty lines.
  // Also prefer folding a super-long line.
  if (!hasLineBreak && !hasFoldableLine) {
    // Strings interpretable as another type have to be quoted;
    // e.g. the string 'true' vs. the boolean true.
    if (plain && !forceQuotes && !testAmbiguousType(string)) {
      return STYLE_PLAIN;
    }
    return quotingType === QUOTING_TYPE_DOUBLE ? STYLE_DOUBLE : STYLE_SINGLE;
  }
  // Edge case: block indentation indicator can only have one digit.
  if (indentPerLevel > 9 && needIndentIndicator(string)) {
    return STYLE_DOUBLE;
  }
  // At this point we know block styles are valid.
  // Prefer literal style unless we want to fold.
  if (!forceQuotes) {
    return hasFoldableLine ? STYLE_FOLDED : STYLE_LITERAL;
  }
  return quotingType === QUOTING_TYPE_DOUBLE ? STYLE_DOUBLE : STYLE_SINGLE;
}

// Note: line breaking/folding is implemented for only the folded style.
// NB. We drop the last trailing newline (if any) of a returned block scalar
//  since the dumper adds its own newline. This always works:
//    • No ending newline => unaffected; already using strip "-" chomping.
//    • Ending newline    => removed then restored.
//  Importantly, this keeps the "+" chomp indicator from gaining an extra line.
function writeScalar(state, string, level, iskey, inblock) {
  state.dump = (function () {
    if (string.length === 0) {
      return state.quotingType === QUOTING_TYPE_DOUBLE ? '""' : "''";
    }
    if (!state.noCompatMode) {
      if (DEPRECATED_BOOLEANS_SYNTAX.indexOf(string) !== -1 || DEPRECATED_BASE60_SYNTAX.test(string)) {
        return state.quotingType === QUOTING_TYPE_DOUBLE ? ('"' + string + '"') : ("'" + string + "'");
      }
    }

    var indent = state.indent * Math.max(1, level); // no 0-indent scalars
    // As indentation gets deeper, let the width decrease monotonically
    // to the lower bound min(state.lineWidth, 40).
    // Note that this implies
    //  state.lineWidth ≤ 40 + state.indent: width is fixed at the lower bound.
    //  state.lineWidth > 40 + state.indent: width decreases until the lower bound.
    // This behaves better than a constant minimum width which disallows narrower options,
    // or an indent threshold which causes the width to suddenly increase.
    var lineWidth = state.lineWidth === -1
      ? -1 : Math.max(Math.min(state.lineWidth, 40), state.lineWidth - indent);

    // Without knowing if keys are implicit/explicit, assume implicit for safety.
    var singleLineOnly = iskey
      // No block styles in flow mode.
      || (state.flowLevel > -1 && level >= state.flowLevel);
    function testAmbiguity(string) {
      return testImplicitResolving(state, string);
    }

    switch (chooseScalarStyle(string, singleLineOnly, state.indent, lineWidth,
      testAmbiguity, state.quotingType, state.forceQuotes && !iskey, inblock)) {

      case STYLE_PLAIN:
        return string;
      case STYLE_SINGLE:
        return "'" + string.replace(/'/g, "''") + "'";
      case STYLE_LITERAL:
        return '|' + blockHeader(string, state.indent)
          + dropEndingNewline(indentString(string, indent));
      case STYLE_FOLDED:
        return '>' + blockHeader(string, state.indent)
          + dropEndingNewline(indentString(foldString(string, lineWidth), indent));
      case STYLE_DOUBLE:
        return '"' + escapeString(string, lineWidth) + '"';
      default:
        throw new YAMLException('impossible error: invalid scalar style');
    }
  }());
}

// Pre-conditions: string is valid for a block scalar, 1 <= indentPerLevel <= 9.
function blockHeader(string, indentPerLevel) {
  var indentIndicator = needIndentIndicator(string) ? String(indentPerLevel) : '';

  // note the special case: the string '\n' counts as a "trailing" empty line.
  var clip =          string[string.length - 1] === '\n';
  var keep = clip && (string[string.length - 2] === '\n' || string === '\n');
  var chomp = keep ? '+' : (clip ? '' : '-');

  return indentIndicator + chomp + '\n';
}

// (See the note for writeScalar.)
function dropEndingNewline(string) {
  return string[string.length - 1] === '\n' ? string.slice(0, -1) : string;
}

// Note: a long line without a suitable break point will exceed the width limit.
// Pre-conditions: every char in str isPrintable, str.length > 0, width > 0.
function foldString(string, width) {
  // In folded style, $k$ consecutive newlines output as $k+1$ newlines—
  // unless they're before or after a more-indented line, or at the very
  // beginning or end, in which case $k$ maps to $k$.
  // Therefore, parse each chunk as newline(s) followed by a content line.
  var lineRe = /(\n+)([^\n]*)/g;

  // first line (possibly an empty line)
  var result = (function () {
    var nextLF = string.indexOf('\n');
    nextLF = nextLF !== -1 ? nextLF : string.length;
    lineRe.lastIndex = nextLF;
    return foldLine(string.slice(0, nextLF), width);
  }());
  // If we haven't reached the first content line yet, don't add an extra \n.
  var prevMoreIndented = string[0] === '\n' || string[0] === ' ';
  var moreIndented;

  // rest of the lines
  var match;
  while ((match = lineRe.exec(string))) {
    var prefix = match[1], line = match[2];
    moreIndented = (line[0] === ' ');
    result += prefix
      + (!prevMoreIndented && !moreIndented && line !== ''
        ? '\n' : '')
      + foldLine(line, width);
    prevMoreIndented = moreIndented;
  }

  return result;
}

// Greedy line breaking.
// Picks the longest line under the limit each time,
// otherwise settles for the shortest line over the limit.
// NB. More-indented lines *cannot* be folded, as that would add an extra \n.
function foldLine(line, width) {
  if (line === '' || line[0] === ' ') return line;

  // Since a more-indented line adds a \n, breaks can't be followed by a space.
  var breakRe = / [^ ]/g; // note: the match index will always be <= length-2.
  var match;
  // start is an inclusive index. end, curr, and next are exclusive.
  var start = 0, end, curr = 0, next = 0;
  var result = '';

  // Invariants: 0 <= start <= length-1.
  //   0 <= curr <= next <= max(0, length-2). curr - start <= width.
  // Inside the loop:
  //   A match implies length >= 2, so curr and next are <= length-2.
  while ((match = breakRe.exec(line))) {
    next = match.index;
    // maintain invariant: curr - start <= width
    if (next - start > width) {
      end = (curr > start) ? curr : next; // derive end <= length-2
      result += '\n' + line.slice(start, end);
      // skip the space that was output as \n
      start = end + 1;                    // derive start <= length-1
    }
    curr = next;
  }

  // By the invariants, start <= length-1, so there is something left over.
  // It is either the whole string or a part starting from non-whitespace.
  result += '\n';
  // Insert a break if the remainder is too long and there is a break available.
  if (line.length - start > width && curr > start) {
    result += line.slice(start, curr) + '\n' + line.slice(curr + 1);
  } else {
    result += line.slice(start);
  }

  return result.slice(1); // drop extra \n joiner
}

// Escapes a double-quoted string.
function escapeString(string) {
  var result = '';
  var char = 0;
  var escapeSeq;

  for (var i = 0; i < string.length; char >= 0x10000 ? i += 2 : i++) {
    char = codePointAt(string, i);
    escapeSeq = ESCAPE_SEQUENCES[char];

    if (!escapeSeq && isPrintable(char)) {
      result += string[i];
      if (char >= 0x10000) result += string[i + 1];
    } else {
      result += escapeSeq || encodeHex(char);
    }
  }

  return result;
}

function writeFlowSequence(state, level, object) {
  var _result = '',
      _tag    = state.tag,
      index,
      length,
      value;

  for (index = 0, length = object.length; index < length; index += 1) {
    value = object[index];

    if (state.replacer) {
      value = state.replacer.call(object, String(index), value);
    }

    // Write only valid elements, put null instead of invalid elements.
    if (writeNode(state, level, value, false, false) ||
        (typeof value === 'undefined' &&
         writeNode(state, level, null, false, false))) {

      if (_result !== '') _result += ',' + (!state.condenseFlow ? ' ' : '');
      _result += state.dump;
    }
  }

  state.tag = _tag;
  state.dump = '[' + _result + ']';
}

function writeBlockSequence(state, level, object, compact) {
  var _result = '',
      _tag    = state.tag,
      index,
      length,
      value;

  for (index = 0, length = object.length; index < length; index += 1) {
    value = object[index];

    if (state.replacer) {
      value = state.replacer.call(object, String(index), value);
    }

    // Write only valid elements, put null instead of invalid elements.
    if (writeNode(state, level + 1, value, true, true, false, true) ||
        (typeof value === 'undefined' &&
         writeNode(state, level + 1, null, true, true, false, true))) {

      if (!compact || _result !== '') {
        _result += generateNextLine(state, level);
      }

      if (state.dump && CHAR_LINE_FEED === state.dump.charCodeAt(0)) {
        _result += '-';
      } else {
        _result += '- ';
      }

      _result += state.dump;
    }
  }

  state.tag = _tag;
  state.dump = _result || '[]'; // Empty sequence if no valid values.
}

function writeFlowMapping(state, level, object) {
  var _result       = '',
      _tag          = state.tag,
      objectKeyList = Object.keys(object),
      index,
      length,
      objectKey,
      objectValue,
      pairBuffer;

  for (index = 0, length = objectKeyList.length; index < length; index += 1) {

    pairBuffer = '';
    if (_result !== '') pairBuffer += ', ';

    if (state.condenseFlow) pairBuffer += '"';

    objectKey = objectKeyList[index];
    objectValue = object[objectKey];

    if (state.replacer) {
      objectValue = state.replacer.call(object, objectKey, objectValue);
    }

    if (!writeNode(state, level, objectKey, false, false)) {
      continue; // Skip this pair because of invalid key;
    }

    if (state.dump.length > 1024) pairBuffer += '? ';

    pairBuffer += state.dump + (state.condenseFlow ? '"' : '') + ':' + (state.condenseFlow ? '' : ' ');

    if (!writeNode(state, level, objectValue, false, false)) {
      continue; // Skip this pair because of invalid value.
    }

    pairBuffer += state.dump;

    // Both key and value are valid.
    _result += pairBuffer;
  }

  state.tag = _tag;
  state.dump = '{' + _result + '}';
}

function writeBlockMapping(state, level, object, compact) {
  var _result       = '',
      _tag          = state.tag,
      objectKeyList = Object.keys(object),
      index,
      length,
      objectKey,
      objectValue,
      explicitPair,
      pairBuffer;

  // Allow sorting keys so that the output file is deterministic
  if (state.sortKeys === true) {
    // Default sorting
    objectKeyList.sort();
  } else if (typeof state.sortKeys === 'function') {
    // Custom sort function
    objectKeyList.sort(state.sortKeys);
  } else if (state.sortKeys) {
    // Something is wrong
    throw new YAMLException('sortKeys must be a boolean or a function');
  }

  for (index = 0, length = objectKeyList.length; index < length; index += 1) {
    pairBuffer = '';

    if (!compact || _result !== '') {
      pairBuffer += generateNextLine(state, level);
    }

    objectKey = objectKeyList[index];
    objectValue = object[objectKey];

    if (state.replacer) {
      objectValue = state.replacer.call(object, objectKey, objectValue);
    }

    if (!writeNode(state, level + 1, objectKey, true, true, true)) {
      continue; // Skip this pair because of invalid key.
    }

    explicitPair = (state.tag !== null && state.tag !== '?') ||
                   (state.dump && state.dump.length > 1024);

    if (explicitPair) {
      if (state.dump && CHAR_LINE_FEED === state.dump.charCodeAt(0)) {
        pairBuffer += '?';
      } else {
        pairBuffer += '? ';
      }
    }

    pairBuffer += state.dump;

    if (explicitPair) {
      pairBuffer += generateNextLine(state, level);
    }

    if (!writeNode(state, level + 1, objectValue, true, explicitPair)) {
      continue; // Skip this pair because of invalid value.
    }

    if (state.dump && CHAR_LINE_FEED === state.dump.charCodeAt(0)) {
      pairBuffer += ':';
    } else {
      pairBuffer += ': ';
    }

    pairBuffer += state.dump;

    // Both key and value are valid.
    _result += pairBuffer;
  }

  state.tag = _tag;
  state.dump = _result || '{}'; // Empty mapping if no valid pairs.
}

function detectType(state, object, explicit) {
  var _result, typeList, index, length, type, style;

  typeList = explicit ? state.explicitTypes : state.implicitTypes;

  for (index = 0, length = typeList.length; index < length; index += 1) {
    type = typeList[index];

    if ((type.instanceOf  || type.predicate) &&
        (!type.instanceOf || ((typeof object === 'object') && (object instanceof type.instanceOf))) &&
        (!type.predicate  || type.predicate(object))) {

      if (explicit) {
        if (type.multi && type.representName) {
          state.tag = type.representName(object);
        } else {
          state.tag = type.tag;
        }
      } else {
        state.tag = '?';
      }

      if (type.represent) {
        style = state.styleMap[type.tag] || type.defaultStyle;

        if (_toString.call(type.represent) === '[object Function]') {
          _result = type.represent(object, style);
        } else if (_hasOwnProperty.call(type.represent, style)) {
          _result = type.represent[style](object, style);
        } else {
          throw new YAMLException('!<' + type.tag + '> tag resolver accepts not "' + style + '" style');
        }

        state.dump = _result;
      }

      return true;
    }
  }

  return false;
}

// Serializes `object` and writes it to global `result`.
// Returns true on success, or false on invalid object.
//
function writeNode(state, level, object, block, compact, iskey, isblockseq) {
  state.tag = null;
  state.dump = object;

  if (!detectType(state, object, false)) {
    detectType(state, object, true);
  }

  var type = _toString.call(state.dump);
  var inblock = block;
  var tagStr;

  if (block) {
    block = (state.flowLevel < 0 || state.flowLevel > level);
  }

  var objectOrArray = type === '[object Object]' || type === '[object Array]',
      duplicateIndex,
      duplicate;

  if (objectOrArray) {
    duplicateIndex = state.duplicates.indexOf(object);
    duplicate = duplicateIndex !== -1;
  }

  if ((state.tag !== null && state.tag !== '?') || duplicate || (state.indent !== 2 && level > 0)) {
    compact = false;
  }

  if (duplicate && state.usedDuplicates[duplicateIndex]) {
    state.dump = '*ref_' + duplicateIndex;
  } else {
    if (objectOrArray && duplicate && !state.usedDuplicates[duplicateIndex]) {
      state.usedDuplicates[duplicateIndex] = true;
    }
    if (type === '[object Object]') {
      if (block && (Object.keys(state.dump).length !== 0)) {
        writeBlockMapping(state, level, state.dump, compact);
        if (duplicate) {
          state.dump = '&ref_' + duplicateIndex + state.dump;
        }
      } else {
        writeFlowMapping(state, level, state.dump);
        if (duplicate) {
          state.dump = '&ref_' + duplicateIndex + ' ' + state.dump;
        }
      }
    } else if (type === '[object Array]') {
      if (block && (state.dump.length !== 0)) {
        if (state.noArrayIndent && !isblockseq && level > 0) {
          writeBlockSequence(state, level - 1, state.dump, compact);
        } else {
          writeBlockSequence(state, level, state.dump, compact);
        }
        if (duplicate) {
          state.dump = '&ref_' + duplicateIndex + state.dump;
        }
      } else {
        writeFlowSequence(state, level, state.dump);
        if (duplicate) {
          state.dump = '&ref_' + duplicateIndex + ' ' + state.dump;
        }
      }
    } else if (type === '[object String]') {
      if (state.tag !== '?') {
        writeScalar(state, state.dump, level, iskey, inblock);
      }
    } else if (type === '[object Undefined]') {
      return false;
    } else {
      if (state.skipInvalid) return false;
      throw new YAMLException('unacceptable kind of an object to dump ' + type);
    }

    if (state.tag !== null && state.tag !== '?') {
      // Need to encode all characters except those allowed by the spec:
      //
      // [35] ns-dec-digit    ::=  [#x30-#x39] /* 0-9 */
      // [36] ns-hex-digit    ::=  ns-dec-digit
      //                         | [#x41-#x46] /* A-F */ | [#x61-#x66] /* a-f */
      // [37] ns-ascii-letter ::=  [#x41-#x5A] /* A-Z */ | [#x61-#x7A] /* a-z */
      // [38] ns-word-char    ::=  ns-dec-digit | ns-ascii-letter | “-”
      // [39] ns-uri-char     ::=  “%” ns-hex-digit ns-hex-digit | ns-word-char | “#”
      //                         | “;” | “/” | “?” | “:” | “@” | “&” | “=” | “+” | “$” | “,”
      //                         | “_” | “.” | “!” | “~” | “*” | “'” | “(” | “)” | “[” | “]”
      //
      // Also need to encode '!' because it has special meaning (end of tag prefix).
      //
      tagStr = encodeURI(
        state.tag[0] === '!' ? state.tag.slice(1) : state.tag
      ).replace(/!/g, '%21');

      if (state.tag[0] === '!') {
        tagStr = '!' + tagStr;
      } else if (tagStr.slice(0, 18) === 'tag:yaml.org,2002:') {
        tagStr = '!!' + tagStr.slice(18);
      } else {
        tagStr = '!<' + tagStr + '>';
      }

      state.dump = tagStr + ' ' + state.dump;
    }
  }

  return true;
}

function getDuplicateReferences(object, state) {
  var objects = [],
      duplicatesIndexes = [],
      index,
      length;

  inspectNode(object, objects, duplicatesIndexes);

  for (index = 0, length = duplicatesIndexes.length; index < length; index += 1) {
    state.duplicates.push(objects[duplicatesIndexes[index]]);
  }
  state.usedDuplicates = new Array(length);
}

function inspectNode(object, objects, duplicatesIndexes) {
  var objectKeyList,
      index,
      length;

  if (object !== null && typeof object === 'object') {
    index = objects.indexOf(object);
    if (index !== -1) {
      if (duplicatesIndexes.indexOf(index) === -1) {
        duplicatesIndexes.push(index);
      }
    } else {
      objects.push(object);

      if (Array.isArray(object)) {
        for (index = 0, length = object.length; index < length; index += 1) {
          inspectNode(object[index], objects, duplicatesIndexes);
        }
      } else {
        objectKeyList = Object.keys(object);

        for (index = 0, length = objectKeyList.length; index < length; index += 1) {
          inspectNode(object[objectKeyList[index]], objects, duplicatesIndexes);
        }
      }
    }
  }
}

function dump(input, options) {
  options = options || {};

  var state = new State(options);

  if (!state.noRefs) getDuplicateReferences(input, state);

  var value = input;

  if (state.replacer) {
    value = state.replacer.call({ '': value }, '', value);
  }

  if (writeNode(state, 0, value, true, true)) return state.dump + '\n';

  return '';
}

module.exports.dump = dump;


/***/ }),

/***/ "./node_modules/js-yaml/lib/exception.js":
/*!***********************************************!*\
  !*** ./node_modules/js-yaml/lib/exception.js ***!
  \***********************************************/
/***/ ((module) => {

"use strict";
// YAML error class. http://stackoverflow.com/questions/8458984
//



function formatError(exception, compact) {
  var where = '', message = exception.reason || '(unknown reason)';

  if (!exception.mark) return message;

  if (exception.mark.name) {
    where += 'in "' + exception.mark.name + '" ';
  }

  where += '(' + (exception.mark.line + 1) + ':' + (exception.mark.column + 1) + ')';

  if (!compact && exception.mark.snippet) {
    where += '\n\n' + exception.mark.snippet;
  }

  return message + ' ' + where;
}


function YAMLException(reason, mark) {
  // Super constructor
  Error.call(this);

  this.name = 'YAMLException';
  this.reason = reason;
  this.mark = mark;
  this.message = formatError(this, false);

  // Include stack trace in error object
  if (Error.captureStackTrace) {
    // Chrome and NodeJS
    Error.captureStackTrace(this, this.constructor);
  } else {
    // FF, IE 10+ and Safari 6+. Fallback for others
    this.stack = (new Error()).stack || '';
  }
}


// Inherit from Error
YAMLException.prototype = Object.create(Error.prototype);
YAMLException.prototype.constructor = YAMLException;


YAMLException.prototype.toString = function toString(compact) {
  return this.name + ': ' + formatError(this, compact);
};


module.exports = YAMLException;


/***/ }),

/***/ "./node_modules/js-yaml/lib/loader.js":
/*!********************************************!*\
  !*** ./node_modules/js-yaml/lib/loader.js ***!
  \********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


/*eslint-disable max-len,no-use-before-define*/

var common              = __webpack_require__(/*! ./common */ "./node_modules/js-yaml/lib/common.js");
var YAMLException       = __webpack_require__(/*! ./exception */ "./node_modules/js-yaml/lib/exception.js");
var makeSnippet         = __webpack_require__(/*! ./snippet */ "./node_modules/js-yaml/lib/snippet.js");
var DEFAULT_SCHEMA      = __webpack_require__(/*! ./schema/default */ "./node_modules/js-yaml/lib/schema/default.js");


var _hasOwnProperty = Object.prototype.hasOwnProperty;


var CONTEXT_FLOW_IN   = 1;
var CONTEXT_FLOW_OUT  = 2;
var CONTEXT_BLOCK_IN  = 3;
var CONTEXT_BLOCK_OUT = 4;


var CHOMPING_CLIP  = 1;
var CHOMPING_STRIP = 2;
var CHOMPING_KEEP  = 3;


var PATTERN_NON_PRINTABLE         = /[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x84\x86-\x9F\uFFFE\uFFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]/;
var PATTERN_NON_ASCII_LINE_BREAKS = /[\x85\u2028\u2029]/;
var PATTERN_FLOW_INDICATORS       = /[,\[\]\{\}]/;
var PATTERN_TAG_HANDLE            = /^(?:!|!!|![a-z\-]+!)$/i;
var PATTERN_TAG_URI               = /^(?:!|[^,\[\]\{\}])(?:%[0-9a-f]{2}|[0-9a-z\-#;\/\?:@&=\+\$,_\.!~\*'\(\)\[\]])*$/i;


function _class(obj) { return Object.prototype.toString.call(obj); }

function is_EOL(c) {
  return (c === 0x0A/* LF */) || (c === 0x0D/* CR */);
}

function is_WHITE_SPACE(c) {
  return (c === 0x09/* Tab */) || (c === 0x20/* Space */);
}

function is_WS_OR_EOL(c) {
  return (c === 0x09/* Tab */) ||
         (c === 0x20/* Space */) ||
         (c === 0x0A/* LF */) ||
         (c === 0x0D/* CR */);
}

function is_FLOW_INDICATOR(c) {
  return c === 0x2C/* , */ ||
         c === 0x5B/* [ */ ||
         c === 0x5D/* ] */ ||
         c === 0x7B/* { */ ||
         c === 0x7D/* } */;
}

function fromHexCode(c) {
  var lc;

  if ((0x30/* 0 */ <= c) && (c <= 0x39/* 9 */)) {
    return c - 0x30;
  }

  /*eslint-disable no-bitwise*/
  lc = c | 0x20;

  if ((0x61/* a */ <= lc) && (lc <= 0x66/* f */)) {
    return lc - 0x61 + 10;
  }

  return -1;
}

function escapedHexLen(c) {
  if (c === 0x78/* x */) { return 2; }
  if (c === 0x75/* u */) { return 4; }
  if (c === 0x55/* U */) { return 8; }
  return 0;
}

function fromDecimalCode(c) {
  if ((0x30/* 0 */ <= c) && (c <= 0x39/* 9 */)) {
    return c - 0x30;
  }

  return -1;
}

function simpleEscapeSequence(c) {
  /* eslint-disable indent */
  return (c === 0x30/* 0 */) ? '\x00' :
        (c === 0x61/* a */) ? '\x07' :
        (c === 0x62/* b */) ? '\x08' :
        (c === 0x74/* t */) ? '\x09' :
        (c === 0x09/* Tab */) ? '\x09' :
        (c === 0x6E/* n */) ? '\x0A' :
        (c === 0x76/* v */) ? '\x0B' :
        (c === 0x66/* f */) ? '\x0C' :
        (c === 0x72/* r */) ? '\x0D' :
        (c === 0x65/* e */) ? '\x1B' :
        (c === 0x20/* Space */) ? ' ' :
        (c === 0x22/* " */) ? '\x22' :
        (c === 0x2F/* / */) ? '/' :
        (c === 0x5C/* \ */) ? '\x5C' :
        (c === 0x4E/* N */) ? '\x85' :
        (c === 0x5F/* _ */) ? '\xA0' :
        (c === 0x4C/* L */) ? '\u2028' :
        (c === 0x50/* P */) ? '\u2029' : '';
}

function charFromCodepoint(c) {
  if (c <= 0xFFFF) {
    return String.fromCharCode(c);
  }
  // Encode UTF-16 surrogate pair
  // https://en.wikipedia.org/wiki/UTF-16#Code_points_U.2B010000_to_U.2B10FFFF
  return String.fromCharCode(
    ((c - 0x010000) >> 10) + 0xD800,
    ((c - 0x010000) & 0x03FF) + 0xDC00
  );
}

var simpleEscapeCheck = new Array(256); // integer, for fast access
var simpleEscapeMap = new Array(256);
for (var i = 0; i < 256; i++) {
  simpleEscapeCheck[i] = simpleEscapeSequence(i) ? 1 : 0;
  simpleEscapeMap[i] = simpleEscapeSequence(i);
}


function State(input, options) {
  this.input = input;

  this.filename  = options['filename']  || null;
  this.schema    = options['schema']    || DEFAULT_SCHEMA;
  this.onWarning = options['onWarning'] || null;
  // (Hidden) Remove? makes the loader to expect YAML 1.1 documents
  // if such documents have no explicit %YAML directive
  this.legacy    = options['legacy']    || false;

  this.json      = options['json']      || false;
  this.listener  = options['listener']  || null;

  this.implicitTypes = this.schema.compiledImplicit;
  this.typeMap       = this.schema.compiledTypeMap;

  this.length     = input.length;
  this.position   = 0;
  this.line       = 0;
  this.lineStart  = 0;
  this.lineIndent = 0;

  // position of first leading tab in the current line,
  // used to make sure there are no tabs in the indentation
  this.firstTabInLine = -1;

  this.documents = [];

  /*
  this.version;
  this.checkLineBreaks;
  this.tagMap;
  this.anchorMap;
  this.tag;
  this.anchor;
  this.kind;
  this.result;*/

}


function generateError(state, message) {
  var mark = {
    name:     state.filename,
    buffer:   state.input.slice(0, -1), // omit trailing \0
    position: state.position,
    line:     state.line,
    column:   state.position - state.lineStart
  };

  mark.snippet = makeSnippet(mark);

  return new YAMLException(message, mark);
}

function throwError(state, message) {
  throw generateError(state, message);
}

function throwWarning(state, message) {
  if (state.onWarning) {
    state.onWarning.call(null, generateError(state, message));
  }
}


var directiveHandlers = {

  YAML: function handleYamlDirective(state, name, args) {

    var match, major, minor;

    if (state.version !== null) {
      throwError(state, 'duplication of %YAML directive');
    }

    if (args.length !== 1) {
      throwError(state, 'YAML directive accepts exactly one argument');
    }

    match = /^([0-9]+)\.([0-9]+)$/.exec(args[0]);

    if (match === null) {
      throwError(state, 'ill-formed argument of the YAML directive');
    }

    major = parseInt(match[1], 10);
    minor = parseInt(match[2], 10);

    if (major !== 1) {
      throwError(state, 'unacceptable YAML version of the document');
    }

    state.version = args[0];
    state.checkLineBreaks = (minor < 2);

    if (minor !== 1 && minor !== 2) {
      throwWarning(state, 'unsupported YAML version of the document');
    }
  },

  TAG: function handleTagDirective(state, name, args) {

    var handle, prefix;

    if (args.length !== 2) {
      throwError(state, 'TAG directive accepts exactly two arguments');
    }

    handle = args[0];
    prefix = args[1];

    if (!PATTERN_TAG_HANDLE.test(handle)) {
      throwError(state, 'ill-formed tag handle (first argument) of the TAG directive');
    }

    if (_hasOwnProperty.call(state.tagMap, handle)) {
      throwError(state, 'there is a previously declared suffix for "' + handle + '" tag handle');
    }

    if (!PATTERN_TAG_URI.test(prefix)) {
      throwError(state, 'ill-formed tag prefix (second argument) of the TAG directive');
    }

    try {
      prefix = decodeURIComponent(prefix);
    } catch (err) {
      throwError(state, 'tag prefix is malformed: ' + prefix);
    }

    state.tagMap[handle] = prefix;
  }
};


function captureSegment(state, start, end, checkJson) {
  var _position, _length, _character, _result;

  if (start < end) {
    _result = state.input.slice(start, end);

    if (checkJson) {
      for (_position = 0, _length = _result.length; _position < _length; _position += 1) {
        _character = _result.charCodeAt(_position);
        if (!(_character === 0x09 ||
              (0x20 <= _character && _character <= 0x10FFFF))) {
          throwError(state, 'expected valid JSON character');
        }
      }
    } else if (PATTERN_NON_PRINTABLE.test(_result)) {
      throwError(state, 'the stream contains non-printable characters');
    }

    state.result += _result;
  }
}

function mergeMappings(state, destination, source, overridableKeys) {
  var sourceKeys, key, index, quantity;

  if (!common.isObject(source)) {
    throwError(state, 'cannot merge mappings; the provided source object is unacceptable');
  }

  sourceKeys = Object.keys(source);

  for (index = 0, quantity = sourceKeys.length; index < quantity; index += 1) {
    key = sourceKeys[index];

    if (!_hasOwnProperty.call(destination, key)) {
      destination[key] = source[key];
      overridableKeys[key] = true;
    }
  }
}

function storeMappingPair(state, _result, overridableKeys, keyTag, keyNode, valueNode,
  startLine, startLineStart, startPos) {

  var index, quantity;

  // The output is a plain object here, so keys can only be strings.
  // We need to convert keyNode to a string, but doing so can hang the process
  // (deeply nested arrays that explode exponentially using aliases).
  if (Array.isArray(keyNode)) {
    keyNode = Array.prototype.slice.call(keyNode);

    for (index = 0, quantity = keyNode.length; index < quantity; index += 1) {
      if (Array.isArray(keyNode[index])) {
        throwError(state, 'nested arrays are not supported inside keys');
      }

      if (typeof keyNode === 'object' && _class(keyNode[index]) === '[object Object]') {
        keyNode[index] = '[object Object]';
      }
    }
  }

  // Avoid code execution in load() via toString property
  // (still use its own toString for arrays, timestamps,
  // and whatever user schema extensions happen to have @@toStringTag)
  if (typeof keyNode === 'object' && _class(keyNode) === '[object Object]') {
    keyNode = '[object Object]';
  }


  keyNode = String(keyNode);

  if (_result === null) {
    _result = {};
  }

  if (keyTag === 'tag:yaml.org,2002:merge') {
    if (Array.isArray(valueNode)) {
      for (index = 0, quantity = valueNode.length; index < quantity; index += 1) {
        mergeMappings(state, _result, valueNode[index], overridableKeys);
      }
    } else {
      mergeMappings(state, _result, valueNode, overridableKeys);
    }
  } else {
    if (!state.json &&
        !_hasOwnProperty.call(overridableKeys, keyNode) &&
        _hasOwnProperty.call(_result, keyNode)) {
      state.line = startLine || state.line;
      state.lineStart = startLineStart || state.lineStart;
      state.position = startPos || state.position;
      throwError(state, 'duplicated mapping key');
    }

    // used for this specific key only because Object.defineProperty is slow
    if (keyNode === '__proto__') {
      Object.defineProperty(_result, keyNode, {
        configurable: true,
        enumerable: true,
        writable: true,
        value: valueNode
      });
    } else {
      _result[keyNode] = valueNode;
    }
    delete overridableKeys[keyNode];
  }

  return _result;
}

function readLineBreak(state) {
  var ch;

  ch = state.input.charCodeAt(state.position);

  if (ch === 0x0A/* LF */) {
    state.position++;
  } else if (ch === 0x0D/* CR */) {
    state.position++;
    if (state.input.charCodeAt(state.position) === 0x0A/* LF */) {
      state.position++;
    }
  } else {
    throwError(state, 'a line break is expected');
  }

  state.line += 1;
  state.lineStart = state.position;
  state.firstTabInLine = -1;
}

function skipSeparationSpace(state, allowComments, checkIndent) {
  var lineBreaks = 0,
      ch = state.input.charCodeAt(state.position);

  while (ch !== 0) {
    while (is_WHITE_SPACE(ch)) {
      if (ch === 0x09/* Tab */ && state.firstTabInLine === -1) {
        state.firstTabInLine = state.position;
      }
      ch = state.input.charCodeAt(++state.position);
    }

    if (allowComments && ch === 0x23/* # */) {
      do {
        ch = state.input.charCodeAt(++state.position);
      } while (ch !== 0x0A/* LF */ && ch !== 0x0D/* CR */ && ch !== 0);
    }

    if (is_EOL(ch)) {
      readLineBreak(state);

      ch = state.input.charCodeAt(state.position);
      lineBreaks++;
      state.lineIndent = 0;

      while (ch === 0x20/* Space */) {
        state.lineIndent++;
        ch = state.input.charCodeAt(++state.position);
      }
    } else {
      break;
    }
  }

  if (checkIndent !== -1 && lineBreaks !== 0 && state.lineIndent < checkIndent) {
    throwWarning(state, 'deficient indentation');
  }

  return lineBreaks;
}

function testDocumentSeparator(state) {
  var _position = state.position,
      ch;

  ch = state.input.charCodeAt(_position);

  // Condition state.position === state.lineStart is tested
  // in parent on each call, for efficiency. No needs to test here again.
  if ((ch === 0x2D/* - */ || ch === 0x2E/* . */) &&
      ch === state.input.charCodeAt(_position + 1) &&
      ch === state.input.charCodeAt(_position + 2)) {

    _position += 3;

    ch = state.input.charCodeAt(_position);

    if (ch === 0 || is_WS_OR_EOL(ch)) {
      return true;
    }
  }

  return false;
}

function writeFoldedLines(state, count) {
  if (count === 1) {
    state.result += ' ';
  } else if (count > 1) {
    state.result += common.repeat('\n', count - 1);
  }
}


function readPlainScalar(state, nodeIndent, withinFlowCollection) {
  var preceding,
      following,
      captureStart,
      captureEnd,
      hasPendingContent,
      _line,
      _lineStart,
      _lineIndent,
      _kind = state.kind,
      _result = state.result,
      ch;

  ch = state.input.charCodeAt(state.position);

  if (is_WS_OR_EOL(ch)      ||
      is_FLOW_INDICATOR(ch) ||
      ch === 0x23/* # */    ||
      ch === 0x26/* & */    ||
      ch === 0x2A/* * */    ||
      ch === 0x21/* ! */    ||
      ch === 0x7C/* | */    ||
      ch === 0x3E/* > */    ||
      ch === 0x27/* ' */    ||
      ch === 0x22/* " */    ||
      ch === 0x25/* % */    ||
      ch === 0x40/* @ */    ||
      ch === 0x60/* ` */) {
    return false;
  }

  if (ch === 0x3F/* ? */ || ch === 0x2D/* - */) {
    following = state.input.charCodeAt(state.position + 1);

    if (is_WS_OR_EOL(following) ||
        withinFlowCollection && is_FLOW_INDICATOR(following)) {
      return false;
    }
  }

  state.kind = 'scalar';
  state.result = '';
  captureStart = captureEnd = state.position;
  hasPendingContent = false;

  while (ch !== 0) {
    if (ch === 0x3A/* : */) {
      following = state.input.charCodeAt(state.position + 1);

      if (is_WS_OR_EOL(following) ||
          withinFlowCollection && is_FLOW_INDICATOR(following)) {
        break;
      }

    } else if (ch === 0x23/* # */) {
      preceding = state.input.charCodeAt(state.position - 1);

      if (is_WS_OR_EOL(preceding)) {
        break;
      }

    } else if ((state.position === state.lineStart && testDocumentSeparator(state)) ||
               withinFlowCollection && is_FLOW_INDICATOR(ch)) {
      break;

    } else if (is_EOL(ch)) {
      _line = state.line;
      _lineStart = state.lineStart;
      _lineIndent = state.lineIndent;
      skipSeparationSpace(state, false, -1);

      if (state.lineIndent >= nodeIndent) {
        hasPendingContent = true;
        ch = state.input.charCodeAt(state.position);
        continue;
      } else {
        state.position = captureEnd;
        state.line = _line;
        state.lineStart = _lineStart;
        state.lineIndent = _lineIndent;
        break;
      }
    }

    if (hasPendingContent) {
      captureSegment(state, captureStart, captureEnd, false);
      writeFoldedLines(state, state.line - _line);
      captureStart = captureEnd = state.position;
      hasPendingContent = false;
    }

    if (!is_WHITE_SPACE(ch)) {
      captureEnd = state.position + 1;
    }

    ch = state.input.charCodeAt(++state.position);
  }

  captureSegment(state, captureStart, captureEnd, false);

  if (state.result) {
    return true;
  }

  state.kind = _kind;
  state.result = _result;
  return false;
}

function readSingleQuotedScalar(state, nodeIndent) {
  var ch,
      captureStart, captureEnd;

  ch = state.input.charCodeAt(state.position);

  if (ch !== 0x27/* ' */) {
    return false;
  }

  state.kind = 'scalar';
  state.result = '';
  state.position++;
  captureStart = captureEnd = state.position;

  while ((ch = state.input.charCodeAt(state.position)) !== 0) {
    if (ch === 0x27/* ' */) {
      captureSegment(state, captureStart, state.position, true);
      ch = state.input.charCodeAt(++state.position);

      if (ch === 0x27/* ' */) {
        captureStart = state.position;
        state.position++;
        captureEnd = state.position;
      } else {
        return true;
      }

    } else if (is_EOL(ch)) {
      captureSegment(state, captureStart, captureEnd, true);
      writeFoldedLines(state, skipSeparationSpace(state, false, nodeIndent));
      captureStart = captureEnd = state.position;

    } else if (state.position === state.lineStart && testDocumentSeparator(state)) {
      throwError(state, 'unexpected end of the document within a single quoted scalar');

    } else {
      state.position++;
      captureEnd = state.position;
    }
  }

  throwError(state, 'unexpected end of the stream within a single quoted scalar');
}

function readDoubleQuotedScalar(state, nodeIndent) {
  var captureStart,
      captureEnd,
      hexLength,
      hexResult,
      tmp,
      ch;

  ch = state.input.charCodeAt(state.position);

  if (ch !== 0x22/* " */) {
    return false;
  }

  state.kind = 'scalar';
  state.result = '';
  state.position++;
  captureStart = captureEnd = state.position;

  while ((ch = state.input.charCodeAt(state.position)) !== 0) {
    if (ch === 0x22/* " */) {
      captureSegment(state, captureStart, state.position, true);
      state.position++;
      return true;

    } else if (ch === 0x5C/* \ */) {
      captureSegment(state, captureStart, state.position, true);
      ch = state.input.charCodeAt(++state.position);

      if (is_EOL(ch)) {
        skipSeparationSpace(state, false, nodeIndent);

        // TODO: rework to inline fn with no type cast?
      } else if (ch < 256 && simpleEscapeCheck[ch]) {
        state.result += simpleEscapeMap[ch];
        state.position++;

      } else if ((tmp = escapedHexLen(ch)) > 0) {
        hexLength = tmp;
        hexResult = 0;

        for (; hexLength > 0; hexLength--) {
          ch = state.input.charCodeAt(++state.position);

          if ((tmp = fromHexCode(ch)) >= 0) {
            hexResult = (hexResult << 4) + tmp;

          } else {
            throwError(state, 'expected hexadecimal character');
          }
        }

        state.result += charFromCodepoint(hexResult);

        state.position++;

      } else {
        throwError(state, 'unknown escape sequence');
      }

      captureStart = captureEnd = state.position;

    } else if (is_EOL(ch)) {
      captureSegment(state, captureStart, captureEnd, true);
      writeFoldedLines(state, skipSeparationSpace(state, false, nodeIndent));
      captureStart = captureEnd = state.position;

    } else if (state.position === state.lineStart && testDocumentSeparator(state)) {
      throwError(state, 'unexpected end of the document within a double quoted scalar');

    } else {
      state.position++;
      captureEnd = state.position;
    }
  }

  throwError(state, 'unexpected end of the stream within a double quoted scalar');
}

function readFlowCollection(state, nodeIndent) {
  var readNext = true,
      _line,
      _lineStart,
      _pos,
      _tag     = state.tag,
      _result,
      _anchor  = state.anchor,
      following,
      terminator,
      isPair,
      isExplicitPair,
      isMapping,
      overridableKeys = Object.create(null),
      keyNode,
      keyTag,
      valueNode,
      ch;

  ch = state.input.charCodeAt(state.position);

  if (ch === 0x5B/* [ */) {
    terminator = 0x5D;/* ] */
    isMapping = false;
    _result = [];
  } else if (ch === 0x7B/* { */) {
    terminator = 0x7D;/* } */
    isMapping = true;
    _result = {};
  } else {
    return false;
  }

  if (state.anchor !== null) {
    state.anchorMap[state.anchor] = _result;
  }

  ch = state.input.charCodeAt(++state.position);

  while (ch !== 0) {
    skipSeparationSpace(state, true, nodeIndent);

    ch = state.input.charCodeAt(state.position);

    if (ch === terminator) {
      state.position++;
      state.tag = _tag;
      state.anchor = _anchor;
      state.kind = isMapping ? 'mapping' : 'sequence';
      state.result = _result;
      return true;
    } else if (!readNext) {
      throwError(state, 'missed comma between flow collection entries');
    } else if (ch === 0x2C/* , */) {
      // "flow collection entries can never be completely empty", as per YAML 1.2, section 7.4
      throwError(state, "expected the node content, but found ','");
    }

    keyTag = keyNode = valueNode = null;
    isPair = isExplicitPair = false;

    if (ch === 0x3F/* ? */) {
      following = state.input.charCodeAt(state.position + 1);

      if (is_WS_OR_EOL(following)) {
        isPair = isExplicitPair = true;
        state.position++;
        skipSeparationSpace(state, true, nodeIndent);
      }
    }

    _line = state.line; // Save the current line.
    _lineStart = state.lineStart;
    _pos = state.position;
    composeNode(state, nodeIndent, CONTEXT_FLOW_IN, false, true);
    keyTag = state.tag;
    keyNode = state.result;
    skipSeparationSpace(state, true, nodeIndent);

    ch = state.input.charCodeAt(state.position);

    if ((isExplicitPair || state.line === _line) && ch === 0x3A/* : */) {
      isPair = true;
      ch = state.input.charCodeAt(++state.position);
      skipSeparationSpace(state, true, nodeIndent);
      composeNode(state, nodeIndent, CONTEXT_FLOW_IN, false, true);
      valueNode = state.result;
    }

    if (isMapping) {
      storeMappingPair(state, _result, overridableKeys, keyTag, keyNode, valueNode, _line, _lineStart, _pos);
    } else if (isPair) {
      _result.push(storeMappingPair(state, null, overridableKeys, keyTag, keyNode, valueNode, _line, _lineStart, _pos));
    } else {
      _result.push(keyNode);
    }

    skipSeparationSpace(state, true, nodeIndent);

    ch = state.input.charCodeAt(state.position);

    if (ch === 0x2C/* , */) {
      readNext = true;
      ch = state.input.charCodeAt(++state.position);
    } else {
      readNext = false;
    }
  }

  throwError(state, 'unexpected end of the stream within a flow collection');
}

function readBlockScalar(state, nodeIndent) {
  var captureStart,
      folding,
      chomping       = CHOMPING_CLIP,
      didReadContent = false,
      detectedIndent = false,
      textIndent     = nodeIndent,
      emptyLines     = 0,
      atMoreIndented = false,
      tmp,
      ch;

  ch = state.input.charCodeAt(state.position);

  if (ch === 0x7C/* | */) {
    folding = false;
  } else if (ch === 0x3E/* > */) {
    folding = true;
  } else {
    return false;
  }

  state.kind = 'scalar';
  state.result = '';

  while (ch !== 0) {
    ch = state.input.charCodeAt(++state.position);

    if (ch === 0x2B/* + */ || ch === 0x2D/* - */) {
      if (CHOMPING_CLIP === chomping) {
        chomping = (ch === 0x2B/* + */) ? CHOMPING_KEEP : CHOMPING_STRIP;
      } else {
        throwError(state, 'repeat of a chomping mode identifier');
      }

    } else if ((tmp = fromDecimalCode(ch)) >= 0) {
      if (tmp === 0) {
        throwError(state, 'bad explicit indentation width of a block scalar; it cannot be less than one');
      } else if (!detectedIndent) {
        textIndent = nodeIndent + tmp - 1;
        detectedIndent = true;
      } else {
        throwError(state, 'repeat of an indentation width identifier');
      }

    } else {
      break;
    }
  }

  if (is_WHITE_SPACE(ch)) {
    do { ch = state.input.charCodeAt(++state.position); }
    while (is_WHITE_SPACE(ch));

    if (ch === 0x23/* # */) {
      do { ch = state.input.charCodeAt(++state.position); }
      while (!is_EOL(ch) && (ch !== 0));
    }
  }

  while (ch !== 0) {
    readLineBreak(state);
    state.lineIndent = 0;

    ch = state.input.charCodeAt(state.position);

    while ((!detectedIndent || state.lineIndent < textIndent) &&
           (ch === 0x20/* Space */)) {
      state.lineIndent++;
      ch = state.input.charCodeAt(++state.position);
    }

    if (!detectedIndent && state.lineIndent > textIndent) {
      textIndent = state.lineIndent;
    }

    if (is_EOL(ch)) {
      emptyLines++;
      continue;
    }

    // End of the scalar.
    if (state.lineIndent < textIndent) {

      // Perform the chomping.
      if (chomping === CHOMPING_KEEP) {
        state.result += common.repeat('\n', didReadContent ? 1 + emptyLines : emptyLines);
      } else if (chomping === CHOMPING_CLIP) {
        if (didReadContent) { // i.e. only if the scalar is not empty.
          state.result += '\n';
        }
      }

      // Break this `while` cycle and go to the funciton's epilogue.
      break;
    }

    // Folded style: use fancy rules to handle line breaks.
    if (folding) {

      // Lines starting with white space characters (more-indented lines) are not folded.
      if (is_WHITE_SPACE(ch)) {
        atMoreIndented = true;
        // except for the first content line (cf. Example 8.1)
        state.result += common.repeat('\n', didReadContent ? 1 + emptyLines : emptyLines);

      // End of more-indented block.
      } else if (atMoreIndented) {
        atMoreIndented = false;
        state.result += common.repeat('\n', emptyLines + 1);

      // Just one line break - perceive as the same line.
      } else if (emptyLines === 0) {
        if (didReadContent) { // i.e. only if we have already read some scalar content.
          state.result += ' ';
        }

      // Several line breaks - perceive as different lines.
      } else {
        state.result += common.repeat('\n', emptyLines);
      }

    // Literal style: just add exact number of line breaks between content lines.
    } else {
      // Keep all line breaks except the header line break.
      state.result += common.repeat('\n', didReadContent ? 1 + emptyLines : emptyLines);
    }

    didReadContent = true;
    detectedIndent = true;
    emptyLines = 0;
    captureStart = state.position;

    while (!is_EOL(ch) && (ch !== 0)) {
      ch = state.input.charCodeAt(++state.position);
    }

    captureSegment(state, captureStart, state.position, false);
  }

  return true;
}

function readBlockSequence(state, nodeIndent) {
  var _line,
      _tag      = state.tag,
      _anchor   = state.anchor,
      _result   = [],
      following,
      detected  = false,
      ch;

  // there is a leading tab before this token, so it can't be a block sequence/mapping;
  // it can still be flow sequence/mapping or a scalar
  if (state.firstTabInLine !== -1) return false;

  if (state.anchor !== null) {
    state.anchorMap[state.anchor] = _result;
  }

  ch = state.input.charCodeAt(state.position);

  while (ch !== 0) {
    if (state.firstTabInLine !== -1) {
      state.position = state.firstTabInLine;
      throwError(state, 'tab characters must not be used in indentation');
    }

    if (ch !== 0x2D/* - */) {
      break;
    }

    following = state.input.charCodeAt(state.position + 1);

    if (!is_WS_OR_EOL(following)) {
      break;
    }

    detected = true;
    state.position++;

    if (skipSeparationSpace(state, true, -1)) {
      if (state.lineIndent <= nodeIndent) {
        _result.push(null);
        ch = state.input.charCodeAt(state.position);
        continue;
      }
    }

    _line = state.line;
    composeNode(state, nodeIndent, CONTEXT_BLOCK_IN, false, true);
    _result.push(state.result);
    skipSeparationSpace(state, true, -1);

    ch = state.input.charCodeAt(state.position);

    if ((state.line === _line || state.lineIndent > nodeIndent) && (ch !== 0)) {
      throwError(state, 'bad indentation of a sequence entry');
    } else if (state.lineIndent < nodeIndent) {
      break;
    }
  }

  if (detected) {
    state.tag = _tag;
    state.anchor = _anchor;
    state.kind = 'sequence';
    state.result = _result;
    return true;
  }
  return false;
}

function readBlockMapping(state, nodeIndent, flowIndent) {
  var following,
      allowCompact,
      _line,
      _keyLine,
      _keyLineStart,
      _keyPos,
      _tag          = state.tag,
      _anchor       = state.anchor,
      _result       = {},
      overridableKeys = Object.create(null),
      keyTag        = null,
      keyNode       = null,
      valueNode     = null,
      atExplicitKey = false,
      detected      = false,
      ch;

  // there is a leading tab before this token, so it can't be a block sequence/mapping;
  // it can still be flow sequence/mapping or a scalar
  if (state.firstTabInLine !== -1) return false;

  if (state.anchor !== null) {
    state.anchorMap[state.anchor] = _result;
  }

  ch = state.input.charCodeAt(state.position);

  while (ch !== 0) {
    if (!atExplicitKey && state.firstTabInLine !== -1) {
      state.position = state.firstTabInLine;
      throwError(state, 'tab characters must not be used in indentation');
    }

    following = state.input.charCodeAt(state.position + 1);
    _line = state.line; // Save the current line.

    //
    // Explicit notation case. There are two separate blocks:
    // first for the key (denoted by "?") and second for the value (denoted by ":")
    //
    if ((ch === 0x3F/* ? */ || ch === 0x3A/* : */) && is_WS_OR_EOL(following)) {

      if (ch === 0x3F/* ? */) {
        if (atExplicitKey) {
          storeMappingPair(state, _result, overridableKeys, keyTag, keyNode, null, _keyLine, _keyLineStart, _keyPos);
          keyTag = keyNode = valueNode = null;
        }

        detected = true;
        atExplicitKey = true;
        allowCompact = true;

      } else if (atExplicitKey) {
        // i.e. 0x3A/* : */ === character after the explicit key.
        atExplicitKey = false;
        allowCompact = true;

      } else {
        throwError(state, 'incomplete explicit mapping pair; a key node is missed; or followed by a non-tabulated empty line');
      }

      state.position += 1;
      ch = following;

    //
    // Implicit notation case. Flow-style node as the key first, then ":", and the value.
    //
    } else {
      _keyLine = state.line;
      _keyLineStart = state.lineStart;
      _keyPos = state.position;

      if (!composeNode(state, flowIndent, CONTEXT_FLOW_OUT, false, true)) {
        // Neither implicit nor explicit notation.
        // Reading is done. Go to the epilogue.
        break;
      }

      if (state.line === _line) {
        ch = state.input.charCodeAt(state.position);

        while (is_WHITE_SPACE(ch)) {
          ch = state.input.charCodeAt(++state.position);
        }

        if (ch === 0x3A/* : */) {
          ch = state.input.charCodeAt(++state.position);

          if (!is_WS_OR_EOL(ch)) {
            throwError(state, 'a whitespace character is expected after the key-value separator within a block mapping');
          }

          if (atExplicitKey) {
            storeMappingPair(state, _result, overridableKeys, keyTag, keyNode, null, _keyLine, _keyLineStart, _keyPos);
            keyTag = keyNode = valueNode = null;
          }

          detected = true;
          atExplicitKey = false;
          allowCompact = false;
          keyTag = state.tag;
          keyNode = state.result;

        } else if (detected) {
          throwError(state, 'can not read an implicit mapping pair; a colon is missed');

        } else {
          state.tag = _tag;
          state.anchor = _anchor;
          return true; // Keep the result of `composeNode`.
        }

      } else if (detected) {
        throwError(state, 'can not read a block mapping entry; a multiline key may not be an implicit key');

      } else {
        state.tag = _tag;
        state.anchor = _anchor;
        return true; // Keep the result of `composeNode`.
      }
    }

    //
    // Common reading code for both explicit and implicit notations.
    //
    if (state.line === _line || state.lineIndent > nodeIndent) {
      if (atExplicitKey) {
        _keyLine = state.line;
        _keyLineStart = state.lineStart;
        _keyPos = state.position;
      }

      if (composeNode(state, nodeIndent, CONTEXT_BLOCK_OUT, true, allowCompact)) {
        if (atExplicitKey) {
          keyNode = state.result;
        } else {
          valueNode = state.result;
        }
      }

      if (!atExplicitKey) {
        storeMappingPair(state, _result, overridableKeys, keyTag, keyNode, valueNode, _keyLine, _keyLineStart, _keyPos);
        keyTag = keyNode = valueNode = null;
      }

      skipSeparationSpace(state, true, -1);
      ch = state.input.charCodeAt(state.position);
    }

    if ((state.line === _line || state.lineIndent > nodeIndent) && (ch !== 0)) {
      throwError(state, 'bad indentation of a mapping entry');
    } else if (state.lineIndent < nodeIndent) {
      break;
    }
  }

  //
  // Epilogue.
  //

  // Special case: last mapping's node contains only the key in explicit notation.
  if (atExplicitKey) {
    storeMappingPair(state, _result, overridableKeys, keyTag, keyNode, null, _keyLine, _keyLineStart, _keyPos);
  }

  // Expose the resulting mapping.
  if (detected) {
    state.tag = _tag;
    state.anchor = _anchor;
    state.kind = 'mapping';
    state.result = _result;
  }

  return detected;
}

function readTagProperty(state) {
  var _position,
      isVerbatim = false,
      isNamed    = false,
      tagHandle,
      tagName,
      ch;

  ch = state.input.charCodeAt(state.position);

  if (ch !== 0x21/* ! */) return false;

  if (state.tag !== null) {
    throwError(state, 'duplication of a tag property');
  }

  ch = state.input.charCodeAt(++state.position);

  if (ch === 0x3C/* < */) {
    isVerbatim = true;
    ch = state.input.charCodeAt(++state.position);

  } else if (ch === 0x21/* ! */) {
    isNamed = true;
    tagHandle = '!!';
    ch = state.input.charCodeAt(++state.position);

  } else {
    tagHandle = '!';
  }

  _position = state.position;

  if (isVerbatim) {
    do { ch = state.input.charCodeAt(++state.position); }
    while (ch !== 0 && ch !== 0x3E/* > */);

    if (state.position < state.length) {
      tagName = state.input.slice(_position, state.position);
      ch = state.input.charCodeAt(++state.position);
    } else {
      throwError(state, 'unexpected end of the stream within a verbatim tag');
    }
  } else {
    while (ch !== 0 && !is_WS_OR_EOL(ch)) {

      if (ch === 0x21/* ! */) {
        if (!isNamed) {
          tagHandle = state.input.slice(_position - 1, state.position + 1);

          if (!PATTERN_TAG_HANDLE.test(tagHandle)) {
            throwError(state, 'named tag handle cannot contain such characters');
          }

          isNamed = true;
          _position = state.position + 1;
        } else {
          throwError(state, 'tag suffix cannot contain exclamation marks');
        }
      }

      ch = state.input.charCodeAt(++state.position);
    }

    tagName = state.input.slice(_position, state.position);

    if (PATTERN_FLOW_INDICATORS.test(tagName)) {
      throwError(state, 'tag suffix cannot contain flow indicator characters');
    }
  }

  if (tagName && !PATTERN_TAG_URI.test(tagName)) {
    throwError(state, 'tag name cannot contain such characters: ' + tagName);
  }

  try {
    tagName = decodeURIComponent(tagName);
  } catch (err) {
    throwError(state, 'tag name is malformed: ' + tagName);
  }

  if (isVerbatim) {
    state.tag = tagName;

  } else if (_hasOwnProperty.call(state.tagMap, tagHandle)) {
    state.tag = state.tagMap[tagHandle] + tagName;

  } else if (tagHandle === '!') {
    state.tag = '!' + tagName;

  } else if (tagHandle === '!!') {
    state.tag = 'tag:yaml.org,2002:' + tagName;

  } else {
    throwError(state, 'undeclared tag handle "' + tagHandle + '"');
  }

  return true;
}

function readAnchorProperty(state) {
  var _position,
      ch;

  ch = state.input.charCodeAt(state.position);

  if (ch !== 0x26/* & */) return false;

  if (state.anchor !== null) {
    throwError(state, 'duplication of an anchor property');
  }

  ch = state.input.charCodeAt(++state.position);
  _position = state.position;

  while (ch !== 0 && !is_WS_OR_EOL(ch) && !is_FLOW_INDICATOR(ch)) {
    ch = state.input.charCodeAt(++state.position);
  }

  if (state.position === _position) {
    throwError(state, 'name of an anchor node must contain at least one character');
  }

  state.anchor = state.input.slice(_position, state.position);
  return true;
}

function readAlias(state) {
  var _position, alias,
      ch;

  ch = state.input.charCodeAt(state.position);

  if (ch !== 0x2A/* * */) return false;

  ch = state.input.charCodeAt(++state.position);
  _position = state.position;

  while (ch !== 0 && !is_WS_OR_EOL(ch) && !is_FLOW_INDICATOR(ch)) {
    ch = state.input.charCodeAt(++state.position);
  }

  if (state.position === _position) {
    throwError(state, 'name of an alias node must contain at least one character');
  }

  alias = state.input.slice(_position, state.position);

  if (!_hasOwnProperty.call(state.anchorMap, alias)) {
    throwError(state, 'unidentified alias "' + alias + '"');
  }

  state.result = state.anchorMap[alias];
  skipSeparationSpace(state, true, -1);
  return true;
}

function composeNode(state, parentIndent, nodeContext, allowToSeek, allowCompact) {
  var allowBlockStyles,
      allowBlockScalars,
      allowBlockCollections,
      indentStatus = 1, // 1: this>parent, 0: this=parent, -1: this<parent
      atNewLine  = false,
      hasContent = false,
      typeIndex,
      typeQuantity,
      typeList,
      type,
      flowIndent,
      blockIndent;

  if (state.listener !== null) {
    state.listener('open', state);
  }

  state.tag    = null;
  state.anchor = null;
  state.kind   = null;
  state.result = null;

  allowBlockStyles = allowBlockScalars = allowBlockCollections =
    CONTEXT_BLOCK_OUT === nodeContext ||
    CONTEXT_BLOCK_IN  === nodeContext;

  if (allowToSeek) {
    if (skipSeparationSpace(state, true, -1)) {
      atNewLine = true;

      if (state.lineIndent > parentIndent) {
        indentStatus = 1;
      } else if (state.lineIndent === parentIndent) {
        indentStatus = 0;
      } else if (state.lineIndent < parentIndent) {
        indentStatus = -1;
      }
    }
  }

  if (indentStatus === 1) {
    while (readTagProperty(state) || readAnchorProperty(state)) {
      if (skipSeparationSpace(state, true, -1)) {
        atNewLine = true;
        allowBlockCollections = allowBlockStyles;

        if (state.lineIndent > parentIndent) {
          indentStatus = 1;
        } else if (state.lineIndent === parentIndent) {
          indentStatus = 0;
        } else if (state.lineIndent < parentIndent) {
          indentStatus = -1;
        }
      } else {
        allowBlockCollections = false;
      }
    }
  }

  if (allowBlockCollections) {
    allowBlockCollections = atNewLine || allowCompact;
  }

  if (indentStatus === 1 || CONTEXT_BLOCK_OUT === nodeContext) {
    if (CONTEXT_FLOW_IN === nodeContext || CONTEXT_FLOW_OUT === nodeContext) {
      flowIndent = parentIndent;
    } else {
      flowIndent = parentIndent + 1;
    }

    blockIndent = state.position - state.lineStart;

    if (indentStatus === 1) {
      if (allowBlockCollections &&
          (readBlockSequence(state, blockIndent) ||
           readBlockMapping(state, blockIndent, flowIndent)) ||
          readFlowCollection(state, flowIndent)) {
        hasContent = true;
      } else {
        if ((allowBlockScalars && readBlockScalar(state, flowIndent)) ||
            readSingleQuotedScalar(state, flowIndent) ||
            readDoubleQuotedScalar(state, flowIndent)) {
          hasContent = true;

        } else if (readAlias(state)) {
          hasContent = true;

          if (state.tag !== null || state.anchor !== null) {
            throwError(state, 'alias node should not have any properties');
          }

        } else if (readPlainScalar(state, flowIndent, CONTEXT_FLOW_IN === nodeContext)) {
          hasContent = true;

          if (state.tag === null) {
            state.tag = '?';
          }
        }

        if (state.anchor !== null) {
          state.anchorMap[state.anchor] = state.result;
        }
      }
    } else if (indentStatus === 0) {
      // Special case: block sequences are allowed to have same indentation level as the parent.
      // http://www.yaml.org/spec/1.2/spec.html#id2799784
      hasContent = allowBlockCollections && readBlockSequence(state, blockIndent);
    }
  }

  if (state.tag === null) {
    if (state.anchor !== null) {
      state.anchorMap[state.anchor] = state.result;
    }

  } else if (state.tag === '?') {
    // Implicit resolving is not allowed for non-scalar types, and '?'
    // non-specific tag is only automatically assigned to plain scalars.
    //
    // We only need to check kind conformity in case user explicitly assigns '?'
    // tag, for example like this: "!<?> [0]"
    //
    if (state.result !== null && state.kind !== 'scalar') {
      throwError(state, 'unacceptable node kind for !<?> tag; it should be "scalar", not "' + state.kind + '"');
    }

    for (typeIndex = 0, typeQuantity = state.implicitTypes.length; typeIndex < typeQuantity; typeIndex += 1) {
      type = state.implicitTypes[typeIndex];

      if (type.resolve(state.result)) { // `state.result` updated in resolver if matched
        state.result = type.construct(state.result);
        state.tag = type.tag;
        if (state.anchor !== null) {
          state.anchorMap[state.anchor] = state.result;
        }
        break;
      }
    }
  } else if (state.tag !== '!') {
    if (_hasOwnProperty.call(state.typeMap[state.kind || 'fallback'], state.tag)) {
      type = state.typeMap[state.kind || 'fallback'][state.tag];
    } else {
      // looking for multi type
      type = null;
      typeList = state.typeMap.multi[state.kind || 'fallback'];

      for (typeIndex = 0, typeQuantity = typeList.length; typeIndex < typeQuantity; typeIndex += 1) {
        if (state.tag.slice(0, typeList[typeIndex].tag.length) === typeList[typeIndex].tag) {
          type = typeList[typeIndex];
          break;
        }
      }
    }

    if (!type) {
      throwError(state, 'unknown tag !<' + state.tag + '>');
    }

    if (state.result !== null && type.kind !== state.kind) {
      throwError(state, 'unacceptable node kind for !<' + state.tag + '> tag; it should be "' + type.kind + '", not "' + state.kind + '"');
    }

    if (!type.resolve(state.result, state.tag)) { // `state.result` updated in resolver if matched
      throwError(state, 'cannot resolve a node with !<' + state.tag + '> explicit tag');
    } else {
      state.result = type.construct(state.result, state.tag);
      if (state.anchor !== null) {
        state.anchorMap[state.anchor] = state.result;
      }
    }
  }

  if (state.listener !== null) {
    state.listener('close', state);
  }
  return state.tag !== null ||  state.anchor !== null || hasContent;
}

function readDocument(state) {
  var documentStart = state.position,
      _position,
      directiveName,
      directiveArgs,
      hasDirectives = false,
      ch;

  state.version = null;
  state.checkLineBreaks = state.legacy;
  state.tagMap = Object.create(null);
  state.anchorMap = Object.create(null);

  while ((ch = state.input.charCodeAt(state.position)) !== 0) {
    skipSeparationSpace(state, true, -1);

    ch = state.input.charCodeAt(state.position);

    if (state.lineIndent > 0 || ch !== 0x25/* % */) {
      break;
    }

    hasDirectives = true;
    ch = state.input.charCodeAt(++state.position);
    _position = state.position;

    while (ch !== 0 && !is_WS_OR_EOL(ch)) {
      ch = state.input.charCodeAt(++state.position);
    }

    directiveName = state.input.slice(_position, state.position);
    directiveArgs = [];

    if (directiveName.length < 1) {
      throwError(state, 'directive name must not be less than one character in length');
    }

    while (ch !== 0) {
      while (is_WHITE_SPACE(ch)) {
        ch = state.input.charCodeAt(++state.position);
      }

      if (ch === 0x23/* # */) {
        do { ch = state.input.charCodeAt(++state.position); }
        while (ch !== 0 && !is_EOL(ch));
        break;
      }

      if (is_EOL(ch)) break;

      _position = state.position;

      while (ch !== 0 && !is_WS_OR_EOL(ch)) {
        ch = state.input.charCodeAt(++state.position);
      }

      directiveArgs.push(state.input.slice(_position, state.position));
    }

    if (ch !== 0) readLineBreak(state);

    if (_hasOwnProperty.call(directiveHandlers, directiveName)) {
      directiveHandlers[directiveName](state, directiveName, directiveArgs);
    } else {
      throwWarning(state, 'unknown document directive "' + directiveName + '"');
    }
  }

  skipSeparationSpace(state, true, -1);

  if (state.lineIndent === 0 &&
      state.input.charCodeAt(state.position)     === 0x2D/* - */ &&
      state.input.charCodeAt(state.position + 1) === 0x2D/* - */ &&
      state.input.charCodeAt(state.position + 2) === 0x2D/* - */) {
    state.position += 3;
    skipSeparationSpace(state, true, -1);

  } else if (hasDirectives) {
    throwError(state, 'directives end mark is expected');
  }

  composeNode(state, state.lineIndent - 1, CONTEXT_BLOCK_OUT, false, true);
  skipSeparationSpace(state, true, -1);

  if (state.checkLineBreaks &&
      PATTERN_NON_ASCII_LINE_BREAKS.test(state.input.slice(documentStart, state.position))) {
    throwWarning(state, 'non-ASCII line breaks are interpreted as content');
  }

  state.documents.push(state.result);

  if (state.position === state.lineStart && testDocumentSeparator(state)) {

    if (state.input.charCodeAt(state.position) === 0x2E/* . */) {
      state.position += 3;
      skipSeparationSpace(state, true, -1);
    }
    return;
  }

  if (state.position < (state.length - 1)) {
    throwError(state, 'end of the stream or a document separator is expected');
  } else {
    return;
  }
}


function loadDocuments(input, options) {
  input = String(input);
  options = options || {};

  if (input.length !== 0) {

    // Add tailing `\n` if not exists
    if (input.charCodeAt(input.length - 1) !== 0x0A/* LF */ &&
        input.charCodeAt(input.length - 1) !== 0x0D/* CR */) {
      input += '\n';
    }

    // Strip BOM
    if (input.charCodeAt(0) === 0xFEFF) {
      input = input.slice(1);
    }
  }

  var state = new State(input, options);

  var nullpos = input.indexOf('\0');

  if (nullpos !== -1) {
    state.position = nullpos;
    throwError(state, 'null byte is not allowed in input');
  }

  // Use 0 as string terminator. That significantly simplifies bounds check.
  state.input += '\0';

  while (state.input.charCodeAt(state.position) === 0x20/* Space */) {
    state.lineIndent += 1;
    state.position += 1;
  }

  while (state.position < (state.length - 1)) {
    readDocument(state);
  }

  return state.documents;
}


function loadAll(input, iterator, options) {
  if (iterator !== null && typeof iterator === 'object' && typeof options === 'undefined') {
    options = iterator;
    iterator = null;
  }

  var documents = loadDocuments(input, options);

  if (typeof iterator !== 'function') {
    return documents;
  }

  for (var index = 0, length = documents.length; index < length; index += 1) {
    iterator(documents[index]);
  }
}


function load(input, options) {
  var documents = loadDocuments(input, options);

  if (documents.length === 0) {
    /*eslint-disable no-undefined*/
    return undefined;
  } else if (documents.length === 1) {
    return documents[0];
  }
  throw new YAMLException('expected a single document in the stream, but found more');
}


module.exports.loadAll = loadAll;
module.exports.load    = load;


/***/ }),

/***/ "./node_modules/js-yaml/lib/schema.js":
/*!********************************************!*\
  !*** ./node_modules/js-yaml/lib/schema.js ***!
  \********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


/*eslint-disable max-len*/

var YAMLException = __webpack_require__(/*! ./exception */ "./node_modules/js-yaml/lib/exception.js");
var Type          = __webpack_require__(/*! ./type */ "./node_modules/js-yaml/lib/type.js");


function compileList(schema, name) {
  var result = [];

  schema[name].forEach(function (currentType) {
    var newIndex = result.length;

    result.forEach(function (previousType, previousIndex) {
      if (previousType.tag === currentType.tag &&
          previousType.kind === currentType.kind &&
          previousType.multi === currentType.multi) {

        newIndex = previousIndex;
      }
    });

    result[newIndex] = currentType;
  });

  return result;
}


function compileMap(/* lists... */) {
  var result = {
        scalar: {},
        sequence: {},
        mapping: {},
        fallback: {},
        multi: {
          scalar: [],
          sequence: [],
          mapping: [],
          fallback: []
        }
      }, index, length;

  function collectType(type) {
    if (type.multi) {
      result.multi[type.kind].push(type);
      result.multi['fallback'].push(type);
    } else {
      result[type.kind][type.tag] = result['fallback'][type.tag] = type;
    }
  }

  for (index = 0, length = arguments.length; index < length; index += 1) {
    arguments[index].forEach(collectType);
  }
  return result;
}


function Schema(definition) {
  return this.extend(definition);
}


Schema.prototype.extend = function extend(definition) {
  var implicit = [];
  var explicit = [];

  if (definition instanceof Type) {
    // Schema.extend(type)
    explicit.push(definition);

  } else if (Array.isArray(definition)) {
    // Schema.extend([ type1, type2, ... ])
    explicit = explicit.concat(definition);

  } else if (definition && (Array.isArray(definition.implicit) || Array.isArray(definition.explicit))) {
    // Schema.extend({ explicit: [ type1, type2, ... ], implicit: [ type1, type2, ... ] })
    if (definition.implicit) implicit = implicit.concat(definition.implicit);
    if (definition.explicit) explicit = explicit.concat(definition.explicit);

  } else {
    throw new YAMLException('Schema.extend argument should be a Type, [ Type ], ' +
      'or a schema definition ({ implicit: [...], explicit: [...] })');
  }

  implicit.forEach(function (type) {
    if (!(type instanceof Type)) {
      throw new YAMLException('Specified list of YAML types (or a single Type object) contains a non-Type object.');
    }

    if (type.loadKind && type.loadKind !== 'scalar') {
      throw new YAMLException('There is a non-scalar type in the implicit list of a schema. Implicit resolving of such types is not supported.');
    }

    if (type.multi) {
      throw new YAMLException('There is a multi type in the implicit list of a schema. Multi tags can only be listed as explicit.');
    }
  });

  explicit.forEach(function (type) {
    if (!(type instanceof Type)) {
      throw new YAMLException('Specified list of YAML types (or a single Type object) contains a non-Type object.');
    }
  });

  var result = Object.create(Schema.prototype);

  result.implicit = (this.implicit || []).concat(implicit);
  result.explicit = (this.explicit || []).concat(explicit);

  result.compiledImplicit = compileList(result, 'implicit');
  result.compiledExplicit = compileList(result, 'explicit');
  result.compiledTypeMap  = compileMap(result.compiledImplicit, result.compiledExplicit);

  return result;
};


module.exports = Schema;


/***/ }),

/***/ "./node_modules/js-yaml/lib/schema/core.js":
/*!*************************************************!*\
  !*** ./node_modules/js-yaml/lib/schema/core.js ***!
  \*************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
// Standard YAML's Core schema.
// http://www.yaml.org/spec/1.2/spec.html#id2804923
//
// NOTE: JS-YAML does not support schema-specific tag resolution restrictions.
// So, Core schema has no distinctions from JSON schema is JS-YAML.





module.exports = __webpack_require__(/*! ./json */ "./node_modules/js-yaml/lib/schema/json.js");


/***/ }),

/***/ "./node_modules/js-yaml/lib/schema/default.js":
/*!****************************************************!*\
  !*** ./node_modules/js-yaml/lib/schema/default.js ***!
  \****************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
// JS-YAML's default schema for `safeLoad` function.
// It is not described in the YAML specification.
//
// This schema is based on standard YAML's Core schema and includes most of
// extra types described at YAML tag repository. (http://yaml.org/type/)





module.exports = __webpack_require__(/*! ./core */ "./node_modules/js-yaml/lib/schema/core.js").extend({
  implicit: [
    __webpack_require__(/*! ../type/timestamp */ "./node_modules/js-yaml/lib/type/timestamp.js"),
    __webpack_require__(/*! ../type/merge */ "./node_modules/js-yaml/lib/type/merge.js")
  ],
  explicit: [
    __webpack_require__(/*! ../type/binary */ "./node_modules/js-yaml/lib/type/binary.js"),
    __webpack_require__(/*! ../type/omap */ "./node_modules/js-yaml/lib/type/omap.js"),
    __webpack_require__(/*! ../type/pairs */ "./node_modules/js-yaml/lib/type/pairs.js"),
    __webpack_require__(/*! ../type/set */ "./node_modules/js-yaml/lib/type/set.js")
  ]
});


/***/ }),

/***/ "./node_modules/js-yaml/lib/schema/failsafe.js":
/*!*****************************************************!*\
  !*** ./node_modules/js-yaml/lib/schema/failsafe.js ***!
  \*****************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
// Standard YAML's Failsafe schema.
// http://www.yaml.org/spec/1.2/spec.html#id2802346





var Schema = __webpack_require__(/*! ../schema */ "./node_modules/js-yaml/lib/schema.js");


module.exports = new Schema({
  explicit: [
    __webpack_require__(/*! ../type/str */ "./node_modules/js-yaml/lib/type/str.js"),
    __webpack_require__(/*! ../type/seq */ "./node_modules/js-yaml/lib/type/seq.js"),
    __webpack_require__(/*! ../type/map */ "./node_modules/js-yaml/lib/type/map.js")
  ]
});


/***/ }),

/***/ "./node_modules/js-yaml/lib/schema/json.js":
/*!*************************************************!*\
  !*** ./node_modules/js-yaml/lib/schema/json.js ***!
  \*************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
// Standard YAML's JSON schema.
// http://www.yaml.org/spec/1.2/spec.html#id2803231
//
// NOTE: JS-YAML does not support schema-specific tag resolution restrictions.
// So, this schema is not such strict as defined in the YAML specification.
// It allows numbers in binary notaion, use `Null` and `NULL` as `null`, etc.





module.exports = __webpack_require__(/*! ./failsafe */ "./node_modules/js-yaml/lib/schema/failsafe.js").extend({
  implicit: [
    __webpack_require__(/*! ../type/null */ "./node_modules/js-yaml/lib/type/null.js"),
    __webpack_require__(/*! ../type/bool */ "./node_modules/js-yaml/lib/type/bool.js"),
    __webpack_require__(/*! ../type/int */ "./node_modules/js-yaml/lib/type/int.js"),
    __webpack_require__(/*! ../type/float */ "./node_modules/js-yaml/lib/type/float.js")
  ]
});


/***/ }),

/***/ "./node_modules/js-yaml/lib/snippet.js":
/*!*********************************************!*\
  !*** ./node_modules/js-yaml/lib/snippet.js ***!
  \*********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";



var common = __webpack_require__(/*! ./common */ "./node_modules/js-yaml/lib/common.js");


// get snippet for a single line, respecting maxLength
function getLine(buffer, lineStart, lineEnd, position, maxLineLength) {
  var head = '';
  var tail = '';
  var maxHalfLength = Math.floor(maxLineLength / 2) - 1;

  if (position - lineStart > maxHalfLength) {
    head = ' ... ';
    lineStart = position - maxHalfLength + head.length;
  }

  if (lineEnd - position > maxHalfLength) {
    tail = ' ...';
    lineEnd = position + maxHalfLength - tail.length;
  }

  return {
    str: head + buffer.slice(lineStart, lineEnd).replace(/\t/g, '→') + tail,
    pos: position - lineStart + head.length // relative position
  };
}


function padStart(string, max) {
  return common.repeat(' ', max - string.length) + string;
}


function makeSnippet(mark, options) {
  options = Object.create(options || null);

  if (!mark.buffer) return null;

  if (!options.maxLength) options.maxLength = 79;
  if (typeof options.indent      !== 'number') options.indent      = 1;
  if (typeof options.linesBefore !== 'number') options.linesBefore = 3;
  if (typeof options.linesAfter  !== 'number') options.linesAfter  = 2;

  var re = /\r?\n|\r|\0/g;
  var lineStarts = [ 0 ];
  var lineEnds = [];
  var match;
  var foundLineNo = -1;

  while ((match = re.exec(mark.buffer))) {
    lineEnds.push(match.index);
    lineStarts.push(match.index + match[0].length);

    if (mark.position <= match.index && foundLineNo < 0) {
      foundLineNo = lineStarts.length - 2;
    }
  }

  if (foundLineNo < 0) foundLineNo = lineStarts.length - 1;

  var result = '', i, line;
  var lineNoLength = Math.min(mark.line + options.linesAfter, lineEnds.length).toString().length;
  var maxLineLength = options.maxLength - (options.indent + lineNoLength + 3);

  for (i = 1; i <= options.linesBefore; i++) {
    if (foundLineNo - i < 0) break;
    line = getLine(
      mark.buffer,
      lineStarts[foundLineNo - i],
      lineEnds[foundLineNo - i],
      mark.position - (lineStarts[foundLineNo] - lineStarts[foundLineNo - i]),
      maxLineLength
    );
    result = common.repeat(' ', options.indent) + padStart((mark.line - i + 1).toString(), lineNoLength) +
      ' | ' + line.str + '\n' + result;
  }

  line = getLine(mark.buffer, lineStarts[foundLineNo], lineEnds[foundLineNo], mark.position, maxLineLength);
  result += common.repeat(' ', options.indent) + padStart((mark.line + 1).toString(), lineNoLength) +
    ' | ' + line.str + '\n';
  result += common.repeat('-', options.indent + lineNoLength + 3 + line.pos) + '^' + '\n';

  for (i = 1; i <= options.linesAfter; i++) {
    if (foundLineNo + i >= lineEnds.length) break;
    line = getLine(
      mark.buffer,
      lineStarts[foundLineNo + i],
      lineEnds[foundLineNo + i],
      mark.position - (lineStarts[foundLineNo] - lineStarts[foundLineNo + i]),
      maxLineLength
    );
    result += common.repeat(' ', options.indent) + padStart((mark.line + i + 1).toString(), lineNoLength) +
      ' | ' + line.str + '\n';
  }

  return result.replace(/\n$/, '');
}


module.exports = makeSnippet;


/***/ }),

/***/ "./node_modules/js-yaml/lib/type.js":
/*!******************************************!*\
  !*** ./node_modules/js-yaml/lib/type.js ***!
  \******************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var YAMLException = __webpack_require__(/*! ./exception */ "./node_modules/js-yaml/lib/exception.js");

var TYPE_CONSTRUCTOR_OPTIONS = [
  'kind',
  'multi',
  'resolve',
  'construct',
  'instanceOf',
  'predicate',
  'represent',
  'representName',
  'defaultStyle',
  'styleAliases'
];

var YAML_NODE_KINDS = [
  'scalar',
  'sequence',
  'mapping'
];

function compileStyleAliases(map) {
  var result = {};

  if (map !== null) {
    Object.keys(map).forEach(function (style) {
      map[style].forEach(function (alias) {
        result[String(alias)] = style;
      });
    });
  }

  return result;
}

function Type(tag, options) {
  options = options || {};

  Object.keys(options).forEach(function (name) {
    if (TYPE_CONSTRUCTOR_OPTIONS.indexOf(name) === -1) {
      throw new YAMLException('Unknown option "' + name + '" is met in definition of "' + tag + '" YAML type.');
    }
  });

  // TODO: Add tag format check.
  this.options       = options; // keep original options in case user wants to extend this type later
  this.tag           = tag;
  this.kind          = options['kind']          || null;
  this.resolve       = options['resolve']       || function () { return true; };
  this.construct     = options['construct']     || function (data) { return data; };
  this.instanceOf    = options['instanceOf']    || null;
  this.predicate     = options['predicate']     || null;
  this.represent     = options['represent']     || null;
  this.representName = options['representName'] || null;
  this.defaultStyle  = options['defaultStyle']  || null;
  this.multi         = options['multi']         || false;
  this.styleAliases  = compileStyleAliases(options['styleAliases'] || null);

  if (YAML_NODE_KINDS.indexOf(this.kind) === -1) {
    throw new YAMLException('Unknown kind "' + this.kind + '" is specified for "' + tag + '" YAML type.');
  }
}

module.exports = Type;


/***/ }),

/***/ "./node_modules/js-yaml/lib/type/binary.js":
/*!*************************************************!*\
  !*** ./node_modules/js-yaml/lib/type/binary.js ***!
  \*************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


/*eslint-disable no-bitwise*/


var Type = __webpack_require__(/*! ../type */ "./node_modules/js-yaml/lib/type.js");


// [ 64, 65, 66 ] -> [ padding, CR, LF ]
var BASE64_MAP = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=\n\r';


function resolveYamlBinary(data) {
  if (data === null) return false;

  var code, idx, bitlen = 0, max = data.length, map = BASE64_MAP;

  // Convert one by one.
  for (idx = 0; idx < max; idx++) {
    code = map.indexOf(data.charAt(idx));

    // Skip CR/LF
    if (code > 64) continue;

    // Fail on illegal characters
    if (code < 0) return false;

    bitlen += 6;
  }

  // If there are any bits left, source was corrupted
  return (bitlen % 8) === 0;
}

function constructYamlBinary(data) {
  var idx, tailbits,
      input = data.replace(/[\r\n=]/g, ''), // remove CR/LF & padding to simplify scan
      max = input.length,
      map = BASE64_MAP,
      bits = 0,
      result = [];

  // Collect by 6*4 bits (3 bytes)

  for (idx = 0; idx < max; idx++) {
    if ((idx % 4 === 0) && idx) {
      result.push((bits >> 16) & 0xFF);
      result.push((bits >> 8) & 0xFF);
      result.push(bits & 0xFF);
    }

    bits = (bits << 6) | map.indexOf(input.charAt(idx));
  }

  // Dump tail

  tailbits = (max % 4) * 6;

  if (tailbits === 0) {
    result.push((bits >> 16) & 0xFF);
    result.push((bits >> 8) & 0xFF);
    result.push(bits & 0xFF);
  } else if (tailbits === 18) {
    result.push((bits >> 10) & 0xFF);
    result.push((bits >> 2) & 0xFF);
  } else if (tailbits === 12) {
    result.push((bits >> 4) & 0xFF);
  }

  return new Uint8Array(result);
}

function representYamlBinary(object /*, style*/) {
  var result = '', bits = 0, idx, tail,
      max = object.length,
      map = BASE64_MAP;

  // Convert every three bytes to 4 ASCII characters.

  for (idx = 0; idx < max; idx++) {
    if ((idx % 3 === 0) && idx) {
      result += map[(bits >> 18) & 0x3F];
      result += map[(bits >> 12) & 0x3F];
      result += map[(bits >> 6) & 0x3F];
      result += map[bits & 0x3F];
    }

    bits = (bits << 8) + object[idx];
  }

  // Dump tail

  tail = max % 3;

  if (tail === 0) {
    result += map[(bits >> 18) & 0x3F];
    result += map[(bits >> 12) & 0x3F];
    result += map[(bits >> 6) & 0x3F];
    result += map[bits & 0x3F];
  } else if (tail === 2) {
    result += map[(bits >> 10) & 0x3F];
    result += map[(bits >> 4) & 0x3F];
    result += map[(bits << 2) & 0x3F];
    result += map[64];
  } else if (tail === 1) {
    result += map[(bits >> 2) & 0x3F];
    result += map[(bits << 4) & 0x3F];
    result += map[64];
    result += map[64];
  }

  return result;
}

function isBinary(obj) {
  return Object.prototype.toString.call(obj) ===  '[object Uint8Array]';
}

module.exports = new Type('tag:yaml.org,2002:binary', {
  kind: 'scalar',
  resolve: resolveYamlBinary,
  construct: constructYamlBinary,
  predicate: isBinary,
  represent: representYamlBinary
});


/***/ }),

/***/ "./node_modules/js-yaml/lib/type/bool.js":
/*!***********************************************!*\
  !*** ./node_modules/js-yaml/lib/type/bool.js ***!
  \***********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var Type = __webpack_require__(/*! ../type */ "./node_modules/js-yaml/lib/type.js");

function resolveYamlBoolean(data) {
  if (data === null) return false;

  var max = data.length;

  return (max === 4 && (data === 'true' || data === 'True' || data === 'TRUE')) ||
         (max === 5 && (data === 'false' || data === 'False' || data === 'FALSE'));
}

function constructYamlBoolean(data) {
  return data === 'true' ||
         data === 'True' ||
         data === 'TRUE';
}

function isBoolean(object) {
  return Object.prototype.toString.call(object) === '[object Boolean]';
}

module.exports = new Type('tag:yaml.org,2002:bool', {
  kind: 'scalar',
  resolve: resolveYamlBoolean,
  construct: constructYamlBoolean,
  predicate: isBoolean,
  represent: {
    lowercase: function (object) { return object ? 'true' : 'false'; },
    uppercase: function (object) { return object ? 'TRUE' : 'FALSE'; },
    camelcase: function (object) { return object ? 'True' : 'False'; }
  },
  defaultStyle: 'lowercase'
});


/***/ }),

/***/ "./node_modules/js-yaml/lib/type/float.js":
/*!************************************************!*\
  !*** ./node_modules/js-yaml/lib/type/float.js ***!
  \************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var common = __webpack_require__(/*! ../common */ "./node_modules/js-yaml/lib/common.js");
var Type   = __webpack_require__(/*! ../type */ "./node_modules/js-yaml/lib/type.js");

var YAML_FLOAT_PATTERN = new RegExp(
  // 2.5e4, 2.5 and integers
  '^(?:[-+]?(?:[0-9][0-9_]*)(?:\\.[0-9_]*)?(?:[eE][-+]?[0-9]+)?' +
  // .2e4, .2
  // special case, seems not from spec
  '|\\.[0-9_]+(?:[eE][-+]?[0-9]+)?' +
  // .inf
  '|[-+]?\\.(?:inf|Inf|INF)' +
  // .nan
  '|\\.(?:nan|NaN|NAN))$');

function resolveYamlFloat(data) {
  if (data === null) return false;

  if (!YAML_FLOAT_PATTERN.test(data) ||
      // Quick hack to not allow integers end with `_`
      // Probably should update regexp & check speed
      data[data.length - 1] === '_') {
    return false;
  }

  return true;
}

function constructYamlFloat(data) {
  var value, sign;

  value  = data.replace(/_/g, '').toLowerCase();
  sign   = value[0] === '-' ? -1 : 1;

  if ('+-'.indexOf(value[0]) >= 0) {
    value = value.slice(1);
  }

  if (value === '.inf') {
    return (sign === 1) ? Number.POSITIVE_INFINITY : Number.NEGATIVE_INFINITY;

  } else if (value === '.nan') {
    return NaN;
  }
  return sign * parseFloat(value, 10);
}


var SCIENTIFIC_WITHOUT_DOT = /^[-+]?[0-9]+e/;

function representYamlFloat(object, style) {
  var res;

  if (isNaN(object)) {
    switch (style) {
      case 'lowercase': return '.nan';
      case 'uppercase': return '.NAN';
      case 'camelcase': return '.NaN';
    }
  } else if (Number.POSITIVE_INFINITY === object) {
    switch (style) {
      case 'lowercase': return '.inf';
      case 'uppercase': return '.INF';
      case 'camelcase': return '.Inf';
    }
  } else if (Number.NEGATIVE_INFINITY === object) {
    switch (style) {
      case 'lowercase': return '-.inf';
      case 'uppercase': return '-.INF';
      case 'camelcase': return '-.Inf';
    }
  } else if (common.isNegativeZero(object)) {
    return '-0.0';
  }

  res = object.toString(10);

  // JS stringifier can build scientific format without dots: 5e-100,
  // while YAML requres dot: 5.e-100. Fix it with simple hack

  return SCIENTIFIC_WITHOUT_DOT.test(res) ? res.replace('e', '.e') : res;
}

function isFloat(object) {
  return (Object.prototype.toString.call(object) === '[object Number]') &&
         (object % 1 !== 0 || common.isNegativeZero(object));
}

module.exports = new Type('tag:yaml.org,2002:float', {
  kind: 'scalar',
  resolve: resolveYamlFloat,
  construct: constructYamlFloat,
  predicate: isFloat,
  represent: representYamlFloat,
  defaultStyle: 'lowercase'
});


/***/ }),

/***/ "./node_modules/js-yaml/lib/type/int.js":
/*!**********************************************!*\
  !*** ./node_modules/js-yaml/lib/type/int.js ***!
  \**********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var common = __webpack_require__(/*! ../common */ "./node_modules/js-yaml/lib/common.js");
var Type   = __webpack_require__(/*! ../type */ "./node_modules/js-yaml/lib/type.js");

function isHexCode(c) {
  return ((0x30/* 0 */ <= c) && (c <= 0x39/* 9 */)) ||
         ((0x41/* A */ <= c) && (c <= 0x46/* F */)) ||
         ((0x61/* a */ <= c) && (c <= 0x66/* f */));
}

function isOctCode(c) {
  return ((0x30/* 0 */ <= c) && (c <= 0x37/* 7 */));
}

function isDecCode(c) {
  return ((0x30/* 0 */ <= c) && (c <= 0x39/* 9 */));
}

function resolveYamlInteger(data) {
  if (data === null) return false;

  var max = data.length,
      index = 0,
      hasDigits = false,
      ch;

  if (!max) return false;

  ch = data[index];

  // sign
  if (ch === '-' || ch === '+') {
    ch = data[++index];
  }

  if (ch === '0') {
    // 0
    if (index + 1 === max) return true;
    ch = data[++index];

    // base 2, base 8, base 16

    if (ch === 'b') {
      // base 2
      index++;

      for (; index < max; index++) {
        ch = data[index];
        if (ch === '_') continue;
        if (ch !== '0' && ch !== '1') return false;
        hasDigits = true;
      }
      return hasDigits && ch !== '_';
    }


    if (ch === 'x') {
      // base 16
      index++;

      for (; index < max; index++) {
        ch = data[index];
        if (ch === '_') continue;
        if (!isHexCode(data.charCodeAt(index))) return false;
        hasDigits = true;
      }
      return hasDigits && ch !== '_';
    }


    if (ch === 'o') {
      // base 8
      index++;

      for (; index < max; index++) {
        ch = data[index];
        if (ch === '_') continue;
        if (!isOctCode(data.charCodeAt(index))) return false;
        hasDigits = true;
      }
      return hasDigits && ch !== '_';
    }
  }

  // base 10 (except 0)

  // value should not start with `_`;
  if (ch === '_') return false;

  for (; index < max; index++) {
    ch = data[index];
    if (ch === '_') continue;
    if (!isDecCode(data.charCodeAt(index))) {
      return false;
    }
    hasDigits = true;
  }

  // Should have digits and should not end with `_`
  if (!hasDigits || ch === '_') return false;

  return true;
}

function constructYamlInteger(data) {
  var value = data, sign = 1, ch;

  if (value.indexOf('_') !== -1) {
    value = value.replace(/_/g, '');
  }

  ch = value[0];

  if (ch === '-' || ch === '+') {
    if (ch === '-') sign = -1;
    value = value.slice(1);
    ch = value[0];
  }

  if (value === '0') return 0;

  if (ch === '0') {
    if (value[1] === 'b') return sign * parseInt(value.slice(2), 2);
    if (value[1] === 'x') return sign * parseInt(value.slice(2), 16);
    if (value[1] === 'o') return sign * parseInt(value.slice(2), 8);
  }

  return sign * parseInt(value, 10);
}

function isInteger(object) {
  return (Object.prototype.toString.call(object)) === '[object Number]' &&
         (object % 1 === 0 && !common.isNegativeZero(object));
}

module.exports = new Type('tag:yaml.org,2002:int', {
  kind: 'scalar',
  resolve: resolveYamlInteger,
  construct: constructYamlInteger,
  predicate: isInteger,
  represent: {
    binary:      function (obj) { return obj >= 0 ? '0b' + obj.toString(2) : '-0b' + obj.toString(2).slice(1); },
    octal:       function (obj) { return obj >= 0 ? '0o'  + obj.toString(8) : '-0o'  + obj.toString(8).slice(1); },
    decimal:     function (obj) { return obj.toString(10); },
    /* eslint-disable max-len */
    hexadecimal: function (obj) { return obj >= 0 ? '0x' + obj.toString(16).toUpperCase() :  '-0x' + obj.toString(16).toUpperCase().slice(1); }
  },
  defaultStyle: 'decimal',
  styleAliases: {
    binary:      [ 2,  'bin' ],
    octal:       [ 8,  'oct' ],
    decimal:     [ 10, 'dec' ],
    hexadecimal: [ 16, 'hex' ]
  }
});


/***/ }),

/***/ "./node_modules/js-yaml/lib/type/map.js":
/*!**********************************************!*\
  !*** ./node_modules/js-yaml/lib/type/map.js ***!
  \**********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var Type = __webpack_require__(/*! ../type */ "./node_modules/js-yaml/lib/type.js");

module.exports = new Type('tag:yaml.org,2002:map', {
  kind: 'mapping',
  construct: function (data) { return data !== null ? data : {}; }
});


/***/ }),

/***/ "./node_modules/js-yaml/lib/type/merge.js":
/*!************************************************!*\
  !*** ./node_modules/js-yaml/lib/type/merge.js ***!
  \************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var Type = __webpack_require__(/*! ../type */ "./node_modules/js-yaml/lib/type.js");

function resolveYamlMerge(data) {
  return data === '<<' || data === null;
}

module.exports = new Type('tag:yaml.org,2002:merge', {
  kind: 'scalar',
  resolve: resolveYamlMerge
});


/***/ }),

/***/ "./node_modules/js-yaml/lib/type/null.js":
/*!***********************************************!*\
  !*** ./node_modules/js-yaml/lib/type/null.js ***!
  \***********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var Type = __webpack_require__(/*! ../type */ "./node_modules/js-yaml/lib/type.js");

function resolveYamlNull(data) {
  if (data === null) return true;

  var max = data.length;

  return (max === 1 && data === '~') ||
         (max === 4 && (data === 'null' || data === 'Null' || data === 'NULL'));
}

function constructYamlNull() {
  return null;
}

function isNull(object) {
  return object === null;
}

module.exports = new Type('tag:yaml.org,2002:null', {
  kind: 'scalar',
  resolve: resolveYamlNull,
  construct: constructYamlNull,
  predicate: isNull,
  represent: {
    canonical: function () { return '~';    },
    lowercase: function () { return 'null'; },
    uppercase: function () { return 'NULL'; },
    camelcase: function () { return 'Null'; },
    empty:     function () { return '';     }
  },
  defaultStyle: 'lowercase'
});


/***/ }),

/***/ "./node_modules/js-yaml/lib/type/omap.js":
/*!***********************************************!*\
  !*** ./node_modules/js-yaml/lib/type/omap.js ***!
  \***********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var Type = __webpack_require__(/*! ../type */ "./node_modules/js-yaml/lib/type.js");

var _hasOwnProperty = Object.prototype.hasOwnProperty;
var _toString       = Object.prototype.toString;

function resolveYamlOmap(data) {
  if (data === null) return true;

  var objectKeys = [], index, length, pair, pairKey, pairHasKey,
      object = data;

  for (index = 0, length = object.length; index < length; index += 1) {
    pair = object[index];
    pairHasKey = false;

    if (_toString.call(pair) !== '[object Object]') return false;

    for (pairKey in pair) {
      if (_hasOwnProperty.call(pair, pairKey)) {
        if (!pairHasKey) pairHasKey = true;
        else return false;
      }
    }

    if (!pairHasKey) return false;

    if (objectKeys.indexOf(pairKey) === -1) objectKeys.push(pairKey);
    else return false;
  }

  return true;
}

function constructYamlOmap(data) {
  return data !== null ? data : [];
}

module.exports = new Type('tag:yaml.org,2002:omap', {
  kind: 'sequence',
  resolve: resolveYamlOmap,
  construct: constructYamlOmap
});


/***/ }),

/***/ "./node_modules/js-yaml/lib/type/pairs.js":
/*!************************************************!*\
  !*** ./node_modules/js-yaml/lib/type/pairs.js ***!
  \************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var Type = __webpack_require__(/*! ../type */ "./node_modules/js-yaml/lib/type.js");

var _toString = Object.prototype.toString;

function resolveYamlPairs(data) {
  if (data === null) return true;

  var index, length, pair, keys, result,
      object = data;

  result = new Array(object.length);

  for (index = 0, length = object.length; index < length; index += 1) {
    pair = object[index];

    if (_toString.call(pair) !== '[object Object]') return false;

    keys = Object.keys(pair);

    if (keys.length !== 1) return false;

    result[index] = [ keys[0], pair[keys[0]] ];
  }

  return true;
}

function constructYamlPairs(data) {
  if (data === null) return [];

  var index, length, pair, keys, result,
      object = data;

  result = new Array(object.length);

  for (index = 0, length = object.length; index < length; index += 1) {
    pair = object[index];

    keys = Object.keys(pair);

    result[index] = [ keys[0], pair[keys[0]] ];
  }

  return result;
}

module.exports = new Type('tag:yaml.org,2002:pairs', {
  kind: 'sequence',
  resolve: resolveYamlPairs,
  construct: constructYamlPairs
});


/***/ }),

/***/ "./node_modules/js-yaml/lib/type/seq.js":
/*!**********************************************!*\
  !*** ./node_modules/js-yaml/lib/type/seq.js ***!
  \**********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var Type = __webpack_require__(/*! ../type */ "./node_modules/js-yaml/lib/type.js");

module.exports = new Type('tag:yaml.org,2002:seq', {
  kind: 'sequence',
  construct: function (data) { return data !== null ? data : []; }
});


/***/ }),

/***/ "./node_modules/js-yaml/lib/type/set.js":
/*!**********************************************!*\
  !*** ./node_modules/js-yaml/lib/type/set.js ***!
  \**********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var Type = __webpack_require__(/*! ../type */ "./node_modules/js-yaml/lib/type.js");

var _hasOwnProperty = Object.prototype.hasOwnProperty;

function resolveYamlSet(data) {
  if (data === null) return true;

  var key, object = data;

  for (key in object) {
    if (_hasOwnProperty.call(object, key)) {
      if (object[key] !== null) return false;
    }
  }

  return true;
}

function constructYamlSet(data) {
  return data !== null ? data : {};
}

module.exports = new Type('tag:yaml.org,2002:set', {
  kind: 'mapping',
  resolve: resolveYamlSet,
  construct: constructYamlSet
});


/***/ }),

/***/ "./node_modules/js-yaml/lib/type/str.js":
/*!**********************************************!*\
  !*** ./node_modules/js-yaml/lib/type/str.js ***!
  \**********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var Type = __webpack_require__(/*! ../type */ "./node_modules/js-yaml/lib/type.js");

module.exports = new Type('tag:yaml.org,2002:str', {
  kind: 'scalar',
  construct: function (data) { return data !== null ? data : ''; }
});


/***/ }),

/***/ "./node_modules/js-yaml/lib/type/timestamp.js":
/*!****************************************************!*\
  !*** ./node_modules/js-yaml/lib/type/timestamp.js ***!
  \****************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var Type = __webpack_require__(/*! ../type */ "./node_modules/js-yaml/lib/type.js");

var YAML_DATE_REGEXP = new RegExp(
  '^([0-9][0-9][0-9][0-9])'          + // [1] year
  '-([0-9][0-9])'                    + // [2] month
  '-([0-9][0-9])$');                   // [3] day

var YAML_TIMESTAMP_REGEXP = new RegExp(
  '^([0-9][0-9][0-9][0-9])'          + // [1] year
  '-([0-9][0-9]?)'                   + // [2] month
  '-([0-9][0-9]?)'                   + // [3] day
  '(?:[Tt]|[ \\t]+)'                 + // ...
  '([0-9][0-9]?)'                    + // [4] hour
  ':([0-9][0-9])'                    + // [5] minute
  ':([0-9][0-9])'                    + // [6] second
  '(?:\\.([0-9]*))?'                 + // [7] fraction
  '(?:[ \\t]*(Z|([-+])([0-9][0-9]?)' + // [8] tz [9] tz_sign [10] tz_hour
  '(?::([0-9][0-9]))?))?$');           // [11] tz_minute

function resolveYamlTimestamp(data) {
  if (data === null) return false;
  if (YAML_DATE_REGEXP.exec(data) !== null) return true;
  if (YAML_TIMESTAMP_REGEXP.exec(data) !== null) return true;
  return false;
}

function constructYamlTimestamp(data) {
  var match, year, month, day, hour, minute, second, fraction = 0,
      delta = null, tz_hour, tz_minute, date;

  match = YAML_DATE_REGEXP.exec(data);
  if (match === null) match = YAML_TIMESTAMP_REGEXP.exec(data);

  if (match === null) throw new Error('Date resolve error');

  // match: [1] year [2] month [3] day

  year = +(match[1]);
  month = +(match[2]) - 1; // JS month starts with 0
  day = +(match[3]);

  if (!match[4]) { // no hour
    return new Date(Date.UTC(year, month, day));
  }

  // match: [4] hour [5] minute [6] second [7] fraction

  hour = +(match[4]);
  minute = +(match[5]);
  second = +(match[6]);

  if (match[7]) {
    fraction = match[7].slice(0, 3);
    while (fraction.length < 3) { // milli-seconds
      fraction += '0';
    }
    fraction = +fraction;
  }

  // match: [8] tz [9] tz_sign [10] tz_hour [11] tz_minute

  if (match[9]) {
    tz_hour = +(match[10]);
    tz_minute = +(match[11] || 0);
    delta = (tz_hour * 60 + tz_minute) * 60000; // delta in mili-seconds
    if (match[9] === '-') delta = -delta;
  }

  date = new Date(Date.UTC(year, month, day, hour, minute, second, fraction));

  if (delta) date.setTime(date.getTime() - delta);

  return date;
}

function representYamlTimestamp(object /*, style*/) {
  return object.toISOString();
}

module.exports = new Type('tag:yaml.org,2002:timestamp', {
  kind: 'scalar',
  resolve: resolveYamlTimestamp,
  construct: constructYamlTimestamp,
  instanceOf: Date,
  represent: representYamlTimestamp
});


/***/ }),

/***/ "./src/sass/default.scss":
/*!*******************************!*\
  !*** ./src/sass/default.scss ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./src/sass/desktop.scss":
/*!*******************************!*\
  !*** ./src/sass/desktop.scss ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./src/js/ai-training-view.js":
/*!************************************!*\
  !*** ./src/js/ai-training-view.js ***!
  \************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const EventEmitter = __webpack_require__(/*! events */ "./node_modules/events/events.js");
const RobotView = __webpack_require__(/*! ./robot-view */ "./src/js/robot-view.js");
const createHoldButton = __webpack_require__(/*! ./hold-button */ "./src/js/hold-button.js");

class AITrainingView {
  constructor(ai, robotView) {
    this.ai = ai;
    this.robotView = robotView;
    this.running = false;
    this.turboDown = false;
    this.timer = 0;
    this.robotIdle = true;
    this.robotView.events.on('idle', () => {
      if (this.running || this.turboDown) {
        this.ai.step();
      } else {
        this.robotIdle = true;
      }
    });
    this.events = new EventEmitter();

    this.$element = $('<div></div>')
      .addClass('ai-training-view');

    this.$runButton = this.buildButton({
        id: 'run',
        icon: 'static/fa/play-solid.svg',
        title: 'Run / Pause',
      })
      .on('i.pointerclick', () => {
        if (this.running) {
          this.$runButton.css({ backgroundImage: 'url("static/fa/play-solid.svg")' });
          this.$runButton.removeClass('active');
          this.running = false;
        } else if (this.robotIdle) {
          this.$runButton.css({ backgroundImage: 'url("static/fa/pause-solid.svg")' });
          this.$runButton.addClass('active');
          this.running = true;
          this.robotIdle = false;
          this.ai.step();
        }
      })
      .appendTo(this.$element);

    this.$turboButton = this.buildButton({
        id: 'turbo',
        icon: 'static/fa/forward-solid.svg',
        title: 'Hold to speed up',
      })
      .on('i.pointerdown', () => {
        this.$turboButton.addClass('active');
        this.robotView.speed = RobotView.Speed.TURBO;
        this.turboDown = true;
        if (this.robotIdle) {
          this.ai.step();
        }
      })
      .on('i.pointerup', () => {
        this.$turboButton.removeClass('active');
        this.robotView.speed = RobotView.Speed.DEFAULT;
        this.turboDown = false;
      })
      .appendTo(this.$element);

    this.$stepButton = this.buildButton({
        id: 'step',
        icon: 'static/fa/step-forward-solid.svg',
        title: 'Step',
      })
      .on('i.pointerclick', () => {
        if (this.robotIdle) {
          this.robotIdle = false;
          this.ai.step();
        }
      })
      .appendTo(this.$element);

    this.$viewPolicyButton = this.buildButton({
        id: 'view-policy',
        icon: 'static/icons/eye-regular.svg',
        title: 'View Policy',
      })
      .on('i.pointerdown', () => {
        this.$viewPolicyButton.addClass('active');
        this.events.emit('policy-show');
      })
      .on('i.pointerup', () => {
        this.$viewPolicyButton.removeClass('active');
        this.events.emit('policy-hide');
      })
      .appendTo(this.$element);

    this.$explorationRateSlider = this.buildSlider({
      id: 'exploration-rate',
      title: 'Exploration rate',
      options: { min: 0, max: 1, step: 0.1 },
      limitLabels: ['Exploit', 'Explore'],
      initialValue: this.ai.exploreRate,
      changeCallback: (value) => {
        this.ai.exploreRate = value;
      },
    }).appendTo(this.$element);

    this.$learningRateSlider = this.buildSlider({
      id: 'learning-rate',
      title: 'Learning rate',
      options: { min: 0, max: 1, step: 0.1 },
      initialValue: this.ai.learningRate,
      changeCallback: (value) => {
        this.ai.learningRate = value;
      },
    }).appendTo(this.$element);

    this.$discountFactorSlider = this.buildSlider({
      id: 'discount-factor',
      title: 'Discount factor',
      options: { min: 0, max: 1, step: 0.1 },
      initialValue: this.ai.discountFactor,
      changeCallback: (value) => {
        this.ai.discountFactor = value;
      },
    }).appendTo(this.$element);

    this.$clearButton = createHoldButton({
      id: 'clear',
      title: 'Clear',
      holdTime: 2000,
    })
      .addClass([
        'ai-training-view-button',
        'ai-training-view-button-clear',
      ])
      .on('hold', () => {
        this.ai.clear();
      })
      .appendTo(this.$element);

    this.$clearButton
      .find('.text')
      .attr({
        'data-i18n-text': 'ai-training-view-button-clear',
      });
  }

  buildButton(props) {
    const button = $('<button></button>')
      .attr({
        type: 'button',
        title: props.title,
        'data-i18n-text': `ai-training-view-button-${props.id}`,
      })
      .addClass([
        'btn',
        'ai-training-view-button',
        `ai-training-view-button-${props.id}`,
      ])
      .html(props.icon ? '&nbsp;' : props.title || '')
      .pointerclick();

    if (props.icon) {
      button.css({
        backgroundImage: `url(${props.icon})`,
      });
      button.addClass('round');
    }

    return button;
  }

  buildSlider(props) {
    const {
      id, title, options, initialValue, changeCallback,
    } = props;

    const $element = $('<div></div>')
      .addClass([
        'slider',
        'ai-training-view-slider',
        `ai-training-view-slider-${id}`,
      ]);

    const $text = $('<div class="slider-text"></div>')
      .appendTo($element);
    const $input = $('<div class="slider-input"></div>')
      .appendTo($element);
    const $exploreValue = $('<span></span>')
      .text(initialValue);
    $('<label></label>')
      .html(`${title}: `)
      .append($exploreValue)
      .appendTo($text);

    if (props.limitLabels) {
      const [minLabel, maxLabel] = props.limitLabels;
      $('<span></span>')
        .addClass(['slider-limit', 'slider-limit-min'])
        .text(minLabel)
        .attr('data-i18n-text', `ai-training-view-slider-${id}-limit-min`)
        .appendTo($text);
      $('<span></span>')
        .addClass(['slider-limit', 'slider-limit-max'])
        .text(maxLabel)
        .attr('data-i18n-text', `ai-training-view-slider-${id}-limit-max`)
        .appendTo($text);
    }

    const $exploreSlider = $('<input type="range"></input>')
      .addClass('form-control-range')
      .attr(options)
      .on('change', () => {
        changeCallback(Number($exploreSlider.val()));
        $exploreValue.text(Number($exploreSlider.val()));
      })
      .val(initialValue)
      .appendTo($input);

    return $element;
  }
}

module.exports = AITrainingView;


/***/ }),

/***/ "./src/js/cfg-loader/cfg-loader.js":
/*!*****************************************!*\
  !*** ./src/js/cfg-loader/cfg-loader.js ***!
  \*****************************************/
/***/ ((module) => {

class CfgLoader {
  constructor(cfgReader, cfgParser) {
    this.reader = cfgReader;
    this.parser = cfgParser;
  }

  async load(files) {
    const segments = [];
    const promises = [];

    files.forEach((file, i) => {
      promises.push(
        this.reader(file)
          .then(cfgText => this.parser(cfgText))
          .then((cfgSegment) => {
            // We keep the segments in order
            segments[i] = cfgSegment;
          })
      );
    });

    return Promise.all(promises).then(() => Object.assign({}, ...segments));
  }
}

module.exports = CfgLoader;


/***/ }),

/***/ "./src/js/cfg-loader/cfg-reader-fetch.js":
/*!***********************************************!*\
  !*** ./src/js/cfg-loader/cfg-reader-fetch.js ***!
  \***********************************************/
/***/ ((module) => {

function CfgReaderFetch(filename) {
  return fetch(filename, { cache: 'no-store' })
    .then(response => response.status === 200? response.text() : '');
}

module.exports = CfgReaderFetch;


/***/ }),

/***/ "./src/js/editor/maze-browser.js":
/*!***************************************!*\
  !*** ./src/js/editor/maze-browser.js ***!
  \***************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const Maze = __webpack_require__(/*! ../maze.js */ "./src/js/maze.js");

class MazeBrowser {
  constructor($element, config, mazeStore, saveMode = false) {
    this.$element = $element;
    this.config = config;
    this.$selectedButton = null;
    this.selectedData = null;

    this.$element.addClass('maze-browser');

    const setSelection = (button) => {
      if (this.$selectedButton) {
        this.$selectedButton.removeClass('selected');
      }
      this.$selectedButton = $(button);
      this.$selectedButton.addClass('selected');
    };

    const buttons = Object.entries(
      saveMode ? mazeStore.getAllUserObjects() : mazeStore.getAllObjects()
    ).map(([id, mazeJSON]) => $('<div></div>')
      .addClass(['col-6', 'col-md-2', 'mb-3'])
      .append(
        $('<button></button>')
          .addClass('maze-browser-item')
          .append(this.createPreviewImage(mazeJSON))
          .pointerclick()
          .on('i.pointerclick', (ev) => {
            setSelection(ev.currentTarget);
            this.selectedData = id;
          })
      ));

    if (saveMode) {
      buttons.unshift($('<div></div>')
        .addClass(['col-6', 'col-md-2', 'mb-3'])
        .append($('<button></button>')
          .addClass('maze-browser-item-new')
          .on('click', (ev) => {
            setSelection(ev.currentTarget);
            this.selectedData = 'new';
          })));
    }

    this.$element.append($('<div class="row"></div>').append(buttons));
  }

  createPreviewImage(mazeJSON) {
    const maze = Maze.fromJSON(mazeJSON);
    const $canvas = $('<canvas class="maze-browser-item-preview"></canvas>')
      .attr({
        width: maze.map.width,
        height: maze.map.height,
      });
    const ctx = $canvas[0].getContext('2d');
    maze.map.allCells().forEach(([i, j, value]) => {
      ctx.fillStyle = (this.config.tileTypes && this.config.tileTypes[value].color) || '#000000';
      ctx.fillRect(i, j, 1, 1);
    });

    return $canvas;
  }
}

module.exports = MazeBrowser;


/***/ }),

/***/ "./src/js/editor/maze-editor-palette.js":
/*!**********************************************!*\
  !*** ./src/js/editor/maze-editor-palette.js ***!
  \**********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const EventEmitter = __webpack_require__(/*! events */ "./node_modules/events/events.js");

class MazeEditorPalette {
  constructor($container, config) {
    this.$container = $container;
    this.$element = $('<div></div>').appendTo(this.$container);
    this.config = config;
    this.activeButton = null;
    this.tileId = null;
    this.events = new EventEmitter();

    this.$element.addClass('maze-editor-palette');
    this.$bar1 = $('<div class="maze-editor-palette-bar"></div>')
      .appendTo(this.$element);
    this.$bar2 = $('<div class="maze-editor-palette-bar"></div>')
      .appendTo(this.$element);

    this.$bar1.append(this.buildActionButtons());

    this.$bar2.append(this.buildTileButtons(config));
    // this.$bar2.append($('<div class="separator"></div>'));
    // this.$bar2.append(this.buildToolButtons(config));
    // this.$bar2.append(this.buildItemButtons(config));
  }

  buildTileButtons(config) {
    return Object.entries(config.tileTypes)
      .filter(([, tileType]) => tileType.inPalette !== false)
      .map(([id, typeCfg]) => $('<div></div>')
        .addClass('item')
        .append(
          $('<button></button>')
            .attr({
              type: 'button',
              title: typeCfg.name,
            })
            .addClass([
              'editor-palette-button',
              'editor-palette-button-tile',
              `editor-palette-button-tile-${id}`,
            ])
            .css({
              backgroundColor: typeCfg.color,
              backgroundImage: typeCfg.editorIcon ? `url(${typeCfg.editorIcon})` : 'none',
            })
            .pointerclick()
            .on('i.pointerclick', (ev) => {
              if (this.activeButton) {
                this.activeButton.removeClass('active');
              }
              this.activeButton = $(ev.target);
              this.activeButton.addClass('active');
              this.tileId = Number(id);
              this.events.emit('change', 'tile', Number(id));
            })
        )
        .append($('<div></div>')
          .addClass('label')
          .attr('data-i18n-text', `editor-palette-button-tile-${id}`)));
  }

  buildToolButtons() {
    return MazeEditorPalette.Tools.map(tool => $('<button></button>')
      .attr({
        type: 'button',
        title: tool.title,
      })
      .addClass([
        'editor-palette-button',
        'editor-palette-button-tool',
        `editor-palette-button-tool-${tool.id}`,
      ])
      .css({
        backgroundImage: `url(${tool.icon})`,
      })
      .pointerclick()
      .on('i.pointerclick', (ev) => {
        if (this.activeButton) {
          this.activeButton.removeClass('active');
        }
        this.activeButton = $(ev.target);
        this.activeButton.addClass('active');
        this.events.emit('change', tool.id);
      }));
  }

  buildItemButtons(config) {
    return Object.entries(config.items)
      .filter(([, props]) => props.inPalette !== false)
      .map(([id, props]) => $('<button></button>')
        .attr({
          type: 'button',
          title: props.name,
        })
        .addClass([
          'editor-palette-button',
          'editor-palette-button-item',
          `editor-palette-button-item-${id}`,
        ])
        .css({
          backgroundImage: props.editorIcon ? `url(${props.editorIcon})` : 'none',
        })
        .pointerclick()
        .on('i.pointerclick', (ev) => {
          if (this.activeButton) {
            this.activeButton.removeClass('active');
          }
          this.activeButton = $(ev.target);
          this.activeButton.addClass('active');
          this.events.emit('change', 'item', id);
        }));
  }

  buildActionButtons() {
    return MazeEditorPalette.Actions.map(action => $('<button></button>')
      .attr({
        type: 'button',
        title: action.title,
      })
      .addClass([
        'editor-palette-button',
        'editor-palette-button-action',
        `editor-palette-button-action-${action.id}`,
      ])
      .css({
        backgroundImage: `url(${action.icon})`,
      })
      .pointerclick()
      .on('i.pointerclick', () => {
        this.events.emit('action', action.id);
      }));
  }
}

MazeEditorPalette.Tools = [
  {
    id: 'start',
    title: 'Set the starting point',
    icon: 'static/fa/robot-solid-blue.svg',
  },
  {
    id: 'erase',
    title: 'Remove items',
    icon: 'static/fa/times-solid.svg',
  },
];

MazeEditorPalette.Actions = [
  // {
  //   id: 'reset',
  //   title: 'Reset',
  //   icon: 'static/fa/sync-solid.svg',
  // },
  {
    id: 'load',
    title: 'Load maze',
    icon: 'static/fa/folder-open-solid.svg',
  },
  {
    id: 'save',
    title: 'Save maze',
    icon: 'static/fa/save-solid.svg',
  },
  {
    id: 'import',
    title: 'Import maze',
    icon: 'static/fa/file-import-solid.svg',
  },
  {
    id: 'export',
    title: 'Export maze',
    icon: 'static/fa/file-export-solid.svg',
  },
];

module.exports = MazeEditorPalette;


/***/ }),

/***/ "./src/js/editor/maze-editor.js":
/*!**************************************!*\
  !*** ./src/js/editor/maze-editor.js ***!
  \**************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const Maze = __webpack_require__(/*! ../maze.js */ "./src/js/maze.js");
const MazeView = __webpack_require__(/*! ../maze-view.js */ "./src/js/maze-view.js");
const ModalLoad = __webpack_require__(/*! ./modal-load.js */ "./src/js/editor/modal-load.js");
const ModalSave = __webpack_require__(/*! ./modal-save.js */ "./src/js/editor/modal-save.js");
const ModalExport = __webpack_require__(/*! ./modal-export.js */ "./src/js/editor/modal-export.js");
const ModalImport = __webpack_require__(/*! ./modal-import.js */ "./src/js/editor/modal-import.js");
const ObjectStore = __webpack_require__(/*! ./object-store.js */ "./src/js/editor/object-store.js");

class MazeEditor {
  constructor($element, maze, palette, config, textures) {
    this.$element = $element;
    this.maze = maze;
    this.palette = palette;
    this.config = config;

    this.mazeView = new MazeView(maze, config, textures, true);
    this.displayObject = this.mazeView.displayObject;

    const tools = {
      start: (x, y) => {
        if (this.maze.robots.length > 0) {
          this.maze.robots[0].setPosition(x, y);
        }
      },
      erase: (x, y) => {
        const item = this.maze.getItem(x, y);
        if (item && item.erasable) {
          this.maze.removeItem(x, y);
        }
      },
      tile: (tileType, x, y) => {
        if (this.maze.startPosition[0] === x && this.maze.startPosition[1] === y) {
          return;
        }
        this.maze.removeItem(x, y);
        this.maze.map.set(x, y, tileType);
        if (this.config.tileTypes[tileType].item !== undefined) {
          this.maze.placeItem(this.config.tileTypes[tileType].item, x, y, false);
        }
      },
      item: (itemType, x, y) => {
        if (this.maze.isWalkable(x, y)) {
          this.maze.placeItem(itemType, x, y);
        }
      },
    };

    this.toolHandler = null;
    this.palette.events.on('change', (tool, type = null) => {
      if (type !== null) {
        this.toolHandler = tools[tool].bind(this, type);
      } else {
        this.toolHandler = tools[tool].bind(this);
      }
    });

    this.palette.events.on('action', (id) => {
      if (this.actionHandlers[id]) {
        this.actionHandlers[id]();
      }
    });

    let lastEdit = null;
    this.mazeView.events.on('action', ([x, y], props) => {
      if (this.toolHandler !== null) {
        if (lastEdit && props.shiftKey) {
          const [lastX, lastY] = lastEdit;
          for (let i = Math.min(lastX, x); i <= Math.max(lastX, x); i += 1) {
            for (let j = Math.min(lastY, y); j <= Math.max(lastY, y); j += 1) {
              this.toolHandler(i, j);
            }
          }
        } else {
          this.toolHandler(x, y);
        }
        lastEdit = [x, y];
      }
    });

    this.objectStore = new ObjectStore();
    this.actionHandlers = {
      load: () => {
        const modal = new ModalLoad(this.config, this.objectStore);
        modal.show().then((id) => {
          const jsonMaze = id && this.objectStore.get(id);
          if (jsonMaze) {
            this.maze.copy(Maze.fromJSON(jsonMaze));
          }
        });
      },
      save: () => {
        const modal = new ModalSave(this.config, this.objectStore);
        modal.show().then((id) => {
          if (id) {
            this.objectStore.set(id === 'new' ? null : id, this.maze.toJSON());
          }
        });
      },
      import: () => {
        const modal = new ModalImport();
        modal.show().then((importedData) => {
          if (importedData) {
            this.maze.copy(Maze.fromJSON(importedData));
          }
        });
      },
      export: () => {
        const modal = new ModalExport(JSON.stringify(this.maze));
        modal.show();
      },
      reset: () => {
        this.maze.reset();
      },
    };
  }

  animate(time) {
    this.mazeView.animate(time);
  }

  getRobotView() {
    return this.mazeView.robotView;
  }
}

module.exports = MazeEditor;


/***/ }),

/***/ "./src/js/editor/modal-export.js":
/*!***************************************!*\
  !*** ./src/js/editor/modal-export.js ***!
  \***************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const Modal = __webpack_require__(/*! ../modal.js */ "./src/js/modal.js");

class ModalExport extends Modal {
  constructor(exportData) {
    super({
      title: 'Export maze',
    });

    this.$dataContainer = $('<textarea class="form-control"></textarea>')
      .attr({
        rows: 10,
      })
      .text(exportData)
      .appendTo(this.$body);

    this.$copyButton = $('<button></button>')
      .addClass(['btn', 'btn-outline-dark', 'btn-copy', 'mt-2'])
      .text('Copy to clipboard')
      .on('click', () => {
        this.$dataContainer[0].select();
        document.execCommand('copy');
        this.hide();
      })
      .appendTo(this.$footer);
  }
}

module.exports = ModalExport;


/***/ }),

/***/ "./src/js/editor/modal-import.js":
/*!***************************************!*\
  !*** ./src/js/editor/modal-import.js ***!
  \***************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const Modal = __webpack_require__(/*! ../modal.js */ "./src/js/modal.js");

class ModalImport extends Modal {
  constructor() {
    super({
      title: 'Import maze',
    });

    this.$dataContainer = $('<textarea class="form-control"></textarea>')
      .attr({
        rows: 10,
        placeholder: 'Paste the JSON object here.',
      })
      .appendTo(this.$body);

    // noinspection JSUnusedGlobalSymbols
    this.$errorText = $('<p class="text-danger"></p>')
      .appendTo(this.$footer)
      .hide();

    // noinspection JSUnusedGlobalSymbols
    this.$copyButton = $('<button></button>')
      .addClass(['btn', 'btn-primary'])
      .text('Import')
      .on('click', () => {
        try {
          const imported = JSON.parse(this.$dataContainer.val());
          this.hide(imported);
        } catch (err) {
          this.showError(err.message);
        }
      })
      .appendTo(this.$footer);
  }

  showError(errorText) {
    this.$errorText.html(errorText);
    this.$errorText.show();
  }
}

module.exports = ModalImport;


/***/ }),

/***/ "./src/js/editor/modal-load.js":
/*!*************************************!*\
  !*** ./src/js/editor/modal-load.js ***!
  \*************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const Modal = __webpack_require__(/*! ../modal.js */ "./src/js/modal.js");
const CityBrowser = __webpack_require__(/*! ./maze-browser.js */ "./src/js/editor/maze-browser.js");

class ModalLoad extends Modal {
  constructor(config, mazeStore) {
    super({
      title: 'Load maze',
      size: 'lg',
    });

    this.$browserContainer = $('<div></div>')
      .appendTo(this.$body);
    this.browser = new CityBrowser(this.$browserContainer, config, mazeStore);

    // noinspection JSUnusedGlobalSymbols
    this.$cancelButton = $('<button></button>')
      .addClass(['btn', 'btn-secondary'])
      .text('Cancel')
      .on('click', () => {
        this.hide(null);
      })
      .appendTo(this.$footer);

    // noinspection JSUnusedGlobalSymbols
    this.$loadButton = $('<button></button>')
      .addClass(['btn', 'btn-primary'])
      .text('Load')
      .on('click', () => {
        try {
          this.hide(this.browser.selectedData);
        } catch (err) {
          this.showError(err.message);
        }
      })
      .appendTo(this.$footer);
  }

  showError(errorText) {
    this.$errorText.html(errorText);
    this.$errorText.show();
  }
}

module.exports = ModalLoad;


/***/ }),

/***/ "./src/js/editor/modal-save.js":
/*!*************************************!*\
  !*** ./src/js/editor/modal-save.js ***!
  \*************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const Modal = __webpack_require__(/*! ../modal.js */ "./src/js/modal.js");
const MazeBrowser = __webpack_require__(/*! ./maze-browser.js */ "./src/js/editor/maze-browser.js");

class ModalSave extends Modal {
  constructor(config, mazeStore) {
    super({
      title: 'Save maze',
      size: 'lg',
    });

    this.$browserContainer = $('<div></div>')
      .appendTo(this.$body);
    this.browser = new MazeBrowser(this.$browserContainer, config, mazeStore, true);

    // noinspection JSUnusedGlobalSymbols
    this.$cancelButton = $('<button></button>')
      .addClass(['btn', 'btn-secondary'])
      .text('Cancel')
      .on('click', () => {
        this.hide(null);
      })
      .appendTo(this.$footer);

    // noinspection JSUnusedGlobalSymbols
    this.$saveButton = $('<button></button>')
      .addClass(['btn', 'btn-primary'])
      .text('Save')
      .on('click', () => {
        try {
          this.hide(this.browser.selectedData);
        } catch (err) {
          this.showError(err.message);
        }
      })
      .appendTo(this.$footer);
  }

  showError(errorText) {
    this.$errorText.html(errorText);
    this.$errorText.show();
  }
}

module.exports = ModalSave;


/***/ }),

/***/ "./src/js/editor/object-store.js":
/*!***************************************!*\
  !*** ./src/js/editor/object-store.js ***!
  \***************************************/
/***/ ((module) => {

class ObjectStore {
  constructor(fixedObjectsPath = null) {
    this.fixedObjects = [];
    this.userObjects = [];

    this.loadUserObjects();
    if (fixedObjectsPath) {
      this.loadFixedObjects(fixedObjectsPath);
    }
  }

  async loadFixedObjects(path) {
    fetch(path, { cache: 'no-store' })
      .then(response => response.json())
      .then((data) => {
        this.fixedObjects = data.mazes;
      });
  }

  loadUserObjects() {
    const userObjects = JSON.parse(localStorage.getItem('reinforcementLearning2.mazeStore.mazes'));
    if (userObjects) {
      this.userObjects = userObjects;
    }
  }

  saveLocal() {
    localStorage.setItem('reinforcementLearning2.mazeStore.mazes', JSON.stringify(this.userObjects));
  }

  getAllObjects() {
    return Object.assign(
      {},
      this.getAllUserObjects(),
      this.getAllFixedObjects(),
    );
  }

  getAllFixedObjects() {
    return Object.fromEntries(this.fixedObjects.map((obj, i) => [
      `F${i}`,
      obj,
    ]));
  }

  getAllUserObjects() {
    return Object.fromEntries(this.userObjects.map((obj, i) => [
      `L${i}`,
      obj,
    ]).reverse());
  }

  get(id) {
    if (id[0] === 'F') {
      return this.fixedObjects[id.substr(1)];
    }
    return this.userObjects[id.substr(1)];
  }

  set(id, obj) {
    if (id === null || this.userObjects[id.substr(1)] === undefined) {
      this.userObjects.push(obj);
    } else {
      this.userObjects[id.substr(1)] = obj;
    }
    this.saveLocal();
  }
}

module.exports = ObjectStore;


/***/ }),

/***/ "./src/js/exhibit/i18n.js":
/*!********************************!*\
  !*** ./src/js/exhibit/i18n.js ***!
  \********************************/
/***/ ((module) => {

/* globals IMAGINARY */

function getLanguage() {
  return IMAGINARY.i18n.getLang();
}

function setLanguage(code) {
  return IMAGINARY.i18n.setLang(code).then(() => {
    $('[data-i18n-text]').each((i, element) => {
      $(element).html(
        IMAGINARY.i18n.t($(element).data('i18n-text'))
      );
    });
  });
}

function init(config, initialLanguage) {
  return IMAGINARY.i18n.init({
    queryStringVariable: 'lang',
    translationsDirectory: 'tr',
    defaultLanguage: 'en',
  })
    .then(() => {
      const languages = Object.keys(config.languages);
      return Promise.all(languages.map(code => IMAGINARY.i18n.loadLang(code)));
    })
    .then(() => {
      return setLanguage(initialLanguage);
    });
}

module.exports = {
  init,
  getLanguage,
  setLanguage,
};


/***/ }),

/***/ "./src/js/grid.js":
/*!************************!*\
  !*** ./src/js/grid.js ***!
  \************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const EventEmitter = __webpack_require__(/*! events */ "./node_modules/events/events.js");
const Array2D = __webpack_require__(/*! ./lib/array-2d.js */ "./src/js/lib/array-2d.js");

/**
 * Represents a 2D grid map that stores a single Number per cell
 */
class Grid {
  /**
   * Create a new grid
   *
   * @param {number} width
   * @param {number} height
   * @param {number[][]} cells
   */
  constructor(width, height, cells = null) {
    this.width = width;
    this.height = height;
    this.cells = cells || Array2D.create(width, height, 0);
    this.events = new EventEmitter();
  }

  /**
   * Create a new Grid from a JSON string
   *
   * @param jsonObject {object} JSON object
   * @return {Grid}
   */
  static fromJSON(jsonObject) {
    const { width, height, cells } = jsonObject;
    return new Grid(width, height, cells);
  }

  /**
   * Serializes to a JSON object
   * @return {{cells: number[][], width: number, height: number}}
   */
  toJSON() {
    return {
      width: this.width,
      height: this.height,
      cells: Array2D.clone(this.cells),
    };
  }

  copy(grid) {
    this.width = grid.width;
    this.height = grid.height;
    this.replace(grid.cells);
  }

  /**
   * Retrieves the value at (x,y)
   *
   * @param {number} x
   * @param {number} y
   * @return {number}
   */
  get(x, y) {
    return this.cells[y][x];
  }

  /**
   * Set the value at (x, y)
   *
   * @fires Grid.events#update
   *
   * @param {number} x
   * @param {number} y
   * @param {number} value
   */
  set(x, y, value) {
    this.cells[y][x] = value;

    /**
     * Update event.
     *
     * Argument is an array of updated cells. Each updated cell is represented
     * by an array with three elements: [x, y, value]
     *
     * @event Grid.events#update
     * @type {[[number, number, number]]}
     */
    this.events.emit('update', [[x, y, value]]);
  }

  /**
   * Backwards compatibility function that maps (x, y) to a single index in a flat array
   * @deprecated
   * @param x {number}
   * @param y {number}
   * @return {number}
   */
  offset(x, y) {
    return y * this.width + x;
  }

  replace(cells) {
    Array2D.copy(cells, this.cells);
    this.events.emit('update', this.allCells());
  }

  /**
   * Returns true if (x, y) are valid coordinates within the grid's bounds.
   *
   * @param {number} x
   * @param {number} y
   * @return {boolean}
   */
  isValidCoords(x, y) {
    return x >= 0 && y >= 0 && x < this.width && y < this.height;
  }

  /**
   * Returns all cells, represented as [x, y, value] arrays.
   *
   * @return {[[number, number, number]]}
   */
  allCells() {
    return Array2D.items(this.cells);
  }

  /**
   * Get cells adjacent to the cell at (i, j).
   *
   * Each cell is represented by an array of the form [i, j, value]
   * A cell has at most four adjacent cells, which share one side
   * (diagonals are not adjacent).
   *
   * @param {number} i
   * @param {number} j
   * @return {[[number, number, number]]}
   */
  adjacentCells(i, j) {
    return [[i, j - 1], [i + 1, j], [i, j + 1], [i - 1, j]]
      .filter(([x, y]) => this.isValidCoords(x, y))
      .map(([x, y]) => [x, y, this.get(x, y)]);
  }

  /**
   * Returns the cells around the cell at (i, j).
   *
   * Each cells returned is represented as an array [i, j, value].
   * Cells "around" are those reachable by no less than <distance> steps in
   * any direction, including diagonals.
   *
   * @param {number} i
   * @param {number} j
   * @param {number} distance
   * @return {[[number, number, number]]}
   */
  nearbyCells(i, j, distance = 1) {
    const coords = [];
    // Top
    for (let x = i - distance; x < i + distance; x += 1) {
      coords.push([x, j - distance]);
    }
    // Right
    for (let y = j - distance; y < j + distance; y += 1) {
      coords.push([i + distance, y]);
    }
    // Bottom
    for (let x = i + distance; x > i - distance; x -= 1) {
      coords.push([x, j + distance]);
    }
    // Left
    for (let y = j + distance; y > j - distance; y -= 1) {
      coords.push([i - distance, y]);
    }

    return coords
      .filter(([x, y]) => this.isValidCoords(x, y))
      .map(([x, y]) => [x, y, this.get(x, y)]);
  }

  stepDistance(x1, y1, x2, y2) {
    return Math.abs(x1 - x2) + Math.abs(y1 - y2);
  }
}

module.exports = Grid;


/***/ }),

/***/ "./src/js/hold-button.js":
/*!*******************************!*\
  !*** ./src/js/hold-button.js ***!
  \*******************************/
/***/ ((module) => {

/**
 * props:
 *  - holdTime: time in ms to hold the button
 */
function createHoldButton(props) {
  const $button = $('<button></button>')
    .attr({
      type: 'button',
    })
    .addClass('hold-button')
    .append(
      $('<span class="progress"></span>')
        .css({
          animationDuration: `${props.holdTime}ms`,
        })
    )
    .append(
      $('<span class="text"></span>')
    );

  let trackedPointerId = null;
  let holdTimeout = null;

  function startHolding() {
    if (holdTimeout !== null) {
      clearTimeout(holdTimeout);
      holdTimeout = null;
    }

    $button.addClass('held');
    holdTimeout = setTimeout(() => {
      holdTimeout = null;
      trackedPointerId = null;
      $button.trigger('hold');
      $button.removeClass('held');
    }, props.holdTime);
  }

  function abortHolding() {
    if (holdTimeout !== null) {
      clearTimeout(holdTimeout);
      holdTimeout = null;
    }
    $button.removeClass('held');
    trackedPointerId = null;
  }

  $(document)
    .on('pointerup', (ev) => {
      if (ev.pointerId === trackedPointerId) {
        abortHolding();
      }
    })
    .on('pointercancel', (ev) => {
      if (ev.pointerId === trackedPointerId) {
        abortHolding();
      }
    });

  $button.on('pointerdown', (ev) => {
    if (trackedPointerId === null) {
      ev.preventDefault();
      trackedPointerId = ev.pointerId;
      // On touch, apparently, the pointer is automatically captured by pointerdown
      ev.delegateTarget.releasePointerCapture(ev.pointerId);
      startHolding();
    }
  });

  return $button;
}

module.exports = createHoldButton;


/***/ }),

/***/ "./src/js/jquery-plugins/jquery.pointerclick.js":
/*!******************************************************!*\
  !*** ./src/js/jquery-plugins/jquery.pointerclick.js ***!
  \******************************************************/
/***/ (() => {

/**
 * This jQuery plugin adds an 'i.pointerclick' event that is fired on pointerdown followed by
 * a pointerup within the area of the original element.
 *
 * Install it by calling pointerclick() on a jQuery object:
 *
 * $('#my-element')
 *  .pointerclick()
 *  .on('i.pointerclick', function(event) {
 *    // do something
 *  });
 *
 *  This plugin was motivated because on multi-touch devices, the click event is not fired if a
 *  different part of the screen is being touched at the time.
 */
(function initPlugins($) {
  $.fn.pointerclick = function pointerClickHandler() {
    return this.each(function pointerClickElementHandler() {
      let trackedPointerId = null;

      $(document)
        .on('pointerup', (ev) => {
          if (ev.pointerId === trackedPointerId) {
            trackedPointerId = null;
            $(this).trigger('i.pointerup', ev);
          }
        })
        .on('pointercancel', (ev) => {
          if (ev.pointerId === trackedPointerId) {
            trackedPointerId = null;
            $(this).trigger('i.pointerup', ev);
          }
        });

      $(this)
        .on('pointerdown', (ev) => {
          ev.preventDefault();
          trackedPointerId = ev.pointerId;
          // On touch, apparently, the pointer is automatically captured by pointerdown
          ev.delegateTarget.releasePointerCapture(ev.pointerId);
          $(this).trigger('i.pointerdown', ev);
        })
        .on('pointerup', (ev) => {
          ev.preventDefault();
          if (ev.pointerId === trackedPointerId) {
            trackedPointerId = null;
            $(this).trigger('i.pointerup', ev);
            $(this).trigger('i.pointerclick', ev);
          }
        });
    });
  };
}(jQuery));


/***/ }),

/***/ "./src/js/keyboard-controller.js":
/*!***************************************!*\
  !*** ./src/js/keyboard-controller.js ***!
  \***************************************/
/***/ ((module) => {

function setupKeyControls(robot) {
  const keyMap = {
    ArrowLeft: () => { robot.go('w'); },
    ArrowRight: () => { robot.go('e'); },
    ArrowUp: () => { robot.go('n'); },
    ArrowDown: () => { robot.go('s'); },
  };

  window.addEventListener('keydown', (ev) => {
    if (keyMap[ev.code]) {
      keyMap[ev.code]();
      ev.preventDefault();
    }
  });
}

module.exports = setupKeyControls;


/***/ }),

/***/ "./src/js/lib/array-2d.js":
/*!********************************!*\
  !*** ./src/js/lib/array-2d.js ***!
  \********************************/
/***/ ((module) => {

/**
 * This class provides helper functions to work with 2D arrays.
 * (arrays of arrays)
 */
class Array2D {
  /**
   * Create and initialize a 2D Array
   *
   * @param width {number} Number of columns (inner arrays size)
   * @param height {number} Number of rows (outer array size)
   * @param initValue {any} Initial value for inner array items
   * @return {any[][]}
   */
  static create(width, height, initValue = 0) {
    const rows = [];
    for (let i = 0; i < height; i += 1) {
      const row = [];
      for (let j = 0; j < width; j += 1) {
        row[j] = initValue;
      }
      rows.push(row);
    }
    return rows;
  }

  /**
   * Creates a 2D array from a 1D array in cells[y * width + x] format
   *
   * @param width {number}
   * @param height {number}
   * @param cells {any[]}
   */
  static fromFlat(width, height, cells) {
    const answer = Array2D.create(width, height);
    for (let x = 0; x < width; x += 1) {
      for (let y = 0; y < height; y += 1) {
        answer[y][x] = cells[y * width + x];
      }
    }
    return answer;
  }

  /**
   * Returns a 1D array with the flattened contents of the 2D array
   * @return {*[]}
   */
  static flatten(a) {
    const items = [];
    for (let y = 0; y < a.length; y += 1) {
      for (let x = 0; x < a[y].length; x += 1) {
        items.push(a[y][x]);
      }
    }
    return items;
  }

  /**
   * Returns true if the argument is an array of arrays and every inner
   * array has the same length.
   *
   * @param a {any[][]}
   * @return {boolean}
   */
  static isValid(a) {
    return Array.isArray(a) && a.length > 0
      && Array.isArray(a[0]) && a[0].length > 0
      && a.every(row => row.length === a[0].length);
  }

  /**
   * Returns the size of a 2D array as [width, height]
   *
   * Assumes the argument is a valid 2D Array.
   *
   * @param a {any[][]}
   * @return {number[]}
   */
  static size(a) {
    return [a[0].length, a.length];
  }

  /**
   * Clones the 2D Array.
   *
   * Assumes the argument is a valid 2D Array. The items in the 2D
   * array are not deep copied, only the outer and inner arrays.
   *
   * @param a {any[][]}
   * @return {any[][]}
   */
  static clone(a) {
    return a.map(row => Array.from(row));
  }

  /**
   * Copies the contents of a 2D array into another.
   *
   * Assumes the arguments are valid 2D arrays with the same size.
   *
   * @param src {any[][]}
   * @param dest {any[][]}
   */
  static copy(src, dest) {
    for (let i = 0; i < src.length; i += 1) {
      for (let j = 0; j < src[i].length; j += 1) {
        // eslint-disable-next-line no-param-reassign
        dest[i][j] = src[i][j];
      }
    }
  }

  /**
   * Sets all cells to a fixed value
   *
   * @param a {any[][]}
   * @param value {any}
   */
  static setAll(a, value) {
    for (let y = 0; y < a.length; y += 1) {
      for (let x = 0; x < a[y].length; x += 1) {
        a[y][x] = value;
      }
    }
  }

  /**
   * Returns all items as a flat array of [x, y, value] arrays.
   *
   * @param a {any[][]}
   * @return {[number, number, any][]}
   */
  static items(a) {
    const items = [];
    for (let y = 0; y < a.length; y += 1) {
      for (let x = 0; x < a[y].length; x += 1) {
        items.push([x, y, a[y][x]]);
      }
    }
    return items;
  }

  /**
   * @callback coordinateCallback
   * @param x {number}
   * @param y {number}
   * @return {any}
   */
  /**
   * Fills the items in the array with the result of a callback
   *
   * @param a {any[][]}
   * @param callback {coordinateCallback}
   */
  static fill(a, callback) {
    for (let y = 0; y < a.length; y += 1) {
      for (let x = 0; x < a[y].length; x += 1) {
        a[y][x] = callback(x, y);
      }
    }
  }

  /**
   * @callback reduceCallback
   * @param accumulator {any}
   * @param currentValue {any}
   * @param x {number}
   * @param y {number}
   */
  /**
   *
   * @param a {any[][]}
   * @param callback {reduceCallback}
   * @param initialValue {any}
   * @return {any}
   */
  static reduce(a, callback, initialValue) {
    let accumulator = initialValue;
    for (let y = 0; y < a.length; y += 1) {
      for (let x = 0; x < a[y].length; x += 1) {
        accumulator = callback(accumulator, a[y][x], x, y);
      }
    }
    return accumulator;
  }

  static forEach(a, callback) {
    for (let y = 0; y < a.length; y += 1) {
      for (let x = 0; x < a[y].length; x += 1) {
        callback(a[y][x], x, y);
      }
    }
  }

  static zip(a, b, callback) {
    const yMax = Math.min(a.length, b.length);
    for (let y = 0; y < yMax; y += 1) {
      const xMax = Math.min(a[y].length, b[y].length);
      for (let x = 0; x < xMax; x += 1) {
        callback(a[y][x], b[y][x], x, y);
      }
    }
  }
}

module.exports = Array2D;


/***/ }),

/***/ "./src/js/lib/pixi-helpers.js":
/*!************************************!*\
  !*** ./src/js/lib/pixi-helpers.js ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "screenCoordinates": () => (/* binding */ screenCoordinates)
/* harmony export */ });
/**
 * Converts PIXI coordinates to screen coordinates.
 *
 * @param { HTMLCanvasElement } view
 *  The canvas element.
 * @param { number } pixiX
 * @param { number } pixiY
 * @returns {[number, number]}
 */
function screenCoordinates(view, pixiX, pixiY) {
  const rect = view.getBoundingClientRect();
  const x = pixiX * (rect.width / view.width) + rect.left;
  const y = pixiY * (rect.height / view.height) + rect.top;
  return [x, y];
}


/***/ }),

/***/ "./src/js/lib/show-fatal-error.js":
/*!****************************************!*\
  !*** ./src/js/lib/show-fatal-error.js ***!
  \****************************************/
/***/ ((module) => {

function showFatalError(text, error) {
  $('<div></div>')
    .addClass('fatal-error')
    .append($('<div></div>')
      .addClass('fatal-error-text')
      .html(text))
    .append($('<div></div>')
      .addClass('fatal-error-details')
      .html(error.message))
    .appendTo('body');

  $('html').addClass('with-fatal-error');
}

module.exports = showFatalError;


/***/ }),

/***/ "./src/js/lib/shuffle.js":
/*!*******************************!*\
  !*** ./src/js/lib/shuffle.js ***!
  \*******************************/
/***/ ((module) => {

function shuffleArray(unshuffled) {
  return unshuffled
    .map(value => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value);
}

module.exports = { shuffleArray };


/***/ }),

/***/ "./src/js/maze-view-policy-overlay.js":
/*!********************************************!*\
  !*** ./src/js/maze-view-policy-overlay.js ***!
  \********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/* globals PIXI */
const MazeView = __webpack_require__(/*! ./maze-view.js */ "./src/js/maze-view.js");

const ARROW_TEXTURE_SCALE = 0.25;

class MazeViewPolicyOverlay {
  constructor(mazeView, ai, arrowTexture) {
    this.view = mazeView;
    this.ai = ai;
    this.arrowTexture = arrowTexture;
    this.fontSize = 22;
    this.padding = 18;

    this.visible = false;
    this.displayObject = new PIXI.Container();
    this.displayObject.visible = this.visible;

    this.backgrounds = [];
    this.arrows = [];
    this.texts = [];

    this.createBackgrounds();
    this.createArrows();
    this.createTexts();

    this.update();

    this.ai.events.on('update', () => {
      this.update();
    });

    this.ai.robot.maze.map.events.on('update', () => {
      this.update();
    });
  }

  toggle() {
    if (this.visible) {
      this.hide();
    } else {
      this.show();
    }
  }

  show() {
    this.visible = true;
    this.displayObject.visible = true;
  }

  hide() {
    this.visible = false;
    this.displayObject.visible = false;
  }

  createBackground(x, y) {
    const background = new PIXI.Graphics();

    background
      .clear()
      .beginFill(0xffffff, 0.75)
      .drawRect(0, 0, MazeView.TILE_SIZE, MazeView.TILE_SIZE)
      .endFill();

    background.x = MazeView.TILE_SIZE * x;
    background.y = MazeView.TILE_SIZE * y;

    this.displayObject.addChild(background);
    return background;
  }

  createBackgrounds() {
    const { height, width } = this.view.maze.map;

    for (let y = 0; y < height; y += 1) {
      this.backgrounds[y] = new Array(width);
      for (let x = 0; x < width; x += 1) {
        this.backgrounds[y][x] = this.createBackground(x, y);
      }
    }
  }

  createArrow(x, y, rotation) {
    const sprite = new PIXI.Sprite();
    sprite.texture = this.arrowTexture;
    sprite.roundPixels = true;
    sprite.width = MazeView.TILE_SIZE * ARROW_TEXTURE_SCALE;
    sprite.height = MazeView.TILE_SIZE * ARROW_TEXTURE_SCALE;
    sprite.anchor.set(0.5, 1);

    sprite.x = Math.round(MazeView.TILE_SIZE * (x + 0.5));
    sprite.y = Math.round(MazeView.TILE_SIZE * (y + 0.35));
    sprite.rotation = rotation;

    this.displayObject.addChild(sprite);

    return sprite;
  }

  createArrows() {
    const { height, width } = this.view.maze.map;

    for (let y = 0; y < height; y += 1) {
      this.arrows[y] = new Array(width);
      for (let x = 0; x < width; x += 1) {
        this.arrows[y][x] = {
          n: this.createArrow(x, y, MazeViewPolicyOverlay.Angles.n),
          e: this.createArrow(x, y, MazeViewPolicyOverlay.Angles.e),
          s: this.createArrow(x, y, MazeViewPolicyOverlay.Angles.s),
          w: this.createArrow(x, y, MazeViewPolicyOverlay.Angles.w),
        };
      }
    }
  }

  createTexts() {
    const { height, width } = this.view.maze.map;
    const options = { fontFamily: 'Arial', fontSize: this.fontSize, align: 'center' };

    for (let y = 0; y < height; y += 1) {
      this.texts[y] = new Array(width);
      for (let x = 0; x < width; x += 1) {
        const text = new PIXI.Text('', options);
        text.x = MazeView.TILE_SIZE * (x + 0.5) - text.width / 2;
        text.y = MazeView.TILE_SIZE * (y + 1) - (this.fontSize + this.padding);
        this.texts[y][x] = text;
        this.displayObject.addChild(text);
      }
    }
  }

  update() {
    const { robot } = this.ai;
    const { maze } = robot;

    for (let y = 0; y < this.arrows.length; y += 1) {
      for (let x = 0; x < this.arrows[y].length; x += 1) {
        const background = this.backgrounds[y][x];
        const arrows = this.arrows[y][x];
        const text = this.texts[y][x];
        if (maze.isWalkable(x, y)) {
          const validActions = Object.entries(this.ai.q[y][x])
            .filter((([d]) => robot.availableDirectionsAt(x, y).includes(d)));
          if (validActions.length) {
            // Get all the actions with the highest Q value
            const maxQ = Math.max(...validActions.map((([d, q]) => q)));
            const bestActions = validActions.filter(([, v]) => v === maxQ);
            const bestActionDirections = bestActions.map(([d]) => d);
            Object.keys(arrows).forEach((d) => {
              arrows[d].visible = bestActionDirections.includes(d);
            });
            text.text = this.ai.v[y][x].toFixed(2);
            text.x = MazeView.TILE_SIZE * (x + 0.5) - text.width / 2;
            background.visible = true;
            text.visible = true;
          } else {
            background.visible = false;
            text.visible = false;
            Object.keys(arrows).forEach((d) => {
              arrows[d].visible = false;
            });
          }
        } else {
          background.visible = false;
          text.visible = false;
          Object.keys(arrows).forEach((d) => {
            arrows[d].visible = false;
          });
        }
      }
    }
  }
}

MazeViewPolicyOverlay.Angles = {
  n: 0,
  e: Math.PI * 0.5,
  s: Math.PI,
  w: Math.PI * 1.5,
};

module.exports = MazeViewPolicyOverlay;


/***/ }),

/***/ "./src/js/maze-view-qarrow-overlay.js":
/*!********************************************!*\
  !*** ./src/js/maze-view-qarrow-overlay.js ***!
  \********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/* globals PIXI */
const MazeView = __webpack_require__(/*! ./maze-view.js */ "./src/js/maze-view.js");

class MazeViewQarrowOverlay {
  constructor(mazeView, ai) {
    this.view = mazeView;
    this.ai = ai;
    this.visible = false;
    this.displayObject = new PIXI.Container();
    this.displayObject.visible = this.visible;
    this.green = 0x78df65;
    this.red = 0xfc6159;

    this.height = 20;
    this.padding = 5;
    this.width = 40;
    this.baseTriangle = new PIXI.Polygon([
      // x, y,
      0, 0,
      -1 * this.width / 2, this.height,
      this.width / 2, this.height,
    ]);

    this.qUpperBound = this.ai.qUpperBound();
    this.qLowerBound = this.ai.qLowerBound();

    this.arrows = [];
    this.createArrows();
    this.update();

    this.ai.events.on('update', () => {
      this.update();
    });

    this.ai.robot.maze.map.events.on('update', () => {
      this.update();
    });
  }

  toggle() {
    if (this.visible) {
      this.hide();
    } else {
      this.show();
    }
  }

  show() {
    this.visible = true;
    this.displayObject.visible = true;
  }

  hide() {
    this.visible = false;
    this.displayObject.visible = false;
  }

  static directionColor(direction) {
    switch (direction) {
      case 'n':
        return 0xff0000;
      case 'e':
        return 0x00ff00;
      case 's':
        return 0x0000ff;
      case 'w':
        return 0xff00ff;
    }
  }

  static directionRotation(direction) {
    switch (direction) {
      case 'n':
        return 0;
      case 'e':
        return Math.PI * 0.5;
      case 's':
        return Math.PI;
      case 'w':
        return Math.PI * 1.5;
    }
  }

  coordinates(direction, x, y) {
    switch (direction) {
      case 'n':
        return [MazeView.TILE_SIZE * (x + 0.5),
                MazeView.TILE_SIZE * y + this.padding];
      case 's':
        return [MazeView.TILE_SIZE * (x + 0.5),
                MazeView.TILE_SIZE * (y + 1) - (this.padding)];
      case 'e':
        return [MazeView.TILE_SIZE * (x + 1) - (this.padding),
                MazeView.TILE_SIZE * (y + 0.5)];
      case 'w':
        return [MazeView.TILE_SIZE * x + this.padding,
                MazeView.TILE_SIZE * (y + 0.5)];
      default:
        break;
    }
  }

  createArrow(direction, x, y) {
    const [arrowX, arrowY] = this.coordinates(direction, x, y);
    const arrow = new PIXI.Graphics();
    this.drawArrow(arrow, this.arrowColor(x, y, direction), this.arrowOpacity(x, y, direction));
    arrow.x = arrowX;
    arrow.y = arrowY;
    arrow.rotation = MazeViewQarrowOverlay.directionRotation(direction);
    this.displayObject.addChild(arrow);
    return arrow;
  }

  drawArrow(arrow, color, opacity = 1.0) {
    arrow
      .clear()
      .beginFill(color, opacity)
      .drawPolygon(this.baseTriangle)
      .endFill();
  }

  createArrows() {
    const { height, width } = this.view.maze.map;
    const directions = ['n', 'e', 's', 'w'];

    for (let j = 0; j < height; j += 1) {
      this.arrows[j] = new Array(width);
      for (let i = 0; i < width; i += 1) {
        this.arrows[j][i] = Object.fromEntries(directions.map(d => [d, this.createArrow(d, i, j)]));
      }
    }
  }

  arrowColor(x, y, direction) {
    return this.ai.q[y][x][direction] > 0 ? this.green : this.red;
  }

   arrowOpacity(x, y, direction) {
    const bound = this.ai.q[y][x][direction] > 0 ? this.qUpperBound : this.qLowerBound;
    return bound === 0 ? 0 : 1 - Math.pow(1 - this.ai.q[y][x][direction] / bound, 0.3);
  }

  update() {
    const { robot } = this.ai;
    const { maze } = robot;

    this.qUpperBound = this.ai.qUpperBound();
    this.qLowerBound = this.ai.qLowerBound();

    for (let j = 0; j < this.arrows.length; j += 1) {
      for (let i = 0; i < this.arrows[j].length; i += 1) {
        Object.keys(this.arrows[j][i]).forEach((direction) => {
          const arrow = this.arrows[j][i][direction];
          if (maze.isWalkable(i, j) && robot.availableDirectionsAt(i, j).includes(direction)) {
            arrow.visible = true;
            this.drawArrow(arrow, this.arrowColor(i, j, direction), this.arrowOpacity(i, j, direction));
          } else {
            arrow.visible = false;
          }
        });
      }
    }
  }
}

module.exports = MazeViewQarrowOverlay;


/***/ }),

/***/ "./src/js/maze-view-qvalue-overlay.js":
/*!********************************************!*\
  !*** ./src/js/maze-view-qvalue-overlay.js ***!
  \********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/* globals PIXI */
const MazeView = __webpack_require__(/*! ./maze-view.js */ "./src/js/maze-view.js");

class MazeViewQvalueOverlay {
  constructor(mazeView, ai) {
    this.view = mazeView;
    this.ai = ai;
    this.visible = false;
    this.displayObject = new PIXI.Container();
    this.displayObject.visible = this.visible;

    this.fontSize = 18;
    this.padding = 2;

    this.texts = [];
    this.createTexts();
    this.update();

    this.ai.events.on('update', (x, y, direction) => {
      this.update();
    });

    this.ai.robot.maze.map.events.on('update', () => {
      this.update();
    });
  }

  toggle() {
    if (this.visible) {
      this.hide();
    } else {
      this.show();
    }
  }

  show() {
    this.visible = true;
    this.displayObject.visible = true;
  }

  hide() {
    this.visible = false;
    this.displayObject.visible = false;
  }

  createTexts() {
    const { height, width } = this.view.maze.map;
    const options = { fontFamily: 'Arial', fontSize: this.fontSize };

    const createText = (align) => {
      const text = new PIXI.Text('', Object.assign({}, options, { align }));
      this.displayObject.addChild(text);
      return text;
    };

    for (let j = 0; j < height; j += 1) {
      this.texts[j] = new Array(width);
      for (let i = 0; i < width; i += 1) {
        this.texts[j][i] = {
          n: createText('center'),
          s: createText('center'),
          e: createText('right'),
          w: createText('left'),
        };
      }
    }
  }

  positionText(text, x, y, direction) {
    switch (direction) {
      case 'n':
        text.x = MazeView.TILE_SIZE * (x + 0.5) - text.width / 2;
        text.y = MazeView.TILE_SIZE * y + this.padding;
        break;
      case 's':
        text.x = MazeView.TILE_SIZE * (x + 0.5) - text.width / 2;
        text.y = MazeView.TILE_SIZE * (y + 1) - (this.fontSize + this.padding);
        break;
      case 'e':
        text.x = MazeView.TILE_SIZE * (x + 1) - (text.width + this.padding);
        text.y = MazeView.TILE_SIZE * (y + 0.5) - (this.fontSize * 0.5);
        break;
      case 'w':
        text.x = MazeView.TILE_SIZE * x + this.padding;
        text.y = MazeView.TILE_SIZE * (y + 0.5) - (this.fontSize * 0.5);
        break;
      default:
        break;
    }
  }

  update() {
    const { robot } = this.ai;
    const { maze } = robot;

    for (let y = 0; y < this.texts.length; y += 1) {
      for (let x = 0; x < this.texts[y].length; x += 1) {
        const texts = this.texts[y][x];
        if (maze.isWalkable(x, y)) {
          const validActions = robot.availableDirectionsAt(x, y);

          Object.keys(texts).forEach((direction) => {
            if (validActions.includes(direction)) {
              const textObject = texts[direction];
              textObject.visible = true;
              textObject.text = this.ai.q[y][x][direction].toFixed(2);
              this.positionText(textObject, x, y, direction);
            } else {
              texts[direction].visible = false;
            }
          });
        } else {
          Object.keys(texts).forEach((direction) => {
            texts[direction].visible = false;
          });
        }
      }
    }
  }
}

module.exports = MazeViewQvalueOverlay;


/***/ }),

/***/ "./src/js/maze-view.js":
/*!*****************************!*\
  !*** ./src/js/maze-view.js ***!
  \*****************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/* globals PIXI */
const EventEmitter = __webpack_require__(/*! events */ "./node_modules/events/events.js");
const PencilCursor = __webpack_require__(/*! ../../static/fa/pencil-alt-solid.svg */ "./static/fa/pencil-alt-solid.svg");
const RobotView = __webpack_require__(/*! ./robot-view */ "./src/js/robot-view.js");
const Array2D = __webpack_require__(/*! ./lib/array-2d */ "./src/js/lib/array-2d.js");

class MazeView {
  constructor(maze, config, textures = { }, interactive = false) {
    this.displayObject = new PIXI.Container();
    this.tileLayer = new PIXI.Container();
    this.textureLayer = new PIXI.Container();
    this.itemLayer = new PIXI.Container();
    this.overlayLayer = new PIXI.Container();
    this.robotLayer = new PIXI.Container();
    this.displayObject.addChild(this.tileLayer);
    this.displayObject.addChild(this.textureLayer);
    this.displayObject.addChild(this.itemLayer);
    this.displayObject.addChild(this.overlayLayer);
    this.displayObject.addChild(this.robotLayer);

    this.maze = maze;
    this.config = config;
    this.textures = textures;
    this.events = new EventEmitter();

    this.floorTiles = Array2D.create(maze.map.width, maze.map.height, null);
    this.floorTextures = Array2D.create(maze.map.width, maze.map.height, null);
    this.visited = Array2D.create(maze.map.width, maze.map.height, false);

    this.robotView = null;

    const pointers = {};

    this.maze.map.allCells().forEach(([x, y]) => {
      const floorTile = new PIXI.Graphics();
      floorTile.x = x * MazeView.TILE_SIZE;
      floorTile.y = y * MazeView.TILE_SIZE;

      if (interactive) {
        floorTile.interactive = true;
        floorTile.on('pointerdown', (ev) => {
          pointers[ev.data.pointerId] = { lastTile: { x, y } };
          this.events.emit('action', [x, y], {
            shiftKey: ev.data.originalEvent.shiftKey,
          });
        });
        floorTile.cursor = `url(${PencilCursor}) 0 20, auto`;
      }
      this.floorTiles[y][x] = floorTile;

      const floorTexture = new PIXI.Sprite();
      floorTexture.x = x * MazeView.TILE_SIZE;
      floorTexture.y = y * MazeView.TILE_SIZE;
      floorTexture.width = MazeView.TILE_SIZE;
      floorTexture.height = MazeView.TILE_SIZE;
      floorTexture.roundPixels = true;
      this.floorTextures[y][x] = floorTexture;

      this.renderCell(x, y);
    });

    if (interactive) {
      this.tileLayer.interactive = true;
      this.tileLayer.on('pointermove', (ev) => {
        if (pointers[ev.data.pointerId] !== undefined) {
          const tileCoords = this.getCoordsAtPosition(ev.data.global);
          if (pointers[ev.data.pointerId].lastTile !== tileCoords) {
            if (tileCoords) {
              this.events.emit('action', [tileCoords.x, tileCoords.y], {
                shiftKey: ev.data.originalEvent.shiftKey,
              });
            }
            pointers[ev.data.pointerId].lastTile = tileCoords;
          }
        }
      });

      const onEndPointer = (ev) => {
        delete pointers[ev.data.pointerId];
      };

      this.tileLayer.on('pointerup', onEndPointer);
      this.tileLayer.on('pointerupoutside', onEndPointer);
      this.tileLayer.on('pointercancel', onEndPointer);
    }

    this.tileLayer.addChild(...Array2D.flatten(this.floorTiles));
    this.textureLayer.addChild(...Array2D.flatten(this.floorTextures));

    this.maze.map.events.on('update', this.handleMazeUpdate.bind(this));
    this.handleMazeUpdate(this.maze.map.allCells());

    const { robot } = this.maze;
    this.robotView = new RobotView(robot, MazeView.TILE_SIZE, this.textures.robot);

    robot.events.on('move', (direction, x1, y1, x2, y2, reward, tileType) => {
      if (direction) {
        this.robotView.moveTo(x2, y2);
      } else {
        this.robotView.teleport(x2, y2);
      }
      const reaction = this.config.tileTypes[this.maze.map.get(x2, y2)].react;
      if (reaction === 'always' || (reaction === 'once' && this.visited[y2][x2] === false)) {
        this.robotView.react(tileType, x2, y2);
      }
      this.visited[y2][x2] = true;
      this.renderCell(x2, y2);
    });

    robot.events.on('moveFailed', () => {
      this.robotView.nop();
    });

    robot.events.on('exited', () => {
      this.robotView.exitMaze();
    });

    robot.events.on('reset', () => {
      this.robotView.reset();
    });

    this.robotView.events.on('resetEnd', () => {
      this.maze.reset();
    });

    this.itemSprites = {};
    this.maze.items.forEach((item) => { this.createItemSprite(item); });
    this.maze.events.on('itemPlaced', (item) => {
      this.createItemSprite(item);
    });

    this.maze.events.on('itemRemoved', (item) => {
      this.removeItemSprite(item);
    });

    this.maze.events.on('itemPicked', (item) => {
      this.handleItemPicked(item);
    });

    this.maze.events.on('itemReset', (item) => {
      this.handleItemReset(item);
    });

    this.maze.events.on('reset', () => {
      Array2D.setAll(this.visited, false);
      this.handleMazeUpdate(this.maze.map.allCells());
    });

    this.robotLayer.addChild(this.robotView.sprite);
  }

  createItemSprite(item) {
    const textureScale = 0.5;
    const sprite = new PIXI.Sprite();
    sprite.x = item.x * MazeView.TILE_SIZE + MazeView.TILE_SIZE * 0.25;
    sprite.y = item.y * MazeView.TILE_SIZE + MazeView.TILE_SIZE * 0.25;
    sprite.width = MazeView.TILE_SIZE * textureScale;
    sprite.height = MazeView.TILE_SIZE * textureScale;
    sprite.roundPixels = true;
    sprite.texture = this.textures[`item-${item.type}`];

    this.itemSprites[item.id] = sprite;

    this.itemLayer.addChild(sprite);
  }

  removeItemSprite(item) {
    if (this.itemSprites[item.id]) {
      const sprite = this.itemSprites[item.id];
      this.itemLayer.removeChild(sprite);
      sprite.destroy();
      delete this.itemSprites[item.id];
    }
  }

  handleItemPicked(item) {
    if (this.itemSprites[item.id]) {
      this.itemSprites[item.id].visible = false;
    }
  }

  handleItemReset(item) {
    if (this.itemSprites[item.id]) {
      this.itemSprites[item.id].visible = true;
    }
  }

  getFloorTile(x, y) {
    return this.floorTiles[y][x];
  }

  getFloorTexture(x, y) {
    return this.floorTextures[y][x];
  }

  getCoordsAtPosition(globalPoint) {
    if (this.origin === undefined) {
      this.origin = new PIXI.Point();
    }
    this.origin = this.displayObject.getGlobalPosition(this.origin, false);

    const x = Math.floor((globalPoint.x - this.origin.x)
      / this.displayObject.scale.x / MazeView.TILE_SIZE);
    const y = Math.floor((globalPoint.y - this.origin.y)
      / this.displayObject.scale.y / MazeView.TILE_SIZE);

    return (x >= 0 && x < this.maze.map.width && y >= 0 && y < this.maze.map.height)
      ? { x, y } : null;
  }

  renderCell(i, j) {
    if (this.maze.startPosition[0] === i && this.maze.startPosition[1] === j) {
      this.renderStartCell(i, j);
    } else {
      this.renderFloor(i, j);
    }
  }

  renderStartCell(i, j) {
    this.getFloorTile(i, j)
      .clear()
      .lineStyle(10, 0x99ff99, 1)
      .beginFill(0xffffff)
      .drawRect(5, 5, MazeView.TILE_SIZE - 10, MazeView.TILE_SIZE - 10)
      .endFill();
  }

  renderFloor(i, j) {
    const tileTypeId = this.maze.map.get(i, j);
    const tileType = this.config.tileTypes[tileTypeId] || null;
    this.getFloorTile(i, j)
      .clear()
      .lineStyle(2, 0x0, 1)
      .beginFill(tileType ? Number(`0x${tileType.color.substr(1)}`) : 0, 1)
      .drawRect(0, 0, MazeView.TILE_SIZE, MazeView.TILE_SIZE)
      .endFill();

    if (tileType.texture !== undefined) {
      this.getFloorTexture(i, j).texture = this.visited[j][i] && tileType.textureVisited
        ? this.textures[`tile-${tileTypeId}-visited`] : this.textures[`tile-${tileTypeId}`];
      this.getFloorTexture(i, j).visible = true;
    } else {
      this.getFloorTexture(i, j).visible = false;
    }
  }

  handleMazeUpdate(updates) {
    updates.forEach(([i, j]) => {
      this.visited[j][i] = false;
      this.renderCell(i, j);
    });
  }

  addOverlay(displayObject) {
    this.overlayLayer.addChild(displayObject);
    this.overlayLayer.sortChildren();
  }

  animate(time) {
    this.robotView.animate(time);
  }

  getRobotView() {
    return this.robotView;
  }
}

MazeView.TILE_SIZE = 120;

module.exports = MazeView;


/***/ }),

/***/ "./src/js/maze.js":
/*!************************!*\
  !*** ./src/js/maze.js ***!
  \************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const EventEmitter = __webpack_require__(/*! events */ "./node_modules/events/events.js");
const Grid = __webpack_require__(/*! ./grid.js */ "./src/js/grid.js");
const Array2D = __webpack_require__(/*! ./lib/array-2d.js */ "./src/js/lib/array-2d.js");

class Maze {
  constructor(width, height, cells = null, config) {
    this.map = new Grid(width, height, cells);
    this.config = config;
    this.robot = null;
    this.items = [];
    this.lastItemId = 0;
    this.startPosition = [0, height - 1];

    this.events = new EventEmitter();
  }

  toJSON() {
    const { map } = this;
    return {
      map: map.toJSON(),
      items: this.items.map(({ type, x, y }) => ({ type, x, y })),
    };
  }

  static fromJSON(jsonObject) {
    const { map, items } = jsonObject;
    const { width, height } = map;
    const maze = new Maze(width, height, Array2D.clone(map.cells));
    (items || []).forEach(({ type, x, y }) => {
      maze.placeItem(type, x, y);
    });
    return maze;
  }

  copy(maze) {
    this.map.copy(maze.map);
    this.clearItems();
    (maze.items || []).forEach(({ type, x, y }) => {
      this.placeItem(type, x, y);
    });
    this.lastItemId = maze.lastItemId;
  }

  addRobot(robot) {
    if (this.robot) {
      throw new Error('Robot already exists');
    }
    this.robot = robot;
    robot.maze = this;
    // Put the robot in the lower left corner
    const [startX, startY] = this.startPosition;
    robot.x = startX;
    robot.y = startY;
  }

  placeItem(type, x, y, erasable=true) {
    this.removeItem(x, y);
    this.lastItemId += 1;
    const newItem = {
      id: this.lastItemId,
      type,
      x,
      y,
      picked: false,
      erasable,
    };
    this.items.push(newItem);
    this.events.emit('itemPlaced', newItem);
  }

  getTileType(x, y) {
    return this.config.tileTypes
      && this.config.tileTypes[this.map.get(x, y)]
      && this.config.tileTypes[this.map.get(x, y)].type;
  }

  getItem(x, y) {
    const found = this.items.find(item => item.x === x && item.y === y);
    return found;
  }

  removeItem(x, y) {
    const item = this.getItem(x, y);
    if (item) {
      this.events.emit('itemRemoved', item);
      this.items = this.items.filter(any => any.id !== item.id);
    }
  }

  pickItem(x, y) {
    const item = this.getItem(x, y);
    if (item && !item.picked) {
      this.events.emit('itemPicked', item);
      item.picked = true;
      return item;
    }
    return null;
  }

  clearItems() {
    this.items.forEach((item) => {
      this.events.emit('itemRemoved', item);
    });
    this.items = [];
  }

  isWalkable(x, y) {
    return this.config.tileTypes
      && this.config.tileTypes[this.map.get(x, y)]
      && this.config.tileTypes[this.map.get(x, y)].walkable;
  }

  isExit(x, y) {
    return this.config.tileTypes
      && this.config.tileTypes[this.map.get(x, y)]
      && this.config.tileTypes[this.map.get(x, y)].exit;
  }

  reset() {
    this.items.forEach((item) => {
      item.picked = false;
      this.events.emit('itemReset', item);
    });
    this.events.emit('reset');
  }

  getItemReward(item) {
    return (this.config.items[item.type] && this.config.items[item.type].reward) || 0;
  }

  getPositionReward(x, y) {
    return (
      this.config.tileTypes[this.map.get(x, y)]
      && this.config.tileTypes[this.map.get(x, y)].reward
    ) || 0;
  }
}

module.exports = Maze;


/***/ }),

/***/ "./src/js/modal.js":
/*!*************************!*\
  !*** ./src/js/modal.js ***!
  \*************************/
/***/ ((module) => {

class Modal {
  /**
   * @param {object} options
   *  Modal dialog options
   * @param {string} options.title
   *  Dialog title.
   * @param {string} options.size
   *  Modal size (lg or sm).
   * @param {boolean} options.showCloseButton
   *  Shows a close button in the dialog if true.
   * @param {boolean} options.showFooter
   *  Adds a footer area to the dialog if true.
   */
  constructor(options) {
    this.returnValue = null;

    this.$element = $('<div class="modal fade"></div>');
    this.$dialog = $('<div class="modal-dialog"></div>').appendTo(this.$element);
    this.$content = $('<div class="modal-content"></div>').appendTo(this.$dialog);
    this.$header = $('<div class="modal-header"></div>').appendTo(this.$content);
    this.$body = $('<div class="modal-body"></div>').appendTo(this.$content);
    this.$footer = $('<div class="modal-footer"></div>').appendTo(this.$content);

    this.$closeButton = $('<button type="button" class="close" data-dismiss="modal">')
      .append($('<span>&times;</span>'))
      .appendTo(this.$header);

    if (options.title) {
      $('<h5 class="modal-title"></h5>')
        .html(options.title)
        .prependTo(this.$header);
    }
    if (options.size) {
      this.$dialog.addClass(`modal-${options.size}`);
    }

    if (options.showCloseButton === false) {
      this.$closeButton.remove();
    }
    if (options.showFooter === false) {
      this.$footer.remove();
    }
  }

  async show() {
    return new Promise((resolve) => {
      $('body').append(this.$element);
      this.$element.modal();
      this.$element.on('hidden.bs.modal', () => {
        this.$element.remove();
        resolve(this.returnValue);
      });
    });
  }

  hide(returnValue) {
    this.returnValue = returnValue;
    this.$element.modal('hide');
  }
}

module.exports = Modal;


/***/ }),

/***/ "./src/js/qlearning-ai.js":
/*!********************************!*\
  !*** ./src/js/qlearning-ai.js ***!
  \********************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const EventEmitter = __webpack_require__(/*! events */ "./node_modules/events/events.js");
const Robot = __webpack_require__(/*! ./robot.js */ "./src/js/robot.js");
const { shuffleArray } = __webpack_require__(/*! ./lib/shuffle */ "./src/js/lib/shuffle.js");

class QLearningAI {
  constructor(robot) {
    this.robot = robot;
    // Q-table: Q^*(x, y, a) -> Q-value
    this.q = this.initQ();
    // Estimation of the value function: V^*(x, y) -> v
    this.v = this.initV();
    // A table where we keep the last reward received: R^*(x, y) -> r
    this.r = this.initR();

    this.learningRate = 1;
    this.discountFactor = 1;
    this.exploreRate = 0.2;
    this.learning = true;

    this.events = new EventEmitter();

    this.robot.events.on('move', (direction, x1, y1, x2, y2, reward) => {
      if (this.learning && direction !== null) {
        this.update(direction, x1, y1, x2, y2, reward);
      }
    });
  }

  initQ() {
    const { height, width } = this.robot.maze.map;
    const table = new Array(height);

    for (let j = 0; j < height; j += 1) {
      table[j] = new Array(width);
      for (let i = 0; i < width; i += 1) {
        table[j][i] = Object.fromEntries(
          Object.keys(Robot.Directions).map(direction => [direction, 0])
        );
      }
    }

    return table;
  }

  initV() {
    const { height, width } = this.robot.maze.map;
    const table = new Array(height);
    for (let j = 0; j < height; j += 1) {
      table[j] = new Array(width);
      for (let i = 0; i < width; i += 1) {
        table[j][i] = 0;
      }
    }

    return table;
  }

  initR() {
    return this.initV();
  }

  clear() {
    this.q = this.initQ();
    this.v = this.initV();
    this.r = this.initR();
    this.events.emit('update');
  }

  greedyPolicy() {
    const { x, y } = this.robot;
    const directions = this.robot.availableDirections();
    const dirValuePairs = Object.entries(this.q[y][x])
      .filter(([direction]) => directions.includes(direction));
    if (dirValuePairs.length > 0) {
      return shuffleArray(dirValuePairs).sort(([, valA], [, valB]) => valA - valB)
        .pop()[0];
    }
    return null;
  }

  randomPolicy() {
    const directions = this.robot.availableDirections();
    if (directions.length) {
      return directions[Math.floor(Math.random() * directions.length)];
    }
    return null;
  }

  epsilonGreedyPolicy() {
    if (Math.random() >= this.exploreRate) {
      return this.greedyPolicy();
    }
    return this.randomPolicy();
  }

  step() {
    const direction = this.epsilonGreedyPolicy();
    if (direction) {
      this.robot.go(direction);
    } else {
      this.robot.failMove();
    }
  }

  maxQ(x, y) {
    const directions = this.robot.availableDirectionsAt(x, y);
    return directions.length > 0
      ? Math.max(...Object.entries(this.q[y][x])
        .filter(([direction]) => directions.includes(direction))
        .map(([, value]) => value))
      : 0;
  }

  minQ(x, y) {
    const directions = this.robot.availableDirectionsAt(x, y);
    return directions.length > 0
      ? Math.min(...Object.entries(this.q[y][x])
        .filter(([direction]) => directions.includes(direction))
        .map(([, value]) => value))
      : 0;
  }

  qUpperBound() {
    let bound = 0;
    for (let y = 0; y !== this.q.length; y += 1) {
      for (let x = 0; x !== this.q[y].length; x += 1) {
        bound = Math.max(bound, this.maxQ(x, y));
      }
    }
    return bound;
  }

  qLowerBound() {
    let bound = 0;
    for (let y = 0; y !== this.q.length; y += 1) {
      for (let x = 0; x !== this.q[y].length; x += 1) {
        bound = Math.min(bound, this.minQ(x, y));
      }
    }
    return bound;
  }

  update(direction, x1, y1, x2, y2, reward) {
    this.q[y1][x1][direction] += this.learningRate
      * (reward + this.discountFactor * this.maxQ(x2, y2) - this.q[y1][x1][direction]);

    this.r[y2][x2] = reward;
    // According to Tom Mitchell's book "Machine Learning" (1997), ch.13
    // V^*(s) = max_a Q^*(s, a)
    // See: https://datascience.stackexchange.com/a/16724
    // this.v[y1][x1] = this.maxQ(x1, y1)
    // However, the value function approximates what the expected return is from being in a
    // state and following a policy. In the above formula, "being" in a state doesn't include
    // the reward (or penalty) we received when we moved to said state.
    // So, for a more "illustrative" value of how good or bad a state is, we could add the reward.
    this.v[y1][x1] = this.maxQ(x1, y1) + this.r[y1][x1];
    // The problem with this formula is that V no longer matches the policy we're following.
    // There are cases where Q values for two actions are the same, thus the policy can choose
    // either at random (which we display with a two-pointed arrow), but the V for the two
    // states is different. This is maybe not wrong, but can appear counter-intuitive.

    this.events.emit('update');
  }
}

module.exports = QLearningAI;


/***/ }),

/***/ "./src/js/reaction-controller.js":
/*!***************************************!*\
  !*** ./src/js/reaction-controller.js ***!
  \***************************************/
/***/ ((module) => {

class ReactionController {
  constructor(container, config) {
    this.container = container;
    this.config = config;

    this.reactions = Object.fromEntries(
      Object.entries(this.config.tileTypes)
        .filter(([, props]) => props.reaction)
        .map(([, props]) => [props.type, props.reaction])
    );
  }

  launchReaction(type, x, y) {
    if (this.reactions[type]) {
      const reaction = $('<div></div>')
        .addClass(['reaction', `reaction-${type}`])
        .css({
          left: x,
          top: y,
          backgroundImage: `url(${this.reactions[type]})`,
        })
        .appendTo(this.container);
      setTimeout(() => {
        reaction.addClass('fading');
      }, 0);
      setTimeout(() => {
        reaction.remove();
      }, 1000);
    }
  }
}

module.exports = ReactionController;


/***/ }),

/***/ "./src/js/robot-view.js":
/*!******************************!*\
  !*** ./src/js/robot-view.js ***!
  \******************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/* globals PIXI */
const EventEmitter = __webpack_require__(/*! events */ "./node_modules/events/events.js");

class RobotView {
  constructor(robot, tileSize, texture) {
    this.robot = robot;
    this.tileSize = tileSize;
    this.events = new EventEmitter();

    this.speed = RobotView.Speed.DEFAULT;

    this.sprite = RobotView.createSprite(tileSize, texture);
    this.sprite.x = this.robot.x * this.tileSize;
    this.sprite.y = this.robot.y * this.tileSize;
    this.defaultScale = {
      x: this.sprite.scale.x,
      y: this.sprite.scale.y,
    };

    this.animationQueue = [];
  }

  static createSprite(tileSize, texture) {
    const sprite = new PIXI.Sprite();
    sprite.width = tileSize;
    sprite.height = tileSize;
    sprite.roundPixels = true;
    sprite.texture = texture;

    return sprite;
  }

  teleport(x, y) {
    this.animationQueue.push({ type: 'teleport', x, y });
  }

  moveTo(x, y) {
    this.animationQueue.push({ type: 'move', x, y });
  }

  exitMaze() {
    this.animationQueue.push({ type: 'delay', time: 60 });
  }

  react(reaction, x, y) {
    this.animationQueue.push({ type: 'react', reaction, x, y });
    if (reaction === 'pit') {
      this.animationQueue.push({ type: 'fall', x, y, time: 30 });
    }
  }

  reset() {
    this.animationQueue.push({ type: 'reset' });
  }

  nop() {
    this.animationQueue.push({ type: 'delay', time: 20 });
  }

  animateReact(time, animation) {
    animation.done = true;
  }

  animateTeleport(time, animation) {
    this.sprite.x = animation.x * this.tileSize;
    this.sprite.y = animation.y * this.tileSize;
    animation.done = true;
  }

  animateMove(time, animation) {
    const destX = animation.x * this.tileSize;
    const destY = animation.y * this.tileSize;
    const deltaX = destX - this.sprite.x;
    const deltaY = destY - this.sprite.y;

    this.sprite.x += Math.min(Math.abs(deltaX), time * this.speed) * Math.sign(deltaX);
    this.sprite.y += Math.min(Math.abs(deltaY), time * this.speed) * Math.sign(deltaY);

    if (this.sprite.x === destX && this.sprite.y === destY) {
      animation.done = true;
    }
  }

  animateFall(time, animation) {
    if (animation.elapsed === undefined) {
      animation.elapsed = 0;
    }
    animation.elapsed += (time) * (this.speed / RobotView.Speed.DEFAULT);
    const progress = Math.min(animation.elapsed, animation.time) / animation.time;
    this.sprite.scale.x = 0.8 * (1 - progress) + 0.2;
    this.sprite.scale.y = 0.8 * (1 - progress) + 0.2;
    this.sprite.x = animation.x * this.tileSize + (this.tileSize - this.sprite.width) / 2;
    this.sprite.y = animation.y * this.tileSize + (this.tileSize - this.sprite.height) / 2;
    this.sprite.alpha = 0.8 * (1 - progress) + 0.2;
    if (animation.elapsed >= animation.time) {
      animation.done = true;
    }
  }

  animateDelay(time, animation) {
    if (animation.elapsed === undefined) {
      animation.elapsed = 0;
    }
    animation.elapsed += (time) * (this.speed / RobotView.Speed.DEFAULT);
    if (animation.elapsed >= animation.time) {
      animation.done = true;
    }
  }

  animateReset(time, animation) {
    this.sprite.alpha = 1;
    this.sprite.scale.x = this.defaultScale.x;
    this.sprite.scale.y = this.defaultScale.y;
    animation.done = true;
  }

  animate(time) {
    if (this.animationQueue.length !== 0) {
      switch (this.animationQueue[0].type) {
        case 'move':
          this.animateMove(time, this.animationQueue[0]);
          break;
        case 'teleport':
          this.animateTeleport(time, this.animationQueue[0]);
          break;
        case 'delay':
          this.animateDelay(time, this.animationQueue[0]);
          break;
        case 'react':
          this.animateReact(time, this.animationQueue[0]);
          break;
        case 'fall':
          this.animateFall(time, this.animationQueue[0]);
          break;
        case 'reset':
          this.animateReset(time, this.animationQueue[0]);
          break;
        default:
          throw new Error(`Unknown animation type: ${this.animationQueue[0].type}`);
      }

      if (this.animationQueue[0].done) {
        this.events.emit(`${this.animationQueue[0].type}End`, this.animationQueue[0]);
        this.animationQueue.shift();
      }

      if (this.animationQueue.length === 0) {
        this.events.emit('idle');
      }
    }
  }
}

RobotView.Speed = {
  SLOW: 5,
  DEFAULT: 10,
  TURBO: 30,
};

module.exports = RobotView;


/***/ }),

/***/ "./src/js/robot.js":
/*!*************************!*\
  !*** ./src/js/robot.js ***!
  \*************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const EventEmitter = __webpack_require__(/*! events */ "./node_modules/events/events.js");

class Robot {
  constructor() {
    this.maze = null;
    this.x = 0;
    this.y = 0;
    this.score = 0;
    this.canMove = true;

    this.events = new EventEmitter();
  }

  setPosition(x, y) {
    const oldX = this.x;
    const oldY = this.y;
    this.x = x;
    this.y = y;
    this.onMoved(null, oldX, oldY, x, y);
  }

  canMoveTo(x, y) {
    return this.canMove
      && this.maze
      && this.maze.map.isValidCoords(x, y)
      && this.maze.isWalkable(x, y)
      && this.maze.map.stepDistance(this.x, this.y, x, y) === 1;
  }

  canMoveFromTo(x1, y1, x2, y2) {
    return this.maze.map.isValidCoords(x2, y2)
      && this.maze.isWalkable(x2, y2)
      && !this.maze.isExit(x1, y1)
      && this.maze.map.stepDistance(x1, y1, x2, y2) === 1;
  }

  moveTo(direction, x, y) {
    if (this.canMoveTo(x, y)) {
      const oldX = this.x;
      const oldY = this.y;
      this.x = x;
      this.y = y;
      this.onMoved(direction, oldX, oldY, x, y);
    } else {
      this.onMoveFailed(direction, this.x, this.y, x, y);
    }
  }

  failMove() {
    this.onMoveFailed(null, this.x, this.y, null, null);
  }

  reset() {
    const [x, y] = this.maze.startPosition;
    this.resetScore();
    this.setPosition(x, y);

    this.events.emit('reset');
  }

  onMoved(direction, oldX, oldY, x, y) {
    let reward = 0;
    reward += this.maze.getPositionReward(x, y);
    const item = this.maze.pickItem(x, y);
    if (item) {
      reward += this.maze.getItemReward(item);
    }
    this.events.emit('move', direction, oldX, oldY, x, y, reward, this.maze.getTileType(x, y));
    this.addScore(reward);

    if (this.maze.isExit(x, y)) {
      this.onExit(x, y);
    }
  }

  onMoveFailed(direction, oldX, oldY, x, y) {
    this.events.emit('moveFailed', direction, oldX, oldY, x, y);
  }

  onExit(x, y) {
    this.events.emit('exited', x, y);
    this.reset();
  }

  availableDirections() {
    return Object.keys(Robot.Directions)
      .filter(dir => this.canMoveTo(
        this.x + Robot.Directions[dir][0],
        this.y + Robot.Directions[dir][1]
      ));
  }

  availableDirectionsAt(x, y) {
    return Object.keys(Robot.Directions)
      .filter(dir => this.canMoveFromTo(
        x,
        y,
        x + Robot.Directions[dir][0],
        y + Robot.Directions[dir][1]
      ));
  }

  go(direction) {
    const [deltaX, deltaY] = Robot.Directions[direction];
    this.moveTo(direction, this.x + deltaX, this.y + deltaY);
  }

  resetScore() {
    this.score = 0;
  }

  addScore(amount) {
    this.score += amount;
    this.events.emit('scoreChanged', amount, this.score);
  }
}

Robot.Directions = {
  n: [0, -1],
  s: [0, 1],
  e: [1, 0],
  w: [-1, 0],
};

module.exports = Robot;


/***/ }),

/***/ "./static/fa/pencil-alt-solid.svg":
/*!****************************************!*\
  !*** ./static/fa/pencil-alt-solid.svg ***!
  \****************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
module.exports = __webpack_require__.p + "2174451d87ee3f5a3181.svg";

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/global */
/******/ 	(() => {
/******/ 		__webpack_require__.g = (function() {
/******/ 			if (typeof globalThis === 'object') return globalThis;
/******/ 			try {
/******/ 				return this || new Function('return this')();
/******/ 			} catch (e) {
/******/ 				if (typeof window === 'object') return window;
/******/ 			}
/******/ 		})();
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/publicPath */
/******/ 	(() => {
/******/ 		var scriptUrl;
/******/ 		if (__webpack_require__.g.importScripts) scriptUrl = __webpack_require__.g.location + "";
/******/ 		var document = __webpack_require__.g.document;
/******/ 		if (!scriptUrl && document) {
/******/ 			if (document.currentScript)
/******/ 				scriptUrl = document.currentScript.src
/******/ 			if (!scriptUrl) {
/******/ 				var scripts = document.getElementsByTagName("script");
/******/ 				if(scripts.length) scriptUrl = scripts[scripts.length - 1].src
/******/ 			}
/******/ 		}
/******/ 		// When supporting browsers where an automatic publicPath is not supported you must specify an output.publicPath manually via configuration
/******/ 		// or pass an empty string ("") and set the __webpack_public_path__ variable from your code to use your own logic.
/******/ 		if (!scriptUrl) throw new Error("Automatic publicPath is not supported in this browser");
/******/ 		scriptUrl = scriptUrl.replace(/#.*$/, "").replace(/\?.*$/, "").replace(/\/[^\/]+$/, "/");
/******/ 		__webpack_require__.p = scriptUrl;
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!************************!*\
  !*** ./src/js/main.js ***!
  \************************/
/* eslint-disable no-console */
/* globals PIXI */
__webpack_require__(/*! ../sass/default.scss */ "./src/sass/default.scss");
__webpack_require__(/*! ../sass/desktop.scss */ "./src/sass/desktop.scss");

const yaml = __webpack_require__(/*! js-yaml */ "./node_modules/js-yaml/index.js");
const CfgLoader = __webpack_require__(/*! ./cfg-loader/cfg-loader */ "./src/js/cfg-loader/cfg-loader.js");
const CfgReaderFetch = __webpack_require__(/*! ./cfg-loader/cfg-reader-fetch */ "./src/js/cfg-loader/cfg-reader-fetch.js");
const showFatalError = __webpack_require__(/*! ./lib/show-fatal-error */ "./src/js/lib/show-fatal-error.js");
__webpack_require__(/*! ./jquery-plugins/jquery.pointerclick */ "./src/js/jquery-plugins/jquery.pointerclick.js");
const Maze = __webpack_require__(/*! ./maze.js */ "./src/js/maze.js");
const Robot = __webpack_require__(/*! ./robot.js */ "./src/js/robot.js");
const QLearningAI = __webpack_require__(/*! ./qlearning-ai.js */ "./src/js/qlearning-ai.js");
const AITrainingView = __webpack_require__(/*! ./ai-training-view.js */ "./src/js/ai-training-view.js");
const MazeViewQvalueOverlay = __webpack_require__(/*! ./maze-view-qvalue-overlay.js */ "./src/js/maze-view-qvalue-overlay.js");
const MazeViewQarrowOverlay = __webpack_require__(/*! ./maze-view-qarrow-overlay.js */ "./src/js/maze-view-qarrow-overlay.js");
const MazeViewPolicyOverlay = __webpack_require__(/*! ./maze-view-policy-overlay */ "./src/js/maze-view-policy-overlay.js");
const MazeEditor = __webpack_require__(/*! ./editor/maze-editor.js */ "./src/js/editor/maze-editor.js");
const setupKeyControls = __webpack_require__(/*! ./keyboard-controller */ "./src/js/keyboard-controller.js");
const maze1 = __webpack_require__(/*! ../../data/mazes/maze1.json */ "./data/mazes/maze1.json");
const MazeEditorPalette = __webpack_require__(/*! ./editor/maze-editor-palette */ "./src/js/editor/maze-editor-palette.js");
const ReactionController = __webpack_require__(/*! ./reaction-controller */ "./src/js/reaction-controller.js");
const I18n = __webpack_require__(/*! ./exhibit/i18n */ "./src/js/exhibit/i18n.js");
const { screenCoordinates } = __webpack_require__(/*! ./lib/pixi-helpers */ "./src/js/lib/pixi-helpers.js");

const qs = new URLSearchParams(window.location.search);

const cfgLoader = new CfgLoader(CfgReaderFetch, yaml.load);
cfgLoader.load([
  'config/tiles.yml',
  'config/robot.yml',
  'config/items.yml',
  'config/i18n.yml',
  'config/default-settings.yml',
  'settings.yml',
])
  .catch((err) => {
    showFatalError('Error loading configuration', err);
    console.error('Error loading configuration');
    console.error(err);
  })
  .then(config => I18n.init(config, qs.get('lang') || config.defaultLanguage || 'en')
    .then(() => config))
  .then(config => IMAGINARY.i18n.init({
      queryStringVariable: 'lang',
      translationsDirectory: 'tr',
      defaultLanguage: 'en',
    })
    .then(() => {
      const languages = Object.keys(config.languages);
      return Promise.all(languages.map(code => IMAGINARY.i18n.loadLang(code)));
    })
    .then(() => {
      const defaultLanguage = qs.get('lang') || config.defaultLanguage || 'en';
      return IMAGINARY.i18n.setLang(defaultLanguage);
    })
    .then(() => config)
    .catch((err) => {
      showFatalError('Error loading translations', err);
      console.error('Error loading translations');
      console.error(err);
    }))
  .then((config) => {
    const app = new PIXI.Application({
      width: 1920,
      height: 1920,
      backgroundColor: 0xf2f2f2,
    });
    const textures = {};
    textures.robot = null;
    app.loader.add('robot', config.robot.texture);
    textures.arrow = null;
    app.loader.add('arrow', 'static/icons/arrow.svg');
    Object.entries(config.items).forEach(([id, props]) => {
      if (props.texture) {
        const textureId = `item-${id}`;
        textures[textureId] = null;
        app.loader.add(textureId, props.texture);
      }
    });
    Object.entries(config.tileTypes).forEach(([id, props]) => {
      if (props.texture) {
        const textureId = `tile-${id}`;
        textures[textureId] = null;
        app.loader.add(textureId, props.texture);
      }
      if (props.textureVisited) {
        const textureId = `tile-${id}-visited`;
        textures[textureId] = null;
        app.loader.add(textureId, props.textureVisited);
      }
    });
    app.loader.load((loader, resources) => {
      Object.keys(textures).forEach((id) => {
        textures[id] = resources[id].texture;
      });

      const maze = Maze.fromJSON(maze1);
      maze.config = config;
      const robot = new Robot();
      maze.addRobot(robot);
      const ai = new QLearningAI(maze.robot);
      setupKeyControls(maze.robot);

      $('[data-component="app-container"]').append(app.view);
      // const mazeView = new MazeView(maze, config, textures);
      const mazeEditorPalette = new MazeEditorPalette($('body'), config);
      const mazeView = new MazeEditor($('body'), maze, mazeEditorPalette, config, textures);
      app.stage.addChild(mazeView.displayObject);
      mazeView.displayObject.width = 1920;
      mazeView.displayObject.height = 1920;
      mazeView.displayObject.x = 0;
      mazeView.displayObject.y = 0;

      // const qArrowOverlay = new MazeViewQarrowOverlay(mazeView.mazeView, ai);
      // mazeView.mazeView.addOverlay(qArrowOverlay.displayObject);
      // qArrowOverlay.show();

      const policyOverlay = new MazeViewPolicyOverlay(mazeView.mazeView, ai, textures.arrow);
      mazeView.mazeView.addOverlay(policyOverlay.displayObject);
      policyOverlay.hide();

      const qValueOverlay = new MazeViewQvalueOverlay(mazeView.mazeView, ai);
      mazeView.mazeView.addOverlay(qValueOverlay.displayObject);
      window.addEventListener('keydown', (ev) => {
        if (ev.code === 'KeyD') {
          qValueOverlay.toggle();
        }
      });
      app.ticker.add(time => mazeView.mazeView.animate(time));

      const reactionContainer = $('<div></div>')
        .addClass('reaction-container')
        .appendTo($('body'));
      const reactionController = new ReactionController(reactionContainer, config);
      mazeView.mazeView.robotView.events.on('reactEnd', (animation) => {
        const bounds = mazeView.mazeView.robotView.sprite.getBounds();
        const [x, y] = screenCoordinates(app.view, bounds.x - bounds.width / 4, bounds.y - bounds.height / 2);
        reactionController.launchReaction(animation.reaction, x, y);
      });
      window.pixiApp = app;

      const trainingView = new AITrainingView(ai, mazeView.mazeView.robotView);
      $('.sidebar').append(trainingView.$element);
      trainingView.events
        .on('policy-show', () => {
          policyOverlay.show();
        })
        .on('policy-hide', () => {
          policyOverlay.hide();
        });
      window.addEventListener('keydown', (ev) => {
        if (ev.code === 'KeyQ') {
          policyOverlay.toggle();
        }
      });

      // Refresh language
      I18n.setLanguage(I18n.getLanguage());
    });
  });

})();

/******/ })()
;
//# sourceMappingURL=default.6de3ae6ecc1cc9080a70.js.map