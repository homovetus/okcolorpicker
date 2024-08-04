import { state } from "./shared.js";
import { Slider } from "./Slider.js";

let slider = new Slider(state.okhsv);

slider.setHueComponent("okhsv_h_slider", "okhsv_h_manipulator");

document.addEventListener(
  "mouseup",
  function (event) {
    if (state.mouse_handler !== null) {
      state.mouse_handler(event);
      state.mouse_handler = null;
      // update_url();
    }
  },
  false,
);

document.addEventListener(
  "mousemove",
  function (event) {
    if (state.mouse_handler !== null) {
      state.mouse_handler(event);
    }
  },
  false,
);

document.addEventListener(
  "touchend",
  function (event) {
    if (state.touch_handler !== null && event.touches.length === 0) {
      state.touch_handler = null;
      update_url();
    }
  },
  false,
);

document.addEventListener(
  "touchmove",
  function (event) {
    if (state.touch_handler !== null && event.touches.length === 1) {
      state.touch_handler(event);
    }
  },
  false,
);
