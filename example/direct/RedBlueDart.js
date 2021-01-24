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
     * Top-to bottom, Red-to-Blue
     */
    Init: function () {
        this.led = -1;
        this.blue = 0;
        this.red = 252;
        this.count = 0;

        return 20;
    },

    Update: function (ctrl) {
        let running = true;

        if (this.led >= 0) {
            ctrl.ClearLed(this.led);
        }

        if (++this.led > 20) {
            this.led = 0;
            this.count++;
        }

        this.red = (this.red < 24) ? 252 : this.red - 12;
        this.blue = (this.blue > 240) ? 12 : this.blue + 12;

        ctrl.SetLed(this.led, `rgb(${this.red}, 0, ${this.blue})`);
        ctrl.UpdateDirect();

        return (this.count < 10);
    }
};
