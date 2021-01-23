/******************************************************************************
 *
 * The MIT License (MIT)
 *
 * Copyright (c) 2021 Alan Thiessen
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 *
 ******************************************************************************/

const HID = require('node-hid');
const Color = require("color");

const SupportedDevices = {
    'GA15': {
        'vendorId': 0x0b05,
        'productId': 0x1866
    }
};


const Mode = {
    'Static':       0x00,
    'Breathe':      0x01,
    'ColorCycle':   0x02,
    'Rainbow':      0x03,
    'Strobe':       0x0a,
    'Comet':        0x0b,
    'FlashNDash':   0x0c,
    'Irradiation':  0x11
};


const Speeds = {
    'Slow':         0xe1,
    'Medium':       0xeb,
    'Fast':         0xf5
}


const Directions = {
    'Left':         0x00,
    'Right':        0x01
}


const Params = [
    {
        'mode': Mode.Static,
        'params': [
            'color1'
        ]
    },
    {
        'mode': Mode.Breathe,
        'params': [
            'color1',
            'color2',
            'speed'
        ]
    },
    {
        'mode': Mode.ColorCycle,
        'params': [
            'speed'
        ]
    },
    {
        'mode': Mode.Rainbow,
        'params': [
            'speed',
            'direction'
        ]
    },
    {
        'mode': Mode.Strobe,
        'params': [
            'color1'
        ]
    },
    {
        'mode': Mode.Comet,
        'params': [
            'color1'
        ]
    },
    {
        'mode': Mode.FlashNDash,
        'params': [
            'color1'
        ]
    },
    {
        'mode': Mode.Irradiation,
        'params': [
        ]
    }
];


/***
 * The main Coruscate object delegate
 * @type {{Init: (function(): boolean), Close: Close}}
 */
const Coruscate = {
    'Init': Init,
    'Close': Close,
    'Update': Update,
    'SetZone': SetZone,
    'SetMode': SetMode,
    'SetColor': SetColor,
    'SetSpeed': SetSpeed,
    'SetDirection': SetDirection,
    'SetBrightness': SetBrightness,
    'Off': Off,
    'On': On
};


/***
 * Creates a new Coruscate object
 * @returns {any}
 * @constructor
 */
function NewCoruscate(obj = null) {
    let coruscateObj = Object.assign(Coruscate);
    coruscateObj.Init(obj);
    return coruscateObj;
}


/***
 * Initializes a Coruscate object
 */
function Init(obj) {
    this.aura = null;
    this.descriptor = null;
    this.zone = 0;
    this.mode = Mode.Static;
    this.color1 = Color("#000000");
    this.color2 = Color("#000000");
    this.speed = 0xe1;
    this.dir = Directions.Left;

    // Set any values passed in
    this.Update(obj);

    let device = FindSupportedDevice();

    if(device) {
        try {
            this.aura = new HID.HID(device.vendorId, device.productId);
        }
        catch (e) {
            console.error(e);
            this.aura = null;
            this.descriptor = null;
        }
        finally {
            if(this.aura !== null) {
                this.descriptor = device;
                Handshake(this.aura);
                this.SetBrightness(1);
            }
        }
    }

    return (this.aura !== null);
}


function Handshake(aura) {
    try {
        SendIdString();
        // NOt sure what the returned data means, or what the query means either.
        // But the device won't talk after power-up until this sequence is observed.
        aura.getFeatureReport(0x5E, 64);
        SendQuery();
        aura.getFeatureReport(0x5E, 64);
    }
    catch(e) {
        console.log(e);
    }

    function SendIdString() {
        let setData = Buffer.alloc(64, 0);
        let idString = Buffer.from("ASUS Tech.Inc.");

        setData[ 0] = 0x5e;
        idString.copy(setData, 1);
        aura.sendFeatureReport(setData);
    }

    function SendQuery() {
        let setData = Buffer.alloc(64, 0);
        let query = Buffer.from([
            0x5e,
            0x05,
            0x20,
            0x31,
            0x00,
            0x10
        ]);

        query.copy(setData, 0);
        aura.sendFeatureReport(setData);
    }
}


/***
 * Close the connected HID device
 * @constructor
 */
function Close() {
    if(this.aura) {
        this.aura.close();
        this.aura = null;
    }
}


/***
 * Forces and update
 * @constructor
 */
function Update(obj = null) {
    let aura = this;

    if(obj !== null) {
        if(obj.hasOwnProperty('zone')) {
            aura.SetZone(obj.zone);
        }

        if(obj.hasOwnProperty('mode')) {
            aura.SetMode(obj.mode, false);
        }

        if(obj.hasOwnProperty('color1')) {
            let color1 = obj.color1;
            let color2 = null;

            if(obj.hasOwnProperty('color2')) {
                color2 = obj.color2;
            }

            aura.SetColor(color1, color2, false);
        }

        if(obj.hasOwnProperty('speed')) {
            aura.SetSpeed(obj.speed, false);
        }

        if(obj.hasOwnProperty('direction')) {
            aura.SetDirection(obj.direction, false);
        }
    }

    UpdateDevice(aura);
}


/***
 * Set the brightness of the LEDs
 * @param level
 * @constructor
 */
function SetBrightness(level) {
    if((level >= 0) && (level <= 1)) {
        let buffer = Buffer.from([
            0xC5,
            0xC4,
            level
        ]);

        WriteAura(this.aura, 0xba, buffer);
    }
}


/***
 * Set the zone to write
 * @param zone
 * @constructor
 */
function SetZone(zone) {
    this.zone = zone;
}


/***
 * Set the mode for operation
 * @param mode
 * @constructor
 */
function SetMode(mode, update = true) {
    let newMode = CheckMode(mode);

    if(newMode !== null) {
        this.mode = newMode;

        if(update) {
            UpdateDevice(this);
        }
    }
}


/***
 * Checks the mode and converts to the real value
 * @param mode
 * @returns {*}
 * @constructor
 */
function CheckMode(mode) {
    let newMode;

    switch(typeof(mode)) {
        case 'string':
            newMode = Mode.hasOwnProperty(mode) ? Mode[mode] : null;
            break;

        case "number":
            newMode = Object.values(Mode).includes(mode) ? mode : null;
            break;

        default:
            newMode = null;
            break;
    }

    return newMode;
}


/***
 * Sets the two colors for the various Modes
 * @param color1
 * @param color2
 * @constructor
 */
function SetColor(color1, color2 = null, update = true) {
    this.color1 = Color(color1);

    if(color2 !== null) {
        this.color2 = Color(color2);
    }

    if(update) {
        UpdateDevice(this);
    }
}


/***
 * Sets the speed for the modes (Supported by Breathe, ColorCycle, and Rainbow)
 * @param speed
 * @constructor
 */
function SetSpeed(speed, update = true) {
    let newSpeed = null;

    if(typeof(speed) === 'string') {
        newSpeed = Speeds.hasOwnProperty(speed) ? Speeds[speed] : null;
    }

    if((typeof(speed) === 'number') && (speed >= 0xe1) && (speed <= 0xff)) {
        newSpeed = speed;
    }

    if(newSpeed !== null) {
        this.speed = newSpeed;

        if(update) {
            UpdateDevice(this);
        }
    }
}


/***
 * Turn of the LEDS by setting them to static black
 * @constructor
 */
function Off() {
    this.SetBrightness(0);
}


/***
 * Turn the LEDS on by setting them to the current configuration
 * @constructor
 */
function On() {
    this.SetBrightness(1);
}

/***
 * Sets the direction of the Mode (Supported by Rainbow)
 * @param dir
 * @constructor
 */
function SetDirection(dir, update = true) {
    if(Directions.hasOwnProperty(dir)) {
        // Only update if dir changes
        if(this.dir !== Directions[dir]) {
            this.dir = Directions[dir];

            if(update) {
                UpdateDevice(this);
            }
        }
    }
}


/***
 * Searchs HID devices for a matching device in SupportedDevices.
 * @returns {*} or undefined
 */
function FindSupportedDevice() {
    let devices = HID.devices();

    let device = devices.find((entry) => {
        let found = false;

        for (let key in SupportedDevices) {
            if(SupportedDevices.hasOwnProperty(key)) {
                let dev = SupportedDevices[key];

                if((dev.vendorId === entry.vendorId) &&
                   (dev.productId === entry.productId)) {
                    found = true;
                }
            }
        }

        return found;
    });

    return device;
}


/***
 * Builds the message to send to the HID controller
 * @param aura
 * @constructor
 */
function UpdateDevice(aura) {
    let params = GetParams(aura.mode);
    let buffer = Buffer.from([
        aura.zone,              // Zone
        aura.mode,              // Mode
        0x00, 0x00, 0x00,       // Color 1
        0x00,                   // speed
        0xff,                   // param
        0x00,                   // Num colors? Breathe only
        0x00, 0x00, 0x00        // Color2; Breathe only
    ]);

    if((aura.aura !== null) && Array.isArray(params)) {
        if(params.includes('color1')) {
            Buffer.from(aura.color1.array()).copy(buffer, 2, 0, 3);
        }

        // Breathe only
        if(params.includes('color2')) {
            buffer[7] = 0x01;
            Buffer.from(aura.color2.array()).copy(buffer, 8, 0, 3);
        }

        if(params.includes('speed')) {
            buffer[5] = aura.speed;
        }

        // Rainbow only
        if(params.includes('direction')) {
            buffer[6] = aura.dir;
        }

        Idle(aura.aura);
        WriteAura(aura.aura, 0xb3, buffer);
        WriteAura(aura.aura, 0xb4, Buffer.alloc(0));
        WriteAura(aura.aura, 0xb5, Buffer.alloc(0));
    }
}


/***
 * Sends an Idle to the HID device
 * @constructor
 */
function Idle(hid) {
    // Unfortunately, node-hid doesn't support Set_Idle
}


/***
 * Writes the aura data to the HID device
 * @param aura - The HID device
 * @param func - The function to write
 * @param data Array the data to write
 * @returns {*}
 * @constructor
 */
function WriteAura(aura, func, data) {
    let setData = Buffer.alloc(64, 0);

    setData[ 0] = 0x5e;
    setData[ 1] = func;
    data.copy(setData, 2);

    return aura.sendFeatureReport(setData);
}


/***
 * Returns the parameters for the given mode
 * @param reqMode
 * @returns {*}
 * @constructor
 */
function GetParams(reqMode) {
    let mode = CheckMode(reqMode);

    if(mode !== null) {
        return Params.find((param) => param.mode === mode).params;
    }
    else {
        return mode;
    }
}


module.exports = {
    'modes': Mode,
    'speeds': Speeds,
    'directions': Directions,
    'Params': GetParams,
    'Coruscate': NewCoruscate
}
