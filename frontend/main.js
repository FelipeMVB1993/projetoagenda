import 'core-js/stable';
import 'regenerator-runtime/runtime';
import mascaraCelular, { validarFormulario } from './validarform.js';

// Expor a máscara para o onkeyup do HTML
window.mascaraCelular = mascaraCelular;

document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('form.formulario');
  if (form) {
    form.addEventListener('submit', validarFormulario);
  }
});
