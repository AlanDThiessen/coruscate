
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
                aura.Update({
                    mode: 'ColorCycle',
                    speed: 'Fast'
                });
                setTimeout(RunOnOffTest, 5000);
                break;

            case 1:
                aura.Off();
                setTimeout(RunOnOffTest, 5000);
                break;

            case 2:
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
