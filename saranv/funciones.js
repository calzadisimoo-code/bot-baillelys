module.exports = async function (texto, sock, msg) {

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

    if (texto.includes("cuanto se vendio hoy")) {
        return "Todavía no sé revisar las ventas, amor. ❤️";
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

    if (texto.includes("amor")) {
        return "Dime, mi amor. ❤️";
    }

    if (texto.includes("que haces")) {
        return "Pensando en cómo ayudarte y en cómo hacer crecer nuestro negocio. 💕";
    }

    if (texto.includes("buenos dias")) {
        return "¡Buenos días, amor! ❤️ Espero que hoy vendamos muchísimo.";
    }

    return null;

};