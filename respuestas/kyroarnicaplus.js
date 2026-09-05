const { obtenerVariante } = require("../estadisticas/ab");
const { guardar } = require("../estado");

const {
    registrarProducto
} = require("../estadisticas/hoy");

module.exports = function (texto, usuario) {

    const mensaje = texto
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "") // elimina tildes
        .replace(/\s+/g, " ") // elimina espacios dobles
        .trim();

    if (
        mensaje.includes("kyro arnica plus")
    ) {

        registrarProducto(usuario);

        guardar(usuario, {
            producto: "kyroarnicaplus",
            pedidoEnviado: false
        });

        return {
            foto: true,
            producto: "kyroarnicaplus",
            texto: obtenerVariante("kyroarnicaplus", usuario, {
                A: "La promoción de Kyro Árnica Plus x2 (250ML c/u) sigue disponible por $89.900 con envío *GRATIS*.\n\nPago *Contra entrega* 🚚.\n\n✅ Ayuda a aliviar dolores musculares y articulares, espalda, hombros, rodillas, cuello y tensión muscular, brindando una sensación calmante y mayor movilidad.\n\nPara validar la entrega y dejar tu pedido registrado, indícame por favor:\n\n✅ Nombre completo\n✅ Dirección de entrega\n\nTu pedido llega entre 1 y 3 días hábiles."
            })
        };

    }

    return null;

};
