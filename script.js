// ========================================
// ANXANWOMAN - SISTEMA DE RAYOS
// ========================================

// Recuperar los Rayos guardados
let rayos = parseInt(
    localStorage.getItem("anxanRayos"),
    10
) || 0;


// ========================================
// ELEMENTOS DE LA PÁGINA
// ========================================

const headerPoints =
    document.getElementById("header-points");

const points =
    document.getElementById("points");

const challengeButton =
    document.getElementById("challenge-button");

const progressButton =
    document.getElementById("progress-button");

const rankingButton =
    document.getElementById("ranking-button");


// Elementos de la ventana

const modal =
    document.getElementById("anxan-modal");

const modalIcon =
    document.getElementById("modal-icon");

const modalTitle =
    document.getElementById("modal-title");

const modalText =
    document.getElementById("modal-text");

const modalReward =
    document.getElementById("modal-reward");

const modalButton =
    document.getElementById("modal-button");


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

actualizarRayos();


// ========================================
// SISTEMA DE NIVELES
// ========================================

// Por ahora: 500 Rayos por nivel.
// Lo podremos cambiar más adelante.

function obtenerNivel() {

    return Math.floor(rayos / 500) + 1;

}


// ========================================
// VENTANA ANXANWOMAN
// ========================================

function mostrarVentana(
    icono,
    titulo,
    texto,
    recompensa,
    boton
) {

    if (!modal) {
        return;
    }

    modalIcon.textContent = icono;

    modalTitle.textContent = titulo;

    modalText.textContent = texto;

    modalReward.textContent = recompensa;

    modalButton.textContent = boton;

    // Ocultar el recuadro de recompensa
    // cuando no haya una cantidad que mostrar

    modalReward.style.display =
        recompensa ? "inline-block" : "none";

    modal.classList.add("show");

}


// ========================================
// CERRAR VENTANA
// ========================================

function cerrarVentana() {

    if (modal) {
        modal.classList.remove("show");
    }

}


if (modalButton) {

    modalButton.addEventListener(
        "click",
        cerrarVentana
    );

}


// Cerrar pulsando fuera de la tarjeta

if (modal) {

    modal.addEventListener(
        "click",
        function(event) {

            if (event.target === modal) {
                cerrarVentana();
            }

        }
    );

}


// ========================================
// BOTÓN: TU PROGRESO
// ========================================

if (progressButton) {

    progressButton.addEventListener(
        "click",
        function() {

            const nivel = obtenerNivel();

            const progresoNivel = rayos % 500;

            mostrarVentana(

                "⚡",

                "TU PROGRESO",

                "NIVEL " + nivel +
                " · " + rayos + " RAYOS ⚡" +
                "\n\n" +
                "Próximo nivel: " +
                progresoNivel + " / 500 ⚡" +
                "\n\n" +
                "Racha: próximamente 🔥",

                "",

                "CERRAR"

            );

        }
    );

}


// ========================================
// BOTÓN: TOP COMUNIDAD
// ========================================

if (rankingButton) {

    rankingButton.addEventListener(
        "click",
        function() {

            mostrarVentana(

                "🏆",

                "TOP COMUNIDAD",

                "🥇 Próximamente" +
                "\n\n" +
                "🥈 Próximamente" +
                "\n\n" +
                "🥉 Próximamente" +
                "\n\n" +
                "¡Muy pronto podrás competir " +
                "con toda la comunidad!",

                "",

                "CERRAR"

            );

        }
    );

}


// ========================================
// RETO DEL DÍA
// ========================================

if (challengeButton) {

    let retoAceptado =
        localStorage.getItem("retoAceptado")
        === "true";

    let retoCompletado =
        localStorage.getItem("retoCompletado")
        === "true";


    // Recuperar estado anterior

    if (retoCompletado) {

        challengeButton.textContent =
            "✅ RETO COMPLETADO";

        challengeButton.disabled = true;

    }

    else if (retoAceptado) {

        challengeButton.textContent =
            "🏆 COMPLETAR RETO";

    }


    // ====================================
    // CLICK EN EL RETO
    // ====================================

    challengeButton.addEventListener(
        "click",
        function() {


            // ACEPTAR RETO

            if (!retoAceptado) {

                retoAceptado = true;

                localStorage.setItem(
                    "retoAceptado",
                    "true"
                );

                challengeButton.textContent =
                    "🏆 COMPLETAR RETO";

                mostrarVentana(

                    "🔥",

                    "¡RETO ACEPTADO!",

                    "Completa el reto y vuelve " +
                    "para reclamar tu recompensa.",

                    "+50 ⚡",

                    "¡A POR ELLO!"

                );

            }


            // COMPLETAR RETO

            else if (!retoCompletado) {

                retoCompletado = true;

                rayos += 50;


                // Guardar Rayos

                localStorage.setItem(
                    "anxanRayos",
                    rayos
                );


                // Guardar reto completado

                localStorage.setItem(
                    "retoCompletado",
                    "true"
                );


                // Actualizar contador

                actualizarRayos();


                // Actualizar botón

                challengeButton.textContent =
                    "✅ RETO COMPLETADO";

                challengeButton.disabled = true;


                // Mostrar recompensa

                mostrarVentana(

                    "⚡",

                    "¡RETO COMPLETADO!",

                    "¡Has conseguido 50 Rayos!" +
                    "\n\n" +
                    "Ahora tienes " +
                    rayos + " ⚡",

                    "+50 ⚡",

                    "¡GENIAL!"

                );

            }

        }
    );

}
