const { guardar } = require("../estado");
const { obtenerVariante } = require("../estadisticas/ab");
const {
    registrarProducto
} = require("../estadisticas/hoy");

module.exports = function (texto, usuario) {

    if (
		texto.includes("quiero las retro 1 blancas con negro") ||
		texto.includes("quiero jordan blancas con negro") ||
        texto.includes("retro blancas")
    ) {

        registrarProducto(usuario);

        guardar(usuario, {
            producto: "r1",
            pedidoEnviado: false
        });

        return obtenerVariante("r1", usuario, {

            A: "Hola que talla buscas?",

            B: "🔥 Tenemos las Retro 1 blancas con negro por *$84.900*.\n\n✅ Tallas disponibles del *21 al 44*.\n\n👟 *Escríbeme tu talla y te ayudo con el pedido.*",

            C: "✨ Sí hay disponibilidad.\n\n🤍🖤 Retro 1 blancas con negro.\n💰 *$84.900*\n🚚 Envíos a toda Colombia.\n\n👟 *¿Cuál es tu talla? (21 al 44)*",//1 punto

            D: "🚀 Tenemos disponibles las Retro 1 blancas con negro.\n\n💵 Valor: *$84.900*\n\n👟 *Envíame tu talla y te envío la información para recibirlas.*",

            E: "👋 ¡Hola! 😊\n\n¿En qué talla las necesitas? 👟 Tenemos disponibles del *21 al 44*. 💰 Precio: *$84.900*",

            F: "✅ Sí están disponibles.\n\n🤍🖤 Retro 1 blancas con negro.\n💰 *$84.900*\n\n👟 *Dime tu talla y en unos minutos dejamos listo tu pedido.*"

        });

    }

    return null;

};