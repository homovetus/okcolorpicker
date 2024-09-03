const { srgb_to_okhsl, okhsl_to_srgb } = require("./conversion");
const { SolidColor } = require("photoshop").app;

class HSLState {
  constructor(psState) {
    let color = psState.foregroundColor.rgb;
    let hsl = srgb_to_okhsl(color.red, color.green, color.blue);
    this._psState = psState;
    this._hue = hsl[0];
    this._saturation = hsl[1];
    this._lightness = hsl[2];
    this.hueChangeCallbacks = [];
    this.saturationChangeCallbacks = [];
    this.lightnessChangeCallbacks = [];
    this.hueChangeFgCallbacks = [];
    this.saturationChangeFgCallbacks = [];
    this.lightnessChangeFgCallbacks = [];

    this._psState.registerfgChange(() => {
      let color = this._psState.foregroundColor.rgb;
      let hsl = srgb_to_okhsl(color.red, color.green, color.blue);
      this._hue = hsl[0];
      this._saturation = hsl[1];
      this._lightness = hsl[2];
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

  getSolidColor() {
    let rgb = okhsl_to_srgb(this._hue, this._saturation, this._lightness);
    const newColor = new SolidColor();
    newColor.rgb.red = Math.max(0, Math.min(255, rgb[0]));
    newColor.rgb.green = Math.max(0, Math.min(255, rgb[1]));
    newColor.rgb.blue = Math.max(0, Math.min(255, rgb[2]));
    return newColor;
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

module.exports = HSLState;
