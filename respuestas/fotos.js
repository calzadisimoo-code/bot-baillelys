const { obtener } = require("../estado");
const {
    registrarFotos
} = require("../estadisticas/hoy");

module.exports = function (texto, usuario) {

    const palabras = [
        "foto",
        "fotos",
        "ver",
        "verlas",
        "verlos",
        "mostrar",
        "muestrame"
    ];

    if (!palabras.some(p => texto.includes(p))) {
        return null;
    }

    const estado = obtener(usuario);

    if (!estado?.producto) {
        return null;
    }
	
	registrarFotos(usuario);

    return `IMG_${estado.producto}`;

};