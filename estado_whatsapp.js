module.exports = function iniciarEstados(sock) {

    setInterval(async () => {

        try {

            await sock.sendMessage(
                "status@broadcast",
                {
                    text: "👟 Air Force 1 desde $60.000\n🚚 Envíos a toda Colombia."
                }
            );

            console.log("✅ Estado publicado.");

        } catch (error) {

            console.error(
                "❌ Error publicando estado:",
                error
            );

        }

    }, 60 * 1000); // Cada minuto

};