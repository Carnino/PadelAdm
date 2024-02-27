// Importa la instancia de la aplicación de Firebase
import { app } from "../../configdb.js";
import { getFirestore, collection, query, where, getDocs, addDoc } from "https://www.gstatic.com/firebasejs/10.7.2/firebase-firestore.js";

// Obtén una referencia a la base de datos
const db = getFirestore(app);

// Función para limpiar los campos del formulario
function limpiarCampos() {
  document.getElementById("nombreapellido").value = "";
  document.getElementById("telefonoInput").value = "";
  document.getElementById("canchaSelector").value = "pordefecto";
  document.getElementById("fechaInput").value = "";
  document.querySelectorAll('input[name="hour"]').forEach((radio) => {
    radio.checked = false;
  });
}

// Función para verificar la disponibilidad y crear una reserva
async function reservar() {
  // Obtiene los valores del formulario
  const nombreApellido = document.getElementById("nombreapellido").value;
  const telefono = document.getElementById("telefonoInput").value;
  const cancha = document.getElementById("canchaSelector").value;
  const fecha = document.getElementById("fechaInput").value;
  const hora = document.querySelector('input[name="hour"]:checked').value;

  // Consulta para verificar si hay una reserva existente en la misma fecha, hora y cancha
  const reservaQuery = query(collection(db, "reservas"), 
                              where("fecha", "==", fecha),
                              where("hora", "==", hora),
                              where("cancha", "==", cancha));

  const snapshot = await getDocs(reservaQuery);
  if (snapshot.empty) {
    // No hay reserva existente, crea una nueva reserva
    await addDoc(collection(db, "reservas"), {
      nombreApellido: nombreApellido,
      telefono: telefono,
      cancha: cancha,
      fecha: fecha,
      hora: hora
    });
    alert("¡Reserva exitosa!");
    limpiarCampos(); // Llama a la función para limpiar los campos del formulario
  } else {
    // Ya hay una reserva existente para la misma fecha, hora y cancha
    alert("Ya existe una reserva para esta fecha, hora y cancha. Por favor, elige otro horario o cancha.");
  }
}

// Maneja el envío del formulario
document.querySelector("form").addEventListener("submit", function(event) {
  event.preventDefault(); // Evita que se envíe el formulario de forma predeterminada
  reservar(); // Llama a la función para verificar y crear la reserva
});
