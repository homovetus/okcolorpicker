const { entrypoints } = require("uxp");
const { state } = require("./shared");
const { okhsl_to_srgb } = require("./conversion");
const PSState = require("./PSState");
const HSVState = require("./HSVState");
const Slider = require("./Slider");
const Slider2D = require("./Slider2D");
const Input = require("./Input");

showAlert = () => {
  alert("This is an alert message");
};

entrypoints.setup({
  commands: {
    showAlert,
  },
  panels: {
    vanilla: {
      show(node) {},
    },
  },
});

const psState = new PSState();
const okhsv = new HSVState(psState);

let slider = new Slider(okhsv);
slider.setHueComponent("hsl_h_s", "hsl_h_m");
slider.setSaturationComponent("hsl_c_s", "hsl_s_m");
slider.setValueComponent("hsl_l_s", "hsl_v_m");

let input = new Input(okhsv);
input.setHueInput("hsl_h_i");
input.setSaturationInput("hsl_c_i");
input.setValueInput("hsl_l_i");

let slider2D = new Slider2D(okhsv);
slider2D.setSVComponent("hsl_sv_s", "hsl_sv_m");

document.addEventListener(
  "mouseup",
  function (_) {
    if (state.mouse_handler !== null) {
      state.mouse_handler = null;
      let rgb = okhsl_to_srgb(okhsv.h, okhsv.s, okhsv.v);
      //document.getElementById("swatch").style.backgroundColor =
      //  `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`;
    }
  },
  false,
);

document.addEventListener(
  "mousemove",
  function (event) {
    if (state.mouse_handler !== null) {
      state.mouse_handler(event);
      let rgb = okhsl_to_srgb(okhsv.h, okhsv.s, okhsv.v);
      //document.getElementById("swatch").style.backgroundColor =
      //  `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`;
    }
  },
  false,
);

//function showLayerNames() {
//  const allLayers = app.activeDocument.layers;
//  const allLayerNames = allLayers.map((layer) => layer.name);
//  const sortedNames = allLayerNames.sort((a, b) =>
//    a < b ? -1 : a > b ? 1 : 0,
//  );
//  document.getElementById("layers").innerHTML = `
//      <ul>${sortedNames.map((name) => `<li>${name}</li>`).join("")}</ul>`;
//}
//
//document
//  .getElementById("btnPopulate")
//  .addEventListener("click", showLayerNames);
