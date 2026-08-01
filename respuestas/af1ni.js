const { guardar } = require("../estado");
const { obtenerVariante } = require("../estadisticas/ab");
const {
    registrarProducto
} = require("../estadisticas/hoy");

module.exports = function (texto, usuario) {

if (
    texto.includes("air force negras") ||
    texto.includes("air force negras .1") ||
    texto.includes("air force negras importadas") ||
    texto.includes("airforcenegras") ||
    texto.includes("force 1 negras") ||
    texto.includes("af1 negras")
) {
		
		registrarProducto(usuario);
guardar(usuario, {
    producto: "af1ni"
});

        return obtenerVariante("af1ni", usuario, {

            A: "🖤 ¡Sí están disponibles las Air Force 1 negras importadas!\n\n💰 Precio: *$100.000*\n📦 Calidad importada.\n🚚 Envíos a toda Colombia.\n\n👟 *Responde con tu talla (35 al 40) y continuamos con tu pedido.*",

            B: "🔥 ¡Qué buena elección!\n\nTenemos las Air Force 1 negras importadas por *$100.000*.\n\n✅ Tallas disponibles del *35 al 40*.\n\n👟 *Escríbeme únicamente tu talla y te ayudo con el pedido.*",

            C: "✨ Sí hay disponibilidad.\n\n🖤 Air Force 1 negras importadas.\n💰 *$100.000*\n🚚 Envío rápido a toda Colombia.\n\n👟 *¿Cuál es tu talla? (35 al 40)*",

            D: "🚀 Tenemos disponibles las Air Force 1 negras importadas.\n\n💵 Valor: *$100.000*\n📦 Calidad importada.\n\n👟 *Envíame tu talla y te envío la información para recibirlas.*",

            E: "✅ Sí están disponibles.\n\n🖤 Air Force 1 negras importadas.\n💰 *$100.000*\n\n👟 *Responde con tu talla (35 al 40) para separar tu par.*",

            F: "🔥 Las Air Force 1 negras importadas siguen disponibles.\n\n💰 Precio: *$100.000*\n🚚 Envíos a toda Colombia.\n\n👟 *Dime tu talla y en unos minutos dejamos listo tu pedido.*"

        });

    }

    return null;

}
