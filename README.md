# Exp App Boilerplates

Examples of player applications on EXP. See the [documentation](https://docs.goexp.io). These app template boilerplates are the global apps available to all EXP users. Some of the apps are hidden from the UI for simplicity.

# Examples Using Common Frameworks

- angular: [meeting room app](meeting-room-app)
- vuejs: [news app](news-app)
- ember: [social app](social-feed)
- jquery: [menu board app](menu-board)

# Special and Hidden Apps

## Bootloader

The [bootloader app](bootloader) is launched by the player to start playback. Its purpose is to ensure authentication is successful and to either launch the [experience app](#experience) or [pairing app](#pairing) depending on whether or not you are authenticated. You can use a custom app instead of the stock bootloader by using the url query/hash parameter `bootloader=[uuid]`.

## Experience

The [experience app](experience) launches the [menu app](#menu), [identify app](#identify), and [fling app](#fling). It also reads the current experience of the device (or the experience specified in by the url parameter `experience=[uuid]`) and launches the [schedule app](#schedule) with the appropriate configuration.

## Schedule

The [schedule app](schedule) takes a set of recursion rules that map apps to days and plays the appropriate app for the current day (local date).

## Dayplan

The [dayplan app](dayplan) takes a map of apps to time blocks and plays the appropriate app for the current time (local time).


## Pairing

The [pairing app](pairing) shows the pairing code on screen and listens for the pairing event. When credentials are received it saves them and restarts the player.

## Menu

The [menu app](menu) shows a menu on screen when the user clicks near the bottom left corner. The menu shows device, experience, and organization name, as well as online/offline status and cache storage.

## Identify

The [identify app](identify) listens for the `identify` event on the device channel and shows the device name on screen for a short period of time when the message is received.

## Fling

The [fling app](fling) listens for events on contextual channels and forwards the event payload to the `exp.player.play()` method.


# UUIDs

The following is a list of UUIDs for each global app in EXP. These apps are available publically without credentials.

| App Template | UUID |
|--------------|------|
|audio|3415bd0b-f567-4f53-896a-2344b24645be|
|embed|f2520731-8973-4cc6-bba1-87ba1fe17555|
|fling|1b21ec6e-0b96-4089-bed8-0c6f36114916|
|identifier|ef6e7796-a37e-4d30-b992-60e2e787e66d|
|image|a71a9963-b22b-4e59-8b1b-7380296082a9|
|meetingroom|59ada3c8-ded0-11e5-b86d-9a79f06e9478|
|menuboard|5299680e-80b0-404b-baa1-9a414365dfef|
|news|34026b40-f721-11e5-9ce9-5e5517507c66|
|pairing|5e9a5aaf-7a03-4651-8c73-8675635dcf88|
|playlist|e115f1d3-f5a8-4151-9428-a995435eacaa|
|social|c3584db2-508a-43ba-90f7-e14ef2000baf|
|video|1290126c-a06d-4520-a547-1719c48aa9eb|
|weather|b1e38132-5911-4b16-b2ad-30600b8298c8|
|youtube|16215708-0471-4b61-8ead-3e5dbe34c2a1|
