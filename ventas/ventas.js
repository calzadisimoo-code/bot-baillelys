const fs = require("fs");
const path = require("path");

const carpeta = __dirname;
const archivoVentas = path.join(carpeta, "ventas.csv");
const archivoProductos = path.join(carpeta, "productos.json");
const archivoInventario = path.join(carpeta, "inventario.json");

function asegurarArchivo(archivo, contenido) {
    if (!fs.existsSync(archivo)) {
        fs.writeFileSync(archivo, contenido, "utf8");
    }
}

function cargarJSON(archivo) {
    try {
        return JSON.parse(fs.readFileSync(archivo, "utf8"));
    } catch {
        return {};
    }
}

function guardarJSON(archivo, datos) {
    fs.writeFileSync(
        archivo,
        JSON.stringify(datos, null, 4),
        "utf8"
    );
}

function inicializar() {
    asegurarArchivo(
        archivoProductos,
        JSON.stringify({}, null, 4)
    );

    asegurarArchivo(
        archivoInventario,
        JSON.stringify({}, null, 4)
    );

    asegurarArchivo(
        archivoVentas,
        "id,fecha,hora,producto,talla,canal,precio,costo,utilidad,estado\n"
    );
}

function interpretarProducto(codigo) {
    const limpio = String(codigo).trim().toUpperCase();

    // Ejemplo:
    // PARIST38
    // Producto: PARIS
    // Talla: 38

    const match = limpio.match(/^(.+)T(\d+)$/);

    if (!match) {
        return null;
    }

    return {
        producto: match[1],
        talla: match[2]
    };
}

function normalizarDinero(valor) {
    const numero = Number(
        String(valor).replace(",", ".")
    );

    if (!Number.isFinite(numero) || numero < 0) {
        return null;
    }

    // 12 = $12.000
    // 0.5 = $500
    // 1 = $1.000
    // 100 = $100.000

    return numero * 1000;
}

function registrarVenta(texto) {
    inicializar();

    const partes = texto.trim().split(/\s+/);

    if (partes.length !== 3) {
        return {
            ok: false,
            mensaje: "Formato: PARIST38 ANUNCIO 12"
        };
    }

    const datosProducto = interpretarProducto(partes[0]);

    if (!datosProducto) {
        return {
            ok: false,
            mensaje: "No entendí el producto/talla. Ejemplo: PARIST38"
        };
    }

    const producto = datosProducto.producto;
    const talla = datosProducto.talla;
    const canal = partes[1].toUpperCase();
    const precio = normalizarDinero(partes[2]);

    if (precio === null) {
        return {
            ok: false,
            mensaje: "El precio no es válido."
        };
    }

    const productos = cargarJSON(archivoProductos);
    const inventario = cargarJSON(archivoInventario);

    // Crear producto automáticamente
    if (!productos[producto]) {
        productos[producto] = {
            nombre: producto,
            tallas: {},
            canales: {}
        };
    }

    // Crear talla automáticamente
    if (!productos[producto].tallas[talla]) {
        productos[producto].tallas[talla] = {
            costo: 0
        };
    }

    // Crear canal automáticamente
    if (!productos[producto].canales[canal]) {
        productos[producto].canales[canal] = {
            ventas: 0,
            ingresos: 0
        };
    }

    // Crear producto en inventario
    if (!inventario[producto]) {
        inventario[producto] = {};
    }

    // Crear talla en inventario
    if (inventario[producto][talla] === undefined) {
        inventario[producto][talla] = 0;
    }

    // Descontar una unidad
    const stockAnterior = inventario[producto][talla];

    inventario[producto][talla] = stockAnterior - 1;

    // Obtener costo guardado del producto
    const costo =
        Number(productos[producto].tallas[talla].costo) || 0;

    const utilidad = precio - costo;

    // Actualizar estadísticas del canal
    productos[producto].canales[canal].ventas += 1;
    productos[producto].canales[canal].ingresos += precio;

    const ahora = new Date();

    const fecha = ahora.toLocaleDateString("es-CO");

    const hora = ahora.toLocaleTimeString("es-CO", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit"
    });

    const id = Date.now().toString();

    const fila = [
        id,
        fecha,
        hora,
        producto,
        talla,
        canal,
        precio,
        costo,
        utilidad,
        "VENDIDO"
    ].join(",") + "\n";

    fs.appendFileSync(
        archivoVentas,
        fila,
        "utf8"
    );

    guardarJSON(
        archivoProductos,
        productos
    );

    guardarJSON(
        archivoInventario,
        inventario
    );

    return {
        ok: true,
        id,
        producto,
        talla,
        canal,
        precio,
        costo,
        utilidad,
        stock: inventario[producto][talla]
    };
}

function entradaInventario(texto) {
    inicializar();

    const partes = texto.trim().split(/\s+/);

    if (partes.length !== 3) {
        return {
            ok: false,
            mensaje: "Formato: ENTRADA PARIST38 20"
        };
    }

    const datosProducto =
        interpretarProducto(partes[1]);

    const cantidad = Number(partes[2]);

    if (
        !datosProducto ||
        !Number.isInteger(cantidad) ||
        cantidad <= 0
    ) {
        return {
            ok: false,
            mensaje: "Formato: ENTRADA PARIST38 20"
        };
    }

    const producto = datosProducto.producto;
    const talla = datosProducto.talla;

    const productos =
        cargarJSON(archivoProductos);

    const inventario =
        cargarJSON(archivoInventario);

    // Crear producto automáticamente
    if (!productos[producto]) {
        productos[producto] = {
            nombre: producto,
            tallas: {},
            canales: {}
        };
    }

    // Crear talla automáticamente
    if (!productos[producto].tallas[talla]) {
        productos[producto].tallas[talla] = {
            costo: 0
        };
    }

    if (!inventario[producto]) {
        inventario[producto] = {};
    }

    if (inventario[producto][talla] === undefined) {
        inventario[producto][talla] = 0;
    }

    // Agregar inventario
    inventario[producto][talla] += cantidad;

    guardarJSON(
        archivoProductos,
        productos
    );

    guardarJSON(
        archivoInventario,
        inventario
    );

    return {
        ok: true,
        producto,
        talla,
        cantidad,
        stock: inventario[producto][talla]
    };
}

function obtenerStock(texto) {
    inicializar();

    const partes = texto.trim().split(/\s+/);

    if (partes.length !== 2) {
        return {
            ok: false,
            mensaje: "Formato: STOCK PARIST38"
        };
    }

    const datosProducto =
        interpretarProducto(partes[1]);

    if (!datosProducto) {
        return {
            ok: false,
            mensaje: "Formato: STOCK PARIST38"
        };
    }

    const inventario =
        cargarJSON(archivoInventario);

    const producto =
        datosProducto.producto;

    const talla =
        datosProducto.talla;

    const stock =
        inventario[producto]?.[talla] ?? 0;

    return {
        ok: true,
        producto,
        talla,
        stock
    };
}

module.exports = {
    inicializar,
    registrarVenta,
    entradaInventario,
    obtenerStock
};

inicializar();