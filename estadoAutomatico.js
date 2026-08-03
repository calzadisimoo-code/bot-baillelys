const fs = require("fs");
const path = require("path");
const cron = require("node-cron");

function iniciarEstados(sock) {

    cron.schedule("* * * * *", async () => {

        try {

            const carpeta = path.join(
                __dirname,
                "estados"
            );

            const archivos = fs
                .readdirSync(carpeta)
                .filter(a =>
                    /\.(jpg|jpeg|png|mp4)$/i.test(a)
                );

            if (!archivos.length) {

                console.log(
                    "No hay estados para publicar."
                );

                return;

            }

            const archivo =
                archivos[
                    Math.floor(
                        Math.random() *
                        archivos.length
                    )
                ];

            const ruta =
                path.join(
                    carpeta,
                    archivo
                );

            if (
                archivo.endsWith(".mp4")
            ) {

                await sock.sendMessage(
                    "status@broadcast",
                    {
                        video: fs.readFileSync(ruta),
                        caption:
                            "🔥 Escríbenos para más información."
                    }
                );

            } else {

                await sock.sendMessage(
                    "status@broadcast",
                    {
                        image: fs.readFileSync(ruta),
                        caption:
                            "🔥 Escríbenos para más información."
                    }
                );

            }

            console.log(
                "Estado publicado:",
                archivo
            );

        }

        catch (e) {

            console.log(
                "Error publicando estado:",
                e
            );

        }

    });

}

module.exports = {
    iniciarEstados
};