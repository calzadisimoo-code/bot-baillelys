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
                "?? ?S¨ª tenemos disponible el Magnesio Complex 1000 mg! \n\n?? $89.990\n?? 90 c¨¢psulas ¡ª 8 formas de magnesio.\n?? Env¨ªos a todo Colombia.\n\n\n? La promoci¨®n est¨¢ activa por tiempo limitado. Si quieres aprovecharla, te lo puedo dejar separado hoy mismo.\n\n?? P¨¢same nombre completo, ciudad, direcci¨®n y n¨²mero de tel¨¦fono y te dejo el pedido listo"

        });

    }

    return null;

};