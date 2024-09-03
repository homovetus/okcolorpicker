const app = require("photoshop").app;
const { state } = require("./shared");
const { executeAsModal } = require("photoshop").core;
const { okhsl_to_srgb } = require("./conversion");
const { SolidColor } = require("photoshop").app;

class PSState {
  constructor() {
    this.foregroundColor = app.foregroundColor;
    this.backgroundColor = app.backgroundColor;
    this._fgChangeCallbacks = [];
    this._bgChangeCallbacks = [];
    this._isUpdating = false;

    this._startReceiving();
  }

  async _startReceiving() {
    while (true) {
      await new Promise((resolve) => setTimeout(resolve, 150));

      if (this._isUpdating) {
        continue;
      }

      if (
        !app.foregroundColor.isEqual(this.foregroundColor) &&
        state.mouse_handler === null
      ) {
        this.foregroundColor = app.foregroundColor;
        this._fgChangeCallbacks.forEach((callback) => callback());
      }

      if (!app.backgroundColor.isEqual(this.backgroundColor)) {
        this.backgroundColor = app.backgroundColor;
        this._bgChangeCallbacks.forEach((callback) => callback());
      }
    }
  }

  registerfgChange(callback) {
    this._fgChangeCallbacks.push(callback);
  }
  registerbgChange(callback) {
    this._bgChangeCallbacks.push(callback);
  }

  subscribeHSL(okhsl) {
    this._okhsl = okhsl;
    okhsl.whenHueChangeFg(() => {
      this.foregroundColor = this._getHCL();
    });
    okhsl.whenSaturationChangeFg(() => {
      this.foregroundColor = this._getHCL();
    });
    okhsl.whenLightnessChangeFg(() => {
      this.foregroundColor = this._getHCL();
    });
  }

  async _updatePSForegroud() {
    if (this._isUpdating) {
      return;
    }

    this._isUpdating = true;
    const newColor = this._getHCL();

    try {
      await executeAsModal(
        async () => {
          app.foregroundColor = newColor;
        },
        {
          commandName: "Change Foreground Color",
        }
      );
    } catch (e) {
      console.error(e);
    } finally {
      this._isUpdating = false;
    }
  }

  _getHCL() {
    let rgb = okhsl_to_srgb(this._okhsl.h, this._okhsl.s, this._okhsl.l);
    const newColor = new SolidColor();
    newColor.rgb.red = Math.max(0, Math.min(255, rgb[0]));
    newColor.rgb.green = Math.max(0, Math.min(255, rgb[1]));
    newColor.rgb.blue = Math.max(0, Math.min(255, rgb[2]));
    return newColor;
  }
}

module.exports = PSState;
