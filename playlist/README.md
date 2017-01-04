# Playlist App

The playlist app plays a list of apps. Apps are specified via an array of app launch options in `config.slides`. The playlist will loop indefinitely if `context.once` is not set to `true` or if `config.loop` is set to `true`. Apps will generally play in the order they are specified but if an app is slow to load it may be skipped. Will hold playback.

## Configuration

### `transition.name`

A string indicating the transition to use between apps. Supports slide/cube/poster/fade/panAndZoom.

### `duration`

The number of seconds between the start of playback of a slide and the 

## `backgroundColor`

The background color that is directly behind the app containers. If apps are transparent, this color will be shown.

## `viewportColor`

Only for cube transform, the color of the background behind the cube. 

## `loop`

When unset, looping behavior is deferrered to the context. When `true` or `false` enables or disables looping.



## Transitions

### Slide (default)

The apps are slid off the screen using easing.

### Cube

The apps appear as faces of a cube. The cube pops out, rotates, and shows the next application.

### Poster

Same as slide with a vertical transition.

### Fade

Current app fades out while the next app fades in

### Pan and Zoom

Slow panning and zooming while the slide is displayed. Transition is similar to fade.
