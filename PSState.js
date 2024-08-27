const app = require("photoshop").app;
const { executeAsModal } = require("photoshop").core;
const { okhsl_to_srgb } = require("./conversion");
const { SolidColor } = require("photoshop").app;

class PSState {
  constructor() {
    this._foregroundColor = app.foregroundColor;
    this._backgroundColor = app.backgroundColor;
    this._fgChangeCallbacks = [];
    this._bgChangeCallbacks = [];

    setInterval(() => {
      if (app.foregroundColor.isEqual(this._foregroundColor)) {
        return;
      }
      this.foregroundColor = app.foregroundColor;
      this._fgChangeCallbacks.forEach((callback) => callback());
    }, 100);
    setInterval(() => {
      if (app.backgroundColor.isEqual(this._backgroundColor)) {
        return;
      }
      this.backgroundColor = app.backgroundColor;
      this._bgChangeCallbacks.forEach((callback) => callback());
    }, 100);
  }

  registerfgChange(callback) {
    this._fgChangeCallbacks.push(callback);
  }
  registerbgChange(callback) {
    this._bgChangeCallbacks.push(callback);
  }

  subscribeHCL(okhcl) {
    this._okhcl = okhcl;
    okhcl.registerHueChange(() => {
      this._updateForeground();
      this._updatePSForegroud();
    });
    okhcl.registerSaturationChange(() => {
      this._updateForeground();
      this._updatePSForegroud();
    });
    okhcl.registerValueChange(() => {
      this._updateForeground();
      this._updatePSForegroud();
    });
  }
  _updatePSForegroud() {
    let rgb = okhsl_to_srgb(this._okhcl.h, this._okhcl.s, this._okhcl.v);
    const newColor = new SolidColor();
    newColor.rgb.red = rgb[0];
    newColor.rgb.green = rgb[1];
    newColor.rgb.blue = rgb[2];
    let command = () => {
      app.foregroundColor = newColor;
    };
    executeAsModal(command, {
      commandName: "Action Commands",
    });
  }

  _updateForeground() {
    let rgb = okhsl_to_srgb(this._okhcl.h, this._okhcl.s, this._okhcl.v);
    const newColor = new SolidColor();
    newColor.rgb.red = rgb[0];
    newColor.rgb.green = rgb[1];
    newColor.rgb.blue = rgb[2];
    this._foregroundColor = newColor;
  }

  get foregroundColor() {
    return this._foregroundColor;
  }
  get backgroundColor() {
    return this._backgroundColor;
  }

  set foregroundColor(color) {
    this._foregroundColor = color;
  }
  set backgroundColor(color) {
    this._backgroundColor = color;
  }
}

module.exports = PSState;
