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

    A: "⚡ ¡Sí disponible!\n\n💰 Precio: *$60.000*\n\n📍 ¿Envío o recoges?",

    B: "Listo, prefieres recoger en el local o envio?.\n\n📍 Dime tu barrio y te digo cómo te la hacemos llegar",

    C: "🔥 Es uno de los cargadores que más vendemos por su velocidad de carga.\n\n💰 *$60.000*.\n\n📍 ¿Te lo enviamos o pasas por él?",

    D: "👋 ¡Hola! Claro que sí.\n\n¿Para qué celular lo necesitas?\n\n💰 El cargador Turbo *120W* vale *$60.000*.",

    E: "✅ Sí tenemos disponible el cargador Turbo *120W*.\n\n🚚 Envío rápido a toda Colombia.\n💰 *$45.000*.\n\n📍 ¿De qué ciudad nos escribes?",

    F: "⚡ ¡Perfecto!\n\n💰 Cargador Turbo *180W*: *$60.000*.\n\n😊 ¿Cuántas unidades necesitas?"

});

    }

    return null;

}