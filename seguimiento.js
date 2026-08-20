const fs = require("fs");
const path = require("path");
const { obtener } = require("./estado");

const archivo = path.join(__dirname, "seguimientos.json");

if (!fs.existsSync(archivo)) {
    fs.writeFileSync(
        archivo,
        JSON.stringify({}, null, 4)
    );
}

const timers = new Map();
const timers24h = new Map();

function cargar() {

    return JSON.parse(
        fs.readFileSync(
            archivo,
            "utf8"
        )
    );

}

function guardar(datos) {

    fs.writeFileSync(
        archivo,
        JSON.stringify(
            datos,
            null,
            4
        )
    );

}

function cancelarSeguimiento(usuario) {
	
	if (timers24h.has(usuario)) {

    clearTimeout(
        timers24h.get(usuario)
    );

    timers24h.delete(usuario);

}

    if (timers.has(usuario)) {

        clearTimeout(
            timers.get(usuario)
        );

        timers.delete(usuario);

    }

    const datos = cargar();

    if (datos[usuario]) {

        delete datos[usuario];

        guardar(datos);

    }

}

function cancelarSiEsDireccion(usuario, texto) {

    if (!texto) return;

    const direccion =
        /\b(calle|cl|carrera|cra|kr|kra|transversal|tv|diagonal|dg|barrio|casa|apto|apartamento|manzana|mz)\b|#\s*\d+/i.test(texto);

    if (direccion) {
        cancelarSeguimiento(usuario);
    }

}

function programarSeguimiento(
    sock,
    usuario
) {

    cancelarSeguimiento(usuario);

    const estado =
        obtener(usuario);

    if (!estado) return;

    const datos = cargar();

    datos[usuario] = {

        producto:
            estado.producto || "",

        creado: Date.now(),

        enviar:
            Date.now() +
            (40 * 60 * 1000),

        fase: 1

    };

    guardar(datos);

    const timer = setTimeout(

        async () => {

            const actuales =
                cargar();

            if (
                !actuales[usuario]
            ) return;
			
			const seguimiento = actuales[usuario];

if (!seguimiento) return;

let mensaje =
    "👋 Hola. Quería saber si todavía estás interesado. Si tienes alguna duda o deseas hacer el pedido, con gusto te ayudo.";

switch (seguimiento.producto) {

    case "af1b":
        mensaje =
            "👟 Hola. Quería saber si todavía te interesan las Air Force 1. Si tienes alguna duda o deseas hacer el pedido, aquí estoy.";
        break;

    case "af1bi":
        mensaje =
            "👟 Hola. ¿Sigues interesado en las Air Force 1 importadas? Si deseas hacer el pedido, con gusto te ayudo.";
        break;

    case "pro4":
        mensaje =
            "🎧 Hola. ¿Todavía te interesan los AirPods Pro? Si tienes alguna duda, escríbeme.";
        break;

    case "carg67w":
        mensaje =
            "⚡ Hola. ¿Sigues interesado en el cargador de 67W? Si deseas hacer el pedido, aquí estoy.";
        break;

    case "carg120w":
        mensaje =
            "⚡ Hola. ¿Todavía te interesa el cargador de 120W? Si deseas hacer el pedido, con gusto te ayudo.";
        break;
		
		default:

    mensaje =
        "👋 Hola. Quería saber si todavía estás interesado. Si tienes alguna duda o deseas hacer el pedido, aquí estoy.";

    break;

}

try {

    await sock.sendMessage(usuario, {
        text: mensaje
    });

} catch (e) {

    console.log(
        "Error enviando seguimiento:",
        usuario
    );

} finally {

    timers.delete(usuario);

}

    },

    40 * 60 * 1000

);

timers.set(usuario, timer);

const timer24h = setTimeout(

    async () => {

        const actuales = cargar();

        if (!actuales[usuario]) return;

        try {

            await sock.sendMessage(usuario, {
                text:
                    "😊 Hola. Estoy organizando los envíos de hoy y todavía tengo disponible el producto que me preguntaste ayer. 🚚\n\nSi aún lo deseas, puedo enviártelo hoy mismo.\n\n¿Te lo separo?"
            });

        } catch (e) {

            console.log(
                "Error enviando seguimiento 24h:",
                usuario
            );

        } finally {

    delete actuales[usuario];

    guardar(actuales);

    timers.delete(usuario);
    timers24h.delete(usuario);

}

    },

    24 * 60 * 60 * 1000

);
timers24h.set(usuario, timer24h);

}

module.exports = {
    programarSeguimiento,
    cancelarSeguimiento,
    cancelarSiEsDireccion
};