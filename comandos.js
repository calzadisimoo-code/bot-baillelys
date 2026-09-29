const {
    reporte,
    reporteTodos,
    reiniciar,
    reiniciarRespuesta,
    editarRespuesta
} = require("./estadisticas/ab");

const fs = require("fs");
const path = require("path");
const ventas = require("./ventas/ventas");
const estadisticasVentas =
    require("./ventas/estadisticasVentas");

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
const costosPendientes = new Map();

// ==========================================
// DIRECCIONES DEL DÍA
// ==========================================

const archivoDirecciones =
    path.join(__dirname, "estadisticas", "direccionesHoy.json");

function cargarDireccionesHoy() {

    if (!fs.existsSync(archivoDirecciones)) {

        fs.writeFileSync(
            archivoDirecciones,
            JSON.stringify({
                fecha: new Date().toLocaleDateString("es-CO"),
                total: 0
            }, null, 4)
        );
    }

    const datos =
        JSON.parse(
            fs.readFileSync(
                archivoDirecciones,
                "utf8"
            )
        );

    const hoy =
        new Date().toLocaleDateString("es-CO");

    // Si cambió el día, reiniciar automáticamente
    if (datos.fecha !== hoy) {

        datos.fecha = hoy;
        datos.total = 0;

        fs.writeFileSync(
            archivoDirecciones,
            JSON.stringify(
                datos,
                null,
                4
            )
        );
    }

    return datos;
}

function sumarDireccionHoy() {

    const datos =
        cargarDireccionesHoy();

    datos.total++;

    fs.writeFileSync(
        archivoDirecciones,
        JSON.stringify(
            datos,
            null,
            4
        )
    );

    return datos.total;
}

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
// #ventashoy
// ==========================================

if (/^#ventashoy$/i.test(texto.trim())) {

    const lista =
        estadisticasVentas.ventasHoy();

    await sock.sendMessage(usuario, {
        text:
            estadisticasVentas.formatoResumen(
                "VENTAS DE HOY",
                lista
            )
    });

    return true;
}


// ==========================================
// #ventasmes
// ==========================================

if (/^#ventasmes$/i.test(texto.trim())) {

    const lista =
        estadisticasVentas.ventasMes();

    await sock.sendMessage(usuario, {
        text:
            estadisticasVentas.formatoResumen(
                "VENTAS DEL MES",
                lista
            )
    });

    return true;
}


// ==========================================
// #ventasanio
// ==========================================

if (/^#ventasanio$/i.test(texto.trim())) {

    const lista =
        estadisticasVentas.ventasAnio();

    await sock.sendMessage(usuario, {
        text:
            estadisticasVentas.formatoResumen(
                "VENTAS DEL AÑO",
                lista
            )
    });

    return true;
}

// ==========================================
// #ventascanales
// ==========================================

if (/^#ventascanales$/i.test(texto.trim())) {

    const lista =
        estadisticasVentas.ventasAnio();

    const canales =
        estadisticasVentas.ventasPorCanal(lista);

    let mensaje =
        "📊 VENTAS POR CANAL\n";

    for (const canal of Object.keys(canales)) {

        const datos = canales[canal];

        mensaje += `

📢 ${canal}
🧾 Ventas: ${datos.cantidad}
💰 Ingresos: ${estadisticasVentas.dinero(datos.ingresos)}
📈 Utilidad: ${estadisticasVentas.dinero(datos.utilidad)}`;
    }

    await sock.sendMessage(usuario, {
        text: mensaje
    });

    return true;
}


// ==========================================
// #ventasproductos
// ==========================================

if (/^#ventasproductos$/i.test(texto.trim())) {

    const lista =
        estadisticasVentas.ventasAnio();

    const productos =
        estadisticasVentas.ventasPorProducto(lista);

    let mensaje =
        "📦 VENTAS POR PRODUCTO\n";

    for (const producto of Object.keys(productos)) {

        const datos =
            productos[producto];

        mensaje += `

👟 ${producto}
🧾 Ventas: ${datos.cantidad}
💰 Ingresos: ${estadisticasVentas.dinero(datos.ingresos)}
📈 Utilidad: ${estadisticasVentas.dinero(datos.utilidad)}`;
    }

    await sock.sendMessage(usuario, {
        text: mensaje
    });

    return true;
}
	
// ==========================================
// VENTAS E INVENTARIO
// ==========================================


// ==========================================
// RESPUESTA DE COSTO PENDIENTE
// ==========================================

if (
    costosPendientes.has(usuario) &&
    !texto.startsWith("#")
) {

    const pendiente =
        costosPendientes.get(usuario);

    const costoTexto =
        texto.trim().replace(",", ".");

    const costo =
        Number(costoTexto);

    if (
        !Number.isFinite(costo) ||
        costo <= 0
    ) {

        await sock.sendMessage(usuario, {
            text:
                "❌ Ese costo no es válido.\n\n" +
                "Escribe solamente el costo.\n\n" +
                "Ejemplo:\n7"
        });

        return true;
    }

    const resultado =
        ventas.completarCosto(
            pendiente.id,
            pendiente.producto,
            pendiente.talla,
            costo
        );

    costosPendientes.delete(usuario);

    if (!resultado.ok) {

        await sock.sendMessage(usuario, {
            text:
                `❌ ${resultado.mensaje}`
        });

        return true;
    }

    await sock.sendMessage(usuario, {
        text:
            `✅ COSTO GUARDADO

👟 Producto: ${resultado.producto}
📏 Talla: ${resultado.talla}

💰 Venta: $${resultado.precio.toLocaleString("es-CO")}
💵 Costo: $${resultado.costo.toLocaleString("es-CO")}
📈 Utilidad: $${resultado.utilidad.toLocaleString("es-CO")}

La próxima vez ya conoceré este costo.`
    });

    return true;
}


// ==========================================
// #ENTRADA
// Ejemplo:
// #entrada PARIST38 20
// ==========================================

if (/^#entrada\s+/i.test(texto)) {

    const textoEntrada =
        texto.replace(
            /^#entrada\s+/i,
            "ENTRADA "
        );

    const resultado =
        ventas.entradaInventario(
            textoEntrada
        );

    await sock.sendMessage(usuario, {
        text: resultado.ok
            ? `✅ INVENTARIO ACTUALIZADO

📦 Producto: ${resultado.producto}
📏 Talla: ${resultado.talla}
➕ Entrada: ${resultado.cantidad}
📊 Stock actual: ${resultado.stock}`
            : `❌ ${resultado.mensaje}`
    });

    return true;
}


// ==========================================
// #STOCK
// Ejemplo:
// #stock PARIST38
// ==========================================

// ==========================================
// #STOCK
// Ver inventario completo
// ==========================================

if (/^#stock$/i.test(texto.trim())) {

    const inventario =
        ventas.obtenerInventarioCompleto();

    let mensaje =
        "📦 INVENTARIO\n";

    if (!inventario.ok || inventario.productos.length === 0) {

        mensaje += "\nNo hay inventario registrado.";

    } else {

        for (const producto of inventario.productos) {

            mensaje += "\n";

            for (const talla of producto.tallas) {

                mensaje +=
                    `${producto.nombre}T${talla}\n`;
            }
        }

        mensaje = mensaje.trimEnd();
    }

    await sock.sendMessage(usuario, {
        text: mensaje
    });

    return true;
}


// ==========================================
// #STOCK REFERENCIA
// Ejemplo:
// #stock PARIST38
// ==========================================

if (/^#stock\s+/i.test(texto)) {

    const textoStock =
        texto.replace(
            /^#stock\s+/i,
            "STOCK "
        );

    const resultado =
        ventas.obtenerStock(
            textoStock
        );

    await sock.sendMessage(usuario, {

        text: resultado.ok

            ? `📦 STOCK

Producto: ${resultado.producto}
Talla: ${resultado.talla}
Disponible: ${resultado.stock}`

            : `❌ ${resultado.mensaje}`
    });

    return true;
}


// ==========================================
// VENTA RÁPIDA
// Ejemplo:
// #PARIST38 ENVIO 60
// ==========================================

if (
    /^#[a-z0-9]+t\d+\s+\S+\s+\d+(?:[.,]\d+)?$/i
        .test(texto)
) {

    const textoVenta =
        texto.replace(/^#/, "");

    const resultado =
        ventas.registrarVenta(textoVenta);

    if (!resultado.ok) {

        await sock.sendMessage(usuario, {
            text: `❌ ${resultado.mensaje}`
        });

        return true;
    }


    // ======================================
    // COSTO DESCONOCIDO
    // ======================================

    if (!resultado.costoConocido) {

        costosPendientes.set(usuario, {
            id: resultado.id,
            producto: resultado.producto,
            talla: resultado.talla
        });

        await sock.sendMessage(usuario, {
            text:
                `⚠️ VENTA REGISTRADA

👟 Producto: ${resultado.producto}
📏 Talla: ${resultado.talla}
📢 Canal: ${resultado.canal}

💰 Venta: $${resultado.precio.toLocaleString("es-CO")}
📦 Stock: ${resultado.stock}

❓ No conozco el costo de este producto.

¿Cuál es el costo?

Ejemplo:
35`
        });

        return true;
    }


    // ======================================
    // COSTO YA CONOCIDO
    // ======================================

    await sock.sendMessage(usuario, {
        text:
            `✅ VENTA REGISTRADA

👟 Producto: ${resultado.producto}
📏 Talla: ${resultado.talla}
📢 Canal: ${resultado.canal}

💰 Venta: $${resultado.precio.toLocaleString("es-CO")}
💵 Costo: $${resultado.costo.toLocaleString("es-CO")}
📈 Utilidad: $${resultado.utilidad.toLocaleString("es-CO")}
📦 Stock: ${resultado.stock}`
    });

    return true;
}
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
            ? `✅ ACTIVADOR AGREGADO CORRECTAMENTE 📦 ${nombre.toUpperCase()}`
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
`➕${nombre.toUpperCase()}

¿Qué activador vas a agregar?`
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

// ==========================================
// #DIRECCIONES
// ==========================================

if (texto === "#direcciones") {

    const datos =
        cargarDireccionesHoy();

    await sock.sendMessage(usuario, {
        text:
`Camilo Hoy se han enviado ${datos.total} direcciones ✅`
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