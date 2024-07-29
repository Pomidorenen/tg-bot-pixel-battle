const {createCanvas, Image} = require('canvas')
const fs = require('fs')

const canvasBattle = function (sizeX,sizeY,path){
    this.path = path
    this.canvas = createCanvas(sizeX,sizeY)
    this.ctx = this.canvas.getContext('2d')
    this.drawPixel = (color,x,y,size)=>{
        this.ctx.fillStyle = color;
        this.ctx.fillRect(x, y, size, size);
    }
    this.writeImage = ()=>{
        const buffer = this.canvas.toBuffer('image/png')
        fs.writeFileSync(this.path, buffer)
    }
    this.loadImage = (path)=>{
        this.path = path
        let {width, height} = this.canvas
        const image = new Image()
        image.src = path
        image.onload = () => this.ctx.drawImage(image, 0, 0, width, height)
    }
}


module.exports = canvasBattle;