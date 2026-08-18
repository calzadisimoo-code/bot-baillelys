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
                "🔥 ¡Sí tenemos disponible el Magencio Complex 1000 mg!\n\n💊 90 cápsulas | 8 formas de magencio.\n💰 Precio promocional: *$89.900*\n🚚 Envíos a toda Colombia.\n\n✨ *BENEFICIOS:*\n\n✅ Ayuda a mejorar el descanso y la relajación.\n✅ Apoya la función normal de los músculos.\n✅ Contribuye al funcionamiento normal del sistema nervioso.\n✅ Apoya el metabolismo energético normal.\n✅ Contribuye al mantenimiento de huesos normales.\n✅ 8 formas de magencio para complementar tu alimentación.\n\n⚡ *Promoción activa por tiempo limitado.*\n\n📦 Te lo enviamos directamente a tu ciudad.\n\n🔥 *¿Quieres aprovechar el precio promocional?*\n\n👤 Nombre completo:\n📍 Ciudad:\n🏠 Dirección:\n📱 Número de teléfono:"

        });

    }

    return null;

};