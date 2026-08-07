module.exports = function iniciarEstados(sock) {

    console.log("🚀 Estado automático iniciado.");

console.log(sock.user);

    setInterval(async () => {

        console.log("⏰ Intentando publicar estado...");

        try {

            await sock.sendMessage(
                "status@broadcast",
                {
                    text: "🧪 Prueba de estado"
                },
                {
                    broadcast: true,
                    statusJidList: [
                        "573217204017@s.whatsapp.net"
                    ],
                    backgroundColor: "#075E54",
                    font: 1
                }
            );

            console.log("✅ Estado publicado correctamente.");

        } catch (error) {

            console.error("❌ Error publicando estado:", error);

        }

    }, 60000);

};