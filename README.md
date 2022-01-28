# reinforcement-learning-2
Reinforcement Learning exhibit for the I AM A.I. exhibition (v2)

## Compilation

To install the required dependencies run `npm install` in the root directory.

You can use `npm run build` or `npm run watch` in the root directory to build the client apps.

The `.env` file in the root directory contains settings that are applied at compilation time.

## Configuration

The config directory has several data definitions.

You can override any of them by creating a `settings.yml` file in the root directory.

## Exhibit mode

`exhibit.html` runs the exhibit in a fixed 1920x1080 resolution.

To override settings in exhibit mode create a `settings-exhibit.yml` file in the root directory.

The default language can also be set through the lang query string (e.g. `?lang=de`).

## License

Copyright (c) 2020-2021 IMAGINARY gGmbH
Licensed under the MIT license (see LICENSE)
