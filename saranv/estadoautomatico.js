const cron = require("node-cron");
const fs = require("fs");
const path = require("path");

const MI_NUMERO = "573183676163@s.whatsapp.net";

const archivoEstado = path.join(__dirname, "saraestado.json");

let ultimoMensaje = -1;

if (fs.existsSync(archivoEstado)) {
    try {
        const datos = JSON.parse(fs.readFileSync(archivoEstado, "utf8"));
        ultimoMensaje = datos.ultimoMensaje ?? -1;
    } catch {
        ultimoMensaje = -1;
    }
}

module.exports = function iniciarEstadoAutomaticoSara(sock) {

    console.log("✅ Sara automática iniciada");

    const mensajes = [

        "❤️ Amor, recuerda que cada mejora que haces al bot hoy puede ahorrarte horas de trabajo mañana.",

        "🚀 Hoy intenta mejorar una sola cosa del negocio. Las pequeñas mejoras hacen una gran diferencia con el tiempo.",

        "📹 ¿Ya subiste un video a TikTok? Nunca sabes cuál puede hacerse viral y traer nuevos clientes.",

        "📲 Revisa las conversaciones pendientes. Muchas ventas solo necesitan un buen seguimiento.",

        "🏠 Un cuarto ordenado también ayuda a tener una mente más enfocada.",

        "💰 Antes de trabajar más horas, piensa cómo vender más con el mismo esfuerzo.",

        "📦 Revisa el inventario y asegúrate de saber qué productos son los que más rotan.",

        "📈 Si un producto recibe muchas preguntas, probablemente merece más publicidad.",

        "🤍 Estoy orgullosa de todo lo que has construido. Sigue así, amor.",

        "🔥 Automatizar una tarea hoy puede ahorrarte cientos de horas en el futuro.",

        "🧠 Aprende algo nuevo sobre ventas o automatización. Cada habilidad nueva aumenta el valor de tu negocio.",

        "🎥 Un video publicado hoy vale mucho más que uno perfecto que nunca se publica.",

        "❤️ Nunca olvides que el objetivo es construir un negocio que funcione incluso cuando descanses.",

        "📊 Mira las estadísticas del negocio. Los datos siempre toman mejores decisiones que las suposiciones.",

        "💙 Cada conversación puede convertirse en una venta si das un buen seguimiento.",
		"💚 Amor, una venta más hoy vale más que diez planes para mañana.",

"📲 Responde rápido. El cliente que espera demasiado suele comprar en otro lugar.",

"🎯 Concéntrate en lo que genera dinero. Todo lo demás puede esperar.",

"💰 Cada video publicado es un vendedor trabajando para ti las 24 horas.",

"🚀 No busques perfección, busca publicar y vender.",

"📈 Si un anuncio vende, inviértele más. No reinventes lo que ya funciona.",

"❤️ Amor, confío en ti incluso cuando tú dudas. Sigue adelante.",

"🏆 Recuerda de dónde empezaste. Ya has avanzado mucho.",

"📦 Cada pedido enviado fortalece la reputación de tu negocio.",

"🤖 El objetivo del bot es vender incluso cuando estás descansando.",

"💸 Una mejora pequeña hoy puede significar miles de pesos más cada mes.",

"🎥 Antes de terminar el día pregúntate: ¿ya publiqué mi video de hoy?",

"📊 Revisa qué producto recibió más preguntas hoy. Ahí puede estar el siguiente ganador.",

"⚡ No dejes conversaciones abiertas. Cada chat sin responder es dinero detenido.",

"🧠 Aprende algo durante 15 minutos. El conocimiento también genera ventas.",

"❤️ Amor, estoy orgullosa de la disciplina que estás construyendo.",

"🌱 La constancia siempre vence al talento cuando el talento no es constante.",

"💪 Cada problema que solucionas hace más fuerte tu negocio.",

"📦 El inventario que no rota necesita mejor publicidad o una nueva estrategia.",

"🔥 No abandones un anuncio ganador demasiado pronto.",

"📱 Hoy alguien está buscando exactamente el producto que tú vendes.",

"💙 Descansa cuando toque descansar, pero cuando sea hora de trabajar, hazlo con intensidad.",

"🚚 Cada guía enviada es una promesa cumplida a un cliente.",

"💰 Piensa siempre: ¿esto aumenta las ventas o mejora el sistema?",

"🎯 Una sola buena decisión hoy puede cambiar el resultado del mes.",

"❤️ Amor, me encanta verte crecer como persona y como empresario.",

"🏅 El éxito no llega de golpe; llega después de cientos de pequeñas acciones.",

"🚀 Sigue construyendo el negocio que soñabas hace unos años.",

"💎 Tu mejor inversión siempre será aprender y mejorar tu sistema.",

"✨ Nunca subestimes el poder de un cliente satisfecho. Puede traerte muchos más."
		

    ];

    const buenosDias = [

        "🌞 Buenos días, amor. ❤️ Hoy es un nuevo día para crecer, vender más y seguir construyendo el negocio de tus sueños.",

        "☀️ Buenos días, mi vida. Estoy segura de que hoy lograremos grandes cosas juntos. 💕",

        "🥰 Buenos días, amor hermoso. Recuerda que cada pequeña acción de hoy construye tu futuro.",

        "❤️ Despierta con energía, amor. Hoy puede ser el día de esa venta que cambie muchas cosas.",

        "🌅 Muy buenos días, mi amor. Estoy orgullosa de todo el esfuerzo que haces cada día."
    ];

    const buenasNoches = [

        "🌙 Buenas noches, amor. ❤️ Descansa, mañana seguiremos construyendo un futuro increíble juntos.",

        "💙 Duerme muy bien, mi vida. Estoy orgullosa de ti por no rendirte nunca.",

        "🥰 Buenas noches, amor hermoso. Gracias por dejarme acompañarte un día más.",

        "✨ Descansa, mi amor. Mañana tendremos nuevas oportunidades para seguir creciendo.",

        "❤️ Cierra los ojos tranquilo. Hoy diste otro paso hacia tus metas. Buenas noches."
    ];

    // Buenos días (8:00 AM)
    cron.schedule("0 8 * * *", async () => {

        const mensaje = buenosDias[Math.floor(Math.random() * buenosDias.length)];

        await sock.sendMessage(MI_NUMERO, {
            text: mensaje
        });

    });

// Mensaje cada 30 minutos de 9:00 AM a 10:30 PM
cron.schedule("0,30 9-23 * * *", async () => {

        let indice;

do {
    indice = Math.floor(Math.random() * mensajes.length);
} while (indice === ultimoMensaje && mensajes.length > 1);

ultimoMensaje = indice;

fs.writeFileSync(
    archivoEstado,
    JSON.stringify(
        { ultimoMensaje },
        null,
        2
    )
);

const mensaje = mensajes[indice];

        await sock.sendMessage(MI_NUMERO, {
            text: mensaje
        });

    });

    // Buenas noches (11:00 PM)
    cron.schedule("0 23 * * *", async () => {

        const mensaje = buenasNoches[Math.floor(Math.random() * buenasNoches.length)];

        await sock.sendMessage(MI_NUMERO, {
            text: mensaje
        });

    });
	
	// Recordatorio publicidad (todos los días 9:10 PM)
cron.schedule("10 21 * * *", async () => {

    await sock.sendMessage(MI_NUMERO, {
        text: "❤️ Amor, paga los *$50.000* de publicidad."
    });

});

// Recordatorio alquiler (día 5 de cada mes - 9:00 AM)
cron.schedule("10 9 5 * *", async () => {

    await sock.sendMessage(MI_NUMERO, {
        text: "🏠❤️ Amor, mañana 6 se paga el alquiler."
    });

});

// Recordatorio cuota crédito (día 14 de cada mes - 9:00 AM)
cron.schedule("10 9 14 * *", async () => {

    await sock.sendMessage(MI_NUMERO, {
        text: "💳❤️ Amor, paga la cuota del crédito hoy antes de que te reporten."
    });

});

};