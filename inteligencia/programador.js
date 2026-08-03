const cron = require("node-cron");

function iniciarProgramador(sock) {

    cron.schedule("5 21 * * *", async () => {

        try {

            await sock.sendMessage(

                "573183676163@s.whatsapp.net",

                {

                    text:
`🧠 KYRO AI

📊 Ya estoy analizando el rendimiento del día.

Muy pronto aquí recibirás automáticamente:

📈 Estadísticas del día
🥇 Producto ganador
🏆 Variante ganadora
🤖 Recomendaciones inteligentes
📉 Qué debes mejorar mañana
🎯 Plan de acción`

                }

            );

            console.log(
                "📊 Reporte diario enviado."
            );

        }

        catch (e) {

            console.log(
                "Error enviando reporte:",
                e
            );

        }

    });

}

module.exports = iniciarProgramador;