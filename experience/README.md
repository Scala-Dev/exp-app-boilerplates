# Experience App

Launches the schedule, menu, fling, and identifier apps. The schedule app's configuration is pulled from the current experience. The current experience is either the device's experience, or the experience specified by uuid in the query/hash param `experience`. If the query/hash param `key` is specified, will play the app with the given key directly in lieu of the scheduling app.

If there is no experience, no schedule app is played. This app holds playback.

The experience app also listens for updates to the device and experience and restarts the player when a change is detected. If a device is unpaired, the experience app will also call the player unpairing method.
