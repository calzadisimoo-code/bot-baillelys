const fs = require("fs");
const path = require("path");

const archivoVentas = path.join(__dirname, "ventas.csv");

function cargarVentas() {
    if (!fs.existsSync(archivoVentas)) {
        return [];
    }

    const contenido = fs.readFileSync(
        archivoVentas,
        "utf8"
    ).trim();

    if (!contenido) {
        return [];
    }

    const lineas = contenido.split("\n");

    lineas.shift();

    return lineas
        .filter(linea => linea.trim())
        .map(linea => {
            const partes = linea.split(",");

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
    return new Date().toLocaleDateString("es-CO");
}


// ==========================================
// VENTAS DE HOY
// ==========================================

function ventasHoy() {

    const ventas = cargarVentas();

    const hoy = fechaColombia();

    return ventas.filter(
        venta => venta.fecha === hoy
    );
}


// ==========================================
// VENTAS DEL MES
// ==========================================

function ventasMes() {

    const ventas = cargarVentas();

    const ahora = new Date();

    const mes = ahora.getMonth();
    const año = ahora.getFullYear();

    return ventas.filter(venta => {

        const [dia, mesVenta, añoVenta] =
            venta.fecha.split("/").map(Number);

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

    const ventas = cargarVentas();

    const año =
        new Date().getFullYear();

    return ventas.filter(venta => {

        const partes =
            venta.fecha.split("/");

        const añoVenta =
            Number(partes[2]);

        return añoVenta === año;
    });
}


// ==========================================
// RESUMEN
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

function formatoResumen(titulo, ventas) {

    const datos = resumen(ventas);

    return `📊 ${titulo}

🧾 Ventas: ${datos.cantidad}

💰 Ingresos: ${dinero(datos.ingresos)}
💵 Costos: ${dinero(datos.costos)}
📈 Utilidad: ${dinero(datos.utilidad)}`;
}


// ==========================================
// EXPORTAR
// ==========================================

module.exports = {
    cargarVentas,
    ventasHoy,
    ventasMes,
    ventasAnio,
    resumen,
    ventasPorCanal,
    ventasPorProducto,
    formatoResumen,
    dinero
};