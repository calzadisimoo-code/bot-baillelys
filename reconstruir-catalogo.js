const fs = require("fs");
const path = require("path");

const catalogo = path.join(
    __dirname,
    "WEB CATALOGO"
);

const indexPath = path.join(
    catalogo,
    "index.html"
);

const productosPath = path.join(
    catalogo,
    "productos.json"
);

const webCatalogo = "/var/www/catalogo";

function cargarProductos() {
    if (!fs.existsSync(productosPath)) {
        return [];
    }

    try {
        const productos = JSON.parse(
            fs.readFileSync(productosPath, "utf8")
        );

        return Array.isArray(productos)
            ? productos
            : [];
    } catch (error) {
        console.error(
            "Error leyendo productos.json:",
            error.message
        );

        return [];
    }
}

function reconstruir() {
    if (!fs.existsSync(indexPath)) {
        throw new Error(
            "No existe WEB CATALOGO/index.html"
        );
    }

    const productos = cargarProductos()
        .sort((a, b) => Number(a.id) - Number(b.id));

    let html = fs.readFileSync(
        indexPath,
        "utf8"
    );

    const mainMatch = html.match(
        /(<main[^>]*id=["']product-container["'][^>]*>)([\s\S]*?)(<\/main>)/i
    );

    if (!mainMatch) {
        throw new Error(
            'No encontré <main id="product-container">'
        );
    }

const tarjetas = productos.map((producto, index) => {

    const id = index + 1;

    return `
<div class="product-card" id="${id}" data-categoria="${producto.dataCategoria || "1"}">
    <h2>${producto.nombre}</h2>

    <div class="imgContainer">
        <img src="img/${producto.imagen}" loading="lazy">
    </div>

    <p class="productCardDescription">${producto.descripcion || ""}</p>

    <div class="productCardEnd">
        <a class="precio">$${producto.precio}</a>
    </div>

    <p class="tocarParaComprar">👆 TOCA AQUÍ PARA COMPRAR</p>
</div>`;
}).join("\n");

    html =
        html.substring(0, mainMatch.index) +
        mainMatch[1] +
        tarjetas +
        mainMatch[3] +
        html.substring(
            mainMatch.index + mainMatch[0].length
        );

    fs.writeFileSync(
        indexPath,
        html,
        "utf8"
    );

    fs.mkdirSync(
        path.join(webCatalogo, "img"),
        { recursive: true }
    );

    fs.copyFileSync(
        indexPath,
        path.join(webCatalogo, "index.html")
    );

    for (const producto of productos) {

        const origen = path.join(
            catalogo,
            "img",
            producto.imagen
        );

        const destino = path.join(
            webCatalogo,
            "img",
            producto.imagen
        );

        if (fs.existsSync(origen)) {
            fs.copyFileSync(
                origen,
                destino
            );
        }
    }

    console.log(
        `Catalogo reconstruido: ${productos.length} productos`
    );
}

reconstruir();