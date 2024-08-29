# OK Picker

OK Picker is a color picker plugin for Adobe Photoshop, utilizing the OKHsl color space for improved color selection and manipulation.

## Features

- Interactive color selection using Hue, Saturation, and Lightness sliders
- 2D color picker for simultaneous Saturation and Value adjustment
- Real-time synchronization with Photoshop's foreground color
- Display of current foreground and background colors
- Numeric input for precise color values

## Compatibility

This plugin is compatible with Adobe Photoshop version 25.11.0 and later.

## Installation

1. Open the UXP Developer Tools (UDT) application.
2. Click "Add Plugin" and select the `manifest.json` file in the plugin folder.
3. Click the ••• button next to the corresponding workspace entry, and click "Load".

## Usage

1. Launch Photoshop and ensure the plugin is loaded.
2. The plugin panel will appear in Photoshop's interface.
3. Use the sliders, 2D picker, or numeric inputs to select your desired color.
4. The selected color will automatically update as Photoshop's foreground color.

## Development

This plugin is built using vanilla JavaScript and doesn't rely on any external frameworks. To modify or extend the plugin:

1. Edit the relevant JavaScript files (`main.js`, `Slider.js`, `Slider2D.js`, etc.).
