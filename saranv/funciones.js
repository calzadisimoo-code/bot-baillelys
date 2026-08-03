module.exports = async function(texto, sock, msg){

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