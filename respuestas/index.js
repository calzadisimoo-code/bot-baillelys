const sara = require("./sara");
const catalogo = require("./catalogo");
const direccion = require("./direccion");
const envio = require("./envio");
const carg67w = require("./carg67w");
const af1bi = require("./af1bi");
const paris = require("./paris");
const talla = require("./talla");
const fotos = require("./fotos");

module.exports = function (texto, usuario) {

    if (typeof texto !== "string") {
        return null;
    }

    texto = texto
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^\p{L}\p{N}\s]/gu, "")
        .trim();

    return (
        catalogo(texto, usuario) ||
        envio(texto, usuario) ||
        direccion(texto, usuario) ||
        carg67w(texto, usuario) ||
        af1bi(texto, usuario) ||
        paris(texto, usuario) ||
        talla(texto, usuario) ||
		fotos(texto, usuario) ||
        sara(texto)
    );

};