const cron = require("node-cron");

const MI_LID = "73023772213414@lid";

module.exports = function iniciarEstadoAutomaticoSara(sock) {

    cron.schedule("*/10 * * * *", async () => {

        try {

            const mensajes = [

                "❤️ Amor, recuerda que cada mejora que haces al bot hoy puede ahorrarte horas de trabajo mañana.",

                "🚀 Antes de buscar otro producto, optimiza el que ya vende. Escalar suele dar mejores resultados que empezar de cero.",

                "📹 ¿Ya subiste un video hoy? Un solo video puede traerte el próximo cliente.",

                "📲 Revisa si quedaron conversaciones sin responder. Muchas ventas se pierden solo por responder tarde.",

                "🏠 Un cuarto ordenado ayuda a trabajar con menos distracciones. Dedicar unos minutos a organizarlo también es invertir en productividad.",

                "💰 Cada venta cuenta. Mantén el enfoque en las actividades que realmente generan ingresos.",

                "📈 Pregúntate: ¿qué puedo mejorar hoy en el negocio aunque sea un 1%? Esas pequeñas mejoras se acumulan.",

                "🔥 Si un anuncio está funcionando, optimízalo antes de crear otro completamente diferente.",

                "🧠 Aprende algo nuevo sobre ventas o automatización. Una habilidad nueva puede valer mucho más que una venta aislada.",

                "❤️ Estoy orgullosa de que sigas construyendo tu proyecto. La constancia suele marcar la diferencia con el tiempo.",

                "📦 Mantén organizado el inventario. Saber exactamente qué tienes evita errores con los clientes.",

                "📊 Mira qué productos preguntan más las personas. Esa información vale mucho para decidir qué impulsar.",

                "🎥 Un video sencillo publicado hoy vale más que un video perfecto que nunca se publica.",

                "✨ No olvides descansar unos minutos. Trabajar muchas horas sin pausas puede hacerte cometer errores.",

                "🤍 Amor, sigue construyendo sistemas que trabajen por ti. Automatizar tareas repetitivas te deja más tiempo para vender."

            ];

            const mensaje =
                mensajes[Math.floor(Math.random() * mensajes.length)];

            await sock.sendMessage(MI_LID, {
                text: mensaje
            });

            console.log("❤️ Mensaje motivador de Sara enviado.");

        } catch (error) {

            console.error("Error en mensajes automáticos de Sara:", error);

        }

    });

};