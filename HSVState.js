export default class HSVState {
  constructor(hue = 360, saturation = 100, value = 100) {
    this._hue = hue;
    this._saturation = saturation;
    this._value = value;
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
    console.log("saturationChange", newSaturation);
  }

  get v() {
    return this._value;
  }

  set v(newValue) {
    this._value = newValue;
    this._triggerChangeEvent("valueChange", newValue);
  }

  _triggerChangeEvent(eventName, value) {
    document.dispatchEvent(new CustomEvent(eventName, { detail: value }));
  }
}
