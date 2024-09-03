const app = require("photoshop").app;
const { state } = require("./shared");
const { executeAsModal } = require("photoshop").core;

class PSState {
  constructor() {
    this.foregroundColor = app.foregroundColor;
    this.backgroundColor = app.backgroundColor;
    this.receive = true;
    this._fgChangeCallbacks = [];
    this._bgChangeCallbacks = [];
    this._isUpdating = false;

    this._startReceiving();
  }

  async _startReceiving() {
    while (true) {
      await new Promise((resolve) => setTimeout(resolve, 150));

      if (this._isUpdating || !this.receive) {
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

  subscribeHSL(okhsl) {
    this._okhsl = okhsl;
    okhsl.whenHueChangeFg(() => {
      this.foregroundColor = this._okhsl.getSolidColor();
    });
    okhsl.whenSaturationChangeFg(() => {
      this.foregroundColor = this._okhsl.getSolidColor();
    });
    okhsl.whenLightnessChangeFg(() => {
      this.foregroundColor = this._okhsl.getSolidColor();
    });
  }

  async updatePSForegroud() {
    if (this._isUpdating) {
      return;
    }

    this._isUpdating = true;
    const newColor = this._okhsl.getSolidColor();

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
}

module.exports = PSState;
