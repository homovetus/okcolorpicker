class Swatch {
  constructor(okhsv) {
    this.okhsv = okhsv;
  }

  setForeground(view_id) {
    this.fg_view = document.getElementById(view_id);

    document.addEventListener("foregroundColorChanged", (c) => {
      let rgb = c.detail.rgb;
      this.fg_view.style.backgroundColor = `rgb(${rgb.red}, ${rgb.green}, ${rgb.blue})`;
    });
  }

  setBackground(view_id) {
    this.bg_view = document.getElementById(view_id);

    document.addEventListener("backgroundColorChanged", (c) => {
      let rgb = c.detail.rgb;
      this.bg_view.style.backgroundColor = `rgb(${rgb.red}, ${rgb.green}, ${rgb.blue})`;
    });
  }
}

module.exports = Swatch;
