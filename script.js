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
// RETO DEL DÍA - REINICIO DIARIO
// ========================================

const botonReto =
    document.getElementById("challenge-button");


// Fecha local del móvil, en formato AAAA-MM-DD
function obtenerFechaHoy() {

    const ahora = new Date();

    const año = ahora.getFullYear();

    const mes = String(
        ahora.getMonth() + 1
    ).padStart(2, "0");

    const dia = String(
        ahora.getDate()
    ).padStart(2, "0");

    return año + "-" + mes + "-" + dia;

}


if (botonReto) {

    let aceptado =
        localStorage.getItem("retoAceptado") === "true";

    let completado =
        localStorage.getItem("retoCompletado") === "true";


    // ====================================
    // COMPROBAR SI HA CAMBIADO EL DÍA
    // ====================================

    function comprobarNuevoDia() {

        const hoy = obtenerFechaHoy();

        const fechaGuardada =
            localStorage.getItem("fechaReto");


        // Si nunca guardamos una fecha,
        // conservamos el estado actual.
        // Así no perdemos tus 50 Rayitos.

        if (!fechaGuardada) {

            localStorage.setItem(
                "fechaReto",
                hoy
            );

        }


        // Si la fecha es distinta,
        // empieza un reto nuevo.

        else if (fechaGuardada !== hoy) {

            aceptado = false;

            completado = false;

            localStorage.setItem(
                "retoAceptado",
                "false"
            );

            localStorage.setItem(
                "retoCompletado",
                "false"
            );

            localStorage.setItem(
                "fechaReto",
                hoy
            );

        }


        // Actualizar aspecto del botón

        if (completado) {

            botonReto.textContent =
                "✅ RETO COMPLETADO";

            botonReto.disabled = true;

        }

        else if (aceptado) {

            botonReto.textContent =
                "🏆 COMPLETAR RETO";

            botonReto.disabled = false;

        }

        else {

            botonReto.textContent =
                "🔥 ACEPTO EL RETO";

            botonReto.disabled = false;

        }

    }


    // Comprobar al abrir la web

    comprobarNuevoDia();


    // ====================================
    // PULSAR EL BOTÓN DEL RETO
    // ====================================

    botonReto.addEventListener(
        "click",
        function() {

            comprobarNuevoDia();


            // ACEPTAR RETO

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


            // COMPLETAR RETO

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

                    "¡Has conseguido 50 Rayitos! Ahora tienes " +
                    rayos + " ⚡",

                    "+50 ⚡"

                );

            }

        }
    );


    // Si vuelves a la pestaña al día
    // siguiente, actualizar el reto.

    document.addEventListener(
        "visibilitychange",
        function() {

            if (!document.hidden) {

                comprobarNuevoDia();

            }

        }
    );

}
