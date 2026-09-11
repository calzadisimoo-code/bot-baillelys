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

A: `✅ Tenemos disponibles las Paris. 

👟 ¿Las buscas para dama o caballero?`,

B: `🚚 Hacemos envíos a toda Colombia. 

📍 ¿En qué ciudad o barrio te encuentras?`,

C: `💰 Las Paris están en *$65.000*. 

👟 ¿Para qué talla las necesitas?`,

D: `Hola, ¿en qué talla?`,

E: `✅ Tenemos disponibles las Paris. 

💰 *$65.000* 🚚 Hacemos envíos a toda Colombia. 

📏 ¿Qué talla buscas? (21 al 44)`,

F: `👟 Sí tenemos disponibles. 

📦 ¿Serían para ti o para otra persona?`

        });

    }

    return null;

}