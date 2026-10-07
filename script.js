// ========================================
// ANXANWOMAN - SISTEMA DE RAYITOS
// ========================================

let rayos = 0;


// ========================================
// OBTENER RAYITOS
// ========================================

function obtenerRayos() {

    const guardados =
        parseInt(
            localStorage.getItem("anxanRayos"),
            10
        );

    return Number.isNaN(guardados)
        ? 0
        : guardados;

}


// ========================================
// ACTUALIZAR CONTADOR
// ========================================

function actualizarRayos() {

    rayos = obtenerRayos();

    const contador =
        document.getElementById(
            "header-points"
        );

    if (contador) {

        contador.textContent =
            rayos;

    }

}


// ========================================
// SUMAR RAYITOS
// ========================================

function sumarRayitos(cantidad) {

    const saldoActual =
        obtenerRayos();

    const nuevoSaldo =
        saldoActual + cantidad;

    localStorage.setItem(
        "anxanRayos",
        String(nuevoSaldo)
    );

    rayos = nuevoSaldo;

    actualizarRayos();

    return nuevoSaldo;

}


// Primera actualización

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


    const modalIcon =
        document.getElementById(
            "modal-icon"
        );

    const modalTitle =
        document.getElementById(
            "modal-title"
        );

    const modalText =
        document.getElementById(
            "modal-text"
        );

    const recompensa =
        document.getElementById(
            "modal-reward"
        );

    const modalButton =
        document.getElementById(
            "modal-button"
        );


    if (modalIcon) {
        modalIcon.textContent = icono;
    }

    if (modalTitle) {
        modalTitle.textContent = titulo;
    }

    if (modalText) {
        modalText.textContent = texto;
    }

    if (recompensa) {

        recompensa.textContent =
            premio;

        recompensa.style.display =
            premio
                ? "inline-block"
                : "none";

    }

    if (modalButton) {

        modalButton.textContent =
            "CERRAR";

    }


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
// ELEGIR RETO DEL DÍA
// ========================================

function obtenerRetoDelDia() {

    const fecha =
        obtenerFechaReto();

    let numero = 0;

    for (
        let i = 0;
        i < fecha.length;
        i++
    ) {

        numero +=
            fecha.charCodeAt(i);

    }

    return retosDiarios[
        numero %
        retosDiarios.length
    ];

}


// ========================================
// REINICIAR SI ES UN NUEVO DÍA
// ========================================

function comprobarNuevoDia() {

    const fechaHoy =
        obtenerFechaReto();

    const fechaGuardada =
        localStorage.getItem(
            "anxanRetoFecha"
        );


    if (fechaGuardada !== fechaHoy) {

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

}


// ========================================
// MOSTRAR RETO
// ========================================

function cargarRetoDiario() {

    comprobarNuevoDia();


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


    const reto =
        obtenerRetoDelDia();


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

        return;

    }


    if (aceptado) {

        boton.textContent =
            "🏆 HE COMPLETADO EL RETO";

        boton.disabled =
            false;

        return;

    }


    boton.textContent =
        "🎯 ACEPTAR RETO · +10 ⚡";

    boton.disabled =
        false;

}


// ========================================
// BOTÓN DEL RETO
// ========================================

const botonReto =
    document.getElementById(
        "daily-challenge-button"
    );


botonReto?.addEventListener(

    "click",

    function() {

        comprobarNuevoDia();


        const aceptado =
            localStorage.getItem(
                "anxanRetoAceptado"
            ) === "true";


        const completado =
            localStorage.getItem(
                "anxanRetoCompletado"
            ) === "true";


        // =================================
        // YA COMPLETADO
        // =================================

        if (completado) {

            cargarRetoDiario();

            return;

        }


        // =================================
        // PRIMER CLIC: ACEPTAR RETO
        // =================================

        if (!aceptado) {

            localStorage.setItem(
                "anxanRetoAceptado",
                "true"
            );


            cargarRetoDiario();


            mostrarVentana(

                "🎯",

                "¡RETO ACEPTADO!",

                "Completa el reto y vuelve para reclamar tu recompensa.",

                "+10 ⚡ AL COMPLETARLO"

            );


            return;

        }


        // =================================
        // SEGUNDO CLIC: COMPLETAR Y COBRAR
        // =================================

        localStorage.setItem(
            "anxanRetoCompletado",
            "true"
        );


        const nuevoSaldo =
            sumarRayitos(10);


        cargarRetoDiario();


        mostrarVentana(

            "⚡",

            "¡RETO COMPLETADO!",

            "¡Buen trabajo! Ya tienes " +
            nuevoSaldo +
            " Rayitos.",

            "+10 ⚡ RAYITOS"

        );

    }

);


// ========================================
// INICIAR RETO
// ========================================

cargarRetoDiario();

actualizarRayos();


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


// También actualizar si volvemos
// mediante el botón atrás del navegador.

window.addEventListener(

    "pageshow",

    function() {

        actualizarRayos();

        cargarRetoDiario();

    }

);
