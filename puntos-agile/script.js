/* === LÓGICA UI === */
let currentCalc = null;

function showCalc(id) {
  // Ocultar todas las secciones
  document.querySelectorAll('.calc-section').forEach(el => el.classList.add('hidden'));
  document.getElementById('result-area').classList.add('hidden');
  
  // Mostrar la seleccionada
  document.getElementById(id).classList.remove('hidden');
  currentCalc = id;
  
  // Limpiar inputs al cambiar
  limpiarTodo();
}

function displayResult(mainText, detailText, colorClass) {
  const box = document.getElementById('result-area');
  const txt = document.getElementById('result-text');
  const det = document.getElementById('result-detail');
  
  // Resetear clases de color
  box.className = 'result-box';
  box.classList.add(colorClass);
  
  txt.innerText = mainText;
  det.innerText = detailText || '';
  
  box.classList.remove('hidden');
  box.scrollIntoView({ behavior: 'smooth' });
}

function limpiarTodo() {
  document.querySelectorAll('input').forEach(i => i.value = '');
  document.getElementById('result-area').classList.add('hidden');
}

function validar(val, min, max, nombre) {
  if (!val || isNaN(val)) return `Ingrese un valor válido para ${nombre}.`;
  if (val < min || val > max) return `${nombre} debe estar entre ${min} y ${max}.`;
  return null;
}

/* === CALCULADORAS === */

// 1. IMC
function calcularIMC() {
  const peso = parseFloat(document.getElementById('imc-peso').value);
  const altura = parseFloat(document.getElementById('imc-altura').value);

  let error = validar(peso, 2, 300, 'Peso') || validar(altura, 40, 250, 'Altura');
  if (error) return alert(error);

  const imc = peso / Math.pow(altura / 100, 2);
  let cat, color;

  if (imc < 18.5) { cat = "Bajo Peso"; color = "state-blue"; }
  else if (imc < 25) { cat = "Normal"; color = "state-green"; }
  else if (imc < 30) { cat = "Sobrepeso"; color = "state-yellow"; }
  else if (imc < 35) { cat = "Obesidad I"; color = "state-orange"; }
  else { cat = "Obesidad II+"; color = "state-red"; }

  displayResult(imc.toFixed(1), `Categoría: ${cat}`, color);
}

// 2. PRESIÓN ARTERIAL
function calcularPresion() {
  const sis = parseInt(document.getElementById('pa-sis').value);
  const dia = parseInt(document.getElementById('pa-dia').value);

  let error = validar(sis, 70, 250, 'Sistólica') || validar(dia, 40, 150, 'Diastólica');
  if (error) return alert(error);

  let msg, color;

  if (sis >= 180 || dia >= 120) {
    msg = "CRISIS HIPERTENSIVA"; color = "state-darkred";
  } else if (sis >= 140 || dia >= 90) {
    msg = "Hipertensión Etapa 2"; color = "state-red";
  } else if ((sis >= 130 && sis <= 139) || (dia >= 80 && dia <= 89)) {
    msg = "Hipertensión Etapa 1"; color = "state-orange";
  } else if (sis >= 120 && sis <= 129 && dia < 80) {
    msg = "Elevada"; color = "state-yellow";
  } else if (sis < 120 && dia < 80) {
    msg = "Normal"; color = "state-green";
  } else {
    msg = "Valores no clasificados"; color = "state-blue";
  }

  displayResult(msg, "Consulte a su médico", color);
}

// 3. HIDRATACIÓN
function calcularAgua() {
  const peso = parseFloat(document.getElementById('agua-peso').value);
  let error = validar(peso, 2, 300, 'Peso');
  if (error) return alert(error);

  const ml = peso * 35;
  const litros = (ml / 1000).toFixed(2);
  const vasos = Math.round(ml / 250);

  displayResult(`${litros} Litros`, `Aprox. ${vasos} vasos de agua al día`, "state-blue");
}

// 4. DOSIS
function calcularDosis() {
  const peso = parseFloat(document.getElementById('dosis-peso').value);
  const dosisKg = parseFloat(document.getElementById('dosis-mg').value);

  let error = validar(peso, 0.5, 150, 'Peso') || validar(dosisKg, 0.1, 100, 'Dosis');
  if (error) return alert(error);

  const total = peso * dosisKg;
  displayResult(`${total.toFixed(1)} mg`, "Dosis total calculada", "state-green");
}

// 5. EDAD PEDIÁTRICA 
function calcularEdad() {
  const fechaStr = document.getElementById('edad-fecha').value;
  if (!fechaStr) return alert("Seleccione una fecha");

  const nacimiento = new Date(fechaStr);
  const hoy = new Date();
  
  if (nacimiento > hoy) return alert("La fecha no puede ser futura");

  let anios = hoy.getFullYear() - nacimiento.getFullYear();
  let meses = hoy.getMonth() - nacimiento.getMonth();

  if (meses < 0 || (meses === 0 && hoy.getDate() < nacimiento.getDate())) {
    anios--;
    meses += 12;
  }
  
  // Ajuste fino de días para meses exactos
  if (hoy.getDate() < nacimiento.getDate()) {
      meses--;
      if (meses < 0) { // Si retrocedimos demasiado
          meses = 11;
          // anios ya se ajustó arriba
      }
  }

  const mesesTotales = (anios * 12) + meses;
  let resultado, detalle;

  if (anios < 2) {
    resultado = `${mesesTotales} Meses`;
    detalle = `${anios} años, ${meses} meses`;
  } else {
    resultado = `${anios} Años`;
    detalle = `y ${meses} meses`;
  }

  displayResult(resultado, detalle, "state-blue");
}

// Inicializar mostrando la primera calculadora (opcional)
// showCalc('imc');