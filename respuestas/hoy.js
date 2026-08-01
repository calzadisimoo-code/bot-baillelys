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

    return new Date()
        .toISOString()
        .slice(0, 10);

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

    return `📊 ESTADÍSTICAS DE HOY

👤 Personas que escribieron: ${datos[hoy].personas.length}
📚 Preguntaron catálogo: ${datos[hoy].catalogo.length}
👟 Preguntaron producto: ${datos[hoy].productos.length}
📸 Pidieron fotos: ${datos[hoy].fotos.length}
📏 Enviaron talla: ${datos[hoy].tallas.length}
📍 Enviaron dirección: ${datos[hoy].direcciones.length}`;

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