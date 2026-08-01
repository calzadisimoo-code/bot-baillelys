const {
    reporte,
	reporteTodos,
    reiniciar
} = require("./estadisticas/ab");
const {
    reporteHoy
} = require("./estadisticas/hoy");

module.exports = async function comandos(
    texto,
    usuario,
    sock
) {

    if (
        texto === "#ab" ||
        texto === "#abtodo" ||
        texto === "#abproductos"
    ) {

        await sock.sendMessage(usuario, {
            text: reporteTodos()
        });

        return true;

    }

    const lista = {

        catalogo: "Catálogo",

        ubicacion: "Ubicación",

        envio: "Envío",

        talla: "Tallas",

        enviofotos: "Envío de fotos",

        pro4: "AirPods Pro 4",

        carg67w: "Cargador 67W",

        af1bi: "Air Force 1 Blanca Importada",

        paris: "Paris"

    };

    // ... resto del código

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
	
	if (texto === "#hoy") {

    await sock.sendMessage(usuario, {
        text: reporteHoy()
    });

    return true;

}

    return false;

};