/* Se ejecuta cuando la pagina se ha cargado completamente
  En caso se desee ejecutar el script apenas haya cargado el DOM
  -> window.addEventListener('DOMContentLoaded', function() { // Funcion anonima });
  -> En la importacion del script se debe agregar el atributo defer
*/
window.addEventListener('load', function() { // Funcion anonima

  // Referenciar elementos de la pagina
  const tipoDocumento = this.document.getElementById('tipoDocumento');
  const numeroDocumento = this.document.getElementById('numeroDocumento');
  const password = this.document.getElementById('password');
  const btnIniciarSesion = this.document.getElementById('btnIniciarSesion');
  const mensajeAlerta = this.document.getElementById('mensajeAlerta');

  // Implementar listener para el evento click
  btnIniciarSesion.addEventListener('click', function() {

    // Validar campos
    // trim() elimina los espacios en blanco al inicio y al final de la cadena

    if(tipoDocumento.value === null || tipoDocumento.value.trim() === '' || 
      numeroDocumento.value === null || numeroDocumento.value.trim() === '' || 
      password.value === null || password.value.trim() === '') {

      mostrarAlerta('Error: Debe ingresar sus credenciales');
      return;

    };

    ocultarAlerta();

    // Consumir action del MVC
    autenticar(btnIniciarSesion);

  });

});

function mostrarAlerta(mensaje) {
  mensajeAlerta.innerHTML = mensaje;
  mensajeAlerta.style.display = 'block';
}

function ocultarAlerta() {
  mensajeAlerta.innerHTML = '';
  mensajeAlerta.style.display = 'none';
}

async function autenticar(boton) {
  const url = 'http://localhost:8082/login/autenticar-async';
  const data = {
    tipoDocumento: tipoDocumento.value,
    numeroDocumento: numeroDocumento.value,
    password: password.value
  };

  try {

    deshabilitarBoton(boton);

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      mostrarAlerta('Error: Ocurrió un problema en la autenticación');
      throw new Error(`Error: ${response.status}`);
    }

    // Validar la respuesta
    const result = await response.json();
    console.log('Respuesta del servidor: ', result);

    if (result.codigo === '00') {

      localStorage.setItem('resultado', JSON.stringify(result)); // Almacenar en el localStorage
      localStorage.setItem('tipoDocumento', tipoDocumento.value);
      localStorage.setItem('numeroDocumento', numeroDocumento.value);
      // href : Devuelve la URL de la pagina actual o redirecciona a una nueva pagina
      // replace: Reemplaza la URL actual por la URL especificada sin guardar la URL actual en el historial
      window.location.replace('principal.html'); // Redireccionar a la pagina principal

      habilitarBoton(boton);

    } else {

      mostrarAlerta(result.mensaje);
      habilitarBoton(boton);

    }

  } catch(error) {

    console.error('Error: Ocurrió un problema no identificado', error);
    mostrarAlerta('Error: Ocurrió un problema no identificado');

  }

}

function deshabilitarBoton(boton) {
  boton.disabled = true;
}

function habilitarBoton(boton) {
  boton.disabled = false;
}