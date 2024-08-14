class Input {
  constructor(okhsv) {
    this.okhsv = okhsv;
  }

  setHueInput(input) {
    this.hue_input = document.getElementById(input);

    this.hue_input.addEventListener("input", () => {
      this.okhsv.h = this.hue_input.value / 360;
    });

    document.addEventListener("hueChange", () => {
      this.hue_input.value = Math.round(this.okhsv.h * 360);
    });
  }

  setSaturationInput(input) {
    this.saturation_input = document.getElementById(input);

    this.saturation_input.addEventListener("input", () => {
      this.okhsv.s = this.saturation_input.value / 100;
    });

    document.addEventListener("saturationChange", () => {
      this.saturation_input.value = Math.round(this.okhsv.s * 100);
    });
  }

  setValueInput(input) {
    this.value_input = document.getElementById(input);

    this.value_input.addEventListener("input", () => {
      this.okhsv.v = this.value_input.value / 100;
    });

    document.addEventListener("valueChange", () => {
      this.value_input.value = Math.round(this.okhsv.v * 100);
    });
  }
}

module.exports = Input;
