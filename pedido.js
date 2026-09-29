const { obtener, guardar } = require("./estado");

const {
    cancelarSeguimiento
} = require("./seguimiento");

const {
    registrarDireccionAB
} = require("./estadisticas/ab");

const fs = require("fs");
const path = require("path");

const archivoDirecciones =
    path.join(
        __dirname,
        "estadisticas",
        "direccionesHoy.json"
    );

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

const PALABRAS_DIRECCION = [

    "calle",
    "cl ",
    "cra",
    "carrera",
    "kr",
    "kra",
    "transversal",
    "diagonal",
    "manzana",
    "apartamento",
    "apto",
];

const PRODUCTOS = {

    af1b: "Air Force 1 Blanca",
    af1bi: "Air Force 1 Blanca Importada",
    carg67w: "Cargador Turbo 67W",
    carg120w: "Cargador Turbo 120W",
    pro4: "AirPods Pro 4",
    paris: "Paris",
    sara: "Sara"

};

function pareceDireccion(texto) {

    texto = texto.toLowerCase();

    return PALABRAS_DIRECCION.some(p =>
        texto.includes(p)
    );

}

async function revisarPedido(


    sock,
    msg,
    texto

) {

    if (!pareceDireccion(texto))
        return false;


const usuario =
    msg.key.remoteJid;

const estado = obtener(usuario) || {};

const nombre =
    msg.pushName || "Sin nombre";

const producto =
    estado.nombreProducto ||
    PRODUCTOS[estado.producto] ||
    "No especificado";

const talla = estado.talla || "";

let mensaje = `${texto}, ${producto}${talla ? ` • ${talla}` : ""}, $`;

    try {

const destinatarios = [
    "573183676163@s.whatsapp.net" // Tu número // Número de la trabajadora
];

for (const numero of destinatarios) {

    await sock.sendMessage(numero, {
        text: mensaje
    });

}

registrarDireccionAB(usuario);
sumarDireccionHoy();

guardar(usuario, {

    direccion: texto,

    fechaPedido: Date.now()

});
		
		cancelarSeguimiento(usuario);

console.log(
    "✅ Pedido detectado:",
    nombre
);

        return true;

    }

    catch (e) {

        console.log(
            "Error enviando pedido:",
            e
        );

        return false;

    }

}

module.exports = {
    revisarPedido
};