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

const Coruscate = require('../coruscate.js');

const Tests = {
    StaticRed: {
        mode: Coruscate.modes.Static,
        color1: "#ff0000"
    },

    StaticGreen: {
        mode: "Static",
        color1: "#00ff00"
    },

    StaticBlue: {
        mode: Coruscate.modes.Static,
        color1: "#0000ff"
    },

    BreatheRedSlow: {
        mode: 'Breathe',
        color1: "#ff0000",
        speed: 0xe1,
    },

    BreatheRedBlueFast: {
        mode: Coruscate.modes.Breathe,
        color1: "#ff0000",
        color2: "#0000ff",
        speed: 'Fast'
    },

    ColorCycleSlow: {
        mode: 'ColorCycle',
        speed: 'Slow'
    },

    ColorCycleMedium: {
        mode: Coruscate.modes.ColorCycle,
        speed: 'Medium'
    },

    RainbowLeftSlow: {
        mode: Coruscate.modes.Rainbow,
        speed: 'Slow',
        direction: 'Left'
    },

    RainbowRightFast: {
        mode: "Rainbow",
        speed: 'Fast',
        direction: 'Right'
    },

    StrobeRed: {
        mode: "Strobe",
        color1: "#ff0000"
    },

    StrobeBlue: {
        mode: Coruscate.modes.Strobe,
        color1: "#0000ff"
    },

    CometRed: {
        mode: "Comet",
        color1: "#ff0000"
    },

    CometBlue: {
        mode: Coruscate.modes.Comet,
        color1: "#0000ff"
    },

    FlashNDashRed: {
        mode: Coruscate.modes.FlashNDash,
        color1: "#ff0000"
    },

    Irradiation1: {
        mode: Coruscate.modes.Irradiation
    },

    FlashNDashBlue: {
        mode: "FlashNDash",
        color1: "#0000ff"
    },

    Irradiation2: {
        mode: "Irradiation"
    }
}

main();

function main() {
    let aura = Coruscate.Coruscate();
    let test = (process.argv.length > 2) ? process.argv[2] : 'all';
    let testNum = 0;
    let testSuite = Tests;

    console.log(aura.descriptor);

    if(test === 'all') {
        RunAllTests();
    }
    else if(test === 'offon') {
        RunOnOffTest();
    }
    else {
        if(testSuite.hasOwnProperty(test)) {
            RunTest(test);
            setTimeout(Done, 10000);
        }
        else {
            console.error(`Invalid test: '${test}'`)
            Done();
        }
    }

    function RunTest(testToRun) {
        console.log(`Running test: '${testToRun}'`);
        aura.Update(testSuite[testToRun]);
    }

    function RunAllTests() {
        let testSet = Object.keys(testSuite);

        if(testNum < testSet.length) {
            RunTest(testSet[testNum++]);
            setTimeout(RunAllTests, 10000);
        }
        else {
            aura.Off();
            aura.Close();
        }
    }

    function RunOnOffTest() {
        switch(testNum++) {
            case 0:
                console.log("Setting ColorCycle Fast");
                aura.Update({
                    mode: 'ColorCycle',
                    speed: 'Fast'
                });
                setTimeout(RunOnOffTest, 5000);
                break;

            case 1:
                console.log("Turning off");
                aura.Off();
                setTimeout(RunOnOffTest, 5000);
                break;

            case 2:
                console.log("Turning on");
                aura.On();
                setTimeout(RunOnOffTest, 5000);
                break;

            default:
                Done();
                break;
        }
    }

    function Done() {
        aura.Off();
        aura.Close();
    }
}
