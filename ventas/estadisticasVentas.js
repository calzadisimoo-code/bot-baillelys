const fs = require("fs");
const path = require("path");

const archivoVentas =
    path.join(__dirname, "ventas.csv");

const archivoGastos =
    path.join(__dirname, "gastos.csv");

const archivoDomicilios =
    path.join(__dirname, "domicilios.csv");


// ==========================================
// CARGAR VENTAS
// ==========================================

function cargarVentas() {

    if (!fs.existsSync(archivoVentas)) {
        return [];
    }

    const contenido =
        fs.readFileSync(
            archivoVentas,
            "utf8"
        ).trim();

    if (!contenido) {
        return [];
    }

    const lineas =
        contenido.split("\n");

    lineas.shift();

    return lineas
        .filter(linea => linea.trim())
        .map(linea => {

            const partes =
                linea.split(",");

            return {
                id: partes[0],
                fecha: partes[1],
                hora: partes[2],
                producto: partes[3],
                talla: partes[4],
                canal: partes[5],
                precio: Number(partes[6]) || 0,
                costo: Number(partes[7]) || 0,
                utilidad: Number(partes[8]) || 0,
                estado: partes[9]
            };
        });
}


// ==========================================
// FECHA COLOMBIA
// ==========================================

function fechaColombia() {

    return new Date()
        .toLocaleDateString("es-CO");
}


// ==========================================
// CARGAR GASTOS
// ==========================================

function cargarGastos() {

    if (!fs.existsSync(archivoGastos)) {

        fs.writeFileSync(
            archivoGastos,
            "id,fecha,hora,tipo,nombre,valor\n",
            "utf8"
        );

        return [];
    }

    const contenido =
        fs.readFileSync(
            archivoGastos,
            "utf8"
        ).trim();

    if (!contenido) {
        return [];
    }

    const lineas =
        contenido.split("\n");

    lineas.shift();

    return lineas
        .filter(linea => linea.trim())
        .map(linea => {

            const partes =
                linea.split(",");

            return {
                id: partes[0],
                fecha: partes[1],
                hora: partes[2],
                tipo: partes[3],
                nombre: partes[4],
                valor: Number(partes[5]) || 0
            };
        });
}


// ==========================================
// REGISTRAR GASTO
// ==========================================

function registrarGasto(
    tipo,
    nombre,
    valor
) {

    tipo =
        String(tipo)
            .trim()
            .toUpperCase();

    nombre =
        String(nombre)
            .trim();

    valor =
        Math.abs(
            Number(valor)
        );

    if (
        !tipo ||
        !nombre ||
        !Number.isFinite(valor) ||
        valor <= 0
    ) {

        return {
            ok: false,
            mensaje: "Datos inválidos."
        };
    }

    if (!fs.existsSync(archivoGastos)) {

        fs.writeFileSync(
            archivoGastos,
            "id,fecha,hora,tipo,nombre,valor\n",
            "utf8"
        );
    }

    const id =
        Date.now().toString();

    const ahora =
        new Date();

    const fecha =
        ahora.toLocaleDateString("es-CO");

    const hora =
        ahora.toLocaleTimeString(
            "es-CO",
            {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit"
            }
        );

    const linea =
        [
            id,
            fecha,
            hora,
            tipo,
            nombre,
            valor
        ].join(",") + "\n";

    let separador = "";

    if (fs.existsSync(archivoGastos)) {
        const contenidoActual = fs.readFileSync(
            archivoGastos,
            "utf8"
        );

        if (
            contenidoActual.length > 0 &&
            !contenidoActual.endsWith("\n")
        ) {
            separador = "\n";
        }
    }

    fs.appendFileSync(
        archivoGastos,
        separador + linea,
        "utf8"
    );

    return {
        ok: true,
        id,
        fecha,
        hora,
        tipo,
        nombre,
        valor
    };
}


// ==========================================
// VENTAS DE HOY
// ==========================================

function ventasHoy() {

    const ventas =
        cargarVentas();

    const hoy =
        fechaColombia();

    return ventas.filter(
        venta =>
            venta.fecha === hoy &&
            (!venta.estado ||
             venta.estado.toUpperCase() === "VENDIDO")
    );
}


// ==========================================
// VENTAS DEL MES
// ==========================================

function ventasMes() {

    const ventas =
        cargarVentas();

    const ahora =
        new Date();

    const mes =
        ahora.getMonth();

    const año =
        ahora.getFullYear();

    return ventas.filter(venta => {

        const [
            dia,
            mesVenta,
            añoVenta
        ] =
            venta.fecha
                .split("/")
                .map(Number);

        return (
            mesVenta - 1 === mes &&
            añoVenta === año
        );
    });
}


// ==========================================
// VENTAS DEL AÑO
// ==========================================

function ventasAnio() {

    const ventas =
        cargarVentas();

    const año =
        new Date()
            .getFullYear();

    return ventas.filter(venta => {

        const partes =
            venta.fecha.split("/");

        const añoVenta =
            Number(partes[2]);

        return añoVenta === año;
    });
}

function ventasPorMes(mes, año = null) {

    const ventas =
        cargarVentas();

    const añoConsulta =
        año || new Date().getFullYear();

    return ventas.filter(venta => {

        const partes =
            venta.fecha.split("/");

        const mesVenta =
            Number(partes[1]);

        const añoVenta =
            Number(partes[2]);

        return (
            mesVenta === mes &&
            añoVenta === añoConsulta &&
            (!venta.estado ||
             venta.estado.toUpperCase() === "VENDIDO")
        );
    });
}


// ==========================================
// GASTOS DE HOY
// ==========================================

function gastosHoy() {

    const gastos =
        cargarGastos();

    const hoy =
        fechaColombia();

    return gastos.filter(
        gasto =>
            gasto.fecha === hoy
    );
}


// ==========================================
// GASTOS DEL MES
// ==========================================

function gastosMes() {

    const gastos =
        cargarGastos();

    const ahora =
        new Date();

    const mes =
        ahora.getMonth();

    const año =
        ahora.getFullYear();

    return gastos.filter(gasto => {

        const [
            dia,
            mesGasto,
            añoGasto
        ] =
            gasto.fecha
                .split("/")
                .map(Number);

        return (
            mesGasto - 1 === mes &&
            añoGasto === año
        );
    });
}


// ==========================================
// GASTOS DEL AÑO
// ==========================================

function gastosAnio() {

    const gastos =
        cargarGastos();

    const año =
        new Date()
            .getFullYear();

    return gastos.filter(gasto => {

        const partes =
            gasto.fecha.split("/");

        return (
            Number(partes[2]) === año
        );
    });
}

function gastosPorMes(mes, año = null) {

    const gastos =
        cargarGastos();

    const añoConsulta =
        año || new Date().getFullYear();

    return gastos.filter(gasto => {

        const partes =
            gasto.fecha.split("/");

        const mesGasto =
            Number(partes[1]);

        const añoGasto =
            Number(partes[2]);

        return (
            mesGasto === mes &&
            añoGasto === añoConsulta
        );
    });
}

// ==========================================
// DOMICILIOS
// ==========================================

function cargarDomicilios() {

    if (!fs.existsSync(archivoDomicilios)) {

        fs.writeFileSync(
            archivoDomicilios,
            "id,fecha,hora,valor\n",
            "utf8"
        );

        return [];
    }

    const contenido =
        fs.readFileSync(
            archivoDomicilios,
            "utf8"
        ).trim();

    if (!contenido) {
        return [];
    }

    const lineas =
        contenido.split("\n");

    lineas.shift();

    return lineas
        .filter(linea => linea.trim())
        .map(linea => {

            const partes =
                linea.split(",");

            return {
                id: partes[0],
                fecha: partes[1],
                hora: partes[2],
                valor: Number(partes[3]) || 0
            };
        });
}


function registrarDomicilio(valor) {

    valor =
        Math.abs(
            Number(valor)
        );

    if (
        !Number.isFinite(valor) ||
        valor <= 0
    ) {

        return {
            ok: false,
            mensaje: "Valor inválido."
        };
    }

    if (!fs.existsSync(archivoDomicilios)) {

        fs.writeFileSync(
            archivoDomicilios,
            "id,fecha,hora,valor\n",
            "utf8"
        );
    }

    const id =
        Date.now().toString();

    const ahora =
        new Date();

    const fecha =
        ahora.toLocaleDateString("es-CO");

    const hora =
        ahora.toLocaleTimeString(
            "es-CO",
            {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit"
            }
        );

    const linea =
        [
            id,
            fecha,
            hora,
            valor
        ].join(",") + "\n";

    let separador = "";

    const contenidoActual =
        fs.readFileSync(
            archivoDomicilios,
            "utf8"
        );

    if (
        contenidoActual.length > 0 &&
        !contenidoActual.endsWith("\n")
    ) {
        separador = "\n";
    }

    fs.appendFileSync(
        archivoDomicilios,
        separador + linea,
        "utf8"
    );

    return {
        ok: true,
        id,
        fecha,
        hora,
        valor
    };
}


function domiciliosHoy() {

    const domicilios =
        cargarDomicilios();

    const hoy =
        fechaColombia();

    return domicilios.filter(
        domicilio =>
            domicilio.fecha === hoy
    );
}


function domiciliosMes() {

    const domicilios =
        cargarDomicilios();

    const ahora =
        new Date();

    const mes =
        ahora.getMonth();

    const año =
        ahora.getFullYear();

    return domicilios.filter(domicilio => {

        const [
            dia,
            mesDomicilio,
            añoDomicilio
        ] =
            domicilio.fecha
                .split("/")
                .map(Number);

        return (
            mesDomicilio - 1 === mes &&
            añoDomicilio === año
        );
    });
}


function domiciliosAnio() {

    const domicilios =
        cargarDomicilios();

    const año =
        new Date()
            .getFullYear();

    return domicilios.filter(domicilio => {

        const partes =
            domicilio.fecha.split("/");

        return (
            Number(partes[2]) === año
        );
    });
}

function domiciliosPorMes(mes, año = null) {

    const domicilios =
        cargarDomicilios();

    const añoConsulta =
        año || new Date().getFullYear();

    return domicilios.filter(domicilio => {

        const partes =
            domicilio.fecha.split("/");

        const mesDomicilio =
            Number(partes[1]);

        const añoDomicilio =
            Number(partes[2]);

        return (
            mesDomicilio === mes &&
            añoDomicilio === añoConsulta
        );
    });
}


function resumenDomicilios(domicilios) {

    const total =
        domicilios.reduce(
            (total, domicilio) =>
                total + domicilio.valor,
            0
        );

    return {
        total
    };
}


// ==========================================
// RESUMEN DE VENTAS
// ==========================================

// ==========================================
// ELIMINAR GASTO
// ==========================================

function eliminarGasto(id, tipo = null) {

    if (!fs.existsSync(archivoGastos)) {
        return {
            ok: false,
            mensaje: "No existe el archivo de gastos."
        };
    }

    const contenido =
        fs.readFileSync(
            archivoGastos,
            "utf8"
        );

    const lineas =
        contenido
            .split("\n")
            .filter(linea => linea.trim());

    if (lineas.length <= 1) {
        return {
            ok: false,
            mensaje: "No hay gastos registrados."
        };
    }

    const encabezado =
        lineas[0];

    const registros =
        lineas.slice(1);

    const indice =
        registros.findIndex(linea => {

            const partes =
                linea.split(",");

            return (
                partes[0] === String(id) &&
                (
                    !tipo ||
                    partes[3] === tipo
                )
            );
        });

    if (indice === -1) {
        return {
            ok: false,
            mensaje: "No encontré ese gasto."
        };
    }

    const partes =
        registros[indice].split(",");

    const gasto = {
        id: partes[0],
        fecha: partes[1],
        hora: partes[2],
        tipo: partes[3],
        nombre: partes[4],
        valor: Number(partes[5]) || 0
    };

    registros.splice(indice, 1);

    fs.writeFileSync(
        archivoGastos,
        encabezado + "\n" +
        registros.join("\n") +
        (registros.length ? "\n" : ""),
        "utf8"
    );

    return {
        ok: true,
        gasto
    };
}

function resumen(ventas) {

    const cantidad =
        ventas.length;

    const ingresos =
        ventas.reduce(
            (total, venta) =>
                total + venta.precio,
            0
        );

    const costos =
        ventas.reduce(
            (total, venta) =>
                total + venta.costo,
            0
        );

    const utilidad =
        ventas.reduce(
            (total, venta) =>
                total + venta.utilidad,
            0
        );

    return {
        cantidad,
        ingresos,
        costos,
        utilidad
    };
}


// ==========================================
// RESUMEN DE GASTOS
// ==========================================

function resumenGastos(gastos) {

    const total =
        gastos.reduce(
            (total, gasto) =>
                total + gasto.valor,
            0
        );

    const publicidad =
        gastos
            .filter(
                gasto =>
                    gasto.tipo === "PUBLICIDAD"
            )
            .reduce(
                (total, gasto) =>
                    total + gasto.valor,
                0
            );

    const otros =
        gastos
            .filter(
                gasto =>
                    gasto.tipo === "GASTO"
            )
            .reduce(
                (total, gasto) =>
                    total + gasto.valor,
                0
            );

    const nomina =
        gastos
            .filter(
                gasto =>
                    gasto.tipo === "NOMINA"
            )
            .reduce(
                (total, gasto) =>
                    total + gasto.valor,
                0
            );

    return {
        total,
        publicidad,
        otros,
        nomina
    };
}


// ==========================================
// RESUMEN COMPLETO
// ==========================================

function resumenCompleto(
    ventas,
    gastos,
    domicilios
) {

    const datosVentas =
        resumen(ventas);

    const datosGastos =
        resumenGastos(gastos);

    const datosDomicilios =
        resumenDomicilios(domicilios);

    const utilidadNeta =
        datosVentas.utilidad +
        datosDomicilios.total -
        datosGastos.total;

    return {
        ventas: datosVentas,
        gastos: datosGastos,
        domicilios: datosDomicilios,
        utilidadNeta
    };
}


// ==========================================
// POR CANAL
// ==========================================

function ventasPorCanal(ventas) {

    const canales = {};

    for (const venta of ventas) {

        if (!canales[venta.canal]) {

            canales[venta.canal] = {
                cantidad: 0,
                ingresos: 0,
                costos: 0,
                utilidad: 0
            };
        }

        canales[venta.canal].cantidad++;

        canales[venta.canal].ingresos +=
            venta.precio;

        canales[venta.canal].costos +=
            venta.costo;

        canales[venta.canal].utilidad +=
            venta.utilidad;
    }

    return canales;
}


// ==========================================
// POR PRODUCTO
// ==========================================

function ventasPorProducto(ventas) {

    const productos = {};

    for (const venta of ventas) {

        if (!productos[venta.producto]) {

            productos[venta.producto] = {
                cantidad: 0,
                ingresos: 0,
                costos: 0,
                utilidad: 0
            };
        }

        productos[venta.producto].cantidad++;

        productos[venta.producto].ingresos +=
            venta.precio;

        productos[venta.producto].costos +=
            venta.costo;

        productos[venta.producto].utilidad +=
            venta.utilidad;
    }

    return productos;
}


// ==========================================
// FORMATO DINERO
// ==========================================

function dinero(valor) {

    return `$${valor.toLocaleString("es-CO")}`;
}


// ==========================================
// FORMATO RESUMEN
// ==========================================

function formatoResumen(
    titulo,
    ventas
) {

    const datos =
        resumen(ventas);

    return `📊 ${titulo}

🧾 Ventas: ${datos.cantidad}

💰 Ingresos: ${dinero(datos.ingresos)}
💵 Costos: ${dinero(datos.costos)}
📈 Utilidad: ${dinero(datos.utilidad)}`;
}


// ==========================================
// FORMATO RESUMEN COMPLETO
// ==========================================

function formatoResumenCompleto(
    titulo,
    ventas,
    gastos,
    domicilios
) {

    const datos =
        resumenCompleto(
            ventas,
            gastos,
            domicilios
        );

    return `📊 ${titulo}

🧾 Ventas: ${datos.ventas.cantidad}

💰 Ingresos: ${dinero(datos.ventas.ingresos)}
💵 Costos: ${dinero(datos.ventas.costos)}
📈 Utilidad ventas: ${dinero(datos.ventas.utilidad)}

🚴 Domicilios: +${dinero(datos.domicilios.total)}

📉 GASTOS

📢 Publicidad: -${dinero(datos.gastos.publicidad)}
💸 Otros gastos: -${dinero(datos.gastos.otros)}
👤 Nómina: -${dinero(datos.gastos.nomina)}

📉 Total gastos: -${dinero(datos.gastos.total)}

💰 UTILIDAD NETA: ${dinero(datos.utilidadNeta)}`;
}

// ==========================================
// EXPORTAR
// ==========================================

module.exports = {

    cargarVentas,

    cargarGastos,

    registrarGasto,

    ventasHoy,
    ventasMes,
    ventasAnio,
	
	ventasPorMes,
gastosPorMes,
domiciliosPorMes,
 
gastosHoy,
gastosMes,
gastosAnio,
cargarDomicilios,
registrarDomicilio,
domiciliosHoy,
domiciliosMes,
domiciliosAnio,
resumenDomicilios,
eliminarGasto,

    resumen,
    resumenGastos,
    resumenCompleto,

    ventasPorCanal,
    ventasPorProducto,

    formatoResumen,
    formatoResumenCompleto,

    dinero
};