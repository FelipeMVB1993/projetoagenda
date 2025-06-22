// Máscara de celular
export default function mascaraCelular(input) {
  let value = input.value.replace(/\D/g, '');

  if (value.length > 11) value = value.slice(0, 11);

  if (value.length > 2 && value.length <= 6) {
    value = value.replace(/^(\d{2})(\d+)/, '($1) $2');
  } else if (value.length > 6 && value.length <= 10) {
    value = value.replace(/^(\d{2})(\d{4})(\d+)/, '($1) $2-$3');
  } else if (value.length > 10) {
    value = value.replace(/^(\d{2})(\d{5})(\d+)/, '($1) $2-$3');
  }

  input.value = value;
}

// Validação individual do celular
export function validarCelular(telefone) {
  const numero = telefone.replace(/\D/g, '');

  if (numero.length !== 11) return false;

  const dddValidos = [
    '11','12','13','14','15','16','17','18','19',
    '21','22','24','27','28',
    '31','32','33','34','35','37','38',
    '41','42','43','44','45','46',
    '47','48','49',
    '51','53','54','55',
    '61','62','64','63','65','66','67','68','69',
    '71','73','74','75','77','79',
    '81','82','83','84','85','86','87','88','89',
    '91','92','93','94','95','96','97','98','99'
  ];

  const ddd = numero.substring(0, 2);
  if (!dddValidos.includes(ddd)) return false;
  if (numero[2] !== '9') return false;

  return true;
}

// Validação geral do formulário
export function validarFormulario(event) {
  const form = event.target;
  const telefoneInput = form.querySelector('input[name="telefone"]');
  const telefone = telefoneInput.value;

  // Remove feedback anterior
  const feedback = telefoneInput.nextElementSibling;
  if (feedback && feedback.classList.contains('invalid-feedback')) {
    feedback.remove();
  }
  telefoneInput.classList.remove('is-invalid');

  // Validação do celular
  if (!validarCelular(telefone)) {
    event.preventDefault();

    telefoneInput.classList.add('is-invalid');

    const errorDiv = document.createElement('div');
    errorDiv.className = 'invalid-feedback';
    errorDiv.innerText = 'Celular inválido. Informe DDD + número com 9 dígitos.';

    telefoneInput.parentNode.appendChild(errorDiv);
    telefoneInput.focus();
  }
}
