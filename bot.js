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
// CATÁLOGO WEB - AGREGAR Y ELIMINAR PRODUCTOS
// ======================================================

// ======================================================
// COMANDO: #addwebcatalogo
// Formato:
// #addwebcatalogo
// Nombre del producto
// Precio
// + FOTO
// ======================================================
if (texto.toLowerCase().startsWith("#addwebcatalogo")) {
    try {

        const lineas = texto
            .split("\n")
            .map(l => l.trim())
            .filter(Boolean);

        if (!msg.message.imageMessage) {
            await sock.sendMessage(usuario, {
                text:
                    "⚠️ Debes enviar una FOTO con este formato:\n\n" +
                    "#addwebcatalogo\n" +
                    "Nombre del producto\n" +
                    "Precio"
            });
            continue;
        }

        if (lineas.length < 3) {
            await sock.sendMessage(usuario, {
                text:
                    "⚠️ Formato incorrecto.\n\n" +
                    "Debes enviar:\n\n" +
                    "#addwebcatalogo\n" +
                    "Nombre del producto\n" +
                    "Precio"
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

        // Si escribes 75 -> $75.000
        // Si escribes 79 -> $79.000
        // Si escribes 75000 -> $75.000
        const precioBase = Number(precioNumero);

        const precioFinal =
            precioBase < 1000
                ? precioBase * 1000
                : precioBase;

        const precioFormateado =
            precioFinal.toLocaleString("es-CO");

        // Descargar imagen
        const buffer = await downloadMediaMessage(
            msg,
            "buffer",
            {},
            {
                logger: console
            }
        );

        const catalogo = path.join(
            __dirname,
            "WEB CATALOGO"
        );

        const carpetaImagenes = path.join(
            catalogo,
            "img"
        );

        const rutaIndex = path.join(
            catalogo,
            "index.html"
        );

        if (!fs.existsSync(carpetaImagenes)) {
            fs.mkdirSync(carpetaImagenes, {
                recursive: true
            });
        }

        let html = fs.readFileSync(
            rutaIndex,
            "utf8"
        );

        // Obtener IDs existentes
        const idsExistentes = [
            ...html.matchAll(
                /class="product-card"[^>]*id="(\d+)"/gi
            )
        ]
            .map(m => Number(m[1]))
            .filter(n => Number.isInteger(n) && n > 0)
            .sort((a, b) => a - b);

        // Buscar el primer ID disponible.
        // Ejemplo: 1,2,3,5 -> nuevo ID = 4
        let nuevoId = 1;

        for (const id of idsExistentes) {
            if (id === nuevoId) {
                nuevoId++;
            } else if (id > nuevoId) {
                break;
            }
        }

        // Nombre seguro para la imagen
        const nombreImagen = nombreProducto
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-+|-+$/g, "");

        const archivoImagen =
            `${nombreImagen}-${nuevoId}-${Date.now()}.jpeg`;

        const rutaImagen = path.join(
            carpetaImagenes,
            archivoImagen
        );

        fs.writeFileSync(
            rutaImagen,
            buffer
        );

        // Crear producto con exactamente la estructura del catálogo
        const nuevoProducto = `
<div class="product-card" id="${nuevoId}" data-categoria="1">
    <h2>${nombreProducto}</h2>
    <div class="imgContainer"><img src="img/${archivoImagen}" loading="lazy"></div>
    <p class="productCardDescription"></p>
    <div class="productCardEnd">
        <a class="precio">$${precioFormateado}</a>
        <button class="productsButton" data-product-id="${nuevoId}">AGREGAR A MI PEDIDO</button>
    </div>
</div>
`;

        const posicion = html.lastIndexOf("</main>");

        if (posicion === -1) {
            throw new Error(
                "No se encontró </main> en index.html"
            );
        }

        html =
            html.slice(0, posicion) +
            nuevoProducto +
            html.slice(posicion);

        fs.writeFileSync(
            rutaIndex,
            html,
            "utf8"
        );

        // Actualizar catálogo público
        const destinoWeb = "/var/www/catalogo";

        fs.copyFileSync(
            rutaIndex,
            path.join(
                destinoWeb,
                "index.html"
            )
        );

        fs.copyFileSync(
            rutaImagen,
            path.join(
                destinoWeb,
                "img",
                archivoImagen
            )
        );

        await sock.sendMessage(usuario, {
            text:
                "✅ PRODUCTO AGREGADO AL CATÁLOGO\n\n" +
                `👟 Producto: ${nombreProducto}\n` +
                `💰 Precio: $${precioFormateado}\n` +
                `🔢 ID: ${nuevoId}\n\n` +
                "🌐 El catálogo ya fue actualizado."
        });

        continue;

    } catch (error) {

        console.error(
            "❌ Error en #addwebcatalogo:",
            error
        );

        await sock.sendMessage(usuario, {
            text:
                "❌ No pude agregar el producto al catálogo.\n\n" +
                "Revisa los logs del bot."
        });

        continue;
    }
}


// ======================================================
// COMANDO: #deletewebcatalogo
// ======================================================
if (texto.toLowerCase() === "#deletewebcatalogo") {
    try {

        const rutaIndex = path.join(
            __dirname,
            "WEB CATALOGO",
            "index.html"
        );

        const html = fs.readFileSync(
            rutaIndex,
            "utf8"
        );

        const inicio = html.indexOf(
            '<main id="product-container">'
        );

        const fin = html.indexOf(
            "</main>",
            inicio
        );

        if (inicio === -1 || fin === -1) {
            throw new Error(
                "No se encontró product-container."
            );
        }

        const contenido = html.substring(
            inicio + '<main id="product-container">'.length,
            fin
        );

        const productos =
            contenido.match(
                /<div class="product-card"[\s\S]*?(?=\s*<div class="product-card"|$)/gi
            ) || [];

        if (productos.length === 0) {
            await sock.sendMessage(usuario, {
                text:
                    "⚠️ No hay productos en el catálogo."
            });
            continue;
        }

        global.catalogoSeleccion =
            global.catalogoSeleccion || {};

        global.catalogoSeleccion[usuario] =
            productos.map((producto, indice) => {

                const idMatch =
                    producto.match(
                        /<div class="product-card"[^>]*id="([^"]+)"/i
                    );

                const nombreMatch =
                    producto.match(
                        /<h2>([\s\S]*?)<\/h2>/i
                    );

                const precioMatch =
                    producto.match(
                        /class="precio"[^>]*>\s*([^<]+)|class="price"[^>]*>\s*([^<]+)/i
                    );

                const imagenMatch =
                    producto.match(
                        /<img[^>]+src="([^"]+)"/i
                    );

                return {
                    indice,
                    idOriginal: idMatch
                        ? idMatch[1]
                        : null,
                    nombre: nombreMatch
                        ? nombreMatch[1].trim()
                        : "Sin nombre",
                    precio: precioMatch
                        ? (
                            precioMatch[1] ||
                            precioMatch[2] ||
                            ""
                        ).trim()
                        : "Sin precio",
                    imagen: imagenMatch
                        ? imagenMatch[1]
                            .replace(/^img\//i, "")
                        : null
                };
            });

        let mensaje =
            "🗑️ PRODUCTOS DEL CATÁLOGO\n\n";

        global.catalogoSeleccion[usuario]
            .forEach((producto, i) => {

                mensaje +=
                    `${i + 1}. ${producto.nombre}\n` +
                    `   💰 ${producto.precio}\n\n`;
            });

        mensaje +=
            "Responde solamente con el número del producto que deseas eliminar.";

        await sock.sendMessage(usuario, {
            text: mensaje
        });

        continue;

    } catch (error) {

        console.error(
            "❌ Error mostrando catálogo para eliminar:",
            error
        );

        await sock.sendMessage(usuario, {
            text:
                "❌ No pude cargar los productos del catálogo."
        });

        continue;
    }
}


// ======================================================
// SELECCIONAR PRODUCTO PARA ELIMINAR
// ======================================================
if (
    global.catalogoSeleccion &&
    global.catalogoSeleccion[usuario] &&
    /^\d+$/.test(texto)
) {
    try {

        const numero =
            Number(texto);

        const productos =
            global.catalogoSeleccion[usuario];

        const posicion =
            numero - 1;

        if (
            posicion < 0 ||
            posicion >= productos.length
        ) {
            await sock.sendMessage(usuario, {
                text:
                    "⚠️ Ese número no corresponde a ningún producto."
            });
            continue;
        }

        const producto =
            productos[posicion];

        global.catalogoEliminaciones =
            global.catalogoEliminaciones || {};

        global.catalogoEliminaciones[usuario] = {
            indice: posicion,
            idOriginal: producto.idOriginal,
            nombre: producto.nombre,
            precio: producto.precio,
            imagen: producto.imagen
        };

        await sock.sendMessage(usuario, {
            text:
                "⚠️ VAS A ELIMINAR ESTE PRODUCTO\n\n" +
                `👟 ${producto.nombre}\n` +
                `💰 ${producto.precio}\n\n` +
                "¿Confirmas la eliminación?\n\n" +
                "Responde SI para confirmar."
        });

        continue;

    } catch (error) {

        console.error(
            "❌ Error seleccionando producto:",
            error
        );

        await sock.sendMessage(usuario, {
            text:
                "❌ No pude seleccionar el producto."
        });

        continue;
    }
}


// ======================================================
// CONFIRMAR ELIMINACIÓN
// ======================================================
if (
    global.catalogoEliminaciones &&
    global.catalogoEliminaciones[usuario] &&
    texto.toLowerCase() === "si"
) {
    try {

        const pendiente =
            global.catalogoEliminaciones[usuario];

        const rutaIndex = path.join(
            __dirname,
            "WEB CATALOGO",
            "index.html"
        );

        let html = fs.readFileSync(
            rutaIndex,
            "utf8"
        );

        const inicio = html.indexOf(
            '<main id="product-container">'
        );

        const fin = html.indexOf(
            "</main>",
            inicio
        );

        if (inicio === -1 || fin === -1) {
            throw new Error(
                "No se encontró product-container."
            );
        }

        const contenido = html.substring(
            inicio + '<main id="product-container">'.length,
            fin
        );

        let productos =
            contenido.match(
                /<div class="product-card"[\s\S]*?(?=\s*<div class="product-card"|$)/gi
            ) || [];

        if (
            pendiente.idOriginal !== null
        ) {

            const indiceReal =
                productos.findIndex(producto => {

                    const match =
                        producto.match(
                            /<div class="product-card"[^>]*id="([^"]+)"/i
                        );

                    return (
                        match &&
                        match[1] ===
                            pendiente.idOriginal
                    );
                });

            if (indiceReal !== -1) {
                pendiente.indice =
                    indiceReal;
            }
        }

        if (
            pendiente.indice < 0 ||
            pendiente.indice >= productos.length
        ) {
            throw new Error(
                "Producto no encontrado."
            );
        }

        // Eliminar producto
        productos.splice(
            pendiente.indice,
            1
        );

        // Renumerar sin modificar data-categoria
        productos =
            productos.map(
                (producto, index) => {

                    const nuevoId =
                        index + 1;

                    producto =
                        producto.replace(
                            /(<div class="product-card"[^>]*?)\sid="[^"]*"/i,
                            `$1 id="${nuevoId}"`
                        );

                    if (
                        /data-product-id="[^"]*"/i.test(
                            producto
                        )
                    ) {
                        producto =
                            producto.replace(
                                /data-product-id="[^"]*"/i,
                                `data-product-id="${nuevoId}"`
                            );
                    } else {
                        producto =
                            producto.replace(
                                /(<button[^>]*class="productsButton"[^>]*)>/i,
                                `$1 data-product-id="${nuevoId}">`
                            );
                    }

                    // Convertir cualquier data-category antiguo
                    // a data-categoria sin cambiar su valor
                    producto =
                        producto.replace(
                            /data-category="([^"]*)"/i,
                            'data-categoria="$1"'
                        );

                    return producto;
                }
            );

        const nuevoContenido =
            '<main id="product-container">\n' +
            productos.join("\n") +
            '\n</main>';

        html =
            html.substring(0, inicio) +
            nuevoContenido +
            html.substring(
                fin + "</main>".length
            );

        fs.writeFileSync(
            rutaIndex,
            html,
            "utf8"
        );

        // Eliminar imagen
        if (pendiente.imagen) {

            const rutaImagen =
                path.join(
                    __dirname,
                    "WEB CATALOGO",
                    "img",
                    pendiente.imagen
                );

            const rutaImagenWeb =
                path.join(
                    "/var/www/catalogo",
                    "img",
                    pendiente.imagen
                );

            if (
                fs.existsSync(rutaImagen)
            ) {
                fs.unlinkSync(rutaImagen);
            }

            if (
                fs.existsSync(rutaImagenWeb)
            ) {
                fs.unlinkSync(rutaImagenWeb);
            }
        }

        // Actualizar catálogo público
        fs.copyFileSync(
            rutaIndex,
            "/var/www/catalogo/index.html"
        );

        delete global.catalogoEliminaciones[
            usuario
        ];

        delete global.catalogoSeleccion[
            usuario
        ];

        await sock.sendMessage(usuario, {
            text:
                "✅ PRODUCTO ELIMINADO\n\n" +
                `👟 ${pendiente.nombre}\n` +
                `💰 ${pendiente.precio}\n\n` +
                "🔢 Los productos siguientes fueron renumerados automáticamente."
        });

        continue;

    } catch (error) {

        console.error(
            "❌ Error eliminando producto:",
            error
        );

        await sock.sendMessage(usuario, {
            text:
                "❌ No pude eliminar el producto."
        });

        continue;
    }
}
	
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