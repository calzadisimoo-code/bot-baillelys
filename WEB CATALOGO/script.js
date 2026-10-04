$(document).ready(function() {
    
        // Agregar la clase "active" al botón #category1 al cargar la página
    $('#category1').addClass('active');
//-----------------------------------------------NEGOCIO---------------------------------------
var horaApertura = 14; // Hora de apertura en formato de 24 horas
var minutoApertura = 0;
var horaCierre = 23;
var minutoCierre = 30; 

 var data = {
    "#ciudadNegocio": "CRA 27 #29-34 CC VILLA DE LAS PALMAS LOCAL 291",
    "#horaNegocio": "9AM A 7PM",
   //"#nombreNegocio": "TU MARCA",
    "#category1": "TODO",
    "#category2": "CATEGORIA 1",
    "#category3": "CATEGORIA 2",
  };

  $.each(data, function(selector, text) {
    $(selector).text(text);
  });





                 //GUARDA DATOS DE USUARIO EN EN NAVEGADOR
// Función para cargar los datos del usuario al cargar la página
function cargarDatosUsuario() {
  const userDataJSON = localStorage.getItem('userData');

  if (userDataJSON) {
    const userData = JSON.parse(userDataJSON);
    $('#nombre').val(userData.nombre);
    $('#barrio').val(userData.barrio);
    $('#direccion').val(userData.direccion);
    $('#whatsapp').val(userData.whatsapp);

    // Mostrar chulo de validación si los campos no están vacíos
    if (userData.nombre) {
      $('#validationName').show();
    }
    if (userData.barrio) {
      $('#validationNeig').show();
    }
    if (userData.direccion) {
      $('#validationAddress').show();
    }
    if (userData.whatsapp) {
      $('#validationWhatsapp').show();
    }
  }
}

// Llama a la función para cargar los datos del usuario al cargar la página
cargarDatosUsuario();

// Escucha los eventos de los campos y actualiza los chulos de validación
$('input').on('input', function() {
  guardarDatosUsuario();

  // Mostrar u ocultar chulo de validación según el contenido de los campos
  $('#validationName').toggle($('#nombre').val() !== '');
  $('#validationNeig').toggle($('#barrio').val() !== '');
  $('#validationAddress').toggle($('#direccion').val() !== '');
  $('#validationWhatsapp').toggle($('#whatsapp').val() !== '');
});

// Función para guardar los datos del usuario en el almacenamiento local
function guardarDatosUsuario() {
  const datosUsuario = {
    nombre: $('#nombre').val(),
    barrio: $('#barrio').val(),
    direccion: $('#direccion').val(),
    whatsapp: $('#whatsapp').val()
  };

  // Convierte el objeto a JSON
  const datosUsuarioJSON = JSON.stringify(datosUsuario);

  // Guarda los datos en el almacenamiento local
  localStorage.setItem('userData', datosUsuarioJSON);
}
//----------------------------------------------------------------
    


    
//------------------------------------------VALIDACION DE LOS CAMPOS IMPUT-----------------------------------------
    var buy = $('.buy');
    var nombreInput = $('#nombre');
    var neigInput = $('#barrio');
    var addressInput = $('#direccion');
    var whatsappInput = $('#whatsapp');
    var messageElement = $('#message'); // Added message element

    var minLengthNombre = 4; // Update minimum length
    var minLengthNeig = 4;   // Update minimum length
    var minLengthAddress = 5; // Update minimum length
    var minLengthWhatsapp = 13; // Update minimum length

    var validationName = $('#validationName'); // Validation element for Nombre
    var validationNeig = $('#validationNeig'); // Validation element for Barrio
    var validationAddress = $('#validationAddress'); // Validation element for Address
    var validationWhatsapp = $('#validationWhatsapp'); // Validation element for WhatsApp
    var validationImages = $('.validation'); // Updated to select all .validation elements

    function checkValidationStatus(inputElement, validationElement, minLength) {
        inputElement.on('input', function() {
            var inputValue = $(this).val();

            if (inputElement.attr('id') === 'nombre') {
                // Check if only letters are entered in the "nombre" input
                if (/[^a-zA-Z]/.test(inputValue)) {
                    validationElement.text('Only letters are allowed.').show();
                } else {
                    validationElement.text('').hide();
                }
            } else {
                // For other input fields, hide the validation message when typing
                validationElement.hide();
            }

            if (inputValue.length >= minLength) {
                // Character count condition is met, show the validation message
                validationElement.show();
            } else {
                // Character count condition is not met, hide the validation message
                validationElement.hide();
            }

            // Check if the button should be green
            checkButtonStatus();
        });
    }

    function checkButtonStatus() {
        if (
            nombreInput.val().length >= minLengthNombre &&
            neigInput.val().length >= minLengthNeig &&
            addressInput.val().length >= minLengthAddress &&
            whatsappInput.val().length >= minLengthWhatsapp
            
            
        ) {
            // All character count conditions are met, change button color to green
            buy.removeClass('button-gray').addClass('button-green');

        } else {
            // Not all conditions are met, keep button color gray
            buy.removeClass('button-green').addClass('button-gray');

        }
    }

    // Initial check and set button color to gray
    checkButtonStatus();
    checkValidationStatus(nombreInput, validationName, minLengthNombre);
    checkValidationStatus(neigInput, validationNeig, minLengthNeig);
    checkValidationStatus(addressInput, validationAddress, minLengthAddress);

    // Format WhatsApp input
      whatsappInput.on('input', function() {
        var value = whatsappInput.val().replace(/\D/g, ''); // Remove non-numeric characters
        var formattedValue = '';

        for (var i = 0; i < value.length; i++) {
            if (i === 3 || i === 6 || i === 8) {
                formattedValue += ' ';
            }
            formattedValue += value[i];
        }

        // Limit the input to the specified number of characters (minLengthWhatsapp)
        formattedValue = formattedValue.substring(0, minLengthWhatsapp);

        whatsappInput.val(formattedValue);
        checkValidationStatus(whatsappInput, validationWhatsapp, minLengthWhatsapp);
    });



//----------------------------------------FUNCION SI UNDO EL BOTON BUY------------------------------------------
 
/*$('.buy').on('click', function() {
        if ($(this).hasClass('button-green')) {
            //si se cumple esta condicion hagame esto
            
            
        // si se cumple la condicion manda los datos al php
        var userData = {
            name: $('#name').val(),
            email: $('#email').val()
        };

        // Realizar una solicitud AJAX al servidor backend para enviar los datos
        $.ajax({
    type: 'POST',
    url: 'datos.php',
    data: userData,
    success: function(response) {
        // El servidor backend ha procesado la solicitud con éxito
        $('#order').show()
    },
    error: function(error) {
        // Ocurrió un error al procesar la solicitud
        alert('algo paso', error);
    }

        });
        } else {
            $('#error-message').text('Complete los campos').show();
            $('#tusDatosMenssage').text('Tus datos').hide();
        }
    });
    
    */

//------------------------------si el usuario esta escribiendo cambia de mensaje complete los campos a datos---------
    nombreInput.on('input', function() {
        $('#error-message').hide();
        $('#tusDatosMenssage').show();
    });

    neigInput.on('input', function() {
        $('#error-message').hide();
        $('#tusDatosMenssage').show();
    });

    addressInput.on('input', function() {
        $('#error-message').hide();
        $('#tusDatosMenssage').show();
    });

    whatsappInput.on('input', function() {
        $('#error-message').hide();
        $('#tusDatosMenssage').show();
    });


//------------------------------------------------CATEGORY CONTAINER-----------------------------------------

 function toggleNoProductsMessage() {
    const activeCategoryId = $('.category.active').data('categoria');
    const productCards = $('#product-container').find('.product-card');
    // Check if there are no visible product cards for the active category
    if (productCards.filter(`[data-categoria="${activeCategoryId}"]:visible`).length === 0) {
        $('#noProductsMessage').show();
    } else {
        $('#noProductsMessage').hide();
    }
}
// Call the function initially to show/hide the message based on the initial state
toggleNoProductsMessage();

    $('.category').on('click', function() {
        const categoria = $(this).data('categoria');
        $('.product-card').each(function() {
            const cardCategoria = $(this).data('categoria');
            $(this).toggle(cardCategoria === categoria || categoria === 'todos');
        });
      // Guardar una referencia al botón activo actual
        var $activeButton = $('.category.active');

        // Eliminar la clase "active" del botón activo actual
        $activeButton.removeClass('active');

        // Agregar la clase "active" al botón clickeado
        $(this).addClass('active');

        // Obtener la posición del botón activo actual
        var activeButtonPosition = $activeButton.position();

        // Obtener la posición del nuevo botón activo
        var newButtonPosition = $(this).position();

        // Calcular la diferencia de posición entre los dos botones
        var positionDifference = {
            left: newButtonPosition.left - activeButtonPosition.left,
            top: newButtonPosition.top - activeButtonPosition.top
        };

        // Animar el deslizamiento hacia la nueva posición
       // $activeButton.css('position', 'relative').animate(positionDifference, 'fast', function() {
            // Restaurar la posición original
         //   $activeButton.css({ left: 0, top: 0, position: 'static' });
    //    });
    
    toggleNoProductsMessage();  // Toggle no products message visibility

    
    });


    //---------------------------------------------------------ORDER MODAL-------------------------------------------
    $('.productsButton').click(function() {
        $('#orderModal').show();
        $('body').css('overflow', 'hidden'); // Detener el scroll
    });

    // Cerrar el modal de productos al hacer clic en el botón de cerrar
    $('#orderModal .moreProduct').click(function() {
        $('#orderModal').hide();
        $('#error-message').hide();
        $('body').css('overflow', 'auto'); // Restaurar el scroll
    });
    
    //--------------------------------------------------------------STATUS-------------------------------------
    
    
var status = $("#status");

var currentHour = new Date().getHours();
var currentMinute = new Date().getMinutes();

// Calcula el tiempo actual en minutos
var currentTimeInMinutes = currentHour * 60 + currentMinute;

// Calcula el tiempo de apertura en minutos
var aperturaTimeInMinutes = horaApertura * 60 + minutoApertura;

// Calcula el tiempo de cierre en minutos
var cierreTimeInMinutes = horaCierre * 60 + minutoCierre;

if (currentTimeInMinutes >= aperturaTimeInMinutes && currentTimeInMinutes <= cierreTimeInMinutes) {
    status.text("Abierto").css({
        "background-color": "#f0fff0", // Fondo verde claro
        "border": "2px solid #4CAF50", // Borde verde
        "color": "#4CAF50", // Texto en verde
        "padding": "3px 20px 3px 20px",
        "font-weight": "bold",
        "text-transform": "uppercase"
    });
} else {
    status.text("program").css({
        "background-color": "#fff0f0", // Fondo verde claro
        "border": "2px solid #3498db", // Borde verde
        "color": "#3498db", // Texto en verde
        "padding": "3px 20px 3px 20px",
        "font-weight": "bold",
        "text-transform": "uppercase"
    });
}


    // Agregar un manejador de eventos para cuando se haga clic en cualquier botón COMPRAR
    var products = {};

    $('.productsButton').on('click', function() {
        var productId = $(this).data('product-id');

        if (products.hasOwnProperty(productId)) {
            products[productId].cantidad++;
            updateProductView(productId);
        } else {
            products[productId] = {
                cantidad: 1,
                productInfo: getProductInfo(productId)
            };
            createProductView(productId);
        }
    });

  function getProductInfo(productId) {
    var productName = $('#' + productId + ' h2').text();
    var productDescription = $('#' + productId + ' .productCardDescription').text();
    var productValueString = $('#' + productId + ' .precio').text();
    
    // Remover comas y cualquier otro carácter que no sea dígito o punto decimal
    var cleanedValueString = productValueString.replace(/[^0-9.]/g, '');
    
    // Convertir el valor limpio a un número flotante
    var productValue = parseFloat(cleanedValueString);
    
    var productImage = $('#' + productId + ' .imgContainer img').attr('src');

    return {
        productName: productName,
        productDescription: productDescription,
        productValue: productValue,
        productImage: productImage
    };
}




    function createProductView(productId) {
        var productInfo = products[productId].productInfo;

        var newProduct = $('<div class="product" data-product-id="' + productId + '">' +
                           '<div class="productLeft">' +
                           '<div class="productDescription">' +
                           '<h3>' + productInfo.productName + '</h3>' +
                           '<p>' + productInfo.productDescription + '</p>' +
                           '<div class="productbu">' +
                           '<a class="cantidad">x' + products[productId].cantidad + '</a>' +
                           '<button class="menos">-</button>' +
                           '<button style="padding: 0 4px 0 4px; margin: 0 10px 0 0;" class="masButton">+</button>' +
                           '<a class="valorP">' + formatCurrency(productInfo.productValue) + '</a>' +
                           '<a class="eliminar">eliminar</a>' +
                           '</div>' +
                           '</div>' +
                           '</div>' +
                           '<div class="productRight">' +
                           '<img src="' + productInfo.productImage + '" alt="' + productInfo.productName + '" loading="lazy">' +
                           '</div>' +
                           '</div>');

        $('.productsContainer').append(newProduct);

        var cantidadElement = newProduct.find('.cantidad');
        var valorElement = newProduct.find('.valorP');

        newProduct.find('.masButton').on('click', function() {
            products[productId].cantidad++;
            updateProductView(productId);
        });

        newProduct.find('.menos').on('click', function() {
            if (products[productId].cantidad > 1) {
                products[productId].cantidad--;
                updateProductView(productId);
            }
        });

        newProduct.find('.eliminar').on('click', function() {
            $(this).closest('.product').remove();
            delete products[productId];
            updateTotal(); // Actualizar el total cuando se elimina un producto
        });

        updateTotal(); // Actualizar el total cuando se agrega un producto
    }

    function updateProductView(productId) {
        var productInfo = products[productId].productInfo;
        var cantidadElement = $('.productsContainer').find('.product[data-product-id="' + productId + '"] .cantidad');
        var valorElement = $('.productsContainer').find('.product[data-product-id="' + productId + '"] .valorP');

        var newCantidad = 'x' + products[productId].cantidad;
        var oldValue = cantidadElement.text();

        cantidadElement.text(newCantidad);

        // Realizar la animación solo si la cantidad cambió
        if (newCantidad !== oldValue) {
            cantidadElement.animate({ fontSize: '35px' }, 100, function () {
                // Restaurar el tamaño original después de la animación
                cantidadElement.animate({ fontSize: '25px' }, 100);
            });
        }

        valorElement.text(formatCurrency(productInfo.productValue * products[productId].cantidad));

        updateTotal(); // Actualizar el total cuando se cambia la cantidad de un producto
    }

    function updateTotal() {
        var total = 0;

        for (var productId in products) {
            if (products.hasOwnProperty(productId)) {
                var productInfo = products[productId].productInfo;
                total += productInfo.productValue * products[productId].cantidad;
            }
        }

        $('.total').text(formatCurrency(total));

        // Mostrar u ocultar los botones según la cantidad de productos
        if (total > 0) {
            $('.myOrderEnd').show();
            $('.orderContainerData').show();
             $('.tusDatos').show();
        } else {
            $('.myOrderEnd').hide();
            $('.orderContainerData').hide();
             $('.tusDatos').hide();
        }
    }

    // Función para formatear el valor como moneda
    function formatCurrency(value) {
        return value.toLocaleString('es-CO', { minimumFractionDigits: 3, maximumFractionDigits: 10 });
    }

    
// Función para enviar un mensaje de WhatsApp
function sendWhatsAppMessage(message) {
  // Reemplaza 'tu_numero_de_telefono' con tu número de WhatsApp Business API
  const phoneNumber = '+573217204017';
  // Reemplaza 'tu_mensaje' con el mensaje que deseas enviar
  const text = encodeURIComponent(message);
  // Construye la URL de WhatsApp con el número y el mensaje
  const whatsappUrl = `https://api.whatsapp.com/send?phone=${phoneNumber}&text=${text}`;
  // Abre una nueva ventana o pestaña con la URL de WhatsApp
  window.open(whatsappUrl, '_blank');
}



// Recuperar el valor de pedidoCount desde localStorage si existe
let pedidoCount = parseInt(localStorage.getItem('pedidoCount')) || 0;

// Función para enviar un mensaje de WhatsApp
function sendWhatsAppMessage(message) {
  // Reemplaza 'tu_numero_de_telefono' con tu número de WhatsApp Business API
  const phoneNumber = '+573217204017';
  // Reemplaza 'tu_mensaje' con el mensaje que deseas enviar
  const text = encodeURIComponent(message);
  // Construye la URL de WhatsApp con el número y el mensaje
  const whatsappUrl = `https://api.whatsapp.com/send?phone=${phoneNumber}&text=${text}`;
  // Abre una nueva ventana o pestaña con la URL de WhatsApp
  window.open(whatsappUrl, '_blank');
}

$('.buy').on('click', function() {
  if ($(this).hasClass('button-green')) {
    const nombre = $('#nombre').val();
    const barrio = $('#barrio').val();
    const direccion = $('#direccion').val();
    const whatsapp = $('#whatsapp').val();
    const nombreMayusculas = nombre.toUpperCase();
    const domicilio = 3;
    const metodoDePago = $('#metodoDePago').val();
    
    // Obtener el valor total actualizado desde el elemento HTML
    const subtotal = parseFloat($('.total').text());
    const total = subtotal + domicilio;

    const mensaje = `
    NUEVO PEDIDO DE ${nombreMayusculas}\n
    Nombre: ${nombre}
    Barrio: ${barrio}
    Dirección: ${direccion}
    Telefono: ${whatsapp}
    ${buildWhatsAppMessage(products)}
    Subtotal $${subtotal.toFixed(3)}
    Domicilio $${domicilio.toFixed(3)}
    Total $${total.toFixed(3)}
    
    Paga por: ${metodoDePago}
    `;

    // Incrementar el contador de pedidos
    pedidoCount++;

    // Almacenar el nuevo valor de pedidoCount en localStorage
    localStorage.setItem('pedidoCount', pedidoCount.toString());

    // Actualizar y mostrar el contador de pedidos en la página
    $('#pedido-count').text(pedidoCount);

    // Enviar el mensaje de WhatsApp
    sendWhatsAppMessage(mensaje);
  } else {
    $('#error-message').text('Complete los campos').show();
  }
});

function buildWhatsAppMessage(products) {
  let message = "\n";

  for (const productId in products) {
    if (products.hasOwnProperty(productId)) {
      const productInfo = products[productId].productInfo;
      const productName = productInfo.productName;
      const cantidad = products[productId].cantidad;
      message += `    x${cantidad} ${productName}\n`;
    }
  }

  return message;
}

// Llamar a esta función al cargar la página para inicializar el contador
actualizarContadorDePedidos();

function actualizarContadorDePedidos() {
  // Actualizar el elemento HTML con el valor actual de pedidoCount
  $('#pedido-count').text(pedidoCount);
}


 /*// Cuando se hace clic en el botón "Editar"
        $("#editarBoton").click(function() {
            // Mostrar el modal
            $("#panel").show();
        });

        // Cuando se hace clic en el botón "Cambiar"
        $("#cambiarNombre").click(function() {
            // Obtener el nuevo nombre del input
            var nuevoNombre = $("#nuevoNombre").val();

            // Cambiar el contenido del h1 con el id "nombreNegocio"
            $("#nombreNegocio").text(nuevoNombre);

            // Ocultar el modal
            $("#panel").hide();
        });
*/


 $('#categoryButton').click(function() {
      $('.category-container').toggle();  // Alterna la visibilidad del footer (mostrar/ocultar)
    });



   // ABRE DETALLES CUANDO UNDO EN STATUS
$('#detallesButton').on('click', function(event) {
    $('#detalles').toggle();  // Alternar la visibilidad de #detalles
   // event.stopPropagation();  // Evitar que el evento se propague y active el event listener en el documento
});







});
