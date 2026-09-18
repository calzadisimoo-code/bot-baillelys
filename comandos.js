const {
    reporte,
    reporteTodos,
    reiniciar,
    reiniciarRespuesta,
    editarRespuesta
} = require("./estadisticas/ab");
const {
    reporteHoy
} = require("./estadisticas/hoy");

const edicionesAB = new Map();

module.exports = async function comandos(
    texto,
    usuario,
    sock
) {
	
	if (
    edicionesAB.has(usuario) &&
    !texto.startsWith("#")
) {

    const editando =
        edicionesAB.get(usuario);

    editarRespuesta(
        editando.nombre,
        editando.variante,
        texto
    );

    edicionesAB.delete(usuario);

    await sock.sendMessage(usuario, {
        text:
`✅ ${editando.nombre.toUpperCase()} - ${editando.variante} actualizada.`
    });

    return true;
}
	
	const matchEdit = texto.match(
    /^#editab(.+)respuesta([a-z])$/i
);

if (matchEdit) {

    const nombre = matchEdit[1];
    const variante = matchEdit[2].toUpperCase();

    edicionesAB.set(usuario, {
        nombre,
        variante
    });

    await sock.sendMessage(usuario, {
        text:
`✏️ ${nombre.toUpperCase()} - ${variante}

¿Por cuál la vas a reemplazar?`
    });

    return true;
}

if (texto.startsWith("#resetab")) {

    const match = texto.match(
        /^#resetab(.+)respuesta([a-z])$/i
    );

    if (match) {

        const nombre = match[1];
        const variante = match[2].toUpperCase();

        const ok = reiniciarRespuesta(
            nombre,
            variante
        );

        await sock.sendMessage(usuario, {
            text: ok
                ? `✅ ${nombre.toUpperCase()} - ${variante} reiniciada.`
                : "❌ No encontrada."
        });

        return true;

    }

}

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