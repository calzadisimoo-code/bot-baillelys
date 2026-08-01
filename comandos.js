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

if (texto.startsWith("#resetab")) {

    const nombre = texto
        .replace("#resetab", "")
        .trim();

    if (!nombre) {

        await sock.sendMessage(usuario, {
            text: "❌ Escribe el nombre del A/B.\n\nEjemplo:\n#resetabaf1bi"
        });

        return true;

    }

    const ok = reiniciar(nombre);

    await sock.sendMessage(usuario, {
        text: ok
            ? `✅ Estadísticas de ${nombre} reiniciadas.`
            : `❌ No existe un A/B llamado "${nombre}".`
    });

    return true;

}

    // ... resto del código

if (texto.startsWith("#ab")) {

    const nombre = texto
        .replace("#ab", "")
        .trim();

    if (!nombre) {

        await sock.sendMessage(usuario,{
            text: reporteTodos()
        });

        return true;

    }

    await sock.sendMessage(usuario,{
        text: reporte(nombre)
    });

    return true;

}
	
	if (texto === "#hoy") {

    await sock.sendMessage(usuario, {
        text: reporteHoy()
    });

    return true;

}

    return false;

};