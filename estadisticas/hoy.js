const fs = require("fs");
const path = require("path");

const archivo = path.join(__dirname, "hoy.json");

function cargar() {

    if (!fs.existsSync(archivo)) {

        fs.writeFileSync(
            archivo,
            JSON.stringify({}, null, 4)
        );

    }

    return JSON.parse(
        fs.readFileSync(archivo, "utf8")
    );

}

function guardar(datos) {

    fs.writeFileSync(
        archivo,
        JSON.stringify(datos, null, 4)
    );

}

function obtenerFecha() {

    const ahora = new Date();

    const colombia = new Date(
        ahora.toLocaleString("en-US", {
            timeZone: "America/Bogota"
        })
    );

    return colombia.toISOString().slice(0, 10);

}

function crearDia(datos) {

    const hoy = obtenerFecha();

    if (!datos[hoy]) {

        datos[hoy] = {

            personas: [],
            catalogo: [],
            productos: [],
            fotos: [],
            tallas: [],
            direcciones: []

        };

    }

    return hoy;

}

function registrar(campo, usuario) {

    const datos = cargar();

    const hoy = crearDia(datos);

    if (!datos[hoy][campo].includes(usuario)) {

        datos[hoy][campo].push(usuario);

        guardar(datos);

    }

}

function registrarPersona(usuario) {

    registrar("personas", usuario);

}

function registrarCatalogo(usuario) {

    registrar("catalogo", usuario);

}

function registrarProducto(usuario) {

    registrar("productos", usuario);

}

function registrarFotos(usuario) {

    registrar("fotos", usuario);

}

function registrarTalla(usuario) {

    registrar("tallas", usuario);

}

function registrarDireccion(usuario) {

    registrar("direcciones", usuario);

}

function reporteHoy() {

    const datos = cargar();

    const hoy = obtenerFecha();

    if (!datos[hoy]) {

        return "📊 Hoy todavía no hay estadísticas.";

    }

    const personas = datos[hoy].personas.length;
const catalogo = datos[hoy].catalogo.length;
const productos = datos[hoy].productos.length;
const fotos = datos[hoy].fotos.length;
const tallas = datos[hoy].tallas.length;
const direcciones = datos[hoy].direcciones.length;

const conversion =
    productos === 0
        ? 0
        : ((direcciones / productos) * 100).toFixed(1);

return `📊 ESTADÍSTICAS DE HOY

👤 Personas que escribieron: ${personas}
📚 Preguntaron catálogo: ${catalogo}
👟 Preguntaron producto: ${productos}
📸 Pidieron fotos: ${fotos}
📏 Enviaron talla: ${tallas}
📍 Enviaron dirección: ${direcciones}

📈 Conversión a pedido: ${conversion}%`;

}

module.exports = {

    registrarPersona,
    registrarCatalogo,
    registrarProducto,
    registrarFotos,
    registrarTalla,
    registrarDireccion,
    reporteHoy

};