const { obtenerVariante } = require("../estadisticas/ab");
const { guardar } = require("../estado");

const {
    registrarProducto
} = require("../estadisticas/hoy");

module.exports = function (texto, usuario) {

    if (
        texto.includes("paris") ||
        texto.includes("tenis paris") ||
		texto.includes("quiero las r1") ||
        texto.includes("zapatillas paris")
    ) {
		
		registrarProducto(usuario);
		guardar(usuario, {
    producto: "paris",
	pedidoEnviado: false
});

        return obtenerVariante("paris", usuario, {

A: "👟 ¡Sí tenemos las Paris disponibles!\n\n💰 Precio: *$85.000*\n🚚 Envíos a toda Colombia.\n\n📏 *Responde con tu talla (21 al 44) y continuamos con tu pedido.*",

B: "🔥 ¡Sí están disponibles!\n\n💰 *$85.000*\n🚚 Enviamos a cualquier ciudad de Colombia.\n\n👟 *¿Qué talla necesitas? (21 al 44)*",

C: "Hola que talla buscas?",

D: "Hola, en que talla?",

E: "✅ Tenemos disponibles las Paris.\n\n💰 *$85.000*\n🚚 Hacemos envíos a toda Colombia.\n\n📏 *¿Qué talla buscas? (21 al 44)*",

F: "`👟 ¡Sí tenemos las Paris disponibles!\n\n💰 *$85.000*\n🚚 Envíos a toda Colombia.\n\n📏 *Responde con tu talla (21 al 44) y te confirmo de inmediato si está disponible.*`"

        });

    }

    return null;

}