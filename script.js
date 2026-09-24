
// ========================================
// ANXANWOMAN - SISTEMA DE RAYITOS
// ========================================

// Recuperar Rayitos guardados.

let rayos = Number(

    localStorage.getItem("anxanRayos")

) || 0;


// ========================================
// ACTUALIZAR CONTADOR
// ========================================

function actualizarRayos() {

    // Leer el saldo actualizado para
    // conservar también los Rayitos
    // ganados en el quiz o usados
    // en la ruleta.

    rayos = Number(

        localStorage.getItem("anxanRayos")

    ) || 0;

    const contador =

        document.getElementById(
            "header-points"
        );

    if (contador) {

        contador.textContent =
            rayos;

    }

}

actualizarRayos();


// ========================================
// VENTANA CENTRAL
// ========================================

const modal =

    document.getElementById(
        "anxan-modal"
    );


function mostrarVentana(
    icono,
    titulo,
    texto,
    premio = ""
) {

    if (!modal) return;

    document.getElementById(

        "modal-icon"

    ).textContent =
        icono;

    document.getElementById(

        "modal-title"

    ).textContent =
        titulo;

    document.getElementById(

        "modal-text"

    ).textContent =
        texto;


    const recompensa =

        document.getElementById(
            "modal-reward"
        );

    recompensa.textContent =
        premio;

    recompensa.style.display =

        premio
            ? "inline-block"
            : "none";


    document.getElementById(

        "modal-button"

    ).textContent =
        "CERRAR";


    modal.classList.add(
        "show"
    );

}


// ========================================
// CERRAR VENTANA
// ========================================

document.getElementById(

    "modal-button"

)?.addEventListener(

    "click",

    function() {

        modal?.classList.remove(
            "show"
        );

    }

);


// Cerrar pulsando fuera.

modal?.addEventListener(

    "click",

    function(event) {

        if (
            event.target === modal
        ) {

            modal.classList.remove(
                "show"
            );

        }

    }

);


// ========================================
// TU PROGRESO
// ========================================

document.getElementById(

    "progress-button"

)?.addEventListener(

    "click",

    function() {

        actualizarRayos();

        const nivel =

            Math.floor(
                rayos / 500
            ) + 1;

        const progreso =

            rayos % 500;


        mostrarVentana(

            "⚡",

            "TU PROGRESO",

            "NIVEL " +
            nivel +

            "\n\n" +

            "⚡ " +
            rayos +
            " RAYITOS" +

            "\n\n" +

            "Próximo nivel: " +
            progreso +
            " / 500 ⚡" +

            "\n\n" +

            "🔥 Racha: próximamente"

        );

    }

);


// ========================================
// TOP COMUNIDAD
// ========================================

document.getElementById(

    "ranking-button"

)?.addEventListener(

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

            "¡Muy pronto podrás competir!"

        );

    }

);


// ========================================
// ACTUALIZAR AL VOLVER A LA WEB
// ========================================

document.addEventListener(

    "visibilitychange",

    function() {

        if (!document.hidden) {

            actualizarRayos();

        }

    }

);

