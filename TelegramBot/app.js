
const TelegramBot = require('node-telegram-bot-api');
const weather = require('weather-js');


var mqtt = require('mqtt');
const fs = require('fs');
let chat_id = 325118843;
var client = mqtt.connect('http://192.168.1.17');
let mqtt_pak = {
    idx: "",
    dtype: "",
    value1: "",
    value2: "",
};
var Casa = [
    {
        idx_termostato: '2',
        idx_termostato_state: '4',
        Descripcion: "",
        Termostato: "",
        Termostato_estatdo: "",
        Rele1: "",
        Rele2: "",
        ModoAhorro: "",
        Potencia: "",
        Temperatura: ""
    },
    {
        Descripcion: "",
        Termostato: "",
        Termostato_estatdo: "",
        Rele1: "",
        Rele2: "",
        ModoAhorro: "",
        Potencia: "",
        Temperatura: ""
    }, {
        Descripcion: "",
        Termostato: "",
        Termostato_estatdo: "",
        Rele1: "",
        Rele2: "",
        ModoAhorro: "",
        Potencia: "",
        Temperatura: ""
    }, {
        Descripcion: "",
        Termostato: "",
        Termostato_estatdo: "",
        Rele1: "",
        Rele2: "",
        ModoAhorro: "",
        Potencia: "",
        Temperatura: ""
    }, {
        Descripcion: "",
        Termostato: "",
        Termostato_estatdo: "",
        Rele1: "",
        Rele2: "",
        ModoAhorro: "",
        Potencia: "",
        Temperatura: ""
    },
];





/*
Casa[2].Descripcion= "Cuarto del abuelo";
Casa[2].Termostato = "22";
Casa[2].Termostato_estatdo = "on";
Casa[2].Rele1 = "on";
Casa[2].Rele2 = "on";
Casa[2].ModoAhorro ="off";
Casa[2].Potencia = "1200";
Casa[2].Temperatura = "19";*/





client.on('connect', function () {
    client.subscribe('domoticz/out', function (err) {
        if (!err) {
            console.log('Servidor disponible')
            client.subscribe('domoticz/alert')
            client.subscribe('domoticz/in')
            client.subscribe('messages')
            // client.publish("domoticz/in","{ \"idx\" :%d, \"nvalue\" : 0, \"svalue\" : \" %d ;%d ;1 \"}")
        } else {
            console.log('Imposible conectarse al servidor:' + err.message)

        }
    })

})
weather.find({ search: 'Rascafria, Spain', degreeType: 'C' }, function (err, result) {
    if (err) console.log("Error al leer prevision inicial:\n" + err);
    else {
        var a = JSON.stringify(result, null, 2);
        //console.log(a);

        client.publish("domoticz/in", "{ \"idx\" :5,\"dtype\": \"Temp\", \"nvalue\" : 0, \"svalue\" :  \" " + result[0]['current'].temperature + " ;" + result[0]['current'].humidity + " ;1 \"}");
    }

});



// Options:
// search:     location name or zipcode
// degreeType: F or C


client.on('message', function (topic, message) {

    try {
        switch (topic) {
            case "domoticz/out":
                var pakage = JSON.parse(message)

                let mqtt_pak = {
                    idx: "",
                    dtype: "",
                    value1: "",
                    value2: "",
                };
                mqtt_pak.idx = pakage.idx;
                mqtt_pak.dtype = pakage.dtype;
                switch (pakage.dtype) {
                    case "Light/Switch": console.error("TIPO INTERRUPTOR"); mqtt_pak.value1 = pakage.nvalue; break;
                    case "Thermostat": console.error("TIPO TERMOSTATO"); mqtt_pak.value1 = pakage.svalue1; break;
                    case "Temp + Humidity": console.error("TIPO TERMOSTATO"); mqtt_pak.value1 = pakage.svalue1; mqtt_pak.value2 = pakage.svalue2; break;
                    case "Temp": console.error("TIPO TEMP"); mqtt_pak.value1 = pakage.svalue1; console.log(pakage.svalue); break;
                    case "Usage": console.error("TIPO WATS"); mqtt_pak.value1 = pakage.svalue1; console.log(pakage.svalue); break;

                }

                let data = JSON.stringify(mqtt_pak, null, 2);
                client.publish("domoticz/shortout", data);
                break;
            case "domoticz/alert":
                bot.sendMessage(message.chat_id(), message);
                console.warn(message)
                break;
            case "domoticz/in": var pakage = JSON.parse(message);
                console.log(pakage)

                if (pakage.idx > 1989) {
                    Casa[pakage.idx - 1990].Descripcion = pakage.a;
                    Casa[pakage.idx - 1990].Termostato = pakage.b;
                    Casa[pakage.idx - 1990].Termostato_estatdo = pakage.c;
                    Casa[pakage.idx - 1990].Rele1 = pakage.d;
                    Casa[pakage.idx - 1990].Rele2 = "-";
                    Casa[pakage.idx - 1990].ModoAhorro = pakage.e;
                    Casa[pakage.idx - 1990].Potencia = pakage.f;
                    Casa[pakage.idx - 1990].Temperatura = pakage.g;

                    bot.sendMessage(chat_id, Casa[(pakage.idx - 1990)].Descripcion
                        + "\n - Temperatura actual: " + Casa[(pakage.idx - 1990)].Temperatura + " C"
                        + "\n - Temp.Termostato: " + Casa[pakage.idx - 1990].Termostato + " C"
                        + "\n - Estado:  " + Casa[pakage.idx - 1990].Termostato_estatdo
                        + "\n - Rele 1:  " + Casa[pakage.idx - 1990].Rele1
                        + "\n - Rele 2:  " + Casa[pakage.idx - 1990].Rele2
                        + "\n - Potencia Actual:  " + Casa[pakage.idx - 1990].Potencia + " W"
                        + "\n - Modo ahorro  " + Casa[pakage.idx - 1990].ModoAhorro);


                }


                break;
        }
    } catch (err) {
        console.error(err)
    }


})
var botones_cuartos = {
    reply_makeup: {
        inline_keyboard: [
            [
                { text: "Cuarto1", callback_data: "boton1" }

            ]
        ]
    }


};
// API Token Telegram
const token = '614266546:AAFt6dl6pIK4n02qSSLJj0WbSuY7f-EGy9E';

// Creamos un bot que usa 'polling'para obtener actualizaciones
const bot = new TelegramBot(token, { polling: true });
const request = require('request');
var dir1; var chatId;
// Cuando mandes el mensaje "Hola" reconoce tú nombre y genera un input: Hola Daniel
bot.onText(/calefaccion/, (msg) => {
    console.warn("Entra en calefaccion mensaje con ID" + msg.message_id)
    messageId = msg.message_id;

    // console.log("id" + id_msg + "\t msgid:" + msg.message_id + "\t 2 " + messageId2);
    bot.sendMessage(chat_id, "Seleccione habitacion",
        {
            reply_markup: {
                inline_keyboard: [
                    [{ text: "Habitacion 1 " + Casa[0].Descripcion, callback_data: 'boton1' }],
                    [{ text: "Habitacion 2 " + Casa[1].Descripcion, callback_data: 'boton2' }]
                ]
            }


        });
});//Hasta aki ok

bot.onText(/^\/tiempo/, (msg) => {
    console.log("Buscando prevision")
    weather.find({ search: 'Rascafria, Spain', degreeType: 'C' }, function (err, result) {
        if (err) { console.log(err); bot.sendMessage(chat_id, "Se ha producido un error al conectar con el servidor meteorologico") }
        else {
            var a = JSON.stringify(result, null, 2);
            //console.log(a);
            bot.sendMessage(chat_id, "Temperatura:  " + result[0]['current'].temperature + "\t Viento:  " + result[0]['current'].windspeed)//+ "\n Maxima (C):  " + result[0]['forecast'][(new Date().getDay() - 1)].high + "\t Minima (C):  " + result[0]['forecast'][(new Date().getDay() - 1)].low)
            bot.sendPhoto(msg.chat.id, result[0]['current'].imageUrl);
            client.publish("domoticz/in", "{ \"idx\" :5,\"dtype\": \"Temp\", \"nvalue\" : 0, \"svalue\" :  \" " + result[0]['current'].temperature + " ;" + result[0]['current'].humidity + " ;1 \"}");
        }
    });

});
bot.onText(/^\/borrar/, (msg) => {
    chatId = msg.chat.id;
    var messageId = msg.message_id;
    var replyMessage = msg.reply_to_message.message_id;

    if (msg.reply_to_message == undefined) {
        return;
    }


    console.log("Chat id: " + chatId + "\tMensaje reply id:" + replyMessage);

    bot.deleteMessage(chatId, replyMessage);
});



function Options_rooms() {
    bot.sendMessage(message.chat_id(), "Opciones:  ",
        {
            reply_markup: {
                inline_keyboard: [
                    [{ text: "Resumen", callback_data: 'Resumen' }],
                    [{ text: "Activar Calefaccion", callback_data: 'term_on' }],
                    [{ text: "Desactivar Calefaccion", callback_data: 'term_off' }],
                    [{ text: "Seleccionar Tempertura", callback_data: 'sel_temp' }],
                    [{ text: "Modo ahorro", callback_data: 'Ahorro' }]
                ]
            }



        });
}
var sel_hab = 0;
bot.on('callback_query', function onCallbackQuery(AccionBoton) {
    messageId = messageId + 1;//entra aqui

    console.log("Chat id: " + message.chat_id() + "\tMensaje  id:" + messageId);//muestra las id de lo que quiere borrar
    bot.deleteMessage(message.chat_id(), messageId);
    switch (AccionBoton.data) {
        case 'boton2': sel_hab = 2; Options_rooms(); break;
        case 'boton1': sel_hab = 1; Options_rooms(); break;

        case 'Resumen':
            var str = "{\"idx\" :" + (1990 + (sel_hab - 1)) + "}"
            client.publish("domoticz/shortout", str);
            console.log("[domoticz/shortout]: " + str)
            // while (Casa[(sel_hab - 1)].Descripcion == "") { }
            break;

        case 'term_off': client.publish("domoticz/in", "{\"command\": \"switchlight\",\"idx\" :" + Casa[sel_hab - 1].idx_termostato_state + ",\"switchcmd\" : \"Off\"}"); break;
        case 'term_on': client.publish("domoticz/in", "{\"command\": \"switchlight\",\"idx\" :" + Casa[sel_hab - 1].idx_termostato_state + ",\"switchcmd\" : \"On\"}"); break;
        case 'sel_temp': bot.sendMessage(chat_id, "Selecciones la temperatura (Celsius): ",
            {
                reply_markup: {
                    inline_keyboard: [
                        [

                            { text: "    21 C    ", callback_data: 21 },
                            { text: "    22 C    ", callback_data: 22 },
                            { text: "    23 C    ", callback_data: 23 }], [
                            { text: "    24 C    ", callback_data: 24 },
                            { text: "    26 C    ", callback_data: 26 },
                            { text: "    28 C    ", callback_data: 28 }
                        ]
                    ]
                }
            });
            break;
        case '24':
        case '26':
        case '28':
        case '21':
        case '22':
        case '23': client.publish("domoticz/in", "{ \"idx\" : " + Casa[sel_hab - 1].idx_termostato + ", \"nvalue\" : 0, \"svalue\" : \" " + AccionBoton.data + " \"}")
            bot.sendMessage(message.chat_id(), "Habitacion " + Casa[sel_hab - 1].Descripcion + "   Termostato a " + AccionBoton.data + " C"); break;
    }




});