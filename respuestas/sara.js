module.exports = function (texto) {

    if (texto === "hola")
        return "Hola 👋 ¿En qué puedo ayudarte?";

    if (texto.includes("precio"))
        return "¿Qué producto te interesa?";

    if (texto === "gracias")
        return "Con mucho gusto 😊";

    if (texto === "adios")
        return "Hasta luego.";

    return null;

};