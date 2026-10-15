
/* ==========================================
   ANXANWOMAN - RAYITOS POR CUENTA
   Firebase Authentication + Firestore

   Cada reto diario reclamado = 10 Rayitos.
   El saldo se calcula con los registros
   guardados en Firebase, no en localStorage.
========================================== */

"use strict";

let rayos = 0;
let usuarioActual = null;
let firebaseListo = false;
let procesandoReto = false;
let retoAceptado = false;
let retoCompletado = false;

let auth;
let db;
let firebaseFns = {};

const $ = id => document.getElementById(id);

/* ==========================================
   MODAL ORIGINAL
========================================== */

const modal = $("anxan-modal");

function mostrarVentana(icono, titulo, texto, premio = "") {
    if (!modal) return;

    const modalIcon = $("modal-icon");
    const modalTitle = $("modal-title");
    const modalText = $("modal-text");
    const recompensa = $("modal-reward");
    const modalButton = $("modal-button");

    if (modalIcon) modalIcon.textContent = icono;
    if (modalTitle) modalTitle.textContent = titulo;
    if (modalText) modalText.textContent = texto;

    if (recompensa) {
        recompensa.textContent = premio;
        recompensa.style.display =
            premio ? "inline-block" : "none";
    }

    if (modalButton) {
        modalButton.textContent = "CERRAR";
    }

    modal.classList.add("show");
}

$("modal-button")?.addEventListener("click", () => {
    modal?.classList.remove("show");
});

modal?.addEventListener("click", event => {
    if (event.target === modal) {
        modal.classList.remove("show");
    }
});

/* ==========================================
   CONTADOR DE RAYITOS
========================================== */

function pintarRayos() {
    const contador = $("header-points");

    if (contador) {
        contador.textContent = firebaseListo
            ? String(rayos)
            : "…";
    }
}

function rutaRecompensas(uid) {
    return firebaseFns.collection(
        db,
        "usuarios",
        uid,
        "recompensas_diarias"
    );
}

/*
   Usamos fechas UTC para que el mismo
   día de Firebase tenga una única clave
   independientemente del dispositivo.
*/
function obtenerFechaReto() {
    return new Date().toISOString().slice(0, 10);
}

function claveAceptacion(uid, fecha) {
    return "anxanRetoAceptado_v2_" +
        uid + "_" + fecha;
}

/*
   El contador es el número de recompensas
   registradas multiplicado por 10.
*/
async function actualizarRayos() {
    if (!firebaseListo || !usuarioActual) {
        rayos = 0;
        pintarRayos();
        return;
    }

    const uid = usuarioActual.uid;

    try {
        const resultado =
            await firebaseFns.getCountFromServer(
                rutaRecompensas(uid)
            );

        if (!usuarioActual ||
            usuarioActual.uid !== uid) {
            return;
        }

        rayos = resultado.data().count * 10;
        pintarRayos();

    } catch (error) {
        console.error(
            "Error al consultar Rayitos:",
            error
        );

        if (usuarioActual?.uid === uid) {
            firebaseListo = false;
            pintarRayos();
        }
    }
}

/* ==========================================
   PROGRESO
========================================== */

$("progress-button")?.addEventListener(
    "click",
    async () => {
        if (!usuarioActual) {
            mostrarVentana(
                "🔐",
                "INICIA SESIÓN",
                "Inicia sesión para guardar tus Rayitos y tu progreso."
            );
            return;
        }

        await actualizarRayos();

        if (!firebaseListo) {
            mostrarVentana(
                "⚠️",
                "PROGRESO NO DISPONIBLE",
                "No hemos podido consultar tus Rayitos. Inténtalo de nuevo."
            );
            return;
        }

        const nivel = Math.floor(rayos / 500) + 1;
        const progreso = rayos % 500;

        mostrarVentana(
            "⚡",
            "TU PROGRESO",
            "NIVEL " + nivel +
            "\n\n⚡ " + rayos + " RAYITOS" +
            "\n\nPróximo nivel: " +
            progreso + " / 500 ⚡" +
            "\n\n🔥 Racha: próximamente"
        );
    }
);

/* ==========================================
   TOP COMUNIDAD
========================================== */

$("ranking-button")?.addEventListener(
    "click",
    () => {
        mostrarVentana(
            "🏆",
            "TOP COMUNIDAD",
            "🥇 Próximamente" +
            "\n\n🥈 Próximamente" +
            "\n\n🥉 Próximamente" +
            "\n\n¡Muy pronto podrás competir!"
        );
    }
);

/* ==========================================
   RETOS DIARIOS ORIGINALES
========================================== */

const retosDiarios = [
    {
        titulo: "VICTORIA CON UN BRAWLER ALEATORIO",
        texto: "Juega con un Brawler elegido al azar y consigue una victoria."
    },
    {
        titulo: "GANA SIN CAMBIAR DE BRAWLER",
        texto: "Consigue 2 victorias seguidas utilizando el mismo Brawler."
    },
    {
        titulo: "RETO SIN GADGET",
        texto: "Consigue una victoria sin utilizar ningún gadget."
    },
    {
        titulo: "CAMBIA DE CLASE",
        texto: "Juega 3 partidas usando Brawlers de clases diferentes."
    },
    {
        titulo: "TU BRAWLER MENOS USADO",
        texto: "Elige uno de tus Brawlers menos utilizados y consigue una victoria."
    },
    {
        titulo: "RETO SUPERVIVENCIA",
        texto: "Termina entre los 4 primeros en Supervivencia."
    },
    {
        titulo: "RETO DEL AZAR",
        texto: "Usa la Ruleta de AnxanWoman y juega una partida con el Brawler que te toque."
    }
];

function obtenerRetoDelDia() {
    const fecha = obtenerFechaReto();

    let numero = 0;

    for (let i = 0; i < fecha.length; i++) {
        numero += fecha.charCodeAt(i);
    }

    return retosDiarios[numero % retosDiarios.length];
}

/* ==========================================
   CONSULTAR RETO EN FIREBASE
========================================== */

async function comprobarRetoCompletado() {
    if (!usuarioActual || !firebaseListo) {
        retoCompletado = false;
        return;
    }

    const uid = usuarioActual.uid;
    const fecha = obtenerFechaReto();

    const referencia = firebaseFns.doc(
        db,
        "usuarios",
        uid,
        "recompensas_diarias",
        fecha
    );

    const resultado =
        await firebaseFns.getDoc(referencia);

    if (usuarioActual?.uid === uid) {
        retoCompletado = resultado.exists();
    }
}

/* ==========================================
   MOSTRAR RETO DIARIO
========================================== */

function cargarRetoDiario() {
    const titulo = $("daily-challenge-title");
    const texto = $("daily-challenge-text");
    const boton = $("daily-challenge-button");

    if (!titulo || !texto || !boton) return;

    const reto = obtenerRetoDelDia();

    titulo.textContent = reto.titulo;
    texto.textContent = reto.texto;

    if (!usuarioActual) {
        boton.textContent =
            "🔐 INICIA SESIÓN PARA PARTICIPAR";
        boton.disabled = false;
        return;
    }

    if (!firebaseListo || procesandoReto) {
        boton.textContent = "⏳ CARGANDO RETO...";
        boton.disabled = true;
        return;
    }

    if (retoCompletado) {
        boton.textContent =
            "✅ RETO COMPLETADO · +10 ⚡";
        boton.disabled = true;
        return;
    }

    if (retoAceptado) {
        boton.textContent =
            "🏆 HE COMPLETADO EL RETO";
        boton.disabled = false;
        return;
    }

    boton.textContent =
        "🎯 ACEPTAR RETO · +10 ⚡";
    boton.disabled = false;
}

/* ==========================================
   SINCRONIZAR CUENTA Y RETO
========================================== */

async function sincronizarProgreso() {
    const uid = usuarioActual?.uid;

    if (!uid) {
        firebaseListo = false;
        rayos = 0;
        retoAceptado = false;
        retoCompletado = false;
        pintarRayos();
        cargarRetoDiario();
        return;
    }

    firebaseListo = true;

    retoAceptado =
        localStorage.getItem(
            claveAceptacion(
                uid,
                obtenerFechaReto()
            )
        ) === "true";

    try {
        await Promise.all([
            actualizarRayos(),
            comprobarRetoCompletado()
        ]);

        if (usuarioActual?.uid !== uid) return;

    } catch (error) {
        console.error(
            "No se pudo cargar el reto:",
            error
        );

        firebaseListo = false;
    }

    cargarRetoDiario();
}

/* ==========================================
   ACEPTAR Y RECLAMAR RETO
========================================== */

$("daily-challenge-button")?.addEventListener(
    "click",
    async () => {
        if (procesandoReto) return;

        if (!usuarioActual) {
            window.location.href = "login.html";
            return;
        }

        if (!firebaseListo) {
            await sincronizarProgreso();
            return;
        }

        const uid = usuarioActual.uid;
        const fecha = obtenerFechaReto();

        if (retoCompletado) {
            cargarRetoDiario();
            return;
        }

        if (!retoAceptado) {
            retoAceptado = true;

            localStorage.setItem(
                claveAceptacion(uid, fecha),
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

        procesandoReto = true;
        cargarRetoDiario();

        try {
            const referencia = firebaseFns.doc(
                db,
                "usuarios",
                uid,
                "recompensas_diarias",
                fecha
            );

            /*
               createDoc no existe en el SDK web.
               Usamos una transacción que solo
               crea el documento si no existe.
               Las reglas impiden modificarlo.
            */
            await firebaseFns.runTransaction(
                db,
                async transaction => {
                    const existente =
                        await transaction.get(referencia);

                    if (existente.exists()) {
                        return;
                    }

                    transaction.set(referencia, {
                        puntos: 10,
                        fecha: fecha,
                        creadoEn:
                            firebaseFns.serverTimestamp()
                    });
                }
            );

            if (usuarioActual?.uid !== uid) return;

            await comprobarRetoCompletado();
            await actualizarRayos();

            if (!retoCompletado) {
                throw new Error(
                    "No se pudo confirmar la recompensa."
                );
            }

            mostrarVentana(
                "⚡",
                "¡RETO COMPLETADO!",
                "¡Buen trabajo! Ya tienes " +
                rayos + " Rayitos.",
                "+10 ⚡ RAYITOS"
            );

        } catch (error) {
            console.error(
                "Error al reclamar el reto:",
                error
            );

            mostrarVentana(
                "⚠️",
                "NO SE PUDO GUARDAR",
                "No hemos podido confirmar tu recompensa en Firebase. Comprueba tu conexión e inténtalo de nuevo."
            );

        } finally {
            procesandoReto = false;
            cargarRetoDiario();
        }
    }
);

/* ==========================================
   FIREBASE
========================================== */

async function iniciarFirebase() {
    try {
        const appSDK = await import(
            "https://www.gstatic.com/firebasejs/12.4.0/firebase-app.js"
        );

        const authSDK = await import(
            "https://www.gstatic.com/firebasejs/12.4.0/firebase-auth.js"
        );

        const firestoreSDK = await import(
            "https://www.gstatic.com/firebasejs/12.4.0/firebase-firestore.js"
        );

        const firebaseConfig = {
            apiKey: "AIzaSyAs6sUeZNNisoiXsYAspHow1Z2iOwv9TVg",
            authDomain: "anxanwoman.firebaseapp.com",
            projectId: "anxanwoman",
            storageBucket: "anxanwoman.firebasestorage.app",
            messagingSenderId: "366283389190",
            appId: "1:366283389190:web:60115f7658d96304688687",
            measurementId: "G-6DN2N02ZPG"
        };

        const app = appSDK.getApps().length
            ? appSDK.getApp()
            : appSDK.initializeApp(firebaseConfig);

        auth = authSDK.getAuth(app);
        db = firestoreSDK.getFirestore(app);

        firebaseFns = {
            collection: firestoreSDK.collection,
            doc: firestoreSDK.doc,
            getDoc: firestoreSDK.getDoc,
            getCountFromServer:
                firestoreSDK.getCountFromServer,
            runTransaction: firestoreSDK.runTransaction,
            serverTimestamp:
                firestoreSDK.serverTimestamp
        };

        authSDK.onAuthStateChanged(
            auth,
            async user => {
                usuarioActual = user;
                rayos = 0;
                firebaseListo = false;
                retoAceptado = false;
                retoCompletado = false;

                pintarRayos();
                cargarRetoDiario();

                await sincronizarProgreso();
            },
            error => {
                console.error(
                    "Error de autenticación:",
                    error
                );

                usuarioActual = null;
                firebaseListo = false;
                rayos = 0;

                pintarRayos();
                cargarRetoDiario();
            }
        );

    } catch (error) {
        console.error(
            "No se pudo iniciar Firebase:",
            error
        );

        firebaseListo = false;
        pintarRayos();
        cargarRetoDiario();
    }
}

/* ==========================================
   ACTUALIZAR AL REGRESAR
========================================== */

document.addEventListener(
    "visibilitychange",
    () => {
        if (!document.hidden && usuarioActual) {
            sincronizarProgreso();
        }
    }
);

window.addEventListener(
    "pageshow",
    () => {
        if (usuarioActual) {
            sincronizarProgreso();
        }
    }
);

/* ==========================================
   INICIO
========================================== */

pintarRayos();
cargarRetoDiario();
iniciarFirebase();
