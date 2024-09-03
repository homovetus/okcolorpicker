const { srgb_to_okhsl } = require("./conversion");

class HSVState {
  constructor(psState) {
    let color = psState.foregroundColor.rgb;
    let hsv = srgb_to_okhsl(color.red, color.green, color.blue);
    this._psState = psState;
    this._hue = hsv[0];
    this._saturation = hsv[1];
    this._lightness = hsv[2];
    this.hueChangeCallbacks = [];
    this.saturationChangeCallbacks = [];
    this.lightnessChangeCallbacks = [];
    this.hueChangeFgCallbacks = [];
    this.saturationChangeFgCallbacks = [];
    this.lightnessChangeFgCallbacks = [];

    this._psState.registerfgChange(() => {
      let color = this._psState.foregroundColor.rgb;
      let hsv = srgb_to_okhsl(color.red, color.green, color.blue);
      this._hue = hsv[0];
      this._saturation = hsv[1];
      this._lightness = hsv[2];
      this.hueChangeCallbacks.forEach((callback) => callback());
      this.saturationChangeCallbacks.forEach((callback) => callback());
      this.lightnessChangeCallbacks.forEach((callback) => callback());
    });
  }

  registerHueChange(callback) {
    this.hueChangeCallbacks.push(callback);
  }

  registerSaturationChange(callback) {
    this.saturationChangeCallbacks.push(callback);
  }

  registerLightnessChange(callback) {
    this.lightnessChangeCallbacks.push(callback);
  }

  whenHueChangeFg(callback) {
    this.hueChangeFgCallbacks.push(callback);
  }

  whenSaturationChangeFg(callback) {
    this.saturationChangeFgCallbacks.push(callback);
  }

  whenLightnessChangeFg(callback) {
    this.lightnessChangeFgCallbacks.push(callback);
  }

  refresh() {
    this.saturationChangeCallbacks.forEach((callback) => callback());
    this.lightnessChangeCallbacks.forEach((callback) => callback());
    this.hueChangeCallbacks.forEach((callback) => callback());
  }

  get h() {
    return this._hue;
  }

  set h(hue) {
    this._hue = hue;
    this.hueChangeCallbacks.forEach((callback) => callback());
    this.hueChangeFgCallbacks.forEach((callback) => callback());
  }

  get s() {
    return this._saturation;
  }

  set s(saturation) {
    this._saturation = saturation;
    this.saturationChangeCallbacks.forEach((callback) => callback());
    this.saturationChangeFgCallbacks.forEach((callback) => callback());
  }

  get l() {
    return this._lightness;
  }

  set l(lightness) {
    this._lightness = lightness;
    this.lightnessChangeCallbacks.forEach((callback) => callback());
    this.lightnessChangeFgCallbacks.forEach((callback) => callback());
  }
}

module.exports = HSVState;
