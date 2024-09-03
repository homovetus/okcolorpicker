class Input {
  constructor(okhsl) {
    this.okhsl = okhsl;
  }

  setHueInput(input) {
    this.hue_input = document.getElementById(input);

    const debouncedHandler = this._debounce(() => {
      this.okhsl.h = Math.min(this.hue_input.value / 360, 1);
    }, 1000);

    this.hue_input.addEventListener("input", debouncedHandler);
    this.hue_input.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        this.okhsl.h = Math.min(this.hue_input.value / 360, 1);
      }
    });
    this.okhsl.registerHueChange(() => {
      this.hue_input.value = Math.round(this.okhsl.h * 360);
    });
  }

  setSaturationInput(input) {
    this.saturation_input = document.getElementById(input);

    this.saturation_input.addEventListener("input", () => {
      this.okhsl.s = Math.min(this.saturation_input.value / 100, 1);
    });

    this.okhsl.registerSaturationChange(() => {
      this.saturation_input.value = Math.round(this.okhsl.s * 100);
    });
  }

  setLightnessInput(input) {
    this.lightness_input = document.getElementById(input);

    this.lightness_input.addEventListener("input", () => {
      this.okhsl.v = this.lightness_input.value / 100;
    });

    this.okhsl.registerLightnessChange(() => {
      this.lightness_input.value = Math.round(this.okhsl.l * 100);
    });
  }

  _debounce(func, delay) {
    let timeoutId;
    return (...args) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func.apply(this, args), delay);
    };
  }
}

module.exports = Input;
