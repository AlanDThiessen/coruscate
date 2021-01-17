#!/usr/bin/env node

const Coruscate = require('../coruscate.js');

main();

function main() {
    let config = ProcessArgs();

    if(config && CheckConfig(config)) {
        RunConfig(config);
    }
    else {
        process.exit(-1);
    }
}


function CheckConfig(config) {
    let valid = true;

    if(config.hasOwnProperty('off')) {
    }
    else if(!config.hasOwnProperty('mode')) {
        console.error('Mode is required');
        valid = false;
    }
    else {
        let params = Coruscate.Params(config.mode);

        if(config.hasOwnProperty('color1') && !config.hasOwnProperty('color2')) {
            // Add a default blank color2
            config.color2 = '#000000';
        }

        if(Array.isArray(params)) {
            params.forEach((param) => {
                if(!config.hasOwnProperty(param)) {
                    valid = false;
                }
            });
        }

        if(!valid) {
            console.error(`Missing params for Mode ${config.mode}`);
            console.error(`Required params: ${params.join(', ')}`);
        }
    }

    return valid;
}


function RunConfig(config) {
    try {
        let aura = Coruscate.Coruscate(config);

        if (config.hasOwnProperty('off')) {
            aura.Off();
        } else {
            aura.Update();
        }

        aura.Close();
    }
    catch (e) {
        console.error(e.message);
        process.exit(-1);
    }
}


function ProcessArgs() {
    let error = false;
    let config = {};

    do {
        let arg = GetNextArg();

        switch (arg) {
            case 'off':
                config.off = true;
                break;

            case '-m':
            case '--mode':
                let mode = GetNextArg();
                let modes = Object.keys(Coruscate.modes);

                if((mode) && modes.includes(mode)) {
                    config.mode = mode;
                }
                else {
                    error = true;
                    console.error(`Invalid mode '${mode}'`);
                    console.error(`Valid modes include ${modes.join(', ')}`);
                }
                break;

            case '-c1':
            case '--color1':
                error = GetColor('color1');
                break;

            case '-c2':
            case '--color2':
                error = GetColor('color2');
                break;

            case '-s':
            case '--speed':
                let speed = GetNextArg();

                if(typeof(speed) === 'number') {
                    if((speed >= 0xe1) && (speed <= 255)) {
                        config.speed = speed;
                    }
                    else {
                        error = true;
                        console.error(`Speed value must be between 225 and 255`);
                    }
                }
                else if(typeof(speed) === 'string') {
                    let speeds = Object.keys(Coruscate.speeds);

                    if(speeds.includes(speed)) {
                        config.speed = speed;
                    }
                    else {
                        error = true;
                        console.error(`Invalid speed '${speed}'`);
                        console.error(`Valid modes include ${speeds.join(', ')}`);
                    }
                }
                break;

            case '-d':
            case '--direction':
                let dir = GetNextArg();
                let dirs = Object.keys(Coruscate.directions);

                if(dirs.includes(dir)) {
                    config.direction = dir;
                }
                else {
                    error = true;
                    console.error(`Invalid direction '${dir}'`);
                    console.error(`Valid directions include ${dirs.join(', ')}`);
                }
                break;
        }
    }
    while((!error) && (process.argv.length > 0));

    return (error ? null : config);


    function GetNextArg() {
        if(process.argv.length > 0) {
            return process.argv.shift();
        }
        else {
            return null;
        }
    }

    function GetColor(param) {
        let error = false
        let color = GetNextArg();

        if(color !== null) {
            config[param] = color.replace(/'/g, '');
        }
        else {
            console.error(`Invalid color '${color}' for '${param}'`);
            console.error("Color must be in the form of '#rrggbb' (hex) or 'rgb(rrr, ggg, bbb)' (decimal)");
            error = true;
        }

        return error;
    }
}
