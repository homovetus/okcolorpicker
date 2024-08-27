const { srgb_to_okhsl } = require("./conversion");

class HSVState {
  constructor(psState) {
    let color = psState.foregroundColor.rgb;
    let hsv = srgb_to_okhsl(color.red, color.green, color.blue);
    this._psState = psState;
    this._hue = hsv[0];
    this._saturation = hsv[1];
    this._value = hsv[2];
    this.hueChangeCallbacks = [];
    this.saturationChangeCallbacks = [];
    this.valueChangeCallbacks = [];

    this._psState.registerfgChange(() => {
      let color = this._psState.foregroundColor.rgb;
      let hsv = srgb_to_okhsl(color.red, color.green, color.blue);
      this.h = hsv[0];
      this.s = hsv[1];
      this.v = hsv[2];
    });
  }

  registerHueChange(callback) {
    this.hueChangeCallbacks.push(callback);
  }

  registerSaturationChange(callback) {
    this.saturationChangeCallbacks.push(callback);
  }

  registerValueChange(callback) {
    this.valueChangeCallbacks.push(callback);
  }

  get h() {
    return this._hue;
  }

  set h(newHue) {
    this._hue = newHue;
    this.hueChangeCallbacks.forEach((callback) => callback());
  }

  get s() {
    return this._saturation;
  }

  set s(newSaturation) {
    this._saturation = newSaturation;
    this.saturationChangeCallbacks.forEach((callback) => callback());
  }

  get v() {
    return this._value;
  }

  set v(newValue) {
    this._value = newValue;
    this.valueChangeCallbacks.forEach((callback) => callback());
  }
}

module.exports = HSVState;
