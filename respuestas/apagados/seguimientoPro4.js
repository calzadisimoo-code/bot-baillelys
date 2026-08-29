const estadosPro4 = new Map();

function iniciarSeguimientoPro4(numero, variante) {
    estadosPro4.set(numero, {
        producto: "pro4",
        variante,
        etapa: obtenerEtapaInicial(variante),
        cantidad: null,
        ciudad: null,
        tipoEntrega: null,
        dispositivo: null
    });
}

function obtenerEtapaInicial(variante) {
    switch (variante) {
        case "A":
        case "F":
            return "cantidad";

        case "B":
            return "entrega";

        case "C":
            return "ciudad";

        case "D":
            return "dispositivo";

        case "E":
            return "cierre";

        default:
            return "cantidad";
    }
}

function obtenerEstado(numero) {
    return estadosPro4.get(numero);
}

function eliminarSeguimiento(numero) {
    estadosPro4.delete(numero);
}

function normalizar(texto) {
    return texto
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .trim();
}

async function procesarSeguimientoPro4(numero, mensaje) {
    const estado = estadosPro4.get(numero);

    if (!estado) return null;

    const texto = normalizar(mensaje);

    // =========================
    // CANTIDAD
    // =========================

    if (estado.etapa === "cantidad") {

        if (
            texto.includes("1") ||
            texto.includes("uno") ||
            texto.includes("un par")
        ) {
            estado.cantidad = 1;
        } 
        else if (
            texto.includes("2") ||
            texto.includes("dos") ||
            texto.includes("2 pares") ||
            texto.includes("dos pares")
        ) {
            estado.cantidad = 2;
        } 
        else {
            return "📦 ¿Cuántos pares necesitas? 1 o 2";
        }

        estado.etapa = "ciudad";

        return `Perfecto. Te dejo ${estado.cantidad} ${
            estado.cantidad === 1 ? "par" : "pares"
        } de AirPods Pro 4. 🎧

📍 ¿En qué ciudad te encuentras para calcularte el envío?`;
    }

    // =========================
    // ENTREGA
    // =========================

    if (estado.etapa === "entrega") {

        if (
            texto.includes("recoger") ||
            texto.includes("local") ||
            texto.includes("punto") ||
            texto.includes("palmira")
        ) {
            estado.tipoEntrega = "local";
            estado.etapa = "cantidad";

            return `Perfecto. Puedes recogerlos en nuestro punto físico de Palmira. 📍

💰 Cada par cuesta $60.000.

📦 ¿Cuántos pares necesitas?`;
        }

        if (
            texto.includes("envio") ||
            texto.includes("domicilio") ||
            texto.includes("enviar") ||
            texto.includes("envíen")
        ) {
            estado.tipoEntrega = "envio";
            estado.etapa = "cantidad";

            return `Perfecto, hacemos envío. 🚚

💰 Cada par cuesta $60.000.

📦 ¿Cuántos pares necesitas?`;
        }

        return `Claro. ¿Prefieres:

🚚 Envío
📍 Recoger en nuestro punto físico de Palmira?`;
    }

    // =========================
    // DISPOSITIVO
    // =========================

    if (estado.etapa === "dispositivo") {

        if (
            texto.includes("iphone") ||
            texto.includes("ios") ||
            texto.includes("apple")
        ) {
            estado.dispositivo = "iphone";
        } 
        else if (
            texto.includes("android") ||
            texto.includes("samsung") ||
            texto.includes("xiaomi") ||
            texto.includes("redmi")
        ) {
            estado.dispositivo = "android";
        } 
        else {
            return `Son compatibles con iPhone y Android. 🎧

¿Los vas a usar con iPhone o Android?`;
        }

        estado.etapa = "cantidad";

        return `Perfecto. Son compatibles con tu dispositivo. ✅

💰 $60.000 el par.

📦 ¿Te dejo 1 par o quieres llevar 2?`;
    }

    // =========================
    // CIUDAD
    // =========================

    if (estado.etapa === "ciudad") {

        estado.ciudad = mensaje.trim();

        if (
            texto.includes("palmira")
        ) {
            estado.etapa = "cierre";

            return `Perfecto, estás en Palmira. 📍

🎧 AirPods Pro 4
💰 $60.000
🚚 Podemos coordinar la entrega.

¿Te dejo listo el pedido de 1 par?`;
        }

        estado.etapa = "cierre";

        return `Perfecto, hacemos envíos hasta ${mensaje.trim()}. 🚚

🎧 AirPods Pro 4
💰 $60.000

¿Te ayudo a dejar listo tu pedido?`;
    }

    // =========================
    // CIERRE
    // =========================

    if (estado.etapa === "cierre") {

        if (
            texto.includes("si") ||
            texto.includes("sí") ||
            texto.includes("dale") ||
            texto.includes("listo") ||
            texto.includes("quiero") ||
            texto.includes("comprar") ||
            texto.includes("pedido")
        ) {
            estado.etapa = "datos";

            return `Perfecto. Vamos a dejarlo listo. 🔥

Envíame estos datos:

📌 Nombre completo:
📌 Número de celular:
📌 Ciudad:
📌 Dirección exacta:

Con eso te confirmamos el pedido.`;
        }

        if (
            texto.includes("no") ||
            texto.includes("despues") ||
            texto.includes("después")
        ) {
            return `Está bien. Cuando quieras pedirlos, escríbeme y te ayudamos a dejar tu pedido listo. 🎧`;
        }

        return `¿Te ayudo a dejar listo tu pedido de AirPods Pro 4 por $60.000?`;
    }

    // =========================
    // DATOS
    // =========================

    if (estado.etapa === "datos") {

        return `Perfecto. Para finalizar necesito:

📌 Nombre completo
📌 Número de celular
📌 Ciudad
📌 Dirección exacta

Envíame esos datos en un solo mensaje y te confirmamos el pedido.`;
    }

    return null;
}

module.exports = {
    iniciarSeguimientoPro4,
    obtenerEstado,
    eliminarSeguimiento,
    procesarSeguimientoPro4
};