const { guardar } = require("../estado");
const { obtenerVariante } = require("../estadisticas/ab");
const {
    registrarProducto
} = require("../estadisticas/hoy");

module.exports = function (texto, usuario) {

if (
    texto.includes("Kyro Árnica Plus") &&
    texto.includes("$49.900")
) {

        registrarProducto(usuario);

        guardar(usuario, {
            producto: "kyroarnicaplusx1",
            nombreProducto: "Kyro Árnica Plus x1",
            pedidoEnviado: false
        });

        return {
            foto: true,
            producto: "kyroarnicaplus",
            texto: obtenerVariante("kyroarnicaplusx1", usuario, {

                A: "La promoción de Kyro Árnica Plus (250ML c/u) sigue disponible por $49.900\n\nPago Contra entrega 🚚.\n\n✅ Ayuda a aliviar dolores musculares y articulares, espalda, hombros, rodillas, cuello y tensión muscular, brindando una sensación calmante y mayor movilidad.\n\nPara validar la entrega y dejar tu pedido registrado, indícame por favor:\n\n✅ Nombre completo\n✅ Dirección de entrega\n\nTu pedido llega entre 1 y 3 días hábiles."

            })
        };

    }

    return null;

};