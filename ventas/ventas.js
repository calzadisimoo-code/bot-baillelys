const fs = require("fs");
const path = require("path");

const carpeta = __dirname;

const archivoVentas =
    path.join(carpeta, "ventas.csv");

const archivoProductos =
    path.join(carpeta, "productos.json");

const archivoInventario =
    path.join(carpeta, "inventario.json");

const archivoMigracion =
    path.join(carpeta, ".moneda_migrada");


// ==========================================
// ARCHIVOS
// ==========================================

function asegurarArchivo(archivo, contenido) {

    if (!fs.existsSync(archivo)) {
        fs.writeFileSync(
            archivo,
            contenido,
            "utf8"
        );
    }
}


function cargarJSON(archivo) {

    try {

        return JSON.parse(
            fs.readFileSync(
                archivo,
                "utf8"
            )
        );

    } catch {

        return {};
    }
}


function guardarJSON(archivo, datos) {

    fs.writeFileSync(
        archivo,
        JSON.stringify(
            datos,
            null,
            4
        ),
        "utf8"
    );
}


// ==========================================
// INICIALIZAR
// ==========================================

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

    migrarMoneda();
}


// ==========================================
// INTERPRETAR PRODUCTO
// ==========================================

function interpretarProducto(codigo) {

    const limpio =
        String(codigo)
            .trim()
            .toUpperCase();

    const match =
        limpio.match(/^(.+)T(\d+)$/);

    if (!match) {
        return null;
    }

    return {
        producto: match[1],
        talla: match[2]
    };
}


// ==========================================
// DINERO
// ==========================================
//
// TODO EL SISTEMA TRABAJA EN MILES.
//
// 60     = $60.000
// 150    = $150.000
// 0.5    = $500
// 1      = $1.000
// 1000   = $1.000.000
//
// NO se multiplica por 1000.
// ==========================================

function normalizarDinero(valor) {

    const numero =
        Number(
            String(valor)
                .replace(",", ".")
        );

    if (
        !Number.isFinite(numero) ||
        numero < 0
    ) {
        return null;
    }

    return numero;
}


// ==========================================
// MIGRAR DATOS ANTIGUOS
// ==========================================
//
// Antes el sistema guardaba:
//
// 60000 = $60.000
// 35000 = $35.000
//
// Ahora debe guardar:
//
// 60 = $60.000
// 35 = $35.000
//
// Esta migración se ejecuta UNA SOLA VEZ.
// ==========================================

function migrarMoneda() {

    if (fs.existsSync(archivoMigracion)) {
        return;
    }


    // ======================================
    // PRODUCTOS
    // ======================================

    const productos =
        cargarJSON(archivoProductos);

    let productosModificados = false;

    for (
        const producto of Object.values(productos)
    ) {

        if (
            producto.tallas
        ) {

            for (
                const talla of Object.values(
                    producto.tallas
                )
            ) {

                if (
                    typeof talla.costo === "number" &&
                    talla.costo >= 1000
                ) {

                    talla.costo =
                        talla.costo / 1000;

                    productosModificados = true;
                }
            }
        }


        if (
            producto.canales
        ) {

            for (
                const canal of Object.values(
                    producto.canales
                )
            ) {

                if (
                    typeof canal.ingresos === "number" &&
                    canal.ingresos >= 1000
                ) {

                    canal.ingresos =
                        canal.ingresos / 1000;

                    productosModificados = true;
                }
            }
        }
    }


    if (productosModificados) {

        guardarJSON(
            archivoProductos,
            productos
        );
    }


    // ======================================
    // VENTAS CSV
    // ======================================

    if (fs.existsSync(archivoVentas)) {

        const contenido =
            fs.readFileSync(
                archivoVentas,
                "utf8"
            );

        const lineas =
            contenido.split("\n");

        for (
            let i = 1;
            i < lineas.length;
            i++
        ) {

            if (!lineas[i].trim()) {
                continue;
            }

            const columnas =
                lineas[i].split(",");


            // precio
            if (
                columnas[6] !== undefined
            ) {

                const precio =
                    Number(columnas[6]);

                if (
                    Number.isFinite(precio) &&
                    precio >= 1000
                ) {

                    columnas[6] =
                        precio / 1000;
                }
            }


            // costo
            if (
                columnas[7] !== undefined
            ) {

                const costo =
                    Number(columnas[7]);

                if (
                    Number.isFinite(costo) &&
                    costo >= 1000
                ) {

                    columnas[7] =
                        costo / 1000;
                }
            }


            // utilidad
            if (
                columnas[8] !== undefined
            ) {

                const utilidad =
                    Number(columnas[8]);

                if (
                    Number.isFinite(utilidad) &&
                    Math.abs(utilidad) >= 1000
                ) {

                    columnas[8] =
                        utilidad / 1000;
                }
            }


            lineas[i] =
                columnas.join(",");
        }


        fs.writeFileSync(
            archivoVentas,
            lineas.join("\n"),
            "utf8"
        );
    }


    // ======================================
    // MARCAR MIGRACIÓN COMPLETADA
    // ======================================

    fs.writeFileSync(
        archivoMigracion,
        new Date().toISOString(),
        "utf8"
    );
}


// ==========================================
// REGISTRAR VENTA
// ==========================================

function registrarVenta(texto) {

    inicializar();

    const partes =
        texto
            .trim()
            .split(/\s+/);

    if (partes.length !== 3) {

        return {
            ok: false,
            mensaje:
                "Formato: PARIST38 ENVIO 60"
        };
    }


    const datosProducto =
        interpretarProducto(partes[0]);

    if (!datosProducto) {

        return {
            ok: false,
            mensaje:
                "Producto/talla inválido. Ejemplo: PARIST38"
        };
    }


    const producto =
        datosProducto.producto;

    const talla =
        datosProducto.talla;

    const canal =
        partes[1].toUpperCase();

    const precio =
        normalizarDinero(partes[2]);


    if (precio === null) {

        return {
            ok: false,
            mensaje:
                "El precio no es válido."
        };
    }


    const productos =
        cargarJSON(archivoProductos);

    const inventario =
        cargarJSON(archivoInventario);


    // ==========================================
    // CREAR PRODUCTO
    // ==========================================

    if (!productos[producto]) {

        productos[producto] = {

            nombre: producto,

            tallas: {},

            canales: {}
        };
    }


    // ==========================================
    // CREAR TALLA
    // ==========================================

    if (
        !productos[producto]
            .tallas[talla]
    ) {

        productos[producto]
            .tallas[talla] = {

                costo: 0
            };
    }


    // ==========================================
    // CREAR CANAL
    // ==========================================

    if (
        !productos[producto]
            .canales[canal]
    ) {

        productos[producto]
            .canales[canal] = {

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


    if (
        inventario[producto][talla] === undefined
    ) {

        inventario[producto][talla] = 0;
    }


    inventario[producto][talla] -= 1;


    // ==========================================
    // COSTO
    // ==========================================

    let costo =
        Number(
            productos[producto]
                .tallas[talla]
                .costo
        ) || 0;


    // Compatibilidad con datos antiguos
    if (costo >= 1000) {

        costo =
            costo / 1000;

        productos[producto]
            .tallas[talla]
            .costo = costo;
    }


    const costoConocido =
        costo > 0;


    const utilidad =
        costoConocido
            ? precio - costo
            : 0;


    // ==========================================
    // ESTADÍSTICAS PRODUCTO/CANAL
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

    const ahora =
        new Date();


    const fecha =
        ahora.toLocaleDateString(
            "es-CO"
        );


    const hora =
        ahora.toLocaleTimeString(
            "es-CO",
            {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit"
            }
        );


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


    // ==========================================
    // GUARDAR
    // ==========================================

    guardarJSON(
        archivoProductos,
        productos
    );


    guardarJSON(
        archivoInventario,
        inventario
    );


    // ==========================================
    // RESULTADO
    // ==========================================

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

        stock:
            inventario[producto][talla]
    };
}


// ==========================================
// COMPLETAR COSTO
// ==========================================

function completarCosto(
    idVenta,
    producto,
    talla,
    costoIngresado
) {

    inicializar();


    const costo =
        normalizarDinero(
            costoIngresado
        );


    if (
        costo === null ||
        costo <= 0
    ) {

        return {

            ok: false,

            mensaje:
                "El costo debe ser mayor que 0."
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


    if (
        !productos[producto]
            .tallas[talla]
    ) {

        productos[producto]
            .tallas[talla] = {

                costo: 0
            };
    }


    // ==========================================
    // GUARDAR COSTO
    // ==========================================

    productos[producto]
        .tallas[talla]
        .costo = costo;


    guardarJSON(
        archivoProductos,
        productos
    );


    // ==========================================
    // ACTUALIZAR VENTA
    // ==========================================

    const contenido =
        fs.readFileSync(
            archivoVentas,
            "utf8"
        );


    const lineas =
        contenido.split("\n");


    let ventaEncontrada =
        false;

    let resultado =
        null;


    for (
        let i = 1;
        i < lineas.length;
        i++
    ) {

        if (!lineas[i].trim()) {
            continue;
        }


        const columnas =
            lineas[i].split(",");


        if (
            columnas[0] !==
            String(idVenta)
        ) {

            continue;
        }


        let precio =
            Number(
                columnas[6]
            ) || 0;


        // Compatibilidad con venta antigua
        if (precio >= 1000) {

            precio =
                precio / 1000;

            columnas[6] =
                precio;
        }


        const utilidad =
            precio - costo;


        columnas[7] =
            costo;

        columnas[8] =
            utilidad;


        lineas[i] =
            columnas.join(",");


        ventaEncontrada =
            true;


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

        precio:
            resultado?.precio || 0,

        utilidad:
            resultado?.utilidad || 0
    };
}


function entradaInventario(texto) {

    inicializar();

    const partes =
        texto
            .trim()
            .split(/\s+/);

    if (partes.length < 3) {
        return {
            ok: false,
            mensaje:
                "Formato: ENTRADA PARIST38 20\n" +
                "O: ENTRADA AF1B 1/33 2/34\n" +
                "O: ENTRADA AF1B 33 34 34 40"
        };
    }

    let producto;
    let entradas = [];

    // ==========================================
    // FORMA 1
    // ENTRADA AF1BT40 5
    // ==========================================

    if (partes.length === 3) {

        const datosProducto =
            interpretarProducto(partes[1]);

        const cantidad =
            Number(partes[2]);

        if (
            datosProducto &&
            Number.isInteger(cantidad) &&
            cantidad > 0
        ) {

            producto =
                datosProducto.producto;

            const talla =
                datosProducto.talla;

            entradas.push({
                talla,
                cantidad
            });
        }
    }

    // ==========================================
    // FORMAS MASIVAS
    //
    // ENTRADA AF1B 1/33 2/34 3/40
    //
    // ENTRADA AF1B 33 34 34 40 40
    // ==========================================

    if (entradas.length === 0) {

        producto =
            String(partes[1])
                .trim()
                .toUpperCase();

        const datos =
            partes.slice(2);

        if (!producto || datos.length === 0) {
            return {
                ok: false,
                mensaje:
                    "Formato inválido."
            };
        }

        const cantidades = {};

        for (const dato of datos) {

            // ==========================================
            // FORMATO CANTIDAD/TALLA
            // Ejemplo: 2/40
            // ==========================================

            if (/^\d+\/\d+$/.test(dato)) {

                const [cantidadTexto, talla] =
                    dato.split("/");

                const cantidad =
                    Number(cantidadTexto);

                if (
                    !Number.isInteger(cantidad) ||
                    cantidad <= 0
                ) {
                    return {
                        ok: false,
                        mensaje:
                            `Cantidad inválida: ${dato}`
                    };
                }

                if (!cantidades[talla]) {
                    cantidades[talla] = 0;
                }

                cantidades[talla] += cantidad;

                continue;
            }

            // ==========================================
            // FORMATO TALLA REPETIDA
            // Ejemplo:
            // 40 44 44 43 40
            // ==========================================

            if (/^\d+$/.test(dato)) {

                const talla = dato;

                if (!cantidades[talla]) {
                    cantidades[talla] = 0;
                }

                cantidades[talla] += 1;

                continue;
            }

            return {
                ok: false,
                mensaje:
                    `Dato inválido: ${dato}`
            };
        }

        entradas =
            Object.keys(cantidades)
                .map(talla => ({
                    talla,
                    cantidad: cantidades[talla]
                }));
    }

    if (
        !producto ||
        entradas.length === 0
    ) {
        return {
            ok: false,
            mensaje:
                "Formato inválido."
        };
    }

    const productos =
        cargarJSON(archivoProductos);

    const inventario =
        cargarJSON(archivoInventario);

    // ==========================================
    // CREAR PRODUCTO
    // ==========================================

    if (!productos[producto]) {

        productos[producto] = {

            nombre: producto,

            tallas: {},

            canales: {}
        };
    }

    // ==========================================
    // CREAR PRODUCTO EN INVENTARIO
    // ==========================================

    if (!inventario[producto]) {
        inventario[producto] = {};
    }

    // ==========================================
    // AGREGAR TODAS LAS TALLAS
    // ==========================================

    for (const entrada of entradas) {

        const talla =
            entrada.talla;

        const cantidad =
            entrada.cantidad;

        if (
            !productos[producto]
                .tallas[talla]
        ) {

            productos[producto]
                .tallas[talla] = {

                    costo: 0
                };
        }

        if (
            inventario[producto][talla] === undefined
        ) {

            inventario[producto][talla] = 0;
        }

        inventario[producto][talla] +=
            cantidad;
    }

    // ==========================================
    // GUARDAR
    // ==========================================

    guardarJSON(
        archivoProductos,
        productos
    );

    guardarJSON(
        archivoInventario,
        inventario
    );

    // ==========================================
    // RESULTADO
    // ==========================================

    return {

        ok: true,

        producto,

        entradas,

        total:
            entradas.reduce(
                (suma, entrada) =>
                    suma + entrada.cantidad,
                0
            )
    };
}

// ==========================================
// SALIDA MANUAL DE INVENTARIO
// ==========================================

function salidaInventario(texto) {

    inicializar();

    const partes =
        String(texto)
            .trim()
            .split(/\s+/);

    if (partes.length < 3) {
        return {
            ok: false,
            mensaje:
                "Formato: SALIDA PARIST38 2\n" +
                "O: SALIDA AF1B 1/33 2/34\n" +
                "O: SALIDA AF1B 33 34 34 40"
        };
    }

    let producto;
    let entradas = [];

    // ==========================================
    // FORMA 1
    // SALIDA AF1BT40 2
    // ==========================================

    if (partes.length === 3) {

        const datosProducto =
            interpretarProducto(partes[1]);

        const cantidad =
            Number(partes[2]);

        if (
            datosProducto &&
            Number.isInteger(cantidad) &&
            cantidad > 0
        ) {

            producto =
                datosProducto.producto;

            const talla =
                datosProducto.talla;

            entradas.push({
                talla,
                cantidad
            });
        }
    }

    // ==========================================
    // FORMAS MASIVAS
    // ==========================================

    if (entradas.length === 0) {

        producto =
            String(partes[1])
                .trim()
                .toUpperCase();

        const datos =
            partes.slice(2);

        if (!producto || datos.length === 0) {
            return {
                ok: false,
                mensaje: "Formato inválido."
            };
        }

        const cantidades = {};

        for (const dato of datos) {

            // FORMATO 2/40
            if (/^\d+\/\d+$/.test(dato)) {

                const [cantidadTexto, talla] =
                    dato.split("/");

                const cantidad =
                    Number(cantidadTexto);

                if (
                    !Number.isInteger(cantidad) ||
                    cantidad <= 0
                ) {
                    return {
                        ok: false,
                        mensaje:
                            `Cantidad inválida: ${dato}`
                    };
                }

                if (!cantidades[talla]) {
                    cantidades[talla] = 0;
                }

                cantidades[talla] += cantidad;

                continue;
            }

            // FORMATO 40 44 44 40
            if (/^\d+$/.test(dato)) {

                const talla = dato;

                if (!cantidades[talla]) {
                    cantidades[talla] = 0;
                }

                cantidades[talla] += 1;

                continue;
            }

            return {
                ok: false,
                mensaje:
                    `Dato inválido: ${dato}`
            };
        }

        entradas =
            Object.keys(cantidades)
                .map(talla => ({
                    talla,
                    cantidad: cantidades[talla]
                }));
    }

    if (
        !producto ||
        entradas.length === 0
    ) {
        return {
            ok: false,
            mensaje: "Formato inválido."
        };
    }

    const inventario =
        cargarJSON(archivoInventario);

    if (!inventario[producto]) {
        inventario[producto] = {};
    }

    // ==========================================
    // RESTAR TODAS LAS TALLAS
    // ==========================================

    for (const entrada of entradas) {

        const talla =
            entrada.talla;

        const cantidad =
            entrada.cantidad;

        if (
            inventario[producto][talla] === undefined
        ) {
            inventario[producto][talla] = 0;
        }

        inventario[producto][talla] -=
            cantidad;
    }

    guardarJSON(
        archivoInventario,
        inventario
    );

    // ==========================================
    // RESULTADO
    // ==========================================

    return {

        ok: true,

        producto,

        entradas,

        total:
            entradas.reduce(
                (suma, entrada) =>
                    suma + entrada.cantidad,
                0
            )
    };
}
// ==========================================
// CONSULTAR STOCK
// ==========================================

function obtenerStock(texto) {

    inicializar();


    const partes =
        texto
            .trim()
            .split(/\s+/);


    if (partes.length !== 2) {

        return {

            ok: false,

            mensaje:
                "Formato: STOCK PARIST38"
        };
    }


    const datosProducto =
        interpretarProducto(
            partes[1]
        );


    if (!datosProducto) {

        return {

            ok: false,

            mensaje:
                "Formato: STOCK PARIST38"
        };
    }


    const inventario =
        cargarJSON(
            archivoInventario
        );


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


// ==========================================
// EXPORTAR
// ==========================================

function obtenerInventarioCompleto() {

    inicializar();

    const inventario =
        cargarJSON(archivoInventario);

    const ventasPorProducto = {};

    if (fs.existsSync(archivoVentas)) {

        const contenido =
            fs.readFileSync(
                archivoVentas,
                "utf8"
            );

        const lineas =
            contenido.split("\n");

        for (let i = 1; i < lineas.length; i++) {

            if (!lineas[i].trim()) {
                continue;
            }

            const columnas =
                lineas[i].split(",");

            const producto =
                columnas[3];

            const estado =
                columnas[9];

            if (!producto) {
                continue;
            }

            if (
                estado &&
                estado.toUpperCase() !== "VENDIDO"
            ) {
                continue;
            }

            ventasPorProducto[producto] =
                (ventasPorProducto[producto] || 0) + 1;
        }
    }

    const productos =
        Object.keys(inventario)
            .filter(producto => {

                return Object.keys(
                    inventario[producto] || {}
                ).some(talla => {

    return inventario[producto][talla] !== undefined;
});
            })
            .sort((a, b) => {

                const ventasA =
                    ventasPorProducto[a] || 0;

                const ventasB =
                    ventasPorProducto[b] || 0;

                if (ventasB !== ventasA) {
                    return ventasB - ventasA;
                }

                return a.localeCompare(b);
            });

    const resultado = [];

    for (const producto of productos) {

        const tallas =
            Object.keys(
                inventario[producto]
            )
            .filter(talla => {

    return inventario[producto][talla] !== undefined;
})
            .sort((a, b) => {

                return Number(a) - Number(b);
            });

        if (tallas.length === 0) {
            continue;
        }

        resultado.push({
            nombre: producto,
            tallas,
            stock: inventario[producto]
        });
    }

    return {
        ok: true,
        productos: resultado
    };
}

// ==========================================
// VENTAS DE HOY PARA ELIMINAR
// ==========================================

function obtenerVentasHoyParaEliminar() {

    inicializar();

    if (!fs.existsSync(archivoVentas)) {
        return [];
    }

    const contenido =
        fs.readFileSync(
            archivoVentas,
            "utf8"
        );

    const lineas =
        contenido.split("\n");

    const hoy =
        new Date().toLocaleDateString("es-CO");

    const ventasHoy = [];

    for (let i = 1; i < lineas.length; i++) {

        if (!lineas[i].trim()) {
            continue;
        }

        const columnas =
            lineas[i].split(",");

        const id = columnas[0];
        const fecha = columnas[1];
        const producto = columnas[3];
        const talla = columnas[4];
        const canal = columnas[5];
        const precio = Number(columnas[6]) || 0;
        const estado = columnas[9];

        if (fecha !== hoy) {
            continue;
        }

        if (
            estado &&
            estado.toUpperCase() !== "VENDIDO"
        ) {
            continue;
        }

        ventasHoy.push({
            id,
            fecha,
            producto,
            talla,
            canal,
            precio
        });
    }

    return ventasHoy;
}


// ==========================================
// ELIMINAR VENTA
// ==========================================

function eliminarVenta(idVenta) {

    inicializar();

    if (!fs.existsSync(archivoVentas)) {
        return {
            ok: false,
            mensaje: "No existe el archivo de ventas."
        };
    }

    const contenido =
        fs.readFileSync(
            archivoVentas,
            "utf8"
        );

    const lineas =
        contenido.split("\n");

    let ventaEncontrada = null;
    let indiceVenta = -1;

    for (let i = 1; i < lineas.length; i++) {

        if (!lineas[i].trim()) {
            continue;
        }

        const columnas =
            lineas[i].split(",");

        if (
            columnas[0] ===
            String(idVenta)
        ) {

            ventaEncontrada = {
                id: columnas[0],
                fecha: columnas[1],
                producto: columnas[3],
                talla: columnas[4],
                canal: columnas[5],
                precio: Number(columnas[6]) || 0,
                costo: Number(columnas[7]) || 0,
                utilidad: Number(columnas[8]) || 0,
                estado: columnas[9]
            };

            indiceVenta = i;

            break;
        }
    }

    if (!ventaEncontrada) {

        return {
            ok: false,
            mensaje: "Venta no encontrada."
        };
    }

    if (
        ventaEncontrada.estado &&
        ventaEncontrada.estado.toUpperCase() !== "VENDIDO"
    ) {

        return {
            ok: false,
            mensaje: "Esa venta ya no está activa."
        };
    }


    // ==========================================
    // RESTAURAR INVENTARIO
    // ==========================================

    const inventario =
        cargarJSON(archivoInventario);

    if (!inventario[ventaEncontrada.producto]) {
        inventario[ventaEncontrada.producto] = {};
    }

    if (
        inventario[
            ventaEncontrada.producto
        ][ventaEncontrada.talla] === undefined
    ) {

        inventario[
            ventaEncontrada.producto
        ][ventaEncontrada.talla] = 0;
    }

    inventario[
        ventaEncontrada.producto
    ][ventaEncontrada.talla] += 1;


    // ==========================================
    // CORREGIR ESTADÍSTICAS DEL PRODUCTO/CANAL
    // ==========================================

    const productos =
        cargarJSON(archivoProductos);

    const producto =
        ventaEncontrada.producto;

    const canal =
        ventaEncontrada.canal;

    if (
        productos[producto] &&
        productos[producto].canales &&
        productos[producto].canales[canal]
    ) {

        productos[producto]
            .canales[canal]
            .ventas = Math.max(
                0,
                Number(
                    productos[producto]
                        .canales[canal]
                        .ventas
                ) - 1
            );

        productos[producto]
            .canales[canal]
            .ingresos = Number(
                productos[producto]
                    .canales[canal]
                    .ingresos
            ) - ventaEncontrada.precio;
    }


    // ==========================================
    // ELIMINAR DEL CSV
    // ==========================================

    lineas.splice(indiceVenta, 1);

    fs.writeFileSync(
        archivoVentas,
        lineas.join("\n"),
        "utf8"
    );


    // ==========================================
    // GUARDAR CAMBIOS
    // ==========================================

    guardarJSON(
        archivoInventario,
        inventario
    );

    guardarJSON(
        archivoProductos,
        productos
    );


    return {
        ok: true,
        id: ventaEncontrada.id,
        producto: ventaEncontrada.producto,
        talla: ventaEncontrada.talla,
        canal: ventaEncontrada.canal,
        precio: ventaEncontrada.precio,
        stock:
            inventario[
                ventaEncontrada.producto
            ][ventaEncontrada.talla]
    };
}
 

module.exports = {
    inicializar,
    registrarVenta,
    completarCosto,
    entradaInventario,
    salidaInventario,
    obtenerStock,
    obtenerInventarioCompleto,
    obtenerVentasHoyParaEliminar,
    eliminarVenta
};


inicializar();