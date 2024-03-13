import { app } from "./configdb.js";
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

// Función para obtener las horas disponibles para la fecha y cancha seleccionadas
async function obtenerHorasDisponibles(cancha, fecha) {
  const horasDisponibles = ['16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00'];
  const reservaQuery = query(collection(db, "reservas"),
    where("cancha", "==", cancha),
    where("fecha", "==", fecha)
  );
  const snapshot = await getDocs(reservaQuery);
  snapshot.forEach(doc => {
    const horaReservada = doc.data().hora;
    const index = horasDisponibles.indexOf(horaReservada);
    if (index !== -1) {
      horasDisponibles.splice(index, 1); // Remover la hora reservada de las horas disponibles
    }
  });
  return horasDisponibles;
}


// Función para manejar cambios en la selección de fecha y cancha
document.getElementById("fechaInput").addEventListener("change", actualizarHorasDisponibles);
document.getElementById("canchaSelector").addEventListener("change", actualizarHorasDisponibles);

// Función para actualizar las opciones de horas disponibles en el formulario
async function actualizarHorasDisponibles() {
  const canchaSeleccionada = document.getElementById("canchaSelector").value;
  const fechaSeleccionada = document.getElementById("fechaInput").value;
  if (canchaSeleccionada !== "pordefecto" && fechaSeleccionada !== "") {
    const horasDisponibles = await obtenerHorasDisponibles(canchaSeleccionada, fechaSeleccionada);
    const horasContainer = document.getElementById("horasContainer");
    horasContainer.innerHTML = ""; // Limpiar opciones anteriores

    // Divide las horas disponibles en dos columnas
    const halfLength = Math.ceil(horasDisponibles.length / 2);
    const horasColumn1 = horasDisponibles.slice(0, halfLength);
    const horasColumn2 = horasDisponibles.slice(halfLength);

    const rowDiv = document.createElement("div");
    rowDiv.classList.add("row");

    const columnDiv1 = document.createElement("div");
    columnDiv1.classList.add("col");
    const columnDiv2 = document.createElement("div");
    columnDiv2.classList.add("col");

    // Agrega las horas a la primera columna
    horasColumn1.forEach(hora => {
      const input = document.createElement("input");
      input.type = "radio";
      input.name = "hour";
      input.value = hora;
      input.id = `hour${hora}`;
      const label = document.createElement("label");
      label.textContent = `${hora}hs`;
      label.setAttribute("for", `hour${hora}`);
      label.classList.add("form-check-label", "text-white"); // Agregar clases para que el texto sea blanco
      const div = document.createElement("div");
      div.classList.add("form-check");
      div.appendChild(input);
      div.appendChild(label);
      columnDiv1.appendChild(div);
    });

    // Agrega las horas a la segunda columna
    horasColumn2.forEach(hora => {
      const input = document.createElement("input");
      input.type = "radio";
      input.name = "hour";
      input.value = hora;
      input.id = `hour${hora}`;
      const label = document.createElement("label");
      label.textContent = `${hora}hs`;
      label.setAttribute("for", `hour${hora}`);
      label.classList.add("form-check-label", "text-white"); // Agregar clases para que el texto sea blanco
      const div = document.createElement("div");
      div.classList.add("form-check");
      div.appendChild(input);
      div.appendChild(label);
      columnDiv2.appendChild(div);
    });

    // Agrega las columnas al contenedor
    rowDiv.appendChild(columnDiv1);
    rowDiv.appendChild(columnDiv2);
    horasContainer.appendChild(rowDiv);

    horasContainer.style.display = "block"; // Mostrar el contenedor de horas
  } else {
    document.getElementById("horasContainer").style.display = "none"; // Ocultar el contenedor de horas si no se ha seleccionado fecha o cancha
  }
}



// Maneja el cambio de fecha y cancha para actualizar las horas disponibles
document.getElementById("canchaSelector").addEventListener("change", actualizarHorasDisponibles);
document.getElementById("fechaInput").addEventListener("change", actualizarHorasDisponibles);

// Maneja el envío del formulario
document.querySelector("form").addEventListener("submit", async function(event) {
  event.preventDefault(); // Evita que se envíe el formulario de forma predeterminada
  const horaSeleccionada = document.querySelector('input[name="hour"]:checked');
  if (!horaSeleccionada) {
    alert("Por favor, selecciona una hora.");
    return;
  }
  await reservar(); // Llama a la función para verificar y crear la reserva
});

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
    where("cancha", "==", cancha)
  );

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
    document.getElementById("horasContainer").style.display = "none"; // Oculta el contenedor de horas
  } else {
    // Ya hay una reserva existente para la misma fecha, hora y cancha
    alert("Ya existe una reserva para esta fecha, hora y cancha. Por favor, elige otro horario o cancha.");
  }
}
