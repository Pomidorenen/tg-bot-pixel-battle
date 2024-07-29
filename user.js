const color = require('./color.js')
class User{
    color = String(new color(0,0,0))
    colorList = [new color(),new color(), new color()]

    constructor() {
        this.date = Date.now()
    }
}

module.exports = User