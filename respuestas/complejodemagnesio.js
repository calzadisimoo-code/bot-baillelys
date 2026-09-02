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
                "🔥 ¡Sí tenemos disponible el Magnesio Complex 1000 mg!\n\n" +
                "💊 90 cápsulas | 8 formas de magnesio\n" +
                "💰 $89.990\n" +
                "🚚 Envíos a toda Colombia.\n\n" +
                "¿Lo buscas principalmente para *descanso, músculos o energía*?",

            B:
                "🔥 Sí tenemos el Magnesio Complex 1000 mg por *$89.990*.\n\n" +
                "💊 90 cápsulas | 8 formas de magnesio\n" +
                "🚚 Envíos a toda Colombia.\n\n" +
                "¿Qué buscas principalmente?\n\n" +
                "1️⃣ Descanso\n" +
                "2️⃣ Músculos\n" +
                "3️⃣ Energía\n\n" +
                "👉 Respóndeme con *1, 2 o 3*.",

            C:
                "🔥 Sí, disponible por *$89.990*.\n\n" +
                "💊 Magnesio Complex | 90 cápsulas\n" +
                "⚡ 8 formas de magnesio\n\n" +
                "¿Para qué lo estás buscando principalmente? 💪😴⚡",

            D:
                "🔥 Sí tenemos disponible el Magnesio Complex 1000 mg.\n\n" +
                "💰 Precio: *$89.990*\n" +
                "💊 90 cápsulas\n" +
                "🚚 Envíos a toda Colombia.\n\n" +
                "Cuéntame, ¿qué te interesa más: *descansar mejor, apoyar tus músculos o tener más energía*?",

            E:
                "🔥 Sí tenemos el Magnesio Complex 1000 mg por *$89.990*.\n\n" +
                "💊 90 cápsulas | 8 formas de magnesio\n\n" +
                "¿Lo estás buscando por alguna necesidad específica o simplemente quieres complementar tu alimentación?",

            F:
                "🔥 Sí tenemos disponible el Magnesio Complex 1000 mg.\n\n" +
                "💊 90 cápsulas | 8 formas de magnesio\n" +
                "💰 *$89.990*\n\n" +
                "¿Quieres que te diga cuál de sus beneficios puede interesarte más según lo que buscas?"

        });

    }

    return null;

};