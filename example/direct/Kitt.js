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

module.exports = {
    /***
     * Emulate KITT's nose light
     * https://en.wikipedia.org/wiki/KITT
     */
    Init: function(ctrl) {
        this.led = -1;
        this.count = 0;
        this.dir = 1;

        return 60;  // Update every 60ms
    },

    Update: function(ctrl) {
        this.led += this.dir;

        if (this.led >= 19) {
            this.dir = -1;
        }
        else if(this.led <= 0) {
            this.dir = 1;
            this.count++;
        }

        ctrl.ClearAllLeds();
        ctrl.SetLed(this.led, '#ff0000');
        ctrl.SetLed(this.led - (this.dir), '#a80000');
        ctrl.SetLed(this.led - (this.dir * 2), '#540000');
        ctrl.UpdateDirect();

        return (this.count < 10);
    }
};