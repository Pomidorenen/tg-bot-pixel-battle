class Color{
    constructor(r = 0,g =0,b = 0) {
        this.r =  Number(r)
        this.g =  Number(g)
        this.b = Number(b)
    }
    getArray(){
        return [this.r, this.g,this.b]
    }
    toString(){
        return `rgb (${this.r}, ${this.g}, ${this.b})`
    }
    setColor(r = 0,b =0 ,g = 0){
        this.r = r
        this.g = g
        this.b = b
    }
}


module.exports = Color