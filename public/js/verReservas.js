// Importa la instancia de la aplicación de Firebase y otras dependencias
import { app } from "../../configdb.js";
import { getFirestore, collection, getDocs, query, where, Timestamp, deleteDoc, doc } from "https://www.gstatic.com/firebasejs/10.7.2/firebase-firestore.js";

// Obtén una referencia a la base de datos
const db = getFirestore(app);

// Función para mostrar las reservas en la tabla
async function mostrarReservas(fecha) {
    const reservasTable = document.getElementById("reservasTable");
  
    // Limpia el contenido anterior de la tabla
    reservasTable.innerHTML = "";
  
    // Consulta las reservas para la fecha seleccionada
    const reservaQuery = query(collection(db, "reservas"), where("fecha", "==", fecha));
    const snapshot = await getDocs(reservaQuery);
  
    // Verifica si hay reservas para la fecha seleccionada
    if (snapshot.empty) {
      reservasTable.innerHTML = "<p>No hay reservas para esta fecha.</p>";
      return;
    }
  
    // Construye la tabla con las reservas encontradas
    let tableHTML = `
      <div class="table-responsive" style="height: 350px; overflow: auto;">
        <table class="table table-striped table-bordered">
          <thead>
            <tr>
              <th scope="col">Nombre</th>
              <th scope="col">Teléfono</th>
              <th scope="col">Cancha</th>
              <th scope="col">Hora</th>
              <th scope="col">Acciones</th>
            </tr>
          </thead>
          <tbody>
    `;
  
    snapshot.forEach((doc) => {
      const reserva = doc.data();
      tableHTML += `
        <tr>
          <td>${reserva.nombreApellido}</td>
          <td>${reserva.telefono}</td>
          <td>${reserva.cancha}</td>
          <td>${reserva.hora}</td>
          <td><button class="btn btn-danger" data-reserva-id="${doc.id}">Eliminar</button></td>
        </tr>
      `;
    });
  
    tableHTML += `
          </tbody>
        </table>
      </div>
    `;
  
    // Agrega la tabla al elemento reservasTable
    reservasTable.innerHTML = tableHTML;
    
    // Asigna el evento de clic a los botones de eliminar usando la delegación de eventos
    reservasTable.addEventListener("click", async function(event) {
        if (event.target.classList.contains("btn-danger")) {
            event.stopPropagation(); // Evita la propagación del evento
            const reservaId = event.target.dataset.reservaId; // Obtén el ID de la reserva desde el atributo de datos
            await eliminarReserva(reservaId);
        }
    });
}

// Función para eliminar una reserva
async function eliminarReserva(reservaId) {
    // Pide confirmación al usuario
    const confirmacion = confirm("¿Estás seguro de que quieres eliminar esta reserva?");
    if (!confirmacion) {
        return; // Si el usuario cancela, no hacer nada
    }

    try {
        // Elimina la reserva de la base de datos
        await deleteDoc(doc(db, "reservas", reservaId));
        alert("Reserva eliminada exitosamente.");
        // Actualiza la tabla de reservas después de eliminar la reserva
        const fechaReserva = document.getElementById("fechaReserva").value;
        await mostrarReservas(fechaReserva);
    } catch (error) {
        console.error("Error al eliminar la reserva:", error);
        alert("Se produjo un error al intentar eliminar la reserva. Por favor, inténtalo de nuevo más tarde.");
    }
}

// Maneja el evento de clic en el botón de consultar
document.getElementById("consultarBtn").addEventListener("click", async function() {
    const fechaReserva = document.getElementById("fechaReserva").value;
    await mostrarReservas(fechaReserva);
});
