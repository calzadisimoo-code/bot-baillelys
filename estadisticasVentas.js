const fs = require("fs");
const path = require("path");

const archivoVentas =
    path.join(__dirname, "ventas.csv");

const archivoGastos =
    path.join(__dirname, "gastos.csv");


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

    fs.appendFileSync(
        archivoGastos,
        linea,
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


// ==========================================
// RESUMEN DE VENTAS
// ==========================================

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
    gastos
) {

    const datosVentas =
        resumen(ventas);

    const datosGastos =
        resumenGastos(gastos);

    const utilidadNeta =
        datosVentas.utilidad -
        datosGastos.total;

    return {
        ventas: datosVentas,
        gastos: datosGastos,
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
    gastos
) {

    const datos =
        resumenCompleto(
            ventas,
            gastos
        );

    return `📊 ${titulo}

🧾 Ventas: ${datos.ventas.cantidad}

💰 Ingresos: ${dinero(datos.ventas.ingresos)}
💵 Costos: ${dinero(datos.ventas.costos)}
📈 Utilidad ventas: ${dinero(datos.ventas.utilidad)}

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

    gastosHoy,
    gastosMes,
    gastosAnio,

    resumen,
    resumenGastos,
    resumenCompleto,

    ventasPorCanal,
    ventasPorProducto,

    formatoResumen,
    formatoResumenCompleto,

    dinero
};