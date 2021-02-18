import assertFunc from './assert.js'

class Misc {
    assert (cond) { return assertFunc(cond) }

    sleepAsync (ms) {
        return new Promise((resolve) => {
            setTimeout(resolve, ms)
        })
    }

    addCommas (x) {
        // https://stackoverflow.com/questions/2901102/how-to-print-a-number-with-commas-as-thousands-separators-in-javascript
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
}

export default new Misc()
