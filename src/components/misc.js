import assertFunc from './assert.js'

class Misc {
    assert (cond) { return assertFunc(cond) }

    sleepAsync (ms) {
        return new Promise((resolve) => {
            setTimeout(resolve, ms)
        })
    }
}

export default new Misc()
