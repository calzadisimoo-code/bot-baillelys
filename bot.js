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

    // sara = require("./sara/sara.js");

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
    useMultiFileAuthState,
    downloadMediaMessage
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

 try {

     const iniciarMensajesSara = require("./sara/estadoautomatico");

     iniciarMensajesSara(sock);

 } catch (error) {

     console.error("❌ No se pudo iniciar Sara Automática:", error);

 }

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


else if (
    msg.message.imageMessage?.caption
) {

    texto =
        msg.message.imageMessage.caption;

}

else if (
    msg.message.imageMessage?.caption
) {

    texto =
        msg.message.imageMessage.caption;

}

                else {

                    continue;

                }

texto = texto.trim();

// ======================================================
// COMANDO: #addwebcatalogo
// ======================================================
if (texto.toLowerCase().startsWith("#addwebcatalogo")) {
    try {
        const lineas = texto
            .split("\n")
            .map(l => l.trim())
            .filter(Boolean);

        if (!msg.message.imageMessage) {
            await sock.sendMessage(usuario, {
                text: "⚠️ Para agregar un producto al catálogo debes enviar una FOTO con el siguiente formato:\n\n#addwebcatalogo\nNombre del producto\nPrecio"
            });
            continue;
        }

        if (lineas.length < 3) {
            await sock.sendMessage(usuario, {
                text: "⚠️ Formato incorrecto.\n\nDebes enviar:\n\n#addwebcatalogo\nNombre del producto\nPrecio"
            });
            continue;
        }

        const nombreProducto = lineas[1];
        const precioProducto = lineas[2];

        const precioNumero = precioProducto.replace(/[^\d]/g, "");

        if (!precioNumero) {
            await sock.sendMessage(usuario, {
                text: "⚠️ El precio no es válido."
            });
            continue;
        }

        const buffer = await downloadMediaMessage(
            msg,
            "buffer",
            {},
            {
                logger: console
            }
        );

        const carpetaImg = path.join(__dirname, "WEB CATALOGO", "img");

        if (!fs.existsSync(carpetaImg)) {
            fs.mkdirSync(carpetaImg, { recursive: true });
        }

        const nombreArchivo =
            nombreProducto
                .toLowerCase()
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "")
                .replace(/[^a-z0-9]+/g, "-")
                .replace(/^-|-$/g, "") +
            "-" +
            Date.now() +
            ".jpeg";

        const rutaImagen = path.join(carpetaImg, nombreArchivo);

        fs.writeFileSync(rutaImagen, buffer);

        const rutaIndex = path.join(__dirname, "WEB CATALOGO", "index.html");

        let html = fs.readFileSync(rutaIndex, "utf8");

        const nuevoProducto = `
<div class="product-card" id="${Date.now()}" data-category="todos">
    <h2>${nombreProducto}</h2>

    <div class="imgContainer">
        <img src="img/${nombreArchivo}" alt="${nombreProducto}">
    </div>

    <div class="product-info">
        <p class="price">$${Number(precioNumero).toLocaleString("es-CO")}</p>
        <button class="productsButton">AGREGAR A MI PEDIDO</button>
    </div>
</div>
`;

        const posicion = html.lastIndexOf("</main>");

        if (posicion === -1) {
            throw new Error("No se encontró </main> en index.html");
        }

        html =
            html.slice(0, posicion) +
            nuevoProducto +
            html.slice(posicion);

        fs.writeFileSync(rutaIndex, html, "utf8");

        // Copiar catálogo actualizado al directorio servido por Nginx
        const destinoWeb = "/var/www/catalogo";

        fs.copyFileSync(
            rutaIndex,
            path.join(destinoWeb, "index.html")
        );

        fs.copyFileSync(
            rutaImagen,
            path.join(destinoWeb, "img", nombreArchivo)
        );

        await sock.sendMessage(usuario, {
            text:
                "✅ PRODUCTO AGREGADO AL CATÁLOGO\n\n" +
                `👟 Producto: ${nombreProducto}\n` +
                `💰 Precio: $${Number(precioNumero).toLocaleString("es-CO")}\n` +
                `🖼️ Imagen: ${nombreArchivo}\n\n` +
                "🌐 El catálogo ya fue actualizado."
        });

        continue;

    } catch (error) {
        console.error("❌ Error en #addwebcatalogo:", error);

        await sock.sendMessage(usuario, {
            text: "❌ No pude agregar el producto al catálogo.\n\nRevisa los logs del bot."
        });

        continue;
    }
}

// AGREGAR PRODUCTO AL CATÁLOGO WEB
if (texto.toLowerCase().startsWith("#addwebbcatalogo")) {

    try {

        const lineas = texto
            .split("\n")
            .map(linea => linea.trim())
            .filter(Boolean);

        if (lineas.length < 3) {
            await sock.sendMessage(usuario, {
                text: "❌ Formato incorrecto.\n\nEnvía una foto con:\n#addwebbcatalogo\nNombre del producto\nPrecio"
            });
            continue;
        }

        const nombreProducto = lineas[1];
        const precioProducto = lineas[2];

        if (!msg.message.imageMessage) {
            await sock.sendMessage(usuario, {
                text: "❌ Debes enviar la foto junto con el comando."
            });
            continue;
        }

        const catalogo = path.join(__dirname, "WEB CATALOGO");
        const carpetaImagenes = path.join(catalogo, "img");
        const indexCatalogo = path.join(catalogo, "index.html");

        if (!fs.existsSync(carpetaImagenes)) {
            fs.mkdirSync(carpetaImagenes, { recursive: true });
        }

        let html = fs.readFileSync(indexCatalogo, "utf8");

        const ids = [...html.matchAll(/class="product-card" id="(\d+)"/g)]
            .map(match => parseInt(match[1], 10))
            .filter(Number.isFinite);

        const nuevoId = ids.length > 0 ? Math.max(...ids) + 1 : 1;

        const nombreImagen = nombreProducto
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-+|-+$/g, "");

        const extension =
            msg.message.imageMessage.mimetype?.includes("png")
                ? "png"
                : "jpg";

        const archivoImagen = `${nombreImagen}-${nuevoId}.${extension}`;

        const rutaImagen = path.join(
            carpetaImagenes,
            archivoImagen
        );

        const buffer = await downloadMediaMessage(
            msg,
            "buffer",
            {}
        );

        fs.writeFileSync(rutaImagen, buffer);

        const nuevoProducto = `

      <div class="product-card" id="${nuevoId}" data-categoria="1">
        <h2>${nombreProducto}</h2>
        <div class="imgContainer"><img src="img/${archivoImagen}" loading="lazy"></div>
        <p class="productCardDescription">Disponible</p>
        <div class="productCardEnd">
          <a class="precio">$${precioProducto}</a>
          <button class="productsButton" data-product-id="${nuevoId}">AGREGAR A MI PEDIDO</button>
        </div>
      </div>
`;

        html = html.replace(
            "</main>",
            nuevoProducto + "\n    </main>"
        );

        fs.writeFileSync(indexCatalogo, html, "utf8");

        const catalogoWeb = "/var/www/catalogo";

        fs.copyFileSync(
            indexCatalogo,
            path.join(catalogoWeb, "index.html")
        );

        fs.copyFileSync(
            rutaImagen,
            path.join(catalogoWeb, "img", archivoImagen)
        );

        await sock.sendMessage(usuario, {
            text:
                "✅ Producto agregado al catálogo.\n\n" +
                `📦 ${nombreProducto}\n` +
                `💰 $${precioProducto}\n` +
                `🆔 ID: ${nuevoId}`
        });

        console.log(
            `✅ Producto web agregado: ${nombreProducto} | ID ${nuevoId}`
        );

        continue;

    } catch (error) {

        console.error("❌ Error agregando producto al catálogo:", error);

        await sock.sendMessage(usuario, {
            text: "❌ No se pudo agregar el producto al catálogo. Revisa la consola del bot."
        });

        continue;
    }
}

// AGREGAR PRODUCTO AL CATÁLOGO WEB
if (texto.toLowerCase().startsWith("#addwebbcatalogo")) {

    try {

        const lineas = texto
            .split("\n")
            .map(linea => linea.trim())
            .filter(Boolean);

        if (lineas.length < 3) {
            await sock.sendMessage(usuario, {
                text: "❌ Formato incorrecto.\n\nEnvía una foto con:\n#addwebbcatalogo\nNombre del producto\nPrecio"
            });
            continue;
        }

        const nombreProducto = lineas[1];
        const precioProducto = lineas[2];

        // Verificar que realmente haya una foto
        if (!msg.message.imageMessage) {
            await sock.sendMessage(usuario, {
                text: "❌ Debes enviar la foto junto con el comando."
            });
            continue;
        }

        // Rutas del catálogo
        const catalogo = path.join(__dirname, "WEB CATALOGO");
        const carpetaImagenes = path.join(catalogo, "img");
        const indexCatalogo = path.join(catalogo, "index.html");

        // Crear carpeta de imágenes si no existe
        if (!fs.existsSync(carpetaImagenes)) {
            fs.mkdirSync(carpetaImagenes, { recursive: true });
        }

        // Leer index.html
        let html = fs.readFileSync(indexCatalogo, "utf8");

        // Buscar el siguiente ID disponible
        const ids = [...html.matchAll(/class="product-card" id="(\d+)"/g)]
            .map(match => parseInt(match[1], 10))
            .filter(Number.isFinite);

        const nuevoId = ids.length > 0 ? Math.max(...ids) + 1 : 1;

        // Nombre seguro para la imagen
        const nombreImagen = nombreProducto
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-+|-+$/g, "");

        const extension =
            msg.message.imageMessage.mimetype?.includes("png")
                ? "png"
                : "jpg";

        const archivoImagen = `${nombreImagen}-${nuevoId}.${extension}`;

        const rutaImagen = path.join(
            carpetaImagenes,
            archivoImagen
        );

        // Descargar la foto de WhatsApp
        const buffer = await downloadMediaMessage(
            msg,
            "buffer",
            {}
        );

        fs.writeFileSync(rutaImagen, buffer);

        // Crear el nuevo producto
        const nuevoProducto = `

      <div class="product-card" id="${nuevoId}" data-categoria="1">
        <h2>${nombreProducto}</h2>
        <div class="imgContainer"><img src="img/${archivoImagen}" loading="lazy"></div>
        <p class="productCardDescription">Disponible</p>
        <div class="productCardEnd">
          <a class="precio">$${precioProducto}</a>
          <button class="productsButton" data-product-id="${nuevoId}">AGREGAR A MI PEDIDO</button>
        </div>
      </div>
`;

        // Insertar antes de cerrar MAIN
        html = html.replace(
            "</main>",
            nuevoProducto + "\n    </main>"
        );

        // Guardar catálogo
        fs.writeFileSync(indexCatalogo, html, "utf8");

        // Actualizar inmediatamente la versión que sirve Nginx
        const catalogoWeb = "/var/www/catalogo";

        fs.copyFileSync(
            indexCatalogo,
            path.join(catalogoWeb, "index.html")
        );

        fs.copyFileSync(
            rutaImagen,
            path.join(catalogoWeb, "img", archivoImagen)
        );

        await sock.sendMessage(usuario, {
            text:
                "✅ Producto agregado al catálogo.\n\n" +
                `📦 ${nombreProducto}\n` +
                `💰 $${precioProducto}\n` +
                `🆔 ID: ${nuevoId}`
        });

        console.log(
            `✅ Producto web agregado: ${nombreProducto} | ID ${nuevoId}`
        );

        continue;

    } catch (error) {

        console.error("❌ Error agregando producto al catálogo:", error);

        await sock.sendMessage(usuario, {
            text: "❌ No se pudo agregar el producto al catálogo. Revisa la consola del bot."
        });

        continue;
    }
}
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
    Array.isArray(respuesta.mensajes)
) {

    for (const mensaje of respuesta.mensajes) {

        if (mensaje.foto) {

            const carpeta = path.join(
                __dirname,
                "img",
                mensaje.producto
            );

          let imagen = null;

if (fs.existsSync(carpeta)) {

    const archivos = fs
        .readdirSync(carpeta)
        .filter(a =>
            /\.(jpg|jpeg|png|webp)$/i.test(a)
        )
        .sort();

    if (archivos.length > 0) {

        const indice =
            (mensaje.imagen || 1) - 1;

        if (archivos[indice]) {

            imagen = path.join(
                carpeta,
                archivos[indice]
            );

        }

    }

}

            if (imagen) {

                await sock.sendMessage(usuario, {
                    image: fs.readFileSync(imagen),
                    caption: mensaje.texto || ""
                });

            }

        } else {

            await sock.sendMessage(usuario, {
                text: mensaje.texto
            });

        }

        await new Promise(resolve =>
            setTimeout(resolve, 1000)
        );

    }

    ultimaRespuesta.set(
        usuario,
        Date.now()
    );

    continue;
}

if (
    typeof respuesta === "object" &&
    respuesta.foto === true
) {

    const carpeta = path.join(
        __dirname,
        "img",
        respuesta.producto
    );

    let imagen = null;

    if (fs.existsSync(carpeta)) {

        const archivos = fs
            .readdirSync(carpeta)
            .filter(archivo =>
                /\.(jpg|jpeg|png|webp)$/i.test(archivo)
            );

        if (archivos.length > 0) {

            imagen = path.join(
                carpeta,
                archivos[0]
            );

        }

    }

    if (imagen) {

        await sock.sendMessage(usuario, {
            image: fs.readFileSync(imagen),
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