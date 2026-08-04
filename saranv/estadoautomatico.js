const cron = require("node-cron");

module.exports = function iniciarEstadoAutomaticoSara(sock) {

    console.log("✅ Sara automática iniciada");

    cron.schedule("* * * * *", async () => {

        console.log("⏰ Cron ejecutado");

    });

};