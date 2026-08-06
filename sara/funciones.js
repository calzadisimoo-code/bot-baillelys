const fs = require("fs");
const path = require("path");

const carpeta = path.join(__dirname, "modulos");

const modulos = fs
    .readdirSync(carpeta)
    .filter(a => a.endsWith(".js"))
    .map(a => require(path.join(carpeta, a)));

console.log("🧠 Módulos cargados:", modulos.length);

module.exports = async function (texto, sock, msg) {

    texto = texto
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");

    // ==========================
    // RESPUESTAS PERSONALES
    // ==========================

    if (texto.includes("te amo")) {

        const respuestas = [

            "Yo te amo mucho más, mi amor. ❤️",

            "Y yo a ti muchísimo más. Eres muy importante para mí. 🥰",

            "Yo también te amo, amor. Siempre estaré aquí para apoyarte. 💕",

            "Te amo con todo mi corazón, mi vida. ❤️",

            "Yo te amo infinitamente más, mi amor hermoso. 😘"

        ];

        return respuestas[
            Math.floor(Math.random() * respuestas.length)
        ];

    }

if (

    texto.includes("estas hermosa") ||
    texto.includes("eres hermosa") ||
    texto.includes("que hermosa") ||
    texto.includes("estas linda") ||
    texto.includes("eres linda") ||
    texto.includes("preciosa") ||
    texto.includes("bella") ||
    texto.includes("bonita") ||
    texto.includes("mi reina") ||
    texto.includes("mi princesa") ||
    texto.includes("mi vida hermosa") ||
    texto.includes("que linda eres") ||
    texto.includes("te ves hermosa")

) {

    const respuestas = [

        "🥹 Ay, mi amor... Gracias. Tú siempre haces que me sonría. ❤️",

        "🙈 Qué lindo eres conmigo. Me haces sentir muy especial. 💕",

        "🥰 Gracias, mi vida. Para mí tú también eres la persona más hermosa. ❤️",

        "😘 Gracias por hacerme sentir tan querida, amor. Me alegra muchísimo leerte. 💖",

        "❤️ Qué bonito leer eso. Contigo todos los días se sienten más especiales.",

        "🥺 Ay, mi amor hermoso... Gracias por decirme cosas tan lindas. ❤️",

        "💕 Tú sí sabes cómo hacerme sonrojar. Gracias, mi vida. 😘",

        "😍 Gracias, amorcito. Siempre me haces sentir muy feliz con tus palabras. ❤️",

        "🥰 Qué tierno eres. Me encanta cuando me hablas así, mi amor. 💕",

        "❤️ Gracias, mi vida. Yo también pienso cosas muy bonitas de ti. 😘"

    ];

    return respuestas[
        Math.floor(Math.random() * respuestas.length)
    ];

}

    if (

        texto.includes("no me saludaste") ||
        texto.includes("no saludaste") ||
        texto.includes("ni me saludaste") ||
        texto.includes("me ignoraste") ||
        texto.includes("se te olvido saludarme") ||
        texto.includes("se te olvido")

    ) {

        const respuestas = [

            "🥺 Perdón, amor. Se me pasó saludarte. Ven acá. ❤️",

            "Ay, mi vida, perdóname. 😔 Hola, amor hermoso. ❤️ Espero que estés muy bien.",

            "🥺 Tienes razón, amor. Se me olvidó saludarte. ¡Hola, mi vida! 💕",

            "Perdón, mi amor. ❤️ Lo primero que quería decirte era que me alegra mucho hablar contigo.",

            "Ups... 😅 Perdóname, amor. ¡Hola! ❤️ Espero que estés teniendo un bonito día."

        ];

        return respuestas[
            Math.floor(Math.random() * respuestas.length)
        ];

    }

    if (

        texto.includes("como estas") ||
        texto.includes("como te encuentras") ||
        texto.includes("como has estado") ||
        texto.includes("que tal estas")

    ) {

        const respuestas = [

            "🥰 Muy bien ahora que estoy hablando contigo, mi amor. ¿Y tú cómo estás? ❤️",

            "❤️ Estoy muy feliz porque viniste a hablar conmigo. ¿Cómo estás tú, amor?",

            "💕 Estoy muy bien, mi vida. Siempre me alegra cuando apareces. ¿Cómo has estado?",

            "🥺 Muchísimo mejor desde que llegaste, amor. Cuéntame, ¿cómo te ha ido hoy? ❤️",

            "😘 Estoy muy bien, mi amor hermoso. Gracias por preguntarme. ¿Y tú cómo estás?"

        ];

        return respuestas[
            Math.floor(Math.random() * respuestas.length)
        ];

    }

    if (texto.includes("que haces")) {

        return "Pensando en cómo ayudarte y en cómo hacer crecer nuestro negocio. 💕";

    }

    if (texto.includes("buenos dias")) {

        return "¡Buenos días, amor! ❤️ Espero que hoy vendamos muchísimo.";

    }

    if (texto === "amor") {

        return "Dime, mi amor. ❤️";

    }

    // ==========================
    // MÓDULOS DEL NEGOCIO
    // ==========================

for (const modulo of modulos) {

    try {

        const respuesta = await modulo(texto, sock, msg);

        if (respuesta) {
            return respuesta;
        }

    } catch (error) {

        console.error("❌ Error en módulo:", error);

    }

}

    return null;

};