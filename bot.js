const qrcode = require("qrcode-terminal");
const fs = require("fs");
const path = require("path");
const envioFotos = require("./respuestas/enviofotos");
const iniciarInteligencia = require("./inteligencia");

const NUMEROS_IGNORADOS = [
    "573233898981"
];
let sara = null;

try {

    sara = require("./sara/sara.js");

} catch (error) {

    console.error("❌ Sara no pudo cargarse:", error);

}

const {
    guardarContacto
} = require("./contactos");

const {
    revisarPedido
} = require("./pedido");

const {
    programarSeguimiento,
    cancelarSeguimiento,
    cancelarSiEsDireccion
} = require("./seguimiento");

const {
    default: makeWASocket,
    DisconnectReason,
    fetchLatestBaileysVersion,
    useMultiFileAuthState
} = require("@whiskeysockets/baileys");

const {
    registrarPersona
} = require("./estadisticas/hoy");

const P = require("pino");

const responder = require("./respuestas");

const comandos = require("./comandos");

const {
    registrarRespuesta
} = require("./estadisticas/ab");

const {
    LIMITE_RESPUESTA,
    LIMITE_MENSAJE,
    ESPERA_MIN,
    ESPERA_MAX
} = require("./config");

const ultimaRespuesta = new Map();
const ultimaRespuestaTexto = new Map();
const mensajesProcesados = new Set();

let conectado = false;
let reconectando = false;

setInterval(() => {

    const ahora = Date.now();

    for (const [usuario, tiempo] of ultimaRespuesta) {

        if (
            ahora - tiempo >
            24 * 60 * 60 * 1000
        ) {

            ultimaRespuesta.delete(usuario);

        }

    }

}, 60 * 60 * 1000);

module.exports = async function iniciarBot() {
	

    const { state, saveCreds } =
        await useMultiFileAuthState("./sesion");

    const { version } =
        await fetchLatestBaileysVersion();

    const sock = makeWASocket({

        version,

        auth: state,

        logger: P({
            level: "silent"
        }),

        browser: [
            "Kyro Bot",
            "Chrome",
            "1.0.0"
        ]

    });

    sock.ev.on(
        "creds.update",
        saveCreds
    );

 sock.ev.on(
    "connection.update",
    ({ connection, lastDisconnect, qr }) => {

        if (qr) {

            console.log("Escanea este QR:\n");

            qrcode.generate(qr, {
                small: true
            });

        }

if (connection === "open") {

    conectado = true;
    reconectando = false;

    console.log("==================================");
    console.log("BOT CONECTADO");
    console.log("==================================");

     
iniciarInteligencia(sock);

// try {

//     const iniciarMensajesSara = require("./sara/estadoautomatico");

//     iniciarMensajesSara(sock);

// } catch (error) {

//     console.error("❌ No se pudo iniciar Sara Automática:", error);

// }

}

if (connection === "close") {

    conectado = false;

    const codigo =
        lastDisconnect?.error?.output?.statusCode;

    if (
        codigo !== DisconnectReason.loggedOut &&
        !reconectando
    ) {

        reconectando = true;

        console.log("Reconectando...");

        setTimeout(() => {

            iniciarBot();

        }, 3000);

    }

}

    }
);

sock.ev.on(
    "messages.upsert",
    async ({ messages, type }) => {

        if (type !== "notify") return;

        for (const msg of messages) {

            try {

                if (!msg.message) continue;
				
				if (!conectado) continue;

                if (msg.key.fromMe) continue;

const usuario = msg.key.remoteJid;

if (!usuario) continue;

// Ignorar números específicos
const numero = usuario.replace("@s.whatsapp.net", "");

if (NUMEROS_IGNORADOS.includes(numero)) {
    console.log("🚫 Número ignorado:", numero);
    continue;
}

// Ignorar grupos
if (usuario.endsWith("@g.us")) continue;

// Ignorar canales/newsletters
if (usuario.endsWith("@newsletter")) continue;

// Ignorar estados
if (usuario === "status@broadcast") continue;

registrarPersona(usuario);

guardarContacto(
    usuario,
    msg.pushName || "Sin nombre"
);

                // Obtener texto
                let texto = "";

                if (msg.message.conversation) {

                    texto =
                        msg.message.conversation;

                }

                else if (
                    msg.message.extendedTextMessage?.text
                ) {

                    texto =
                        msg.message.extendedTextMessage.text;

                }

                else {

                    continue;

                }

texto = texto.trim();
cancelarSiEsDireccion(usuario, texto);
	
	const fuePedido = await revisarPedido(
    sock,
    msg,
    texto
);

if (fuePedido) {
    continue;
}

                if (!texto) continue;
				
				// Ignorar mensajes viejos
const timestamp = Number(msg.messageTimestamp);

const ahora = Math.floor(Date.now() / 1000);

if (
    timestamp &&
    (ahora - timestamp) > LIMITE_MENSAJE
) continue;

const tiempoActual = Date.now();

if (ultimaRespuesta.has(usuario)) {

    const ultima = ultimaRespuesta.get(usuario);

    if (
        tiempoActual - ultima <
        LIMITE_RESPUESTA
    ) {

        console.log(
            "Respuesta omitida:",
            usuario
        );

        continue;

    }

}

                console.log("--------------------------------");
                console.log("Usuario:", usuario);
                console.log("Mensaje:", texto);
                console.log("--------------------------------");
await registrarRespuesta(sock, usuario);

// Primero revisar comandos del negocio
const ejecutado = await comandos(
    texto,
    usuario,
    sock
);

if (ejecutado) continue;

// Luego revisar respuestas del negocio
const respuesta = responder(
    texto,
    usuario
);

if (respuesta) {

    // Si es una respuesta del negocio,
    // continuar con el código que ya tienes más abajo.
} else {

    // Si el negocio no respondió,
    // intentar con Sara.
    let atendidoPorSara = false;

    try {

        let atendidoPorSara = false;

if (sara) {

    try {

        atendidoPorSara = await sara(sock, msg, texto);

    } catch (error) {

        console.error("❌ Error en Sara:", error);

    }

}

if (atendidoPorSara) continue;

    } catch (error) {

        console.error("❌ Error en Sara:", error);

    }

    if (atendidoPorSara) continue;

    continue;

}

if (
    typeof respuesta === "object" &&
    respuesta.foto === true
) {

    const ruta = path.join(
        __dirname,
        "img",
        respuesta.producto,
        "1.jpeg"
    );

    if (fs.existsSync(ruta)) {

        await sock.sendMessage(usuario, {
            image: fs.readFileSync(ruta),
            caption: respuesta.texto
        });

    } else {

        await sock.sendMessage(usuario, {
            text: respuesta.texto
        });

    }

    ultimaRespuestaTexto.set(usuario, {
        texto: respuesta.texto,
        fecha: Date.now()
    });

    programarSeguimiento(
        sock,
        usuario
    );

    ultimaRespuesta.set(
        usuario,
        Date.now()
    );

    console.log("Respuesta enviada.");

    continue;
}


if (respuesta.startsWith("IMG_")) {

    const producto = respuesta.replace("IMG_", "");

    const carpeta = path.join(
        __dirname,
        "img",
        producto
    );

    if (!fs.existsSync(carpeta)) continue;

    const archivos = fs
    .readdirSync(carpeta)
    .filter(archivo =>
        /\.(jpg|jpeg|png|webp)$/i.test(archivo)
    )
    .sort();
	
	await sock.sendMessage(usuario, {
    text: envioFotos(usuario)
});

    for (const archivo of archivos) {

        await sock.sendMessage(
            usuario,
            {
                image: fs.readFileSync(
                    path.join(carpeta, archivo)
                )
            }
        );

    }

    continue;

}
				
const espera =
    ESPERA_MIN +
    Math.floor(
        Math.random() *
        (ESPERA_MAX - ESPERA_MIN + 1)
    );

await new Promise(resolve =>
    setTimeout(resolve, espera)
);

const ultima = ultimaRespuestaTexto.get(usuario);

if (
    ultima &&
    ultima.texto === respuesta &&
    Date.now() - ultima.fecha < 10000
) {

    console.log("🔁 Mensaje duplicado evitado.");

} else {

    await sock.sendMessage(usuario, {
        text: respuesta
    });

    ultimaRespuestaTexto.set(usuario, {
        texto: respuesta,
        fecha: Date.now()
    });

}

// Programar seguimiento si no responde
programarSeguimiento(
    sock,
    usuario
);

ultimaRespuesta.set(
    usuario,
    Date.now()
);

console.log("Respuesta enviada.");

            }

            catch (e) {

                console.log(e);

            }

        }

    }

);

}