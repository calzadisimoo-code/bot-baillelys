
const { obtenerVariante } = require("../estadisticas/ab");
const { guardar } = require("../estado");

const {
    registrarProducto
} = require("../estadisticas/hoy");

module.exports = function (texto, usuario) {

    if (
        texto.includes("quiero pedir la promocion de kyro arnica plus x2 por $89.900.")
    ) {

        registrarProducto(usuario);

        guardar(usuario, {
            producto: "kyroarnicaplus",
            pedidoEnviado: false
        });

        return obtenerVariante("kyroarnicaplus", usuario, {

            A: "La promoción de Kyro Árnica Plus x2 (250ML c/u) sigue disponible por $89.900 con envío GRATIS 🚚.\n\n✅ Ayuda a aliviar dolores musculares y articulares, espalda, hombros, rodillas, cuello y tensión muscular, brindando una sensación calmante y mayor movilidad.\n\nPara validar la entrega y dejar tu pedido registrado, indícame por favor:\n\n✅ Ciudad\n✅ Nombre completo\n✅ Dirección de entrega\n\nTu pedido llega entre 1 y 3 días hábiles"

        });

    }

    return null;

};