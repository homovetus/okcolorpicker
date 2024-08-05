import { state } from "./shared.js";
import { Slider } from "./Slider.js";
import { Input } from "./Input.js";
import { Slider2D } from "./Slider2D.js";
import { okhsv_to_srgb } from "./conversion.js";

let slider = new Slider(state.okhsv);
slider.setHueComponent("okhsv_h_slider", "okhsv_h_manipulator");
slider.setSaturationComponent("okhsv_s_slider", "okhsv_s_manipulator");
slider.setValueComponent("okhsv_v_slider", "okhsv_v_manipulator");

let input = new Input(state.okhsv);
input.setHueInput("okhsv_h_input");
input.setSaturationInput("okhsv_s_input");
input.setValueInput("okhsv_v_input");

let slider2D = new Slider2D(state.okhsv);
slider2D.setSVComponent("okhsv_sv_canvas", "okhsv_sv_manipulator");

// trigger first render
state.okhsv.h = 1;
state.okhsv.s = 0.5;
state.okhsv.v = 0.5;

document.addEventListener(
  "mouseup",
  function (_) {
    if (state.mouse_handler !== null) {
      state.mouse_handler = null;
      let rgb = okhsv_to_srgb(state.okhsv.h, state.okhsv.s, state.okhsv.v);
      document.getElementById("swatch").style.backgroundColor =
        `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`;
    }
  },
  false,
);

document.addEventListener(
  "mousemove",
  function (event) {
    if (state.mouse_handler !== null) {
      state.mouse_handler(event);
      let rgb = okhsv_to_srgb(state.okhsv.h, state.okhsv.s, state.okhsv.v);
      document.getElementById("swatch").style.backgroundColor =
        `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`;
    }
  },
  false,
);

document.addEventListener(
  "touchend",
  function (event) {
    if (state.touch_handler !== null && event.touches.length === 0) {
      state.touch_handler = null;
      // update_url();
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
