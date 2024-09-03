const { state, resizeSquare } = require("./shared");
const PSState = require("./PSState");
const HSVState = require("./HSVState");
const Slider = require("./Slider");
const Slider2D = require("./Slider2D");
const Swatch = require("./Swatch");
const Input = require("./Input");

const psState = new PSState();
const okhsv = new HSVState(psState);
psState.subscribeHSL(okhsv);

let swatch = new Swatch(psState, okhsv);
swatch.setForeground("foreground");
swatch.setBackground("background");

let slider = new Slider(okhsv);
slider.setHueComponent("okhsl_h_s", "okhsl_h_m");
slider.setSaturationComponent("okhsl_s_s", "okhsl_s_m");
slider.setLightnessComponent("okhsl_l_s", "okhsl_l_m");

let input = new Input(okhsv);
input.setHueInput("okhsl_h_i");
input.setSaturationInput("okhsl_s_i");
input.setLightnessInput("okhsl_l_i");

let slider2D = new Slider2D(okhsv);
slider2D.setSLComponent("okhsl_sl_s", "okhsl_sl_m");

resizeSquare();
okhsv.refresh();

window.addEventListener("resize", resizeSquare);

document.addEventListener(
  "mouseup",
  function (_) {
    if (state.mouse_handler !== null) {
      state.mouse_handler = null;
      psState._updatePSForegroud();
    }
  },
  false
);

document.addEventListener(
  "mousemove",
  function (event) {
    if (state.mouse_handler !== null) {
      state.mouse_handler(event);
    }
  },
  false
);
