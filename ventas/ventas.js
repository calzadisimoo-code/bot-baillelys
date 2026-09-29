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
        return JSON.parse(
            fs.readFileSync(archivo, "utf8")
        );
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
    const limpio = String(codigo)
        .trim()
        .toUpperCase();

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

    // 65 = $65.000
    // 7 = $7.000
    // 0.5 = $500

    return numero * 1000;
}


// ==========================================
// REGISTRAR VENTA
// ==========================================

function registrarVenta(texto) {
    inicializar();

    const partes = texto.trim().split(/\s+/);

    if (partes.length !== 3) {
        return {
            ok: false,
            mensaje: "Formato: #venta PARIST38 ANUNCIO 12"
        };
    }

    const datosProducto =
        interpretarProducto(partes[0]);

    if (!datosProducto) {
        return {
            ok: false,
            mensaje: "Producto/talla inválido. Ejemplo: PARIST38"
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

    const productos =
        cargarJSON(archivoProductos);

    const inventario =
        cargarJSON(archivoInventario);


    // ==========================================
    // CREAR PRODUCTO AUTOMÁTICAMENTE
    // ==========================================

    if (!productos[producto]) {
        productos[producto] = {
            nombre: producto,
            tallas: {},
            canales: {}
        };
    }


    // ==========================================
    // CREAR TALLA AUTOMÁTICAMENTE
    // ==========================================

    if (!productos[producto].tallas[talla]) {
        productos[producto].tallas[talla] = {
            costo: 0
        };
    }


    // ==========================================
    // CREAR CANAL AUTOMÁTICAMENTE
    // ==========================================

    if (!productos[producto].canales[canal]) {
        productos[producto].canales[canal] = {
            ventas: 0,
            ingresos: 0
        };
    }


    // ==========================================
    // INVENTARIO
    // ==========================================

    if (!inventario[producto]) {
        inventario[producto] = {};
    }

    if (inventario[producto][talla] === undefined) {
        inventario[producto][talla] = 0;
    }

    inventario[producto][talla] -= 1;


    // ==========================================
    // COSTO
    // ==========================================

    const costo =
        Number(
            productos[producto]
                .tallas[talla]
                .costo
        ) || 0;

    const costoConocido = costo > 0;

    const utilidad =
        costoConocido
            ? precio - costo
            : 0;


    // ==========================================
    // ESTADÍSTICAS DEL PRODUCTO/CANAL
    // ==========================================

    productos[producto]
        .canales[canal]
        .ventas += 1;

    productos[producto]
        .canales[canal]
        .ingresos += precio;


    // ==========================================
    // FECHA Y HORA
    // ==========================================

    const ahora = new Date();

    const fecha =
        ahora.toLocaleDateString("es-CO");

    const hora =
        ahora.toLocaleTimeString("es-CO", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit"
        });

    const id =
        Date.now().toString();


    // ==========================================
    // GUARDAR VENTA
    // ==========================================

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
        costoConocido,
        stock: inventario[producto][talla]
    };
}


// ==========================================
// GUARDAR COSTO Y COMPLETAR VENTA
// ==========================================

function completarCosto(idVenta, producto, talla, costoIngresado) {
    inicializar();

    const costo = normalizarDinero(costoIngresado);

    if (costo === null || costo <= 0) {
        return {
            ok: false,
            mensaje: "El costo debe ser mayor que 0."
        };
    }

    const productos =
        cargarJSON(archivoProductos);

    if (!productos[producto]) {
        productos[producto] = {
            nombre: producto,
            tallas: {},
            canales: {}
        };
    }

    if (!productos[producto].tallas[talla]) {
        productos[producto].tallas[talla] = {
            costo: 0
        };
    }

    // Guardar costo para futuras ventas
    productos[producto]
        .tallas[talla]
        .costo = costo;

    guardarJSON(
        archivoProductos,
        productos
    );


    // ==========================================
    // ACTUALIZAR LA VENTA EN CSV
    // ==========================================

    const contenido =
        fs.readFileSync(
            archivoVentas,
            "utf8"
        );

    const lineas =
        contenido.split("\n");

    let ventaEncontrada = false;
    let resultado = null;

    for (let i = 1; i < lineas.length; i++) {

        if (!lineas[i].trim()) {
            continue;
        }

        const columnas =
            lineas[i].split(",");

        if (columnas[0] !== String(idVenta)) {
            continue;
        }

        const precio =
            Number(columnas[6]) || 0;

        const utilidad =
            precio - costo;

        columnas[7] = costo;
        columnas[8] = utilidad;

        lineas[i] =
            columnas.join(",");

        ventaEncontrada = true;

        resultado = {
            precio,
            costo,
            utilidad
        };

        break;
    }

    if (ventaEncontrada) {

        fs.writeFileSync(
            archivoVentas,
            lineas.join("\n"),
            "utf8"
        );
    }

    return {
        ok: true,
        producto,
        talla,
        costo,
        precio: resultado?.precio || 0,
        utilidad: resultado?.utilidad || 0
    };
}


// ==========================================
// ENTRADA INVENTARIO
// ==========================================

function entradaInventario(texto) {
    inicializar();

    const partes =
        texto.trim().split(/\s+/);

    if (partes.length !== 3) {
        return {
            ok: false,
            mensaje: "Formato: ENTRADA PARIST38 20"
        };
    }

    const datosProducto =
        interpretarProducto(partes[1]);

    const cantidad =
        Number(partes[2]);

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

    const producto =
        datosProducto.producto;

    const talla =
        datosProducto.talla;

    const productos =
        cargarJSON(archivoProductos);

    const inventario =
        cargarJSON(archivoInventario);


    if (!productos[producto]) {
        productos[producto] = {
            nombre: producto,
            tallas: {},
            canales: {}
        };
    }

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


// ==========================================
// CONSULTAR STOCK
// ==========================================

function obtenerStock(texto) {
    inicializar();

    const partes =
        texto.trim().split(/\s+/);

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
    completarCosto,
    entradaInventario,
    obtenerStock
};

inicializar();