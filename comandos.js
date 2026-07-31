const {
    reporte,
    reiniciar
} = require("./estadisticas/ab");

module.exports = async function comandos(
    texto,
    usuario,
    sock
) {

    const lista = {

        catalogo: "Catálogo",

        ubicacion: "Ubicación",

        envio: "Envío",

        carg67w: "Cargador 67W",

        af1bi: "Air Force 1 Blanca Importada",

        paris: "Paris"

    };

    for (const nombre of Object.keys(lista)) {

        if (texto === `#ab${nombre}`) {

            await sock.sendMessage(

                usuario,

                {
                    text: reporte(nombre)
                }

            );

            return true;

        }

        if (texto === `#resetab${nombre}`) {

            reiniciar(nombre);

            await sock.sendMessage(

                usuario,

                {
                    text: `✅ Estadísticas de ${lista[nombre]} reiniciadas.`
                }

            );

            return true;

        }

    }

    return false;

};