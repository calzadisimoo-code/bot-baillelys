const { guardar } = require("../estado");
const { obtenerVariante } = require("../estadisticas/ab");
const {
    registrarProducto
} = require("../estadisticas/hoy");

module.exports = function (texto, usuario) {

    if (
        texto.includes("kyro arnica plus") &&
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
            producto: "kyroarnicaplusx1",
            texto: obtenerVariante("kyroarnicaplusx1", usuario, {

                A: "La promoción de Kyro Árnica Plus (250ML) sigue disponible por $49.900.\n\n🚚 Pago Contra Entrega.\n\n✅ Ayuda a aliviar dolores musculares y articulares, espalda, hombros, rodillas, cuello y tensión muscular.\n\nPara registrar tu pedido envíame por favor:\n\n✅ Nombre completo\n✅ Dirección de entrega\n\n📦 Entrega entre 1 y 3 días hábiles.",

                B: "🔥 ¡Excelente elección!\n\nKyro Árnica Plus (250ML) está disponible por solo $49.900.\n\n🚚 Pago Contra Entrega.\n\n✅ Ideal para aliviar molestias musculares, articulares y tensión acumulada.\n\nPara dejar tu pedido listo necesito:\n\n✅ Nombre completo\n✅ Dirección de entrega",

                C: "💥 La promoción sigue activa.\n\nKyro Árnica Plus por $49.900 pagando al recibir.\n\n✅ Ayuda a aliviar dolores de espalda, cuello, hombros, rodillas y músculos cansados.\n\nPara registrar tu pedido indícame:\n\n✅ Nombre completo\n✅ Dirección de entrega",

                D: "✅ Sí tenemos disponible Kyro Árnica Plus.\n\n💰 Precio promocional: $49.900.\n\n🚚 Pago Contra Entrega.\n\nMiles de personas lo utilizan para aliviar dolores musculares y articulares.\n\nPara registrar tu pedido envíame:\n\n✅ Nombre completo\n✅ Dirección de entrega",

                E: "👋 Perfecto.\n\nLa promoción de Kyro Árnica Plus continúa disponible por $49.900.\n\n🚚 Pagas cuando recibes tu pedido.\n\n✅ Ayuda a brindar alivio en espalda, rodillas, cuello, hombros y articulaciones.\n\nPara confirmar tu pedido necesito:\n\n✅ Nombre completo\n✅ Dirección de entrega\n\n📦 Tiempo estimado: 1 a 3 días hábiles."

            })
        };

    }

    return null;

};