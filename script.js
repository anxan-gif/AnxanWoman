// ========================================
// ANXANWOMAN - SISTEMA DE RAYITOS
// ========================================

let rayos = Number(
    localStorage.getItem("anxanRayos")
) || 0;


// ========================================
// ACTUALIZAR CONTADOR
// ========================================

function actualizarRayos() {

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
    ).textContent = icono;

    document.getElementById(
        "modal-title"
    ).textContent = titulo;

    document.getElementById(
        "modal-text"
    ).textContent = texto;


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


// Cerrar pulsando fuera

modal?.addEventListener(

    "click",

    function(event) {

        if (event.target === modal) {

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
// RETOS DIARIOS
// ========================================

const retosDiarios = [

    {
        titulo:
            "VICTORIA CON UN BRAWLER ALEATORIO",

        texto:
            "Juega con un Brawler elegido al azar y consigue una victoria."
    },

    {
        titulo:
            "GANA SIN CAMBIAR DE BRAWLER",

        texto:
            "Consigue 2 victorias seguidas utilizando el mismo Brawler."
    },

    {
        titulo:
            "RETO SIN GADGET",

        texto:
            "Consigue una victoria sin utilizar ningún gadget."
    },

    {
        titulo:
            "CAMBIA DE CLASE",

        texto:
            "Juega 3 partidas usando Brawlers de clases diferentes."
    },

    {
        titulo:
            "TU BRAWLER MENOS USADO",

        texto:
            "Elige uno de tus Brawlers menos utilizados y consigue una victoria."
    },

    {
        titulo:
            "RETO SUPERVIVENCIA",

        texto:
            "Termina entre los 4 primeros en Supervivencia."
    },

    {
        titulo:
            "RETO DEL AZAR",

        texto:
            "Usa la Ruleta de AnxanWoman y juega una partida con el Brawler que te toque."
    }

];


// ========================================
// FECHA LOCAL
// ========================================

function obtenerFechaReto() {

    const hoy =
        new Date();

    const año =
        hoy.getFullYear();

    const mes =
        String(
            hoy.getMonth() + 1
        ).padStart(
            2,
            "0"
        );

    const dia =
        String(
            hoy.getDate()
        ).padStart(
            2,
            "0"
        );

    return (
        año +
        "-" +
        mes +
        "-" +
        dia
    );

}


// ========================================
// RETO DEL DÍA
// ========================================

function obtenerRetoDelDia() {

    const hoy =
        new Date();

    const inicio =
        new Date(
            hoy.getFullYear(),
            0,
            0
        );

    const diferencia =
        hoy - inicio;

    const numeroDia =
        Math.floor(
            diferencia /
            86400000
        );

    return retosDiarios[
        numeroDia %
        retosDiarios.length
    ];

}


// ========================================
// CARGAR RETO
// ========================================

function cargarRetoDiario() {

    const titulo =
        document.getElementById(
            "daily-challenge-title"
        );

    const texto =
        document.getElementById(
            "daily-challenge-text"
        );

    const boton =
        document.getElementById(
            "daily-challenge-button"
        );


    if (
        !titulo ||
        !texto ||
        !boton
    ) {

        return;

    }


    const fechaHoy =
        obtenerFechaReto();

    const reto =
        obtenerRetoDelDia();

    const fechaGuardada =
        localStorage.getItem(
            "anxanRetoFecha"
        );


    // Nuevo día:
    // reiniciar reto.

    if (
        fechaGuardada !==
        fechaHoy
    ) {

        localStorage.setItem(
            "anxanRetoFecha",
            fechaHoy
        );

        localStorage.removeItem(
            "anxanRetoAceptado"
        );

        localStorage.removeItem(
            "anxanRetoCompletado"
        );

    }


    const aceptado =
        localStorage.getItem(
            "anxanRetoAceptado"
        ) === "true";


    const completado =
        localStorage.getItem(
            "anxanRetoCompletado"
        ) === "true";


    titulo.textContent =
        reto.titulo;

    texto.textContent =
        reto.texto;


    if (completado) {

        boton.textContent =
            "✅ RETO COMPLETADO · +10 ⚡";

        boton.disabled =
            true;

    }

    else if (aceptado) {

        boton.textContent =
            "🏆 HE COMPLETADO EL RETO";

        boton.disabled =
            false;

    }

    else {

        boton.textContent =
            "🎯 ACEPTAR RETO · +10 ⚡";

        boton.disabled =
            false;

    }

}


// ========================================
// BOTÓN RETO DIARIO
// ========================================

document.getElementById(
    "daily-challenge-button"
)?.addEventListener(

    "click",

    function() {

        const aceptado =
            localStorage.getItem(
                "anxanRetoAceptado"
            ) === "true";


        const completado =
            localStorage.getItem(
                "anxanRetoCompletado"
            ) === "true";


        // -----------------------------
        // ACEPTAR RETO
        // -----------------------------

        if (!aceptado) {

            localStorage.setItem(
                "anxanRetoAceptado",
                "true"
            );


            mostrarVentana(

                "🎯",

                "¡RETO ACEPTADO!",

                "Completa el reto y vuelve para reclamar tu recompensa.",

                "+10 ⚡ AL COMPLETARLO"

            );


            cargarRetoDiario();

            return;

        }


        // -----------------------------
        // COMPLETAR RETO
        // -----------------------------

        if (!completado) {

            let saldoActual =
                Number(
                    localStorage.getItem(
                        "anxanRayos"
                    )
                ) || 0;


            // PREMIO DIARIO

            saldoActual += 10;


            localStorage.setItem(
                "anxanRayos",
                saldoActual
            );


            localStorage.setItem(
                "anxanRetoCompletado",
                "true"
            );


            actualizarRayos();


            mostrarVentana(

                "⚡",

                "¡RETO COMPLETADO!",

                "Has completado el reto diario.",

                "+10 ⚡ RAYITOS"

            );


            cargarRetoDiario();

        }

    }

);


// ========================================
// INICIAR RETO
// ========================================

cargarRetoDiario();


// ========================================
// ACTUALIZAR AL VOLVER A LA WEB
// ========================================

document.addEventListener(

    "visibilitychange",

    function() {

        if (!document.hidden) {

            actualizarRayos();

            cargarRetoDiario();

        }

    }

);
