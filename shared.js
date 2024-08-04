import HSVState from "./HSVState.js";

export const state = {
  okhsv: new HSVState(),
  mouse_handler: null,
  touch_handler: null,
};

export function setup_canvas_handler(canvas, handler) {
  let mouse_handler = function (event) {
    event.preventDefault();

    let rect = canvas.getBoundingClientRect();
    let x = event.clientX - rect.left;
    let y = event.clientY - rect.top;

    handler(x, y);
  };

  let touch_handler = function (event) {
    event.preventDefault();

    let touch = event.touches[0];

    let rect = canvas.getBoundingClientRect();
    let x = touch.clientX - rect.left;
    let y = touch.clientY - rect.top;

    handler(x, y);
  };

  canvas.addEventListener(
    "mousedown",
    function (event) {
      state.mouse_handler = mouse_handler;
      mouse_handler(event);
    },
    false,
  );

  canvas.addEventListener(
    "touchstart",
    function (event) {
      if (event.touches.length === 1) {
        state.touch_handler = touch_handler;
        touch_handler(event);
      } else {
        state.touch_handler = null;
      }
    },
    false,
  );
}

export function clamp(x) {
  let eps = 1e-6;
  return x < eps ? eps : x > 1 - eps ? 1 - eps : x;
}
