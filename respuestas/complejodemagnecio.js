const { guardar } = require("../estado");
const { obtenerVariante } = require("../estadisticas/ab");

const {
    registrarProducto
} = require("../estadisticas/hoy");

module.exports = function (texto, usuario) {

    texto = texto.toLowerCase().trim();

    if (
        texto.includes("complejo de magnesio calzadisimo") ||
        texto.includes("magnesio complex")
    ) {

        registrarProducto(usuario);

        guardar(usuario, {
            producto: "complejodemagnesio",
            pedidoEnviado: false
        });

        return obtenerVariante("complejodemagnesio", usuario, {

            A:
                "👋 Claro. ¿Buscas el magnesio para apoyar la función muscular, reducir la sensación de tensión o complementar tu alimentación? 💪",

            B:
                "🔥 Tenemos nuestro *Magnesio Complex 1000 mg* por solo *$89.990*.\n\n💪 Ideal como complemento para apoyar la función muscular y el bienestar general.\n😴 También es una opción para quienes buscan complementar su rutina de descanso.\n\n👉 ¿Lo quieres para ti? Te ayudo a dejar el pedido listo.",

            C:
                "✨ *MAGNESIO COMPLEX 1000 MG* ✨\n\n💊 90 cápsulas\n⚡ 8 formas de magnesio\n💰 *$89.990*\n🚚 Envíos rápidos.\n\n¿Lo estás buscando principalmente para *cansancio, tensión muscular o bienestar general*?",

            D:
                "💪 Si buscas complementar tu alimentación con magnesio, tenemos el *Magnesio Complex 1000 mg*.\n\n✅ 90 cápsulas\n✅ 8 formas de magnesio\n✅ 1000 mg por porción\n💰 *$89.990*\n\n🚚 Te lo podemos enviar rápidamente.\n\n¿Te lo envío?",

            E:
                "👋 ¿Sientes que necesitas complementar tu alimentación con magnesio?\n\n💊 Tenemos *Magnesio Complex 1000 mg*.\n💰 *$89.990*\n📦 90 cápsulas\n🚚 Envío rápido.\n\n👉 ¿Quieres que te lo envíe?",

            F:
                "🚀 *MAGNESIO COMPLEX — $89.990*\n\n💪 Apoya la función normal de músculos y nervios.\n😴 Ideal para complementar tu rutina de bienestar.\n💊 90 cápsulas + 8 formas de magnesio.\n\n¿Te confirmo el pedido y me pasas la dirección de entrega? 📦"

        });

    }

    return null;

};