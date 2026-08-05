const { guardar } = require("../estado");
const { obtenerVariante } = require("../estadisticas/ab");
const {
    registrarProducto
} = require("../estadisticas/hoy");

module.exports = function (texto, usuario) {

if (
    (texto.includes("air force") ||
     texto.includes("airforce") ||
     texto.includes("force 1") ||
     texto.includes("af1")) &&
    (
        texto.includes(".1") ||
        texto.includes("1.1") ||
        texto.includes("import") ||
        texto.includes("importada") ||
        texto.includes("importadas")
    )
) {
		registrarProducto(usuario);
guardar(usuario, {
    producto: "af1bi",
	pedidoEnviado: false
});

        return obtenerVariante("af1bi", usuario, {

            A: "🤍 ¡Sí están disponibles las Air Force 1 blancas importadas!\n\n💰 Precio: *$100.000*\n📦 Calidad importada.\n🚚 Envíos a toda Colombia.\n\n👟 *Responde con tu talla (21 al 44) y continuamos con tu pedido.*",

            B: "🤍 ¡Sí tenemos disponibles las Air Force 1 blancas importadas!\n\n💰 *$100.000*\n🚚 Envíos a toda Colombia.\n\n👟 Escríbeme tu talla (21 al 44) y dejamos listo tu pedido.",

            C: "✨ Sí hay disponibilidad.\n\n🤍 Air Force 1 blancas importadas.\n💰 *$100.000*\n🚚 Envío rápido a toda Colombia.\n\n👟 *¿Cuál es tu talla? (21 al 44)*",

            D: "🚀 Tenemos disponibles las Air Force 1 blancas importadas.\n\n💵 Valor: *$100.000*\n📦 Calidad importada.\n\n👟 *Envíame tu talla y te envío la información para recibirlas.*",

            E: "✨ Sí hay disponibilidad.\n\n🤍 Air Force 1 blancas importadas.\n💰 *$100.000*\n🚚 Envíos a toda Colombia.\n\n👟 ¿Qué talla necesitas? (21 al 44)"

            F: "🔥 Las Air Force 1 blancas importadas siguen disponibles.\n\n💰 Precio: *$100.000*\n🚚 Envíos a toda Colombia.\n\n👟 *Dime tu talla y en unos minutos dejamos listo tu pedido.*"

        });

    }

    return null;

}
