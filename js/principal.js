window.addEventListener('load', function() { // Funcion anonima

  // Referenciar elementos de la pagina
  const mensajeAlerta = this.document.getElementById('alertSuccess');
  const btnCerrarSesion = this.document.getElementById('btnCerrarSesion');

  // Recuperar nombre de usuario del local storage
  const result = JSON.parse(localStorage.getItem('resultado')); // Convertir de json a objeto
  mostrarAlerta(`¡Bienvenido: ${result.nombreUsuario}!`, mensajeAlerta);

  // Agregar evento al boton de cerrar sesion
  btnCerrarSesion.addEventListener('click', function() {
    cerrarSesion(btnCerrarSesion);
  }); 

});

function mostrarAlerta(mensaje, alerta) {
  alerta.innerHTML = mensaje;
  alerta.style.display = 'block';
}

async function cerrarSesion(boton) {
  const url = 'http://localhost:8082/logout/cerrar-sesion-feign';
  const data = {
    tipoDocumento: localStorage.getItem('tipoDocumento'),
    numeroDocumento: localStorage.getItem('numeroDocumento')
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

    if(!response.ok) {
      mostrarAlerta('Error: No se pudo cerrar la sesión', mensajeAlerta);
      throw new Error(`Error: ${response.status}`);
    } 

    const result = await response.json();
    console.log('Respuesta del servidor', result);

    if (result.codigo === '00') {
      
      localStorage.removeItem('resultado'); // Eliminar del local storage
      localStorage.removeItem('tipoDocumento');
      localStorage.removeItem('numeroDocumento');
      window.location.replace('index.html'); // Redireccionar al inicio

      habilitarBoton(boton);

    } else {

      alert(result.mensaje);
      habilitarBoton(boton);

    }

  } catch(error) {

    console.error('Error: No se pudo cerrar la sesión', error);
    alert('Error: No se pudo cerrar la sesión');

  }

}

function deshabilitarBoton(boton) {
  boton.disabled = true;
}

function habilitarBoton(boton) {
  boton.disabled = false;
}