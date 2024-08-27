const app = require("photoshop").app;
const { executeAsModal } = require("photoshop").core;
const { okhsl_to_srgb } = require("./conversion");
const { SolidColor } = require("photoshop").app;

class PSState {
  constructor() {
    this.foregroundColor = app.foregroundColor;
    this.backgroundColor = app.backgroundColor;
    this._fgChangeCallbacks = [];
    this._bgChangeCallbacks = [];
    this._lastUpdateTime = Date.now();
    this._isUpdating = false;

    this._receivePSColor();
  }

  async _receivePSColor() {
    while (true) {
      await new Promise((resolve) => setTimeout(resolve, 150));

      const currentTime = Date.now();
      if (currentTime - this._lastUpdateTime < 500 || this._isUpdating) {
        continue;
      }

      if (!app.foregroundColor.isEqual(this.foregroundColor)) {
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

  subscribeHCL(okhcl) {
    this._okhcl = okhcl;
    okhcl.whenHueChangeFg(() => {
      this.foregroundColor = this._getHCL();
      this._updatePSForegroud();
    });
    okhcl.whenSaturationChangeFg(() => {
      this.foregroundColor = this._getHCL();
      this._updatePSForegroud();
    });
    okhcl.whenValueChangeFg(() => {
      this.foregroundColor = this._getHCL();
      this._updatePSForegroud();
    });
  }

  async _updatePSForegroud() {
    if (this._updateTimer) {
      clearTimeout(this._updateTimer);
    }

    if (this._isUpdating) {
      return;
    }

    this._updateTimer = setTimeout(async () => {
      this._isUpdating = true;
      const newColor = this._getHCL();

      try {
        await executeAsModal(
          async () => {
            app.foregroundColor = newColor;
          },
          {
            commandName: "Change Foreground Color",
          },
        );
      } catch (e) {
        console.error(e);
      } finally {
        this._lastUpdateTime = Date.now();
        this._isUpdating = false;
      }
    }, 15);
  }

  _getHCL() {
    let rgb = okhsl_to_srgb(this._okhcl.h, this._okhcl.s, this._okhcl.v);
    const newColor = new SolidColor();
    newColor.rgb.red = Math.max(0, Math.min(255, rgb[0]));
    newColor.rgb.green = Math.max(0, Math.min(255, rgb[1]));
    newColor.rgb.blue = Math.max(0, Math.min(255, rgb[2]));
    return newColor;
  }
}

module.exports = PSState;
