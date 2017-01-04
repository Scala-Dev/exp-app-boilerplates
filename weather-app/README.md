# Weather App

Shows the current weather and weather forcast for the given location.

## Location

If the weather feed is static, the weather app will just show the data for this feed. If dynamic, the weather app will attempt to use the address or lat/lon coordinates from the device's location.

## Configuration

### `feedConfiguration.uuid`

The uuid of the weather feed to pull from. 

### `logo.uuid`

The uuid of the image that will be displayed as a logo.

### `primaryColor`

The background color.

### `textColor`

### `temperature`

`c` for celcius and `f` for farenheit

### `measurements`

`metric` or `standard`

### `dateFormat`

How to show the day of week. `EEEE` for Sunday/Monday/..., `MM/dd/yyyy` for US format and `dd-MM-yyyy` for EU format.

### `refreshRateSeconds`

The number of seconds between updates of the data. 


