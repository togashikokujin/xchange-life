/* Utility Code - Start */
/* isObject: Returns if Value is an object (not including "null"). */
function isObject (Value) {
  return !!Value && typeof Value === "object";
}

/* isProperty: Returns if Prop is a property of the object Obj. */
function isProperty (Obj, Prop) {
  var result = false;
  if (isObject(Obj)) {
      result = Obj ? hasOwnProperty.call(Obj, Prop) : false;
      if (!result) {               /* if not pass... */
          try {
              if (Obj[Prop] === undefined) {
                  result = false;  /* double-check fail */
              } else {
                  result = true;   /* double-check pass */
              }
          } catch(error) {
              result = false;      /* error fail */
          }
      }
  }
  return result;
}

/* Number.clamp: Returns the number clamped to the specified bounds. */
Object.defineProperty(Number.prototype, 'clamp', {
  configurable: true,
  writable    : true,
  value       : function (min, max) {
      if (this == null) {  // lazy equality for null
          throw new TypeError('Number.prototype.clamp called on null or undefined');
      }
      if (arguments.length !== 2) {
          throw new Error('Number.prototype.clamp called with an incorrect number of parameters');
      }
      if (min > max) {
          var temp = min;
          min = max;
          max = temp;
      }
      return Math.min(Math.max(this, min), max);
  }
});

/* UnicodeToBase64: Converts a Unicode DOMString (UTF-16 String) to a Base64 (UTF-8) String. */
// JSON = UnicodeToBase64(localStorage.getItem(key))
function UnicodeToBase64 (str) {
  var lng = str.length.clamp(0, 30000), n = 0, result = "", chunk, i;
  while (n < str.length) {
      chunk = new Uint16Array(lng);
      for (i = 0; i < lng; i++) {
          chunk[i] = str.charCodeAt(i + n);
      }
      result += String.fromCharCode.apply(null, new Uint8Array(chunk.buffer));
      n += lng;
      if (n + lng > str.length) {
          lng = str.length - n;
      }
  }
  return btoa(result);
}

/* Base64ToUnicode: Converts a Base64 string to binary and/or Unicode. */
// localStorage.setItem(key, Base64ToUnicode(JSON))
function Base64ToUnicode (str) {
  str = atob(str);
  var lng = str.length.clamp(0, 30000), n = 0, result = "", chunk, i;
  while (n < str.length) {
      chunk = new Uint8Array(lng);
      for (i = 0; i < lng; i++) {
          chunk[i] = str.charCodeAt(i + n);
      }
      result += String.fromCharCode.apply(null, new Uint16Array(chunk.buffer));
      n += lng;
      if (n + lng > str.length) {
          lng = str.length - n;
      }
  }
  return result;
}
/* Utility Code - End */