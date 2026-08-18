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
                "馃憢 Claro. 驴Buscas el magnesio para apoyar la funci贸n muscular, reducir la sensaci贸n de tensi贸n o complementar tu alimentaci贸n? 馃挭",

            B:
                "馃敟 Tenemos nuestro *Magnesio Complex 1000 mg* por solo *$89.990*.\n\n馃挭 Ideal como complemento para apoyar la funci贸n muscular y el bienestar general.\n馃槾 Tambi茅n es una opci贸n para quienes buscan complementar su rutina de descanso.\n\n馃憠 驴Lo quieres para ti? Te ayudo a dejar el pedido listo.",

            C:
                "?? ?Sí tenemos disponible el Magnesio Complex 1000 mg! \n\n?? $89.990\n?? 90 cápsulas — 8 formas de magnesio.\n?? Envíos a todo Colombia.\n\n\n? La promoción está activa por tiempo limitado. Si quieres aprovecharla, te lo puedo dejar separado hoy mismo.\n\n?? Pásame nombre completo, ciudad, dirección y número de teléfono y te dejo el pedido listo"

        });

    }

    return null;

};