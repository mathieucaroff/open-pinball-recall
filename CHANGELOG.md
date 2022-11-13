# Open Pinball Recall Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [v0.1.3] - 2022-11-13

### Added

- There is now a minimum value for the size of the grid (3x3) and the number of bumpers (2).
- Clicking on the score screen leads to the 'Play again?' screen which starts a new game when clicked.
- The time waited while displaying the bumpers is now an affine function of tth number of bumpers.

### Changed

- the text size is now based on the board size rather than the cell size

## [v0.1.2] - 2022-11-12

### Added

- the levels are now generated with the constraint that the ball must hit at least two bumpers

### Changed

- the switching from one level to the next is now smoother and does not requires clicking
  - the `clickyNext` parameter restores the former behaviour

## [v0.1.1] - 2022-11-11

### Added

- support for phones and tablets

### Changed

- the difficulty progression has been changed

## [v0.1.0] - 2022-11-11

The game is playable and has a score system.
