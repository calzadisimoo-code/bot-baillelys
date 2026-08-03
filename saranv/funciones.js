module.exports = async function(texto, sock, msg){
	
	module.exports = async function(texto, sock, msg){

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

    if(texto.includes("cuanto se vendio hoy")){
        return "Todavía no sé revisar las ventas. ❤️";
    }

    if(texto.includes("que haces")){
        return "Pensando en cómo ayudarte y en cómo hacer crecer nuestro negocio. 💕";
    }

    if(texto.includes("buenos dias")){
        return "¡Buenos días, amor! ❤️ Espero que hoy vendamos muchísimo.";
    }

    return null;
}

    if(texto.includes("cuanto se vendio hoy")){
        return "Todavía no sé revisar las ventas. ❤️";
    }

    if(texto.includes("que haces")){
        return "Pensando en cómo ayudarte y en cómo hacer crecer nuestro negocio. 💕";
    }

    if(texto.includes("buenos dias")){
        return "¡Buenos días, amor! ❤️ Espero que hoy vendamos muchísimo.";
    }

    return null;
}