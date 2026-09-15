// ========================================
// SISTEMA DE RAYOS - ANXANWOMAN
// ========================================


// Recuperamos los rayos guardados
let rayos = parseInt(localStorage.getItem("anxanRayos")) || 0;


// Elementos de la página
const headerPoints = document.getElementById("header-points");
const points = document.getElementById("points");
const challengeButton = document.getElementById("challenge-button");


// ========================================
// MOSTRAR RAYOS
// ========================================

function actualizarRayos() {

    if (headerPoints) {
        headerPoints.textContent = rayos;
    }

    if (points) {
        points.textContent = rayos;
    }

}


// Mostrar los rayos al cargar la página
actualizarRayos();


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

        challengeButton.textContent = "✅ RETO COMPLETADO";
        challengeButton.disabled = true;

    }

    // Si estaba aceptado pero no completado
    else if (retoAceptado) {

        challengeButton.textContent = "🏆 COMPLETAR RETO";

    }


    // Cuando pulsamos el botón
    challengeButton.addEventListener("click", function () {


        // PRIMER CLICK: aceptar reto

        if (!retoAceptado) {

            retoAceptado = true;

            localStorage.setItem(
                "retoAceptado",
                "true"
            );

            challengeButton.textContent =
                "🏆 COMPLETAR RETO";

            alert(
                "🔥 ¡Reto aceptado!\n\n" +
                "Completa el reto y vuelve para reclamar 50 ⚡"
            );

        }


        // SEGUNDO CLICK: completar reto

        else if (!retoCompletado) {

            retoCompletado = true;

            rayos += 50;


            // Guardamos los nuevos rayos
            localStorage.setItem(
                "anxanRayos",
                rayos
            );


            // Guardamos el reto como completado
            localStorage.setItem(
                "retoCompletado",
                "true"
            );


            // Actualizamos pantalla
            actualizarRayos();


            challengeButton.textContent =
                "✅ RETO COMPLETADO";

            challengeButton.disabled = true;


            alert(
                "⚡ ¡RETO COMPLETADO!\n\n" +
                "+50 RAYOS\n\n" +
                "Ahora tienes " + rayos + " ⚡"
            );

        }

    });

}
