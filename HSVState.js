const { srgb_to_okhsl } = require("./conversion");

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
  }

  get s() {
    return this._saturation;
  }

  set s(newSaturation) {
    this._saturation = newSaturation;
    this._triggerChangeEvent("saturationChange", newSaturation);
  }

  get v() {
    return this._value;
  }

  set v(newValue) {
    this._value = newValue;
    this._triggerChangeEvent("valueChange", newValue);
  }

  _triggerChangeEvent(eventName, value) {
    console.log("triggering event", eventName, value);
    document.dispatchEvent(new CustomEvent(eventName, { detail: value }));
  }
}

module.exports = HSVState;
