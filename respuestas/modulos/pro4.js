const { obtenerVariante } = require("../estadisticas/ab");
const { obtener, guardar } = require("../estado");
const {
    registrarProducto
} = require("../estadisticas/hoy");

module.exports = function (texto, usuario) {

    const estado = obtener(usuario);

    if (estado?.producto === "pro4") {

        const celulares = {
            iphone: "iPhone",
            android: "Android",
            samsung: "Samsung",
            xiaomi: "Xiaomi",
            motorola: "Motorola",
            huawei: "Huawei",
            oppo: "Oppo",
            realme: "Realme",
            honor: "Honor",
            vivo: "Vivo",
            infinix: "Infinix",
            tecno: "Tecno"
        };

        const patrones = {
            iphone: /\biphone\b/i,
            android: /\bandroid\b/i,
            samsung: /\bsamsung\b/i,
            xiaomi: /\bxiaomi\b/i,
            motorola: /\bmotorola\b/i,
            huawei: /\bhuawei\b/i,
            oppo: /\boppo\b/i,
            realme: /\brealme\b/i,
            honor: /\bhonor\b/i,
            vivo: /\b(celular|telefono|teléfono|movil|móvil)\s+vivo\b|\b(vivo)\s+(celular|telefono|teléfono|movil|móvil)\b|\bes\s+para\s+vivo\b|^vivo$/i,
            infinix: /\binfinix\b/i,
            tecno: /\btecno\b/i
        };

        for (const marca in celulares) {

            if (patrones[marca].test(texto)) {

                return `📱 ¡Perfecto! Son totalmente compatibles con *${celulares[marca]}*.

🚚 ¿A qué ciudad o barrio sería el envío? Así te digo el costo y el tiempo de entrega.`;

            }

        }

    }

    if (
        texto.includes("pro 4") ||
        texto.includes("pro4") ||
        texto.includes("airpods pro 4") ||
        texto.includes("audifonos con cancelacion de ruido") ||
        texto.includes("airpod pro 4") ||
        texto.includes("audifonos pro 4")
    ) {

        registrarProducto(usuario);

        guardar(usuario, {
            producto: "pro4",
            pedidoEnviado: false
        });

        return obtenerVariante("pro4", usuario, {

A: "🎧 ¡Sí tenemos disponibles los *AirPods Pro 4*!\n\n💰 Precio: *$60.000*\n🚚 Envíos a toda Colombia.\n\n📦 ¿Te envío 1 par o quieres aprovechar para llevar 2?",

B: "🎧 ¡Sí hay disponibilidad!\n\n💰 Precio: *$60.000*\n\n🚚 ¿Prefieres envío o recoger en nuestro punto físico de Palmira?",

C: "🎧 ¡Sí tenemos disponibles!\n\n💰 *$60.000*\n\n📍 ¿En qué ciudad te encuentras para decirte el tiempo de entrega?",

D: "🎧 ¡Sí hay disponibilidad!\n\n💰 Precio: *$60.000*\n📦 Envíos rápidos.\n\n📱 ¿Los usarás con iPhone o Android?",

E: "🎧 ¡Sí hay disponibilidad!\n\n💰 *$60.000*\n🚚 Envíos a toda Colombia.\n\n✅ ¿Te ayudo a dejar listo tu pedido?",

F: "🎧 ¡Sí tenemos los *AirPods Pro 4*!\n\n💰 Precio: *$60.000*\n\n📦 ¿Cuántos pares necesitas?"

        });

    }

    return null;

};