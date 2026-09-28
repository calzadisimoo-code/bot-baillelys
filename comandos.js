const {
    reporte,
    reporteTodos,
    reiniciar,
    reiniciarRespuesta,
    editarRespuesta
} = require("./estadisticas/ab");

const fs = require("fs");
const path = require("path");

const carpetaRespuestas = path.join(
    __dirname,
    "respuestas"
);

const activadoresAB = new Map();
const eliminacionesAB = new Map();
const {
    reporteHoy
} = require("./estadisticas/hoy");

const edicionesAB = new Map();

function agregarActivadorAlJS(nombre, palabra) {

    const archivo = path.join(
        carpetaRespuestas,
        `${nombre}.js`
    );

    if (!fs.existsSync(archivo)) {
        return {
            ok: false,
            mensaje:
                `❌ No existe respuestas/${nombre}.js`
        };
    }

    let contenido =
        fs.readFileSync(
            archivo,
            "utf8"
        );

    const palabraEscapada =
        palabra
            .replace(/\\/g, "\\\\")
            .replace(/"/g, '\\"');

    const nuevoActivador =
        `texto.includes("${palabraEscapada}")`;

    if (contenido.includes(nuevoActivador)) {
        return {
            ok: false,
            mensaje:
                `⚠️ "${palabra}" ya existe como activador.`
        };
    }

    /*
     * CASO 1:
     * Busca una variable tipo:
     *
     * const mencionaAF1 =
     *     texto.includes("air force") ||
     *     texto.includes("af1");
     *
     * y agrega ahí el nuevo activador.
     */

    const regexVariable =
        /(const\s+\w+\s*=\s*\n?)([\s\S]*?texto\.includes\([\s\S]*?\)[\s\S]*?)(;\s*\n)/g;

    let encontrada = false;

    contenido =
        contenido.replace(
            regexVariable,
            function (
                match,
                inicio,
                condiciones,
                final
            ) {

                if (encontrada) {
                    return match;
                }

                if (
                    !condiciones.includes(
                        "texto.includes"
                    )
                ) {
                    return match;
                }

                encontrada = true;

                const condicionesLimpias =
                    condiciones.trimEnd();

                return (
                    inicio +
                    condicionesLimpias +
                    ` ||\n        ${nuevoActivador}` +
                    final
                );
            }
        );

    /*
     * CASO 2:
     * Si no encontró una variable de activadores,
     * busca un if que contenga obtenerVariante()
     *
     * Ejemplo:
     *
     * if (
     *     texto.includes("paris") ||
     *     texto.includes("tenis paris")
     * ) {
     *
     */

    if (!encontrada) {

        const posicionObtener =
            contenido.indexOf(
                `obtenerVariante("${nombre}"`
            );

        const posicionObtenerSimple =
            contenido.indexOf(
                `obtenerVariante('${nombre}'`
            );

        const posicion =
            posicionObtener !== -1
                ? posicionObtener
                : posicionObtenerSimple;

        if (posicion !== -1) {

            const antes =
                contenido.slice(
                    0,
                    posicion
                );

            const inicioIf =
                antes.lastIndexOf("if (");

            if (inicioIf !== -1) {

                const cierreParentesis =
                    contenido.indexOf(
                        ") {",
                        inicioIf
                    );

                if (
                    cierreParentesis !== -1 &&
                    cierreParentesis < posicion
                ) {

                    const condicion =
                        contenido.slice(
                            inicioIf,
                            cierreParentesis
                        );

                    if (
                        condicion.includes(
                            "texto.includes"
                        )
                    ) {

                        const nuevaCondicion =
                            condicion +
                            ` ||\n        ${nuevoActivador}`;

                        contenido =
                            contenido.slice(
                                0,
                                inicioIf
                            ) +
                            nuevaCondicion +
                            contenido.slice(
                                cierreParentesis
                            );

                        encontrada = true;
                    }
                }
            }
        }
    }

    if (!encontrada) {

        return {
            ok: false,
            mensaje:
`❌ No encontré automáticamente el bloque de activadores en ${nombre}.js.

No modifiqué el archivo.`
        };
    }

    fs.writeFileSync(
        archivo,
        contenido,
        "utf8"
    );

    return {
        ok: true
    };
}

module.exports = async function comandos(
    texto,
    usuario,
    sock
) {
	
	// ==========================================
// AGREGAR ACTIVADOR
// ==========================================

if (activadoresAB.has(usuario)) {

    const nombre =
        activadoresAB.get(usuario);

    if (texto.startsWith("#")) {
        return false;
    }

    const palabra =
        texto.trim();

    if (!palabra) {

        await sock.sendMessage(usuario, {
            text:
`❌ Escribe la palabra o frase que quieres agregar.

Ejemplo:

120w`
        });

        return true;
    }

    const resultado =
        agregarActivadorAlJS(
            nombre,
            palabra
        );

    activadoresAB.delete(usuario);

    await sock.sendMessage(usuario, {
        text: resultado.ok
            ? `✅ ACTIVADOR AGREGADO CORRECTAMENTE

📦 ${nombre.toUpperCase()}

🔑 Activador:
texto.includes("${palabra}")`
            : resultado.mensaje
    });

    return true;
}


// ==========================================
// #addresponseNOMBRE
// ==========================================

const matchAdd =
    texto.match(
        /^#addresponse([a-z0-9_]+)$/i
    );

if (matchAdd) {

    const nombre =
        matchAdd[1].toLowerCase();

    const archivo =
        path.join(
            carpetaRespuestas,
            `${nombre}.js`
        );

    if (!fs.existsSync(archivo)) {

        await sock.sendMessage(usuario, {
            text:
`❌ No existe:

respuestas/${nombre}.js`
        });

        return true;
    }

    activadoresAB.set(
        usuario,
        nombre
    );

    await sock.sendMessage(usuario, {
        text:
`➕ AGREGAR ACTIVADOR

📦 Producto: ${nombre.toUpperCase()}

¿Qué activador vas a agregar?

Escribe solamente la palabra o frase.

Ejemplo:

120w`
    });

    return true;
}
	
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