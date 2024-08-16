const { srgb_to_okhsl } = require("./conversion");
const { app } = require("photoshop");
const { executeAsModal } = require("photoshop").core;
const { SolidColor } = require("photoshop").app;

class HSVState {
  constructor(psState) {
    let color = psState.foregroundColor.rgb;
    let hsv = srgb_to_okhsl(color.red, color.green, color.blue);
    this._hue = hsv[0];
    this._saturation = hsv[1];
    this._value = hsv[2];

    document.addEventListener("foregroundColorChanged", (c) => {
      let rgb = c.detail.rgb;
      let hsv = srgb_to_okhsl(rgb.red, rgb.green, rgb.blue);
      this.h = hsv[0];
      this.s = hsv[1];
      this.v = hsv[2];
    });
  }

  get h() {
    return this._hue;
  }

  set h(newHue) {
    this._hue = newHue;
    this._triggerChangeEvent("hueChange", newHue);
    this._updateForegroud();
  }

  get s() {
    return this._saturation;
  }

  set s(newSaturation) {
    this._saturation = newSaturation;
    this._triggerChangeEvent("saturationChange", newSaturation);
    this._updateForegroud();
  }

  get v() {
    return this._value;
  }

  set v(newValue) {
    this._value = newValue;
    this._triggerChangeEvent("valueChange", newValue);
    this._updateForegroud();
  }

  _triggerChangeEvent(eventName, value) {
    document.dispatchEvent(new CustomEvent(eventName, { detail: value }));
  }

  async _updateForegroud() {
    let rgb = okhsl_to_srgb(this.h, this.s, this.v);
    const newColor = new SolidColor();
    newColor.rgb.red = rgb[0];
    newColor.rgb.green = rgb[1];
    newColor.rgb.blue = rgb[2];
    let command = () => {
      app.foregroundColor = newColor;
    };
    await executeAsModal(command, {
      commandName: "Action Commands",
    });
  }
}

module.exports = HSVState;
