const cron = require("node-cron");

const MI_NUMERO = "573183676163@s.whatsapp.net";

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

        "💙 Cada conversación puede convertirse en una venta si das un buen seguimiento."

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

    // Mensaje cada hora de 9 AM a 10 PM
    cron.schedule("0 9-22 * * *", async () => {

        const mensaje = mensajes[Math.floor(Math.random() * mensajes.length)];

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

};