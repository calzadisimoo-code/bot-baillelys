module.exports = function iniciarEstados(sock) {

    console.log("🚀 Estado automático iniciado.");

    setInterval(async () => {

        console.log("⏰ Intentando publicar estado...");

        try {

            await sock.sendMessage(
                "status@broadcast",
                {
                    text: "🧪 Prueba de estado"
                }
            );

            console.log("✅ Estado publicado correctamente.");

        } catch (error) {

            console.error("❌ Error:", error);

        }

    }, 60000);

};