# Coruscate

> **coruscate** *verb*
> 
> cor - us - cate | ˈkȯr-ə-ˌskāt
> 
> 1. to give off or reflect light in bright beams or flashes
> 2. to be brilliant or showy in technique or style
> 
> *[“Coruscate.” Merriam-Webster.com Dictionary, Merriam-Webster](https://www.merriam-webster.com/dictionary/coruscate). Accessed 16 Jan. 2021.*

## Description

Coruscate is a [NodeJs](https://nodejs.org/en/) library for controlling the LED case lighting on an [Asus ROG Strix GA15](https://rog.asus.com/desktops/mid-tower/rog-strix-ga15-series/) Desktop.

This module also provides a command-line utility to control the lighting.

## Warning

This software is made available under the terms of the [MIT License](https://opensource.org/licenses/MIT).

No guarantees.  This library uses reverse-engineered protocols to communicate with an external USB device (the case lighting controller).  As a result, the functionality of some values is unknown.  While unlikely, damage to hardware may be possible.  The developers of this software make no guarantees.

That said, the initial developer is using this successfully to control the lighting on an Asus ROG Strix GA15.

## Installation

Install locally (library only):

```
npm install coruscate
```

Installing globally also installs the `coruscate` command-line utility.

```
npm install -g coruscate
```

## Library Usage

### Primary Usage

#### Steps:

- A new Coruscate object is created by calling the constructor with a configuration object.  The constructor first searches for supported USB devices.  If one is found, the connection is opened, but no data is written to the device.
- The `Update()` method is used to write the configuration to the device.
- The `Close()` method is called to close connection to the device.

```javascript
const Coruscate = require('coruscate');

// Create a new Corescate object the the specified config.
let lights = Coruscate.Coruscate({
    mode: "Static",         // Static mode is solid-on
    color1: "#ff0000"       // Set the primary color to red
});

lights.Update();    // Update the device with the new mode
lights.Close();     // Close the connection to the device
```

### Configuration Object

The configuration object takes the following parameters:

- **mode** - *string*: The mode/function of the lighting.  The following modes are supported ***(case-sensative)***.
   - Static
   - Breathe
   - ColorCycle
   - Rainbow
   - Strobe
   - Comet
   - FlashNDash
   - Irradiation
- **color1** - *string*: The primary color to use for the mode.  This string can be any value supported by the [color](https://github.com/Qix-/color#readme) library.  Examples include `'#00ff00'` and `'rgb(0, 0, 255)'`.
- **color2** - *string*: The secondary color to use for the mode ***(currently only supported for the `Breathe` mode)***.
- **speed** - *number* or *string*: A number between 225 and 255.  Alternatively, the following strings can be used ***(case-sensative)***:
   - Slow
   - Medium
   - Fast
- **direction** - *string*: The direction for the mode *(currently only supported by the `Rainbow` mode)*.
- **zone** - *number*: The zone to configure.  (The GA15DH only supports zone 0).

### Constructor Method

```javascript
let lights = Coruscate.Coruscate(config);
```

The `Coruscate` constructor can be called with a config structure documented above, or empty.  If no config structure provided, the internal values are initialized to Static mode with black colors (off).

Parameters:

- **config** - *object, optional*. A configuration object documented above.

### Update Method

```javascript
   lights.Update(config);
```

The `Update` method writes the configuration to the device.  A new/updated configuration object can be provided.  If no configuration object is proivded, the `Update` method writes the last used configuration to the device.

**Parameters:**

- **config** - *object, optional*. A configuration object documented above.

### Off Method

```javascript
   lights.Off();
```

The `Off` method turns off the case lights by setting them to Static mode and color `#000000`.  The internal configuration is left untouched.

### On Method

```javascript
   lights.On();
```

The `On` method turns the lights back on to the previously used configuration.

### Close Method

```javascript
   lights.Close();
```

The `Close` method is used to close communications with the device.  After this method is called no additional updates can be made.

### SetBrightness

```javascript
   lights.SetBrightness(level);
```

The `SetBrightness` method immediately changes the brightness of the device.  The GA15DH only supports 0 and 1.

**Parameters:**

- **level** - *number, required*: The level of brightness (0, or 1) to set the device.

> Note: The `On` and `Off` methods are simply aliases of `SetBrightness`.

### SetMode Method

```javascript
   lights.SetMode(mode);
```

The `SetMode` method changes the mode of the device.  If a connection is open, this method takes affect immediately.

**Parameters:**

- **mode** - *string, required*: The new mode (documented above) to which to set the device.

### SetColor Method

```javascript
   lights.SetColor(color1, color2);
```

The `SetColor` method changes the color of the current mode.  If a connection is open, this method takes affect immediately.

**Parameters:**

- **color1** - *string, required*: A color string (see above) specifying the primary color for the mode.
- **color2** - *string, optional*: A color string (see above) specifying the secondary color for the mode.

**Supported Modes:**

- *color1* is supported by *Static, Breathe, Strobe, Comet,* and *FlashNDash* modes.
- *color2* is supported by the *Breathe* mode.

### SetSpeed Method

```javascript
   lights.SetSpeed(speed);
```

The `SetSpeed` method changes the speed of the current mode (if supported).  If a connection is open, this method takes affect immediately.

**Parameters:**

- **speed** - *number or string, required*:
  - As a number between 225 and 255 specifying the speed of the effect. 
  - As a string `Slow`, `Medium`, or `Fast`.

**Supported Modes:**

- *speed* is supported by *Breathe, ColorCycle* and *Rainbow* modes.
 
### SetDirection Method

```javascript
   lights.SetDirection(direction);
```

The `SetDirection` method changes the direction of the current mode (if supported).  If a connection is open, this method takes affect immediately.

**Parameters:**

- *direction* - *string, required*: The direction for the mode.  Can be either `Left` or `Right`.

**Supported Modes:**

- *direction* is supported by the *Rainbow* mode.

### SetZone

```javascript
   lights.SetZone(zone);
```

The `SetZone` method changes the zone for the following operations.  No changes take effect immediately.  (The GA15DH only supports zone 0.)

**Parameters:**

- **zone** - *number, required*: The zone to begin operating on.


## Command Line Usage

The provided `coruscate` command-line utility (if installed) can be used to control the case lights.

> Note: The user running the command must have write priviledges to the appropriate USB HID device.  Sudo privileges may be required.

To control the case lights:

```
$ coruscate [options]
```

or, to turn off the lights:

```
$ coruscate off
```

or, to turn on the lights:

```
$ coruscate on
```

### Options

The following options can be used.  Descriptions of these parameters match the configuration structure documented above.

- `-m <mode>`, `--mode <mode>` - Specifies the mode to use.
- `-c1 <color>`, `--color1 <color>` - Specifies the primary color.
- `-c2 <color>`, `--color2 <color>` - Specifies the secondary color.
- `-s <speed>`, `--speed <speed>` - Specifies the speed.
- `-d <direction>`, `--direction <direction>` - Specifies the direction.
- `-z <zone>`, `--zone <zone` - Specifies the zone on which to operate.


## Supported Platforms

Currently, this library has only been tested on Linux.  Support for Windows is currently unknown.
