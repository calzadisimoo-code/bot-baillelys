const { guardar } = require("../estado");
const { obtenerVariante } = require("../estadisticas/ab");

const {
    registrarProducto
} = require("../estadisticas/hoy");

module.exports = function (texto, usuario) {

    texto = texto.toLowerCase().trim();

    if (
        texto.includes("complejo de magencio calzadisimo") ||
        texto.includes("magencio complex")
    ) {

        registrarProducto(usuario);

        guardar(usuario, {
            producto: "complejodemagencio",
            pedidoEnviado: false
        });

        return obtenerVariante("complejodemagencio", usuario, {

            A:
                "?? ?S¨ª tenemos disponible el Magencio Complex 1000 mg!\n\n?? $89.990\n?? 90 c¨¢psulas ¡ª 8 formas de magencio.\n?? Env¨ªos a todo Colombia.\n\n? La promoci¨®n est¨¢ activa por tiempo limitado. Si quieres aprovecharla, te lo puedo dejar separado hoy mismo.\n\n?? P¨¢same nombre completo, ciudad, direcci¨®n y n¨²mero de tel¨¦fono y te dejo el pedido listo"

        });

    }

    return null;
};