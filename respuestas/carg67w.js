const { obtenerVariante } = require("../estadisticas/ab");

module.exports = function (texto, usuario) {

    if (
        texto.includes("67w") ||
        texto.includes("67 w") ||
        texto.includes("cargador 67") ||
        texto.includes("cargador de 67")
    ) {

        return obtenerVariante("carg67w", usuario, {

            A: "⚡ ¡Sí disponible!\n\n💰 1 cargador: *$45.000*\n💰 2 cargadores: *$85.000*\n💰 3 cargadores: *$120.000*\n\n🚚 Envío rápido a toda Colombia.\n\n¿Te envío 1, 2 o 3 cargadores?",

            B: "🔥 PROMOCIÓN DEL DÍA 🔥\n\n✅ 1 por *$45.000*\n✅ 2 por *$85.000*\n✅ 3 por *$120.000*\n\n📦 Escríbeme cuántos deseas y te ayudo con el pedido.",

            C: "⚡ Tenemos disponible el cargador de *67W*.\n\n💵 1: *$45.000*\n💵 2: *$85.000*\n💵 3: *$120.000*\n\n🚚 Hacemos envíos a toda Colombia.\n\n¿Cuántos deseas pedir?",

            D: "🚀 El cargador de *67W* está disponible.\n\n🔥 Aprovecha la promoción:\n1️⃣ $45.000\n2️⃣ $85.000\n3️⃣ $120.000\n\n📲 Responde con 1, 2 o 3 y continuamos con tu pedido.",

            E: "🔋 Cargador de *67W* disponible.\n\n💰 1 unidad: *$45.000*\n💰 2 unidades: *$85.000*\n💰 3 unidades: *$120.000*\n\n🚚 Envío rápido.\n\n¿Quieres 1, 2 o 3?",

            F: "✅ ¡Sí hay disponibilidad!\n\n⚡ Cargador de *67W*\n\n💲1 = *$45.000*\n💲2 = *$85.000*\n💲3 = *$120.000*\n\n📦 Dime cuántos quieres y preparo tu pedido."

        });

    }

    return null;

}