class Input {
  constructor(okhsv) {
    this.okhsv = okhsv;
  }

  setHueInput(input) {
    this.hue_input = document.getElementById(input);

    const debouncedHandler = this._debounce(() => {
      this.okhsv.h = Math.min(this.hue_input.value / 360, 1);
    }, 1000); // Adjust the debounce delay as needed

    this.hue_input.addEventListener("input", debouncedHandler);
    this.hue_input.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        this.okhsv.h = Math.min(this.hue_input.value / 360, 1);
      }
    });
    this.okhsv.registerHueChange(() => {
      this.hue_input.value = Math.round(this.okhsv.h * 360);
    });
  }

  setSaturationInput(input) {
    this.saturation_input = document.getElementById(input);

    this.saturation_input.addEventListener("input", () => {
      this.okhsv.s = Math.min(this.saturation_input.value / 100, 1);
    });

    this.okhsv.registerSaturationChange(() => {
      this.saturation_input.value = Math.round(this.okhsv.s * 100);
    });
  }

  setValueInput(input) {
    this.value_input = document.getElementById(input);

    this.value_input.addEventListener("input", () => {
      this.okhsv.v = this.value_input.value / 100;
    });

    this.okhsv.registerValueChange(() => {
      this.value_input.value = Math.round(this.okhsv.v * 100);
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
