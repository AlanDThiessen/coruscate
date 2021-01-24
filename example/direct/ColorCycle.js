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
     * Color Cycle All Leds
     */
    Init: function () {
        this.red = 256;
        this.green = 0;
        this.blue = 0;
        this.fade = 0;
        this.count = 0;

        return 12;  // Update every 12ms
    },

    Update: function (ctrl) {
        switch (this.fade) {
            // Fade from Red to Green
            case 0:
                --this.red;
                ++this.green;

                if (this.red === 0) {
                    this.fade = 1;
                }
                break;

            // Fade from Green to Blue
            case 1:
                --this.green;
                ++this.blue;

                if (this.green === 0) {
                    this.fade = 2;
                }
                break;

            // Fade from Blue to Red
            case 2:
                --this.blue;
                ++this.red;

                if (this.blue === 0) {
                    this.fade = 0;
                    this.count++;
                }
                break;

            default:
                break;
        }

        ctrl.FillLeds(`rgb( ${this.red}, ${this.green}, ${this.blue} )`, 0);
        ctrl.UpdateDirect();

        return (this.count < 5);
    }
}