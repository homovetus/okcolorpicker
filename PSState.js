const app = require("photoshop").app;

class PSState {
  constructor() {
    console.log("PSState constructor");
    this._foregroundColor = app.foregroundColor;
    this._backgroundColor = app.backgroundColor;

    setInterval(() => {
      if (app.foregroundColor.isEqual(this._foregroundColor)) {
        return;
      }
      this.foregroundColor = app.foregroundColor;
    }, 500);

    setInterval(() => {
      if (app.backgroundColor.isEqual(this._backgroundColor)) {
        return;
      }
      this.backgroundColor = app.backgroundColor;
    }, 500);
  }

  get foregroundColor() {
    return this._foregroundColor;
  }

  set foregroundColor(color) {
    this._foregroundColor = color;
    console.log("foregroundColorChanged", color);
    this._triggerChangeEvent("foregroundColorChanged", color);
  }

  get backgroundColor() {
    return this._backgroundColor;
  }

  set backgroundColor(color) {
    this._backgroundColor = color;
    console.log("backgroundColorChanged", color);
    this._triggerChangeEvent("backgroundColorChanged", color);
  }

  _triggerChangeEvent(eventName, value) {
    document.dispatchEvent(new CustomEvent(eventName, { detail: value }));
  }
}

module.exports = PSState;
