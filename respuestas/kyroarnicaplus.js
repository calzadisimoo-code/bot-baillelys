module.exports = function (texto) {

    if (
        texto.toLowerCase().includes("hola, quiero pedir la promoción de kyro árnica plus x2 por $89.900.") ||
        texto.toLowerCase().includes("hola, quiero pedir la promocion de kyro arnica plus x2 por $89.900.")
    ) {

        return `La promoción de Kyro Árnica Plus x2 (250ML c/u) sigue disponible por $89.900 con envío GRATIS 🚚.

Para validar la entrega y dejar tu pedido registrado, indícame por favor:

✅ Ciudad
✅ Nombre completo
✅ Dirección de entrega

Tu pedido llega entre 1 y 3 días hábiles`;

    }

    return null;

};