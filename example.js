const TelegramApi = require('node-telegram-bot-api')
const token = '';
const bot = new TelegramApi(token, {polling:true})
const {createCanvas} = require('canvas')
const fs = require('fs')

const canvas = createCanvas(192,192)
const ctx = canvas.getContext("2d")


const range = (value)=>[...new Array(value).fill(0)].map((el,index)=>index)
const buttonNumber = range(10).map(el=>{return {text:el, callback_data:el}})
const chats = {}
const gameOptions ={
    reply_markup:JSON.stringify({
        inline_keyboard:[
            [...buttonNumber.toSpliced(0,5)],
            [...buttonNumber.toSpliced(5,10)]
        ]
    })
}
const againOptions ={
    reply_markup:JSON.stringify({
        inline_keyboard:[
            [{text:"again", callback_data:'/game'}]
        ]
    })
}
const commands ={
    "/start":async (msg)=>{
        const {first_name, id} = msg.from;
        await bot.sendMessage(id,`привет ${first_name}`)
    },
    "/info":async (msg)=>{
        const {id} = msg.from
        await bot.sendMessage(id,`информация какая-то)))`)
    },
    "/picture":async (msg)=>{
        const {id} = msg.from
        ctx.fillStyle = "green";
        ctx.fillRect(20, 10, 150, 100);
        const buffer = canvas.toBuffer('image/png')
        fs.writeFileSync('./image.png', buffer)
        await bot.sendPhoto(id,"./image.png")
    },
    "/help":async (msg)=>{
        const {id} = msg.from
        const text = Object.keys(commands).join('\n')
        await bot.sendMessage(id,`список команд`)
        await bot.sendMessage(id,text)
    },
    "/game":async (msg)=>{
        const {id} = msg.from
        await bot.sendMessage(id, "0 от 9")
        const randomNumber = Math.floor(Math.random()*10)
        chats[id]= randomNumber;
        await bot.sendMessage(id,"отгодай",gameOptions)
    },
    "/lab2":async (msg)=>{
        const {id} = msg.from
        await bot.sendMessage(id, "Ну смотрии")
        await bot.sendMessage(id, "сначало")
        await bot.sendMessage(id, "Гена цитормян")
        await bot.sendMessage(id, "потом")
        await bot.sendMessage(id, "дай подумать")
        setTimeout(async ()=>{
            await bot.sendMessage(id, "крч сам думай")
        },1500)
    }
}

bot.setMyCommands([
    {command: "/start", description: "начальное приветствие"},
    {command: "/info", description: "получить информацию"},
    {command: "/picture", description: "прислать картинку"},
    {command: "/help", description: "помогите"},
    {command: "/lab2", description: "очередь на вторую лабу"}
])
const start = ()=>{
    bot.on("message", async msg=>{
        const {text} = msg
        if(Object.keys(commands).includes(text)){
            commands[text](msg)
        }

    })
    bot.on('callback_query',async msg=>{
        const {data} = msg
        const {id} = msg.message.chat
        if(Object.keys(commands).includes(data)){
            commands[data](msg)
            return
        }
        await bot.sendMessage(id, `ты выбрал ${data}`)
        if(data == chats[id]){
            await bot.sendMessage(id, `угадал ${chats[id]}`,againOptions)
        }
        else {
            await bot.sendMessage(id, `не угадал ${chats[id]}`,againOptions)
        }

    })
}

start()
