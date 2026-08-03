const { obtener, guardar } = require("./estado");

const {
    cancelarSeguimiento
} = require("./seguimiento");

const PALABRAS_DIRECCION = [

    "calle",
    "cl ",
    "cra",
    "carrera",
    "kr",
    "kra",
    "transversal",
    "tv",
    "diagonal",
    "dg",
    "manzana",
    "mz",
    "casa",
    "apartamento",
    "apto",
    "barrio"

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

if (estado.pedidoEnviado)
    return false;

const nombre =
    msg.pushName || "Sin nombre";

const numero =
    usuario
        .replace("@s.whatsapp.net", "")
        .replace(/^57/, "");

const producto =
    PRODUCTOS[estado.producto] ||
    "No especificado";

const talla =
    estado.talla ||
    "No especificada";

		    let mensaje =

`🚨 NUEVO PEDIDO

👤 ${nombre} ${numero}

📦 ${producto}

👟 Talla:
${talla}

📍 ${texto}

💰 Total:
Pendiente de calcular envío`;

    try {

        await sock.sendMessage(

            "573183676163@s.whatsapp.net",

            {
                text: mensaje
            }

        );

        guardar(usuario, {

            pedidoEnviado: true,

            direccion: texto,

            fechaPedido: Date.now()

        });
		
		cancelarSeguimiento(usuario);

        console.log(
            "✅ Pedido detectado:",
            numero
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