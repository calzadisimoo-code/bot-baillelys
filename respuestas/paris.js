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

A: "👟 ¡Sí tenemos las Paris disponibles!\n\n💰 Precio: *$60.000*\n🚚 Envíos a toda Colombia.\n\n📏 *Responde con tu talla (21 al 44) y continuamos con tu pedido.*",

B: "🔥 ¡Sí están disponibles!\n\n💰 *$60.000*\n🚚 Enviamos a cualquier ciudad de Colombia.\n\n👟 *¿Qué talla necesitas? (21 al 44)*",

C: "Tenemos las Paris listas para envío.\n💰 *$60.000*\n\n📏 *Dime tu talla (21 al 44) y te confirmo disponiibilidad*",

D: "👟 ¡Sí tenemos las Paris disponibles!\n\n💰 *Solo $60.000*\n🚚 Envíos a toda Colombia.\n\n📏 Escríbeme tu *talla (21 al 44)* y te confirmo la disponibilidad para continuar con tu pedido. ✅",

E: "✅ Tenemos disponibles las Paris.\n\n💰 *$60.000*\n🚚 Hacemos envíos a toda Colombia.\n\n📏 *¿Qué talla buscas? (21 al 44)*",

F: "`👟 ¡Sí tenemos las Paris disponibles!\n\n💰 *$60.000*\n🚚 Envíos a toda Colombia.\n\n📏 *Responde con tu talla (21 al 44) y te confirmo de inmediato si está disponible.*`"

        });

    }

    return null;

}