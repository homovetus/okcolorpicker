const { setup_view_handler, clamp } = require("./shared");
const { okhsl_to_srgb } = require("./conversion");

class SliderHS {
  constructor(psState, okhsl) {
    this._psState = psState;
    this.okhsl = okhsl;
  }

  setSLComponent(view_id, manipulator) {
    this.view = document.getElementById(view_id);
    this.manipulator = document.getElementById(manipulator);

    setup_view_handler(this.view, this._psState, (x, y) => {
      let width = this.view.clientWidth;
      let height = this.view.clientHeight;

      let hsl_a = -1 * (2 * (x / width) - 1);
      let hsl_b = -1 * (1 - 2 * (y / height));

      this.okhsl.h = clamp(0.5 + (0.5 * Math.atan2(hsl_b, hsl_a)) / Math.PI);
      this.okhsl.s = clamp(Math.sqrt(hsl_a ** 2 + hsl_b ** 2));
    });

    this.okhsl.registerSaturationChange(() => {
      let width = this.view.clientWidth;
      let height = this.view.clientHeight;

      let hsl_a =
        0.5 + 0.5 * this.okhsl.s * Math.cos(this.okhsl.h * 2 * Math.PI);
      let hsl_b =
        0.5 + 0.5 * this.okhsl.s * Math.sin(this.okhsl.h * 2 * Math.PI);
      this.manipulator.setAttribute(
        "transform",
        `translate(${width * hsl_a}, ${height * (1 - hsl_b)})`
      );
    });

    this.okhsl.registerHueChange(() => {
      let width = this.view.clientWidth;
      let height = this.view.clientHeight;
      let hsl_a =
        0.5 + 0.5 * this.okhsl.s * Math.cos(this.okhsl.h * 2 * Math.PI);
      let hsl_b =
        0.5 + 0.5 * this.okhsl.s * Math.sin(this.okhsl.h * 2 * Math.PI);
      this.manipulator.setAttribute(
        "transform",
        `translate(${width * hsl_a}, ${height * (1 - hsl_b)})`
      );
    });

    let debounceTimeout;
    const debounceDelay = 10;

    this.okhsl.registerLightnessChange(() => {
      clearTimeout(debounceTimeout);

      debounceTimeout = setTimeout(() => {
        let url = this.render_hs(200, 200);
        this.view.src = url;
        URL.revokeObjectURL(url);
      }, debounceDelay);
    });
  }

  render_hs(width, height) {
    const pixelCount = width * height;
    const buffer = new ArrayBuffer(pixelCount * 3);
    const colorArrayView = new Uint8Array(buffer);

    // get body element's background color
    const body = document.getElementsByTagName("body")[0];
    const background =
      getComputedStyle(body).getPropertyValue("background-color");
    const b_r = parseInt(background.substring(1, 3), 16);
    const b_g = parseInt(background.substring(3, 5), 16);
    const b_b = parseInt(background.substring(5, 7), 16);

    const invHeight = 1 / height;
    const invWidth = 1 / width;
    const okhsl_l = this.okhsl.l;

    for (let i = 0; i < height; i++) {
      const hsl_a = 2 * i * invHeight - 1;

      for (let j = 0; j < width; j++) {
        const hsl_b = 1 - 2 * j * invWidth;
        const distSquared = hsl_a * hsl_a + hsl_b * hsl_b; // Avoid Math.sqrt

        const index = 3 * (i * width + j);

        if (distSquared <= 1) {
          const rgb = okhsl_to_srgb(
            0.5 + (0.5 * Math.atan2(hsl_a, hsl_b)) / Math.PI,
            Math.sqrt(distSquared), // Only take sqrt when needed
            okhsl_l
          );
          colorArrayView[index + 0] = rgb[0];
          colorArrayView[index + 1] = rgb[1];
          colorArrayView[index + 2] = rgb[2];
        } else {
          colorArrayView[index + 0] = b_r;
          colorArrayView[index + 1] = b_g;
          colorArrayView[index + 2] = b_b;
        }
      }
    }

    const biggerImage = this.upscaleCircle(colorArrayView, width, width * 4);
    const imageMetaData = {
      width: width * 4,
      height: height * 4,
      colorSpace: "RGB",
      pixelFormat: "RGB",
      components: 3,
      componentSize: 8,
      hasAlpha: false,
      type: "image/uncompressed",
    };

    const imageBlob = new ImageBlob(biggerImage, imageMetaData);
    return URL.createObjectURL(imageBlob);
  }

  upscaleCircle(lowres_data, lowres_data_width, data_width) {
    const body = document.getElementsByTagName("body")[0];
    const background =
      getComputedStyle(body).getPropertyValue("background-color");
    const b_r = parseInt(background.substring(1, 3), 16);
    const b_g = parseInt(background.substring(3, 5), 16);
    const b_b = parseInt(background.substring(5, 7), 16);

    const data = new Uint8ClampedArray(data_width * data_width * 3);
    const inv_width = 1 / data_width;
    for (let i = 0; i < data_width; i++) {
      const hsl_a = 2 * i * inv_width - 1;
      for (let j = 0; j < data_width; j++) {
        const hsl_b = 1 - 2 * j * inv_width;
        const index = 3 * (i * data_width + j);
        const distSquared = hsl_a * hsl_a + hsl_b * hsl_b;
        if (distSquared <= 0.97) {
          const x_ratio = Math.floor(
            (i / (data_width - 1)) * (lowres_data_width - 1)
          );
          const y_ratio = Math.floor(
            (j / (data_width - 1)) * (lowres_data_width - 1)
          );
          const lowres_index = 3 * (x_ratio * lowres_data_width + y_ratio);
          data[index + 0] = lowres_data[lowres_index + 0];
          data[index + 1] = lowres_data[lowres_index + 1];
          data[index + 2] = lowres_data[lowres_index + 2];
        } else {
          data[index + 0] = b_r;
          data[index + 1] = b_g;
          data[index + 2] = b_b;
        }
      }
    }
    return data;
  }
}

module.exports = SliderHS;
