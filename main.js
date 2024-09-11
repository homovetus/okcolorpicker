const { state, resizeSquare } = require("./shared");
const PSState = require("./PSState");
const HSLState = require("./HSLState");
const Slider = require("./Slider");
const Slider2D = require("./Slider2D");
const Swatch = require("./Swatch");
const Input = require("./Input");

const psState = new PSState();
const okhsl = new HSLState(psState);
psState.subscribeHSL(okhsl);

let swatch = new Swatch(psState, okhsl);
swatch.setForeground("foreground");
swatch.setBackground("background");

let slider = new Slider(psState, okhsl);
slider.setHueComponent("okhsl_h_s", "okhsl_h_m");
slider.setSaturationComponent("okhsl_s_s", "okhsl_s_m");
slider.setLightnessComponent("okhsl_l_s", "okhsl_l_m");

let input = new Input(psState, okhsl);
input.setHueInput("okhsl_h_i");
input.setSaturationInput("okhsl_s_i");
input.setLightnessInput("okhsl_l_i");

let slider2D = new Slider2D(psState, okhsl);
slider2D.setComponents("okhsl_sl_s", "okhsl_sl_m");

resizeSquare();
setTimeout(() => {
  okhsl.refresh();
}, 200);

window.addEventListener("resize", () => {
  resizeSquare();
  okhsl.refresh();
});

document.addEventListener(
  "mouseup",
  function (_) {
    if (state.mouse_handler !== null) {
      state.mouse_handler = null;
      psState.updatePSForegroud();
      psState.receive = true;
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
