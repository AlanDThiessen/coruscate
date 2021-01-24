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

const Examples = {
    SingleLed: require('./direct/SingleLed.js'),
    RedBlueDart: require('./direct/RedBlueDart.js'),
    ColorCycle: require('./direct/ColorCycle.js'),
    Kitt: require('./direct/Kitt.js')
}


function Run(example) {
    let aura = Coruscate.Coruscate();
    let interval;

    aura.InitDirect();
    let time = example.Init(aura);

    if(time) {
        interval = setInterval(() => {
            if(!example.Update(aura)) {
                Done();
            }
        }, time);
    }

    function Done() {
        clearInterval(interval);
        aura.InitDirect();
        aura.Close();
    }
}

main();

function main() {
    if(process.argv.length > 2) {
        let example = process.argv[2];

        if(Examples.hasOwnProperty(example)) {
            Run(Examples[example]);
        }
    }
    else {
        console.error("Please specify an example to run");
        console.error(`   Examples: ${Object.keys(Examples).join(', ')}`)
    }
}
