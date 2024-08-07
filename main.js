const { entrypoints } = require("uxp");
const app = require("photoshop").app;
const PSState = require("./PSState");
const HSVState = require("./HSVState");

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
const hsvState = new HSVState(psState);

function showLayerNames() {
  const allLayers = app.activeDocument.layers;
  const allLayerNames = allLayers.map((layer) => layer.name);
  const sortedNames = allLayerNames.sort((a, b) =>
    a < b ? -1 : a > b ? 1 : 0,
  );
  document.getElementById("layers").innerHTML = `
      <ul>${sortedNames.map((name) => `<li>${name}</li>`).join("")}</ul>`;
}

document
  .getElementById("btnPopulate")
  .addEventListener("click", showLayerNames);

