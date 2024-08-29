const state = {
  mouse_handler: null,
  touch_handler: null,
};

function setup_view_handler(view, handler) {
  let mouse_handler = function (event) {
    event.preventDefault();

    let rect = view.getBoundingClientRect();
    let x = event.clientX - rect.left;
    let y = event.clientY - rect.top;

    handler(x, y);
  };

  let touch_handler = function (event) {
    event.preventDefault();

    let touch = event.touches[0];

    let rect = view.getBoundingClientRect();
    let x = touch.clientX - rect.left;
    let y = touch.clientY - rect.top;

    handler(x, y);
  };

  view.addEventListener(
    "mousedown",
    function (event) {
      state.mouse_handler = mouse_handler;
      mouse_handler(event);
    },
    false
  );

  view.addEventListener(
    "touchstart",
    function (event) {
      if (event.touches.length === 1) {
        state.touch_handler = touch_handler;
        touch_handler(event);
      } else {
        state.touch_handler = null;
      }
    },
    false
  );
}

function clamp(x) {
  let eps = 1e-6;
  return x < eps ? eps : x > 1 - eps ? 1 - eps : x;
}

function resizeSquare() {
  let outerDiv = document.getElementById("bottom");
  let innerDiv = document.getElementById("inner");
  let size = Math.min(outerDiv.offsetWidth, outerDiv.offsetHeight);
  innerDiv.style.width = size + "px";
  innerDiv.style.height = size + "px";
}

module.exports = {
  state,
  setup_view_handler,
  clamp,
  resizeSquare,
};
