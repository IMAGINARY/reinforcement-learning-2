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

## Embed mode

`embed.html` allows you to embed instances of the app in your own website via an iframe.

You can customize the functionality of the embeded app through query strings arguments:

- **lang** (default: `en`): Language.
- **map** (default: `maze1`): Map to show. Maps have to be stored in `data/mazes`.
- **training**: Name of the q-value table to initialize the robot with. Q-values are stored in `data/training`.
- **editmap** (default: `false`): If true, the map can be edited.
- **tiles**: Comma separated list of the ids (numerical) of the tiles to show in the left side palette. Ids can be viewed in `config/tiles.yml`.
- **cmds**: Comma separated list of UI elements to show, from:
  - run: The run button
  - step: The step button
  - turbo: The turbo button
  - clear: The button to clear the training
  - xr: The exploration rate slider (Explore / Exploit)
  - reset-map: The button to reset the map
  - policy: The button to show the policy and value function
- **xr** (default: `0.2`) The starting exploration rate.
- **lr** (default: `1`) The learning rate.
- **speed** (default: `10`): The speed of the robot.
- **showpolicy** (default: `false`): If true, the policy and value function are shown.
- **showqv** (default: `false`): If true, the q-values are shown on the map.
- **autorun** (default: `false`): If true, the robot starts in the running state.
- **showrewardbar** (default: `false`): If true, the reward bar is shown over the map (currently very specific to a particular
  experiment, so probably not practical).

## Sentry

The app supports Sentry.

The `index.html` page can take the DSN from the `sentry-dsn` query string parameter.

It can also get the DSN from the `sentry.dsn` configuration key in the  `settings-exhibit.yml` file.

## Credits

Developed by Eric Londaits for IMAGINARY gGmbH adapted from the original
[reinforcement-learning exhibit](https://github.com/IMAGINARY/reinforcement-learning/)
by Sebastián Uribe and Andreas Matt.

Dutch translation by [Jarne Renders](https://github.com/JarneRenders).
Spanish and French translations by Daniel Ramos.

## License

Copyright (c) 2020-2021 IMAGINARY gGmbH
Licensed under the MIT license (see LICENSE)
