class Swatch {
  constructor(psState, okhsv) {
    this.psState = psState;
    this.okhcl = okhsv;
  }

  setForeground(view_id) {
    this.fg_view = document.getElementById(view_id);

    this.okhcl.registerHueChange(() => {
      let rgb = okhsl_to_srgb(this.okhcl.h, this.okhcl.s, this.okhcl.v);
      this.fg_view.style.backgroundColor = `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`;
    });

    this.okhcl.registerSaturationChange(() => {
      let rgb = okhsl_to_srgb(this.okhcl.h, this.okhcl.s, this.okhcl.v);
      this.fg_view.style.backgroundColor = `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`;
    });

    this.okhcl.registerValueChange(() => {
      let rgb = okhsl_to_srgb(this.okhcl.h, this.okhcl.s, this.okhcl.v);
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
