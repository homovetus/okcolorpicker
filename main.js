const { entrypoints } = require("uxp");
const { state, resizeSquare } = require("./shared");
const { okhsl_to_srgb } = require("./conversion");
const PSState = require("./PSState");
const HSVState = require("./HSVState");
const Slider = require("./Slider");
const Slider2D = require("./Slider2D");
const Swatch = require("./Swatch");
const Input = require("./Input");

entrypoints.setup({
  commands: {
    // showAlert,
  },
  panels: {
    vanilla: {
      show(node) {},
    },
  },
});

const psState = new PSState();
const okhsv = new HSVState(psState);
psState.subscribeHCL(okhsv);

let swatch = new Swatch(psState, okhsv);
swatch.setForeground("foreground");
swatch.setBackground("background");

let slider = new Slider(okhsv);
slider.setHueComponent("hsl_h_s", "hsl_h_m");
slider.setSaturationComponent("hsl_c_s", "hsl_c_m");
slider.setValueComponent("hsl_l_s", "hsl_l_m");

let input = new Input(okhsv);
input.setHueInput("hsl_h_i");
input.setSaturationInput("hsl_c_i");
input.setValueInput("hsl_l_i");

let slider2D = new Slider2D(okhsv);
slider2D.setSVComponent("hsl_sv_s", "hsl_sv_m");

resizeSquare();
okhsv.refresh();

window.addEventListener("resize", resizeSquare);

document.addEventListener(
  "mouseup",
  function (_) {
    if (state.mouse_handler !== null) {
      state.mouse_handler = null;
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
