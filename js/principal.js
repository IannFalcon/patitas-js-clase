window.addEventListener('load', function() { // Funcion anonima

  // Referenciar elementos de la pagina
  const mensajeAlerta = this.document.getElementById('alertSuccess');

  // Recuperar nombre de usuario del local storage
  const result = JSON.parse(localStorage.getItem('resultado')); // Convertir de json a objeto
  mostrarAlerta(`¡Bienvenido: ${result.nombreUsuario}!`);

});

function mostrarAlerta(mensaje) {
  mensajeAlerta.innerHTML = mensaje;
  mensajeAlerta.style.display = 'block';
}