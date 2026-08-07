const { obtenerVariante } = require("../../estadisticas/ab");
const { guardar } = require("../../estado");
const {
    registrarProducto
} = require("../../estadisticas/hoy");

module.exports = function (texto, usuario) {

    if (
        texto.includes("120w") ||
        texto.includes("120 w") ||
		texto.includes("quiero el cargador de 120w") ||
        texto.includes("cargador 120") ||
        texto.includes("cargador de 120")
    ) {
	
        registrarProducto(usuario);

        guardar(usuario, {
            producto: "carg120w",
			pedidoEnviado: false
        });

return obtenerVariante("carg120w", usuario, {

    A: "⚡ ¡Sí disponible!\n\n💰 Precio: *$45.000*\n\n📍 ¿Envío o recoges?",

    B: "⚡ El cargador Turbo *120W* carga mucho más rápido que uno convencional.\n\n💰 Solo *$45.000*.\n\n📍 ¿Lo necesitas para envío o recoger?",

    C: "🔥 Es uno de los cargadores que más vendemos por su velocidad de carga.\n\n💰 *$45.000*.\n\n📍 ¿Te lo enviamos o pasas por él?",

    D: "👋 ¡Hola! Claro que sí.\n\n¿Para qué celular lo necesitas?\n\n💰 El cargador Turbo *120W* vale *$45.000*.",

    E: "✅ Sí tenemos disponible el cargador Turbo *120W*.\n\n🚚 Envío rápido a toda Colombia.\n💰 *$45.000*.\n\n📍 ¿De qué ciudad nos escribes?",

    F: "⚡ ¡Perfecto!\n\n💰 Cargador Turbo *120W*: *$45.000*.\n\n😊 ¿Cuántas unidades necesitas?"

});

    }

    return null;

}