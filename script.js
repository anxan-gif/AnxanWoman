// ========================================
// SISTEMA DE RAYOS - ANXANWOMAN
// ========================================


// Recuperamos los rayos guardados
let rayos = parseInt(localStorage.getItem("anxanRayos")) || 0;


// Elementos de la página
const headerPoints = document.getElementById("header-points");
const points = document.getElementById("points");
const challengeButton = document.getElementById("challenge-button");


// Elementos del modal
const modal = document.getElementById("anxan-modal");
const modalIcon = document.getElementById("modal-icon");
const modalTitle = document.getElementById("modal-title");
const modalText = document.getElementById("modal-text");
const modalReward = document.getElementById("modal-reward");
const modalButton = document.getElementById("modal-button");


// ========================================
// ACTUALIZAR RAYOS
// ========================================

function actualizarRayos() {

    if (headerPoints) {
        headerPoints.textContent = rayos;
    }

    if (points) {
        points.textContent = rayos;
    }

}


// Mostramos los rayos al cargar
actualizarRayos();


// ========================================
// ABRIR MODAL
// ========================================

function abrirModal(tipo) {

    if (!modal) {
        return;
    }


    // RETO ACEPTADO

    if (tipo === "aceptado") {

        modalIcon.textContent = "🔥";

        modalTitle.textContent =
            "¡RETO ACEPTADO!";

        modalText.textContent =
            "Completa el reto y vuelve para reclamar tu recompensa.";

        modalReward.textContent =
            "+50 ⚡";

        modalButton.textContent =
            "¡A POR ELLO!";

    }


    // RETO COMPLETADO

    if (tipo === "completado") {

        modalIcon.textContent = "⚡";

        modalTitle.textContent =
            "¡RETO COMPLETADO!";

        modalText.textContent =
            "¡Has conseguido 50 Rayos! Ahora tienes " +
            rayos +
            " ⚡";

        modalReward.textContent =
            "+50 ⚡";

        modalButton.textContent =
            "¡GENIAL!";

    }


    modal.classList.add("show");

}


// ========================================
// CERRAR MODAL
// ========================================

if (modalButton) {

    modalButton.addEventListener(
        "click",
        function () {

            modal.classList.remove("show");

        }
    );

}


// También permitimos cerrar pulsando fuera

if (modal) {

    modal.addEventListener(
        "click",
        function (event) {

            if (event.target === modal) {

                modal.classList.remove("show");

            }

        }
    );

}


// ========================================
// RETO DEL DÍA
// ========================================

if (challengeButton) {

    let retoAceptado =
        localStorage.getItem("retoAceptado") === "true";

    let retoCompletado =
        localStorage.getItem("retoCompletado") === "true";


    // Si ya estaba completado

    if (retoCompletado) {

        challengeButton.textContent =
            "✅ RETO COMPLETADO";

        challengeButton.disabled = true;

    }


    // Si estaba aceptado pero no completado

    else if (retoAceptado) {

        challengeButton.textContent =
            "🏆 COMPLETAR RETO";

    }


    // ====================================
    // CLICK EN EL BOTÓN DEL RETO
    // ====================================

    challengeButton.addEventListener(
        "click",
        function () {


            // PRIMER CLICK
            // ACEPTAMOS EL RETO

            if (!retoAceptado) {

                retoAceptado = true;

                localStorage.setItem(
                    "retoAceptado",
                    "true"
                );

                challengeButton.textContent =
                    "🏆 COMPLETAR RETO";

                abrirModal("aceptado");

            }


            // SEGUNDO CLICK
            // COMPLETAMOS EL RETO

            else if (!retoCompletado) {

                retoCompletado = true;

                rayos += 50;


                // Guardamos los rayos

                localStorage.setItem(
                    "anxanRayos",
                    rayos
                );


                // Guardamos el reto

                localStorage.setItem(
                    "retoCompletado",
                    "true"
                );


                // Actualizamos los contadores

                actualizarRayos();


                // Cambiamos el botón

                challengeButton.textContent =
                    "✅ RETO COMPLETADO";

                challengeButton.disabled = true;


                // Abrimos nuestro popup

                abrirModal("completado");

            }

        }
    );

}

    });

}
