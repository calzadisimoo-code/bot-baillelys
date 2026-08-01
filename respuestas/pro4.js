const { obtenerVariante } = require("../estadisticas/ab");
const { guardar } = require("../estado");
const {
    registrarProducto
} = require("../estadisticas/hoy");

module.exports = function (texto, usuario) {

    if (
        texto.includes("pro 4") ||
        texto.includes("pro4") ||
        texto.includes("airpods pro 4") ||
		texto.includes("audifonos con cancelacion de ruido") ||
        texto.includes("airpod pro 4") ||
        texto.includes("audifonos pro 4")
    ) {
		
		registrarProducto(usuario);
        guardar(usuario, {
            producto: "pro4"
        });

        return obtenerVariante("pro4", usuario, {

A: "🎧 ¡Sí tenemos disponibles los *AirPods Pro 4*!\n\n💰 Precio: *$60.000*\n🚚 Envíos a toda Colombia.\n\n📦 ¿Te envío 1 par o quieres aprovechar para llevar 2?",

B: "🎧 ¡Sí hay disponibilidad!\n\n💰 Precio: *$60.000*\n\n🚚 ¿Prefieres envío o recoger en nuestro punto físico de Palmira?",

C: "🎧 ¡Sí tenemos disponibles!\n\n💰 *$60.000*\n\n📍 ¿En qué ciudad te encuentras para decirte el tiempo de entrega?",

D: "🎧 ¡Sí hay disponibilidad!\n\n💰 Precio: *$60.000*\n📦 Envíos rápidos.\n\n📱 ¿Los usarás con iPhone o Android?",

E: "🎧 ¡Sí hay disponibilidad!\n\n💰 *$60.000*\n🚚 Envíos a toda Colombia.\n\n✅ ¿Te ayudo a dejar listo tu pedido?",

F: "🎧 ¡Sí tenemos los *AirPods Pro 4*!\n\n💰 Precio: *$60.000*\n\n📦 ¿Cuántos pares necesitas?"

        });

    }

    return null;

};