const { obtenerVariante } = require("../estadisticas/ab");
const { obtener, guardar } = require("../estado");
const {
    registrarProducto
} = require("../estadisticas/hoy");

module.exports = function (texto, usuario) {

    texto = texto.toLowerCase().trim();

    const estado = obtener(usuario);

    // =====================================================
    // SEGUIMIENTO DE PRO4
    // =====================================================

    if (estado?.producto === "pro4") {

        // =================================================
        // AB2
        // =================================================

        if (estado.etapa === "ab2") {

            // Si el cliente responde una cantidad
            if (
                /\b1\b/.test(texto) ||
                texto.includes("uno") ||
                texto.includes("un par")
            ) {

                guardar(usuario, {
                    ...estado,
                    cantidad: 1,
                    etapa: "ab3"
                });

                return obtenerVariante("pro4_2", usuario, {

                    A: "Perfecto 🎧 Te dejo 1 par. ¿En qué ciudad te encuentras para calcularte el envío?",

                    B: "Excelente. ¿A qué ciudad sería el envío?",

                    C: "Listo, sería 1 par por *$60.000*. 📦 ¿En qué ciudad estás?",

                    D: "Perfecto. Para dejarlo listo, ¿en qué ciudad te encuentras?",

                    E: "Perfecto 🔥 ¿Me confirmas la ciudad donde quieres recibirlos?",

                    F: "Listo. ¿A qué ciudad hacemos el envío?"

                });
            }

            // Si el cliente responde 2
            if (
                /\b2\b/.test(texto) ||
                texto.includes("dos") ||
                texto.includes("2 pares") ||
                texto.includes("dos pares")
            ) {

                guardar(usuario, {
                    ...estado,
                    cantidad: 2,
                    etapa: "ab3"
                });

                return obtenerVariante("pro4_2", usuario, {

                    A: "🔥 Excelente elección. ¿En qué ciudad te encuentras para calcularte el envío?",

                    B: "Perfecto, serían 2 pares. 📦 ¿A qué ciudad hacemos el envío?",

                    C: "Listo. ¿En qué ciudad quieres recibir los 2 pares?",

                    D: "Perfecto. Te dejo los 2 pares. ¿Cuál es tu ciudad?",

                    E: "Excelente 🔥 ¿Me confirmas la ciudad de entrega?",

                    F: "Perfecto. ¿A qué ciudad hacemos el envío?"

                });
            }

            // Si responde envío
            if (
                texto.includes("envio") ||
                texto.includes("envío") ||
                texto.includes("domicilio") ||
                texto.includes("enviar")
            ) {

                guardar(usuario, {
                    ...estado,
                    tipoEntrega: "envio",
                    etapa: "cantidad"
                });

                return obtenerVariante("pro4_2", usuario, {

                    A: "Perfecto 🚚 ¿Cuántos pares necesitas?",

                    B: "Claro. ¿Quieres 1 par o 2 pares?",

                    C: "Perfecto. 🎧 ¿Cuántos pares te dejo?",

                    D: "Excelente. ¿Sería 1 par o quieres aprovechar para llevar 2?",

                    E: "Listo 🔥 ¿Cuántos pares necesitas?",

                    F: "Perfecto. ¿Cuántos pares deseas llevar?"

                });
            }

            // Si quiere recoger
            if (
                texto.includes("recoger") ||
                texto.includes("local") ||
                texto.includes("punto")
            ) {

                guardar(usuario, {
                    ...estado,
                    tipoEntrega: "local",
                    etapa: "cantidad"
                });

                return obtenerVariante("pro4_2", usuario, {

                    A: "Perfecto 📍 ¿Cuántos pares necesitas?",

                    B: "Claro. ¿Te dejo 1 par o 2?",

                    C: "Perfecto. 🎧 ¿Cuántos pares deseas llevar?",

                    D: "Excelente. ¿Cuántos pares te separo?",

                    E: "Listo 🔥 ¿Cuántos pares necesitas?",

                    F: "Perfecto. ¿Sería 1 par o 2 pares?"

                });
            }

            // Si responde cualquier otra cosa,
            // lo llevamos al cierre de cantidad
            guardar(usuario, {
                ...estado,
                etapa: "ab3"
            });

            return obtenerVariante("pro4_2", usuario, {

                A: "Perfecto. 📍 ¿En qué ciudad te encuentras?",

                B: "Claro. ¿A qué ciudad sería el envío?",

                C: "Perfecto 🎧 ¿En qué ciudad quieres recibirlos?",

                D: "Listo. ¿Cuál es tu ciudad?",

                E: "Excelente. ¿En qué ciudad estás?",

                F: "¿A qué ciudad hacemos el envío?"

            });
        }


        // =================================================
        // CANTIDAD
        // =================================================

        if (estado.etapa === "cantidad") {

            let cantidad = null;

            if (
                /\b1\b/.test(texto) ||
                texto.includes("uno") ||
                texto.includes("un par")
            ) {
                cantidad = 1;
            }

            if (
                /\b2\b/.test(texto) ||
                texto.includes("dos") ||
                texto.includes("2 pares") ||
                texto.includes("dos pares")
            ) {
                cantidad = 2;
            }

            if (cantidad) {

                guardar(usuario, {
                    ...estado,
                    cantidad,
                    etapa: "ab3"
                });

                return obtenerVariante("pro4_2", usuario, {

                    A: "Perfecto. 🎧 ¿En qué ciudad te encuentras?",

                    B: "Excelente. ¿A qué ciudad sería el envío?",

                    C: "Listo. ¿Cuál es tu ciudad para calcularte el envío?",

                    D: "Perfecto. 📦 ¿En qué ciudad deseas recibirlos?",

                    E: "Excelente 🔥 ¿Me confirmas tu ciudad?",

                    F: "¿A qué ciudad hacemos el envío?"

                });
            }

            return "📦 ¿Cuántos pares necesitas? 1 o 2";
        }


        // =================================================
        // AB3
        // =================================================

        if (estado.etapa === "ab3") {

            // Detectar celular
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

            for (const marca in celulares) {

                if (texto.includes(marca)) {

                    guardar(usuario, {
                        ...estado,
                        celular: celulares[marca],
                        etapa: "cierre"
                    });

                    return obtenerVariante("pro4_3", usuario, {

                        A: `📱 Perfecto, son compatibles con *${celulares[marca]}*.\n\n🚚 ¿Me compartes tu ciudad y dirección para dejar listo el pedido?`,

                        B: `Perfecto. ✅ Funcionan con *${celulares[marca]}*.\n\n📦 ¿Cuál es tu ciudad y dirección de entrega?`,

                        C: `Excelente. 🎧 Son compatibles con *${celulares[marca]}*.\n\n📍 ¿Dónde deseas recibirlos?`,

                        D: `Perfecto 🔥 Te sirven con *${celulares[marca]}*.\n\n📍 Pásame ciudad y dirección para preparar tu pedido.`,

                        E: `Listo. ✅ Compatibles con *${celulares[marca]}*.\n\n📦 ¿Cuál es la dirección donde los recibirías?`,

                        F: `Perfecto. 🎧 Ahora solo necesito ciudad y dirección para dejarte el pedido listo.`

                    });
                }
            }

            // Si ya veníamos buscando ciudad
            guardar(usuario, {
                ...estado,
                ciudad: texto,
                etapa: "cierre"
            });

            return obtenerVariante("pro4_3", usuario, {

                A: "Perfecto. 🚚 ¿Me compartes tu nombre completo y dirección para dejar listo el pedido?",

                B: "Excelente. 📦 Ahora pásame tu nombre completo y dirección de entrega.",

                C: "Listo. 🔥 ¿Me envías tu nombre completo y dirección para confirmar el pedido?",

                D: "Perfecto. Solo nos falta tu nombre y dirección para finalizar.",

                E: "Excelente. ✅ Pásame nombre completo y dirección y te dejamos el pedido listo.",

                F: "Perfecto. 📍 Envíame tu nombre completo y dirección para finalizar."

            });
        }


        // =================================================
        // CIERRE
        // =================================================

        if (estado.etapa === "cierre") {

            guardar(usuario, {
                ...estado,
                etapa: "datos"
            });

            return `Perfecto. 🔥 Para finalizar tu pedido necesito:

👤 Nombre completo:
📱 Número de celular:
📍 Ciudad:
🏠 Dirección exacta:

Envíame esos datos y te confirmamos el pedido.`;
        }


        // =================================================
        // DATOS
        // =================================================

        if (estado.etapa === "datos") {

            return `Perfecto. Ya casi está listo. 📦

Envíame por favor:

👤 Nombre completo
📱 Número de celular
📍 Ciudad
🏠 Dirección exacta

Y te confirmamos el pedido.`;
        }


        // =================================================
        // SI NO TIENE ETAPA
        // =================================================

        guardar(usuario, {
            ...estado,
            producto: "pro4",
            etapa: "ab2",
            pedidoEnviado: false
        });

        return obtenerVariante("pro4_2", usuario, {

            A: "Perfecto 🎧 ¿Cuántos pares necesitas?",

            B: "Excelente. 📦 ¿Quieres 1 par o 2?",

            C: "Listo. ¿Cuántos pares te dejo?",

            D: "Perfecto 🔥 ¿Sería 1 par o quieres llevar 2?",

            E: "¿Cuántos pares necesitas?",

            F: "¿Te dejo 1 par o 2 pares?"

        });
    }


    // =====================================================
    // ACTIVAR PRO4
    // =====================================================

    if (
        texto.includes("pro 4") ||
        texto.includes("pro4") ||
        texto.includes("airpods pro 4") ||
        texto.includes("airpod pro 4") ||
        texto.includes("audifonos pro 4") ||
        texto.includes("audífonos pro 4") ||
        texto.includes("audifonos con cancelacion de ruido") ||
        texto.includes("audífonos con cancelación de ruido")
    ) {

        registrarProducto(usuario);

        guardar(usuario, {
            producto: "pro4",
            etapa: "ab2",
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