// модули
const conf = require('./conf.js');
const TelegramApi = require('node-telegram-bot-api');
const token = conf.TOKEN;
const bot = new TelegramApi(token, {polling:true});
const canvasBattle = require('./imageDraw.js')
const user = require('./user.js')
const color = require('./color')


// иницилизация поля для рисования и установка времении обновления изображения
cb = new canvasBattle(1000, 1000, './img.png')
cb.loadImage('./img.png')
setInterval(cb.writeImage,60000)

// установки девольтных настроек
const time = 10000
const sizeDefault = 10

const commandsDescription = [
    {command: "/start", description: "Привет"},
    {command: "/colorpick", description: "Выбрать цвет r,g,b"},
    {command: "/help", description: "Выводить список команд"},
    {command: "/draw", description: "Рисует на холсте x y"},
    {command: "/colorlist", description: "Выводить список цветов по умолчанию"},
    {command: "/mycolorlist", description: "Выводить список цветов по умолчанию ,заданные пользователем"},
    {command: "/setcolorlist", description: "Устанавливаеть список цветов r,g,b r,g,b r,g,b"},
    {command: "/view", description: "Отображаеть сам холст"},
    {command: "/myinfo", description: "Выводить всю информацию об пользователе"},
    {command: "/mycolor", description: "Выводить цвет и изображение"},
]
bot.setMyCommands(commandsDescription)


const chats = {}

const colorList = [
    {text:"Черный цвет ⚫", callback_data:"Black"},
    {text:"Белый цвет ⚪", callback_data:"White"},
    {text:"Красный цвет 🔴", callback_data:"Red"},
    {text:"Желтый цвет 🟡", callback_data:"Yellow"},
    {text:"Синий цвет 🔵", callback_data:"Blue"},
    {text:"Зеленый цвет 🟢", callback_data:"Green"}
]

const colorOptions ={
    reply_markup:JSON.stringify({
        inline_keyboard:[
            [...colorList.toSpliced(0,3)],
            [...colorList.toSpliced(3,3)]
        ]
    })
}


const commands = {
    "/draw":async (id,x,y)=>{
        const date = chats[id].date
        const dateRemain = Date.now()-date
        if((dateRemain)<time){
            await bot.sendMessage(id,"Идет перезарядка хода"+(time - dateRemain))
            return;
        }
        chats[id].date = Date.now()
        cb.drawPixel(chats[id].color, x,y,  sizeDefault)
    },
    "/myinfo":async (id)=>{
        await bot.sendMessage(id,"текущий цвет")
        await bot.sendMessage(id, chats[id].color)
        await bot.sendMessage(id, 'Список цветов')
        await bot.sendMessage(id, chats[id].colorList.map(el => String(el)+"\n").join(''))
    },
    "/colorpick":async (id,color)=>{
        try{
            chats[id].color = String(new color(...color.split(',')))
        }
        catch (e){
            return;
        }

    },
    "/mycolor":async (id)=>{
        const path = `./image/${id}-color.png`
        const cb2 = new canvasBattle(192,192,path)
        cb2.drawPixel(chats[id].color, 0,0,  192)
        cb2.writeImage()
        await bot.sendMessage(id,"текущий цвет")
        await bot.sendMessage(id, chats[id].color)
        await bot.sendPhoto(id, cb2.path)
    },
    "/mycolorlist":async (id)=>{
        const colorList = chats[id].colorList.map((el,index)=>{
            return [{
                text:`цвет №${index+1} ${String(el)}`,
                callback_data:String(el)
            }]
        })
        const colorOptions ={
            reply_markup:JSON.stringify({
                inline_keyboard:[
                    ...colorList
                ]
            })
        }
        await bot.sendMessage(id,"Мой список цветов",colorOptions)
    },
    "/setcolorlist":async (id, ...arg)=>{
        let colorList = []
        for(let i = 0 ; i<3;i++){
            if(arg[i] === undefined){
                colorList.push(new color())
                continue
            }
            colorList.push(new color(...arg[i].split(',')))
        }
        chats[id].colorList = colorList
        commands["/myinfo"](id)
    },
    "/colorlist":async (id)=>{
        await bot.sendMessage(id,"Список цветов",colorOptions)
    },
    "/view":async (id)=>{
        cb.writeImage()
        await bot.sendPhoto(id, cb.path)
    },
    "/help":async (id)=>{
        const list = Object.keys(commands).map(el=>el+"\n").join('')
        await bot.sendMessage(id,list)
    },
    "/start":async (id)=>{
        await bot.sendMessage(id,"Привет")
        commands['/help'](id)
    }
};


const start = ()=>{

    bot.on("message", async msg=>{
        const {text} = msg;
        const {id} = msg.from;
        const [command,...arg] = text.split(' ')
        if(chats[id] === undefined){
            chats[id]= new user()
        }
        if(Object.keys(commands).includes(command)){
            commands[command](id,...arg);
        }
    })
    bot.on("callback_query",async msg =>{
        const {id} = msg.from
        const {data} = msg
        if(chats[id] === undefined){
            chats[id]= new user()
        }
        chats[id].color = data
        commands['/mycolor'](id)
    })
};

start();