const { okhsl_to_srgb } = require("./conversion");

class Swatch {
  constructor(psState, okhsl) {
    this.psState = psState;
    this.okhsl = okhsl;
  }

  setForeground(view_id) {
    this.fg_view = document.getElementById(view_id);

    this.okhsl.registerHueChange(() => {
      let rgb = okhsl_to_srgb(this.okhsl.h, this.okhsl.s, this.okhsl.l);
      this.fg_view.style.backgroundColor = `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`;
    });

    this.okhsl.registerSaturationChange(() => {
      let rgb = okhsl_to_srgb(this.okhsl.h, this.okhsl.s, this.okhsl.l);
      this.fg_view.style.backgroundColor = `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`;
    });

    this.okhsl.registerLightnessChange(() => {
      let rgb = okhsl_to_srgb(this.okhsl.h, this.okhsl.s, this.okhsl.l);
      this.fg_view.style.backgroundColor = `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`;
    });
  }

  setBackground(view_id) {
    this.bg_view = document.getElementById(view_id);

    this.psState.registerbgChange(() => {
      let rgb = this.psState.backgroundColor.rgb;
      this.bg_view.style.backgroundColor = `rgb(${rgb.red}, ${rgb.green}, ${rgb.blue})`;
    });

    let rgb = this.psState.backgroundColor.rgb;
    this.bg_view.style.backgroundColor = `rgb(${rgb.red}, ${rgb.green}, ${rgb.blue})`;
  }
}

module.exports = Swatch;
