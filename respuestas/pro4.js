const { obtenerVariante } = require("../estadisticas/ab");
const { guardar } = require("../estado");

module.exports = function (texto, usuario) {

    if (
        texto.includes("pro 4") ||
        texto.includes("pro4") ||
        texto.includes("airpods pro 4") ||
		texto.includes("Audifonos con cancelacion de ruido") ||
        texto.includes("airpod pro 4") ||
        texto.includes("audifonos pro 4")
    ) {

        guardar(usuario, {
            producto: "pro4"
        });

        return obtenerVariante("pro4", usuario, {

A: "🎧 ¡Sí tenemos disponibles los *AirPods Pro 4*!\n\n💰 Precio: *$60.000*\n🚚 Envíos a toda Colombia.\n\n👀 ¿Quieres ver fotos o prefieres hacer el pedido de una vez?",

B: "🔥 ¡Los *AirPods Pro 4* están disponibles!\n\n💵 Valor: *$60.000*\n📦 Envío rápido a toda Colombia.\n\n📸 ¿Te envío fotos para que los veas?",

C: "✨ ¡Sí hay disponibilidad!\n\n🎧 AirPods Pro 4\n💰 *$60.000*\n\n👀 ¿Deseas ver fotos o resolver alguna duda?",

D: "🚀 Tenemos disponibles los *AirPods Pro 4*.\n\n💵 Precio: *$60.000*\n📦 Envíos nacionales.\n\n📸 ¿Quieres que te envíe fotos reales del producto?",

E: "✅ Sí tenemos los *AirPods Pro 4* disponibles.\n\n💰 *$60.000*\n🚚 Envíos a toda Colombia.\n\n👀 ¿Te envío fotos?",

F: "🎧 ¡Sí hay disponibilidad de los *AirPods Pro 4*!\n\n💰 Precio: *$60.000*\n📦 Envío rápido.\n\n📸 ¿Quieres ver fotos antes de pedirlos?"

        });

    }

    return null;

};