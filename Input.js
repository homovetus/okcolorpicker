class Input {
  constructor(psState, okhsl) {
    this._psState = psState;
    this._okhsl = okhsl;
  }

  setHueInput(input) {
    this.hue_input = document.getElementById(input);

    this.hue_input.addEventListener("focus", () => {
      this._psState.receive = false;
    });

    this.hue_input.addEventListener("input", () => {
      this._okhsl.h = this.hue_input.value / 360;
    });

    this.hue_input.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        this.hue_input.blur();
      }
    });

    this.hue_input.addEventListener("blur", () => {
      this._psState.updatePSForegroud();
      this._psState.receive = true;
    });

    this._okhsl.registerHueChange(() => {
      this.hue_input.value = Math.round(this._okhsl.h * 360);
    });
  }

  setSaturationInput(input) {
    this.saturation_input = document.getElementById(input);

    this.saturation_input.addEventListener("focus", () => {
      this._psState.receive = false;
    });

    this.saturation_input.addEventListener("input", () => {
      this._okhsl.s = this.saturation_input.value / 100;
    });

    this.saturation_input.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        this.saturation_input.blur();
      }
    });

    this.saturation_input.addEventListener("blur", () => {
      this._psState.updatePSForegroud();
      this._psState.receive = true;
    });

    this._okhsl.registerSaturationChange(() => {
      this.saturation_input.value = Math.round(this._okhsl.s * 100);
    });
  }

  setLightnessInput(input) {
    this.lightness_input = document.getElementById(input);

    this.lightness_input.addEventListener("focus", () => {
      this._psState.receive = false;
    });

    this.lightness_input.addEventListener("input", () => {
      this._okhsl.l = this.lightness_input.value / 100;
    });

    this.lightness_input.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        this.lightness_input.blur();
      }
    });

    this.lightness_input.addEventListener("blur", () => {
      this._psState.updatePSForegroud();
      this._psState.receive = true;
    });

    this._okhsl.registerLightnessChange(() => {
      this.lightness_input.value = Math.round(this._okhsl.l * 100);
    });
  }
}

module.exports = Input;
