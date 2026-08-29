const { obtenerVariante } = require("../estadisticas/ab");
const { guardar } = require("../estado");
const {
    registrarProducto
} = require("../estadisticas/hoy");

module.exports = function (texto, usuario) {

    if (
        texto.includes("120w") ||
        texto.includes("120 w") ||
        texto.includes("cargador 120") ||
        texto.includes("cargador de 120")
    ) {
	
        registrarProducto(usuario);

        guardar(usuario, {
            producto: "carg120w",
			pedidoEnviado: false
        });

return obtenerVariante("carg120w", usuario, {

    A: "⚡ ¡Sí disponible!\n\n💰 Precio: *$60.000*\n\n📍 ¿Prefieres envío o recoger?",

    B: "Hola 👋 ¿Desde qué ciudad o barrio nos escribes?",

    C: "🔥 ¡Sí, disponible!\n\n💰 *$60.000*\n\n📍 ¿Desde qué ciudad nos escribes?",

    D: "✅ Sí tenemos disponible.\n\n📍 ¿Desde qué ciudad o barrio nos escribes?",

    E: "Perfecto 👌 ¿Lo recoges en el local o te lo enviamos?",

    F: "⚡ Sí disponible en *$60.000*.\n\n📍 ¿De qué ciudad nos escribes?"

});

    }

    return null;

}