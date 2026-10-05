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
const eliminacionesGastos = new Map();

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
// #HELP
// ==========================================

if (/^#help$/i.test(texto.trim())) {

    const mensaje =
`📋 COMANDOS DEL BOT

💰 VENTAS
#ventashoy — Ventas de hoy
#ventasmes — Ventas del mes
#ventasanio — Ventas del año
#ventasenero — Ventas de enero
#ventasfebrero — Ventas de febrero
#ventasmarzo — Ventas de marzo
#ventasabril — Ventas de abril
#ventasmayo — Ventas de mayo
#ventasjunio — Ventas de junio
#ventasjulio — Ventas de julio
#ventasagosto — Ventas de agosto
#ventasseptiembre — Ventas de septiembre
#ventasoctubre — Ventas de octubre
#ventasnoviembre — Ventas de noviembre
#ventasdiciembre — Ventas de diciembre
#ventascanales — Ventas por canal
#ventasproductos — Ventas por producto

💸 GASTOS
#gasto NOMBRE VALOR — Registra un gasto
#pago anuncio VALOR — Registra publicidad
#nomina NOMBRE VALOR — Registra nómina
#gastos — Resumen de gastos
#deletegasto — Elimina un gasto
#deleteanuncio — Elimina publicidad
#deletenomina — Elimina nómina

🚴 DOMICILIOS
#domicilio VALOR — Registra un domicilio
#domicilios — Domicilios de hoy
#domiciliosmes — Domicilios del mes
#domiciliosanio — Domicilios del año

📦 INVENTARIO
#entrada PRODUCTO TALLA CANTIDAD — Agrega inventario
#salida PRODUCTO TALLA CANTIDAD — Retira inventario
#stock — Muestra todo el inventario
#stock PRODUCTO TALLA — Consulta stock

🛒 VENTAS
#PRODUCTO TALLA CANAL PRECIO — Registra una venta
#deleteventa — Elimina una venta de hoy

🌐 CATÁLOGO WEB
#addwebcatalogo — Agrega producto con foto
#deletewebcatalogo — Elimina producto del catálogo

📊 ESTADÍSTICAS
#hoy — Estadísticas de hoy
#ab — Estadísticas A/B
#resetabNOMBRE — Reinicia estadísticas A/B

📝 RESPUESTAS
#addresponseNOMBRE — Agrega un activador
#editabNOMBRErespuestaX — Edita una respuesta
#resetabNOMBRErespuestaX — Reinicia una respuesta

📍 OTROS
#direcciones — Cuenta las direcciones enviadas
#help — Muestra esta ayuda`;

    await sock.sendMessage(usuario, {
        text: mensaje
    });

    return true;
}
	
// ==========================================
// #ventashoy
// ==========================================

if (/^#(?:ventashoy|ventas)$/i.test(texto.trim())) {

    const ventas =
        estadisticasVentas.ventasHoy();

    const gastos =
        estadisticasVentas.gastosHoy();

    const domicilios =
        estadisticasVentas.domiciliosHoy();

    const mensaje =
        estadisticasVentas.formatoResumenCompleto(
            "VENTAS DE HOY",
            ventas,
            gastos,
            domicilios
        );

    await sock.sendMessage(usuario, {
        text: mensaje
    });

    return true;
}

// ==========================================
// #ventasmes
// ==========================================

if (/^#ventasmes$/i.test(texto.trim())) {

    const ventas =
        estadisticasVentas.ventasMes();

    const gastos =
        estadisticasVentas.gastosMes();

    const domicilios =
        estadisticasVentas.domiciliosMes();

    const mensaje =
        estadisticasVentas.formatoResumenCompleto(
            "VENTAS DEL MES",
            ventas,
            gastos,
            domicilios
        );

    await sock.sendMessage(usuario, {
        text: mensaje
    });

    return true;
}

// ==========================================
// #VENTAS PRODUCTOS POR MES
// Ejemplos:
// #ventasproductosseptiembre
// #ventasproductosmesseptiembre
// ==========================================

const mesesVentasProductos = {
    enero: 1,
    febrero: 2,
    marzo: 3,
    abril: 4,
    mayo: 5,
    junio: 6,
    julio: 7,
    agosto: 8,
    septiembre: 9,
    octubre: 10,
    noviembre: 11,
    diciembre: 12
};

const matchVentasProductosMes =
    texto.trim().match(
        /^#ventasproductos(?:mes)?(enero|febrero|marzo|abril|mayo|junio|julio|agosto|septiembre|octubre|noviembre|diciembre)$/i
    );

if (matchVentasProductosMes) {

    const nombreMes =
        matchVentasProductosMes[1].toLowerCase();

    const numeroMes =
        mesesVentasProductos[nombreMes];

    const anio =
        new Date().getFullYear();

    const ventasMes =
        ventas.obtenerVentasMes(
            anio,
            numeroMes
        );

    if (ventasMes.length === 0) {

        await sock.sendMessage(usuario, {
            text:
                `📦 VENTAS DE ${nombreMes.toUpperCase()} ${anio}\n\n` +
                "No hay ventas registradas."
        });

        return true;
    }

    let mensaje =
        `📦 VENTAS DE ${nombreMes.toUpperCase()} ${anio}\n\n`;

    let totalVentas = 0;
    let totalDinero = 0;
    let gananciaNeta = 0;

    ventasMes.forEach(
        (venta, indice) => {

            totalVentas++;

            totalDinero +=
                Number(venta.precio) || 0;

            gananciaNeta +=
                Number(venta.utilidad) || 0;

            mensaje +=
                `${indice + 1}. ` +
                `${venta.producto}T${venta.talla} ` +
                `${venta.canal} ` +
                `$${Number(venta.precio).toLocaleString("es-CO")}\n`;
        }
    );

    mensaje +=
        `\n📊 TOTAL VENTAS: ${totalVentas}` +
        `\n💰 TOTAL VENDIDO: $${totalDinero.toLocaleString("es-CO")}` +
        `\n📈 GANANCIA NETA: $${gananciaNeta.toLocaleString("es-CO")}`;

    await sock.sendMessage(usuario, {
        text: mensaje
    });

    return true;
}

// ==========================================
// #ventasanio
// ==========================================

if (/^#ventasanio$/i.test(texto.trim())) {

    const ventas =
        estadisticasVentas.ventasAnio();

    const gastos =
        estadisticasVentas.gastosAnio();

    const domicilios =
        estadisticasVentas.domiciliosAnio();

    const mensaje =
        estadisticasVentas.formatoResumenCompleto(
            "VENTAS DEL AÑO",
            ventas,
            gastos,
            domicilios
        );

    await sock.sendMessage(usuario, {
        text: mensaje
    });

    return true;
}

// ==========================================
// #VENTAS POR MES
// Ejemplos:
// #ventasseptiembre
// #ventasmesseptiembre
// ==========================================

const mesesVentas = {
    enero: 1,
    febrero: 2,
    marzo: 3,
    abril: 4,
    mayo: 5,
    junio: 6,
    julio: 7,
    agosto: 8,
    septiembre: 9,
    octubre: 10,
    noviembre: 11,
    diciembre: 12
};

const matchVentasMes =
    texto.trim().match(
        /^#ventas(?:mes)?(enero|febrero|marzo|abril|mayo|junio|julio|agosto|septiembre|octubre|noviembre|diciembre)$/i
    );

if (matchVentasMes) {

    const nombreMes =
        matchVentasMes[1].toLowerCase();

    const numeroMes =
        mesesVentas[nombreMes];

    const año =
        new Date().getFullYear();

    const listaVentas =
        estadisticasVentas.ventasPorMes(
            numeroMes,
            año
        );

    const listaGastos =
        estadisticasVentas.gastosPorMes(
            numeroMes,
            año
        );

    const listaDomicilios =
        estadisticasVentas.domiciliosPorMes(
            numeroMes,
            año
        );

    const titulo =
        `VENTAS DE ${nombreMes.toUpperCase()} ${año}`;

    const mensaje =
        estadisticasVentas.formatoResumenCompleto(
            titulo,
            listaVentas,
            listaGastos,
            listaDomicilios
        );

    await sock.sendMessage(usuario, {
        text: mensaje
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
// #PAGO ANUNCIO
// ==========================================

if (
    /^#pago\s+anuncio\s+-?\d+(?:[.,]\d+)?$/i
        .test(texto.trim())
) {

    const partes =
        texto.trim().split(/\s+/);

    const valor =
        Number(
            partes[2].replace(",", ".")
        );

    const resultado =
        estadisticasVentas.registrarGasto(
            "PUBLICIDAD",
            "Anuncio",
            valor
        );

    if (!resultado.ok) {

        await sock.sendMessage(usuario, {
            text: `❌ ${resultado.mensaje}`
        });

        return true;
    }

    await sock.sendMessage(usuario, {
        text:
            `📢 PUBLICIDAD REGISTRADA\n\n` +
            `Anuncio: -$${resultado.valor}\n` +
            `📅 ${resultado.fecha}`
    });

    return true;
}

// ==========================================
// #GASTO
// ==========================================

if (
    /^#gasto\s+\S+(?:\s+\S+)*\s+-?\d+(?:[.,]\d+)?$/i
        .test(texto.trim())
) {

    const partes =
        texto.trim().split(/\s+/);

    const valor =
        Number(
            partes[partes.length - 1]
                .replace(",", ".")
        );

    const nombre =
        partes
            .slice(1, -1)
            .join(" ");

    const resultado =
        estadisticasVentas.registrarGasto(
            "GASTO",
            nombre,
            valor
        );

    if (!resultado.ok) {

        await sock.sendMessage(usuario, {
            text: `❌ ${resultado.mensaje}`
        });

        return true;
    }

    await sock.sendMessage(usuario, {
        text:
            `💸 GASTO REGISTRADO\n\n` +
            `${resultado.nombre}: -$${resultado.valor}\n` +
            `📅 ${resultado.fecha}`
    });

    return true;
}

// ==========================================
// #NOMINA
// ==========================================

if (
    /^#nomina\s+\S+(?:\s+\S+)*\s+-?\d+(?:[.,]\d+)?$/i
        .test(texto.trim())
) {

    const partes =
        texto.trim().split(/\s+/);

    const valor =
        Number(
            partes[partes.length - 1]
                .replace(",", ".")
        );

    const nombre =
        partes
            .slice(1, -1)
            .join(" ");

    const resultado =
        estadisticasVentas.registrarGasto(
            "NOMINA",
            nombre,
            valor
        );

    if (!resultado.ok) {

        await sock.sendMessage(usuario, {
            text: `❌ ${resultado.mensaje}`
        });

        return true;
    }

    await sock.sendMessage(usuario, {
        text:
            `👤 NÓMINA REGISTRADA\n\n` +
            `${resultado.nombre}: -$${resultado.valor}\n` +
            `📅 ${resultado.fecha}`
    });

    return true;
}

// ==========================================
// #GASTOS
// ==========================================

if (/^#gastos$/i.test(texto.trim())) {

    const hoy =
        estadisticasVentas.resumenGastos(
            estadisticasVentas.gastosHoy()
        );

    const mes =
        estadisticasVentas.resumenGastos(
            estadisticasVentas.gastosMes()
        );

    const anio =
        estadisticasVentas.resumenGastos(
            estadisticasVentas.gastosAnio()
        );

    const mensaje =
        `📉 GASTOS\n\n` +

        `📅 HOY\n` +
        `📢 Publicidad: -${estadisticasVentas.dinero(hoy.publicidad)}\n` +
        `💸 Otros: -${estadisticasVentas.dinero(hoy.otros)}\n` +
        `👤 Nómina: -${estadisticasVentas.dinero(hoy.nomina)}\n` +
        `Total: -${estadisticasVentas.dinero(hoy.total)}\n\n` +

        `📆 MES\n` +
        `📢 Publicidad: -${estadisticasVentas.dinero(mes.publicidad)}\n` +
        `💸 Otros: -${estadisticasVentas.dinero(mes.otros)}\n` +
        `👤 Nómina: -${estadisticasVentas.dinero(mes.nomina)}\n` +
        `Total: -${estadisticasVentas.dinero(mes.total)}\n\n` +

        `📆 AÑO\n` +
        `📢 Publicidad: -${estadisticasVentas.dinero(anio.publicidad)}\n` +
        `💸 Otros: -${estadisticasVentas.dinero(anio.otros)}\n` +
        `👤 Nómina: -${estadisticasVentas.dinero(anio.nomina)}\n` +
        `Total: -${estadisticasVentas.dinero(anio.total)}`;

    await sock.sendMessage(usuario, {
        text: mensaje
    });

    return true;
}



// ==========================================
// #DOMICILIO
// ==========================================

if (
    /^#domicilio\s+-?\d+(?:[.,]\d+)?$/i
        .test(texto.trim())
) {

    const partes =
        texto.trim().split(/\s+/);

    const valor =
        Number(
            partes[1].replace(",", ".")
        );

    const resultado =
        estadisticasVentas.registrarDomicilio(
            valor
        );

    if (!resultado.ok) {

        await sock.sendMessage(usuario, {
            text: `❌ ${resultado.mensaje}`
        });

        return true;
    }

    await sock.sendMessage(usuario, {
        text:
            `🚴 DOMICILIO REGISTRADO\n\n` +
            `💰 +${estadisticasVentas.dinero(resultado.valor)}\n` +
            `📅 ${resultado.fecha}`
    });

    return true;
}


// ==========================================
// #DOMICILIOS
// ==========================================

if (/^#domicilios$/i.test(texto.trim())) {

    const domicilios =
        estadisticasVentas.domiciliosHoy();

    const resumen =
        estadisticasVentas.resumenDomicilios(
            domicilios
        );

    await sock.sendMessage(usuario, {
        text:
            `🚴 DOMICILIOS DE HOY\n\n` +
            `💰 Total: +${estadisticasVentas.dinero(resumen.total)}`
    });

    return true;
}


// ==========================================
// #DOMICILIOSMES
// ==========================================

if (/^#domiciliosmes$/i.test(texto.trim())) {

    const domicilios =
        estadisticasVentas.domiciliosMes();

    const resumen =
        estadisticasVentas.resumenDomicilios(
            domicilios
        );

    await sock.sendMessage(usuario, {
        text:
            `🚴 DOMICILIOS DEL MES\n\n` +
            `💰 Total: +${estadisticasVentas.dinero(resumen.total)}`
    });

    return true;
}


// ==========================================
// #DOMICILIOSANIO
// ==========================================

if (/^#domiciliosanio$/i.test(texto.trim())) {

    const domicilios =
        estadisticasVentas.domiciliosAnio();

    const resumen =
        estadisticasVentas.resumenDomicilios(
            domicilios
        );

    await sock.sendMessage(usuario, {
        text:
            `🚴 DOMICILIOS DEL AÑO\n\n` +
            `💰 Total: +${estadisticasVentas.dinero(resumen.total)}`
    });

    return true;
}

// ==========================================
// RESPUESTA DE COSTO PENDIENTE
// ==========================================

// ==========================================
// #DELETEVENTA
// Eliminar una venta de hoy
// ==========================================

if (/^#deleteventa$/i.test(texto.trim())) {

    const ventasHoy =
        ventas.obtenerVentasHoyParaEliminar();

    if (ventasHoy.length === 0) {

        await sock.sendMessage(usuario, {
            text:
                "🗑️ VENTAS DE HOY\n\n" +
                "No hay ventas para eliminar."
        });

        return true;
    }


    eliminacionesAB.set(
        usuario,
        ventasHoy
    );


    let mensaje =
        "🗑️ VENTAS DE HOY\n\n";

    ventasHoy.forEach(
        (venta, indice) => {

            mensaje +=
                `${indice + 1}. ` +
                `${venta.producto}T${venta.talla} ` +
                `${venta.canal} ` +
                `$${venta.precio.toLocaleString("es-CO")}\n`;
        }
    );

    mensaje +=
        "\nEscribe el número de la venta que quieres eliminar.";

    await sock.sendMessage(usuario, {
        text: mensaje
    });

    return true;
}

// ==========================================
// ELIMINAR GASTO
// ==========================================

if (/^#deletegasto$/i.test(texto.trim())) {

    const gastos =
        estadisticasVentas
            .gastosHoy()
            .filter(gasto =>
                gasto.tipo === "GASTO"
            );

    if (!gastos.length) {

        await sock.sendMessage(usuario, {
            text:
                "📭 No hay gastos registrados hoy."
        });

        return true;
    }

    eliminacionesGastos.set(
        usuario,
        {
            tipo: "GASTO",
            gastos
        }
    );

    let mensaje =
        "🗑️ ELIMINAR GASTO\n\n";

    gastos.forEach((gasto, indice) => {

        mensaje +=
            `${indice + 1}. ${gasto.nombre} - ` +
            `${estadisticasVentas.dinero(gasto.valor)}\n`;
    });

    mensaje +=
        "\nResponde con el número del gasto que quieres eliminar.";

    await sock.sendMessage(usuario, {
        text: mensaje
    });

    return true;
}


// ==========================================
// ELIMINAR ANUNCIO
// ==========================================

if (/^#deleteanuncio$/i.test(texto.trim())) {

    const gastos =
        estadisticasVentas
            .gastosHoy()
            .filter(gasto =>
                gasto.tipo === "PUBLICIDAD"
            );

    if (!gastos.length) {

        await sock.sendMessage(usuario, {
            text:
                "📭 No hay anuncios registrados hoy."
        });

        return true;
    }

    eliminacionesGastos.set(
        usuario,
        {
            tipo: "PUBLICIDAD",
            gastos
        }
    );

    let mensaje =
        "🗑️ ELIMINAR ANUNCIO\n\n";

    gastos.forEach((gasto, indice) => {

        mensaje +=
            `${indice + 1}. ${gasto.nombre} - ` +
            `${estadisticasVentas.dinero(gasto.valor)}\n`;
    });

    mensaje +=
        "\nResponde con el número del anuncio que quieres eliminar.";

    await sock.sendMessage(usuario, {
        text: mensaje
    });

    return true;
}


// ==========================================
// ELIMINAR NÓMINA
// ==========================================

if (/^#deletenomina$/i.test(texto.trim())) {

    const gastos =
        estadisticasVentas
            .gastosHoy()
            .filter(gasto =>
                gasto.tipo === "NOMINA"
            );

    if (!gastos.length) {

        await sock.sendMessage(usuario, {
            text:
                "📭 No hay nóminas registradas hoy."
        });

        return true;
    }

    eliminacionesGastos.set(
        usuario,
        {
            tipo: "NOMINA",
            gastos
        }
    );

    let mensaje =
        "🗑️ ELIMINAR NÓMINA\n\n";

    gastos.forEach((gasto, indice) => {

        mensaje +=
            `${indice + 1}. ${gasto.nombre} - ` +
            `${estadisticasVentas.dinero(gasto.valor)}\n`;
    });

    mensaje +=
        "\nResponde con el número de la nómina que quieres eliminar.";

    await sock.sendMessage(usuario, {
        text: mensaje
    });

    return true;
}

// ==========================================
// CONFIRMAR ELIMINACIÓN DE GASTO
// ==========================================

if (eliminacionesGastos.has(usuario)) {

    const numero =
        Number(texto.trim());

    if (!Number.isInteger(numero)) {

        await sock.sendMessage(usuario, {
            text:
                "❌ Responde únicamente con el número del registro."
        });

        return true;
    }

    const datos =
        eliminacionesGastos.get(usuario);

    const gasto =
        datos.gastos[numero - 1];

    if (!gasto) {

        await sock.sendMessage(usuario, {
            text:
                "❌ Ese número no corresponde a ningún registro."
        });

        return true;
    }

    const resultado =
        estadisticasVentas.eliminarGasto(
            gasto.id,
            datos.tipo
        );

    eliminacionesGastos.delete(usuario);

    if (!resultado.ok) {

        await sock.sendMessage(usuario, {
            text:
                `❌ ${resultado.mensaje}`
        });

        return true;
    }

    await sock.sendMessage(usuario, {
        text:
            `✅ REGISTRO ELIMINADO\n\n` +
            `📌 ${resultado.gasto.nombre}\n` +
            `💰 ${estadisticasVentas.dinero(resultado.gasto.valor)}`
    });

    return true;
}

// ==========================================
// RESPUESTA DE ELIMINACIÓN
// ==========================================

if (
    eliminacionesAB.has(usuario) &&
    !costosPendientes.has(usuario) &&
    !texto.startsWith("#")
) {

    const ventasHoy =
        eliminacionesAB.get(usuario);

    const numero =
        Number(texto.trim());

    if (
        !Number.isInteger(numero) ||
        numero < 1 ||
        numero > ventasHoy.length
    ) {

        await sock.sendMessage(usuario, {
            text:
                "❌ Número inválido.\n\n" +
                `Escribe un número entre 1 y ${ventasHoy.length}.`
        });

        return true;
    }


    const ventaSeleccionada =
        ventasHoy[numero - 1];


    const resultado =
        ventas.eliminarVenta(
            ventaSeleccionada.id
        );


    eliminacionesAB.delete(usuario);


    // Si esta venta todavía tenía costo pendiente,
    // también cancelamos esa solicitud.
    const costoPendiente =
        costosPendientes.get(usuario);

    if (
        costoPendiente &&
        costoPendiente.id === ventaSeleccionada.id
    ) {
        costosPendientes.delete(usuario);
    }


    if (!resultado.ok) {

        await sock.sendMessage(usuario, {
            text:
                `❌ ${resultado.mensaje}`
        });

        return true;
    }


    await sock.sendMessage(usuario, {
        text:
            `✅ VENTA ${numero} ELIMINADA\n\n` +
            `👟 ${resultado.producto}T${resultado.talla}\n` +
            `📢 ${resultado.canal}\n` +
            `💰 $${resultado.precio.toLocaleString("es-CO")}\n\n` +
            `📦 Stock restaurado: ${resultado.stock}`
    });

    return true;
}

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
// #SALIDA
// Ejemplos:
// #salida AF1BT40 2
// #salida AF1B 1/33 2/34 3/40
// #salida AF1B 40 44 44 43 40
// ==========================================

if (/^#salida\s+/i.test(texto)) {

    const textoSalida =
        texto.replace(
            /^#salida\s+/i,
            "SALIDA "
        );

    const resultado =
        ventas.salidaInventario(
            textoSalida
        );

    if (!resultado.ok) {

        await sock.sendMessage(usuario, {
            text:
                `❌ ${resultado.mensaje}`
        });

        return true;
    }

    // ==========================================
    // MOSTRAR SALIDA MASIVA
    // ==========================================

    if (resultado.entradas) {

        let mensaje =
            `✅ INVENTARIO ACTUALIZADO\n\n` +
            `📦 Producto: ${resultado.producto}\n\n`;

        for (const entrada of resultado.entradas) {

            const stockActual =
                ventas.obtenerStock(
                    `STOCK ${resultado.producto}T${entrada.talla}`
                );

            mensaje +=
                `📏 Talla ${entrada.talla}: -${entrada.cantidad}\n` +
                `📊 Stock actual: ${stockActual.stock}\n\n`;
        }

        mensaje +=
            `➖ Total retirado: ${resultado.total}`;

        await sock.sendMessage(usuario, {
            text: mensaje
        });

        return true;
    }

    return true;
}

// ==========================================
// #ENTRADA
// Ejemplos:
// #entrada PARIST38 20
// #entrada AF1B 1/33 1/34 2/35
// #entrada AF1B 40 44 44 43 40
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

    if (!resultado.ok) {

        await sock.sendMessage(usuario, {
            text:
                `❌ ${resultado.mensaje}`
        });

        return true;
    }

    // ==========================================
    // MOSTRAR ENTRADA MASIVA
    // ==========================================

    if (resultado.entradas) {

        let mensaje =
            `✅ INVENTARIO ACTUALIZADO\n\n` +
            `📦 Producto: ${resultado.producto}\n\n`;

        for (const entrada of resultado.entradas) {

            mensaje +=
                `📏 Talla ${entrada.talla}: +${entrada.cantidad}\n` +
                `📊 Stock actual: ${
                    ventas.obtenerStock(
                        `STOCK ${resultado.producto}T${entrada.talla}`
                    ).stock
                }\n\n`;
        }

        mensaje +=
            `➕ Total agregado: ${resultado.total}`;

        await sock.sendMessage(usuario, {
            text: mensaje
        });

        return true;
    }

    // ==========================================
    // ENTRADA NORMAL
    // ==========================================

    await sock.sendMessage(usuario, {
        text:
            `✅ INVENTARIO ACTUALIZADO\n\n` +
            `📦 Producto: ${resultado.producto}\n` +
            `📏 Talla: ${resultado.talla}\n` +
            `➕ Entrada: ${resultado.cantidad}\n` +
            `📊 Stock actual: ${resultado.stock}`
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

    if (
        !inventario.ok ||
        inventario.productos.length === 0
    ) {

        mensaje +=
            "\nNo hay inventario registrado.";

    } else {

        for (
            const producto
            of inventario.productos
        ) {

            mensaje += "\n";

            for (
                const talla
                of producto.tallas
            ) {

                const cantidad =
                    producto.stock[talla];

                // ==========================================
                // PRODUCTO SIN TALLA
                // ==========================================

                if (talla === "UNICA") {

                    if (cantidad === 0) {

                        mensaje +=
                            `🔴 ${producto.nombre} — AGOTADO\n`;

                    } else {

                        mensaje +=
                            `${producto.nombre} ${cantidad}\n`;
                    }

                    continue;
                }

                // ==========================================
                // PRODUCTO CON TALLA
                // ==========================================

                if (cantidad === 0) {

                    mensaje +=
                        `🔴 ${producto.nombre}T${talla} — AGOTADO\n`;

                } else {

                    mensaje +=
                        `${producto.nombre}T${talla} ${cantidad}\n`;
                }
            }
        }

        mensaje =
            mensaje.trimEnd();
    }

    await sock.sendMessage(
        usuario,
        {
            text: mensaje
        }
    );

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
    /^#[a-z0-9_-]+(?:t\d+)?\s+\S+\s+\d+(?:[.,]\d+)?$/i
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

eliminacionesAB.delete(usuario);

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