// ========================================
// ANXANWOMAN - SISTEMA DE RAYOS
// ========================================

// Recuperar Rayos guardados
let rayos = Number(
    localStorage.getItem("anxanRayos")
) || 0;


// ========================================
// ACTUALIZAR CONTADOR
// ========================================

function actualizarRayos() {

    const contador =
        document.getElementById("header-points");

    if (contador) {
        contador.textContent = rayos;
    }

}

actualizarRayos();


// ========================================
// VENTANA CENTRAL
// ========================================

const modal =
    document.getElementById("anxan-modal");

function mostrarVentana(icono, titulo, texto, premio = "") {

    if (!modal) return;

    document.getElementById("modal-icon").textContent =
        icono;

    document.getElementById("modal-title").textContent =
        titulo;

    document.getElementById("modal-text").textContent =
        texto;

    const recompensa =
        document.getElementById("modal-reward");

    recompensa.textContent = premio;

    recompensa.style.display =
        premio ? "inline-block" : "none";

    document.getElementById("modal-button").textContent =
        "CERRAR";

    modal.classList.add("show");

}


// Cerrar ventana

document.getElementById("modal-button")
    ?.addEventListener("click", function() {

        modal.classList.remove("show");

    });


// Cerrar pulsando fuera

modal?.addEventListener("click", function(event) {

    if (event.target === modal) {
        modal.classList.remove("show");
    }

});


// ========================================
// TU PROGRESO
// ========================================

document.getElementById("progress-button")
    ?.addEventListener("click", function() {

        const nivel =
            Math.floor(rayos / 500) + 1;

        const progreso =
            rayos % 500;

        mostrarVentana(

            "⚡",

            "TU PROGRESO",

            "NIVEL " + nivel +
            "\n\n" +
            "⚡ " + rayos + " RAYOS" +
            "\n\n" +
            "Próximo nivel: " +
            progreso + " / 500 ⚡" +
            "\n\n" +
            "🔥 Racha: próximamente"

        );

    });


// ========================================
// TOP COMUNIDAD
// ========================================

document.getElementById("ranking-button")
    ?.addEventListener("click", function() {

        mostrarVentana(

            "🏆",

            "TOP COMUNIDAD",

            "🥇 Próximamente" +
            "\n\n" +
            "🥈 Próximamente" +
            "\n\n" +
            "🥉 Próximamente" +
            "\n\n" +
            "¡Muy pronto podrás competir!"

        );

    });


// ========================================
// RETO DEL DÍA
// ========================================

const botonReto =
    document.getElementById("challenge-button");

if (botonReto) {

    let aceptado =
        localStorage.getItem("retoAceptado") === "true";

    let completado =
        localStorage.getItem("retoCompletado") === "true";


    // Recuperar estado guardado

    if (completado) {

        botonReto.textContent =
            "✅ RETO COMPLETADO";

        botonReto.disabled = true;

    } else if (aceptado) {

        botonReto.textContent =
            "🏆 COMPLETAR RETO";

    }


    // Pulsar botón

    botonReto.addEventListener("click", function() {

        // Aceptar

        if (!aceptado) {

            aceptado = true;

            localStorage.setItem(
                "retoAceptado",
                "true"
            );

            botonReto.textContent =
                "🏆 COMPLETAR RETO";

            mostrarVentana(

                "🔥",

                "¡RETO ACEPTADO!",

                "Completa el reto y vuelve para reclamar tus Rayos.",

                "+50 ⚡"

            );

        }

        // Completar

        else if (!completado) {

            completado = true;

            rayos += 50;

            localStorage.setItem(
                "anxanRayos",
                rayos
            );

            localStorage.setItem(
                "retoCompletado",
                "true"
            );

            actualizarRayos();

            botonReto.textContent =
                "✅ RETO COMPLETADO";

            botonReto.disabled = true;

            mostrarVentana(

                "⚡",

                "¡RETO COMPLETADO!",

                "¡Has conseguido 50 Rayos! Ahora tienes " +
                rayos + " ⚡",

                "+50 ⚡"

            );

        }

    });

}
