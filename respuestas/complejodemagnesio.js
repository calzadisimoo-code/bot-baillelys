const { guardar } = require("../estado");
const { obtenerVariante } = require("../estadisticas/ab");

const {
    registrarProducto
} = require("../estadisticas/hoy");

module.exports = function (texto, usuario) {

    texto = texto.toLowerCase().trim();

    if (
        texto.includes("complejo de magnesio calzadisimo") ||
        texto.includes("magnesio complex")
    ) {

        registrarProducto(usuario);

        guardar(usuario, {
            producto: "complejodemagnesio",
            pedidoEnviado: false
        });

        return obtenerVariante("complejodemagnesio", usuario, {
            A:
                "¡Sí tenemos disponible el Magencio Complex 1000 mg!\n\n $89.990\n?? 90 cápsulas — 8 formas de magencio.\n Envíos a todo Colombia.\n\n La promoción está activa por tiempo limitado. Si quieres aprovecharla, te lo puedo dejar separado hoy mismo.\n\n Pásame nombre completo, ciudad, dirección y número de teléfono y te dejo el pedido listo"
        });

    }

    return null;

};