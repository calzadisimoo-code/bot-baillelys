const { obtenerVariante } = require("../estadisticas/ab");
const { guardar } = require("../estado");

const {
    registrarProducto
} = require("../estadisticas/hoy");

module.exports = function (texto, usuario) {

    if (
        texto.includes("paris") ||
        texto.includes("tenis paris") ||
        texto.includes("zapatillas paris")
    ) {
		
		registrarProducto(usuario);
		guardar(usuario, {
    producto: "paris",
	pedidoEnviado: false
});

        return obtenerVariante("paris", usuario, {

            A: "👟 ¡Sí tenemos las Paris disponibles!\n\n💰 Precio: *$60.000*\n🚚 Envíos a toda Colombia.\n\n📏 *Responde con tu talla (35 al 40) y continuamos con tu pedido.*",

            B: "🔥 ¡Las Paris están disponibles!\n\n💵 Solo *$60.000*\n✅ Tallas del *35 al 40*.\n\n👟 *Escríbeme tu talla y te ayudo con el pedido.*",

            C: "✨ ¡Qué buena elección!\n\n👟 Tenis Paris por *$60.000*.\n📦 Envío rápido.\n\n📏 *¿Qué talla necesitas? (35 al 40)*",

            D: "🚀 Sí hay disponibilidad.\n\n👟 Tenis Paris.\n💰 *$60.000*\n🚚 Envíos a toda Colombia.\n\n📏 *Envíame tu talla y te doy la información para recibirlos.*",

            E: "✅ Tenemos las Paris disponibles.\n\n💵 Precio: *$60.000*\n👟 Tallas del *35 al 40*.\n\n📏 *Responde con tu talla para separar tu par.*",

            F: "🤍 ¡Siguen disponibles las Paris!\n\n💰 *$60.000*\n📦 Envíos a toda Colombia.\n\n👟 *Dime tu talla (35 al 40) y dejamos listo tu pedido.*"

        });

    }

    return null;

}