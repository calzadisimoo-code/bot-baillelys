const estados = new Map();

function guardar(usuario, datos) {

    const actual = estados.get(usuario) || {};

    estados.set(usuario, {
        ...actual,
        ...datos
    });

}

function obtener(usuario) {

    return estados.get(usuario);

}

function borrar(usuario) {

    estados.delete(usuario);

}

module.exports = {
    guardar,
    obtener,
    borrar
};