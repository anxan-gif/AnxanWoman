
import {
  initializeApp,
  getApp,
  getApps
} from "https://www.gstatic.com/firebasejs/12.4.0/firebase-app.js";

import {
  getAuth,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.4.0/firebase-auth.js";

import {
  getFirestore,
  collection,
  doc,
  getDocs,
  getCountFromServer,
  setDoc,
  addDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.4.0/firebase-firestore.js";

const config = {
  apiKey: "AIzaSyAs6sUeZNNisoiXsYAspHow1Z2iOwv9TVg",
  authDomain: "anxanwoman.firebaseapp.com",
  projectId: "anxanwoman",
  storageBucket: "anxanwoman.firebasestorage.app",
  messagingSenderId: "366283389190",
  appId: "1:366283389190:web:60115f7658d96304688687",
  measurementId: "G-6DN2N02ZPG"
};

const app = getApps().length
  ? getApp()
  : initializeApp(config);

const auth = getAuth(app);
const db = getFirestore(app);

export const fechaUTC = () =>
  new Date().toISOString().slice(0, 10);

export function esperarUsuario() {
  return new Promise((resolve, reject) => {
    const cancelar = onAuthStateChanged(
      auth,
      usuario => {
        cancelar();
        resolve(usuario);
      },
      error => {
        cancelar();
        reject(error);
      }
    );
  });
}

export async function consultarSaldo(usuario) {
  if (!usuario) return 0;

  const base = ["usuarios", usuario.uid];

  const [diarios, quiz, giros] = await Promise.all([
    getCountFromServer(
      collection(db, ...base, "recompensas_diarias")
    ),
    getCountFromServer(
      collection(db, ...base, "quiz_respuestas")
    ),
    getCountFromServer(
      collection(db, ...base, "ruleta_giros")
    )
  ]);

  // El quiz incluye respuestas incorrectas.
  // Por eso debemos consultar sus puntos reales.
  const respuestas = await getDocs(
    collection(db, ...base, "quiz_respuestas")
  );

  let ganadosQuiz = 0;

  respuestas.forEach(documento => {
    if (documento.data().puntos === 6) {
      ganadosQuiz += 6;
    }
  });

  return diarios.data().count * 10
    + ganadosQuiz
    - giros.data().count * 2;
}

export async function consultarRespuestas(usuario) {
  const resultado = await getDocs(
    collection(
      db,
      "usuarios",
      usuario.uid,
      "quiz_respuestas"
    )
  );

  const hoy = fechaUTC();
  const respuestas = [null, null];

  resultado.forEach(documento => {
    const dato = documento.data();

    if (
      dato.fecha === hoy &&
      (dato.numero === 0 || dato.numero === 1)
    ) {
      respuestas[dato.numero] = {
        elegida: dato.elegida,
        acierto: dato.acierto
      };
    }
  });

  return respuestas;
}

export async function guardarRespuesta(
  usuario,
  numero,
  elegida,
  acierto
) {
  const fecha = fechaUTC();

  const referencia = doc(
    db,
    "usuarios",
    usuario.uid,
    "quiz_respuestas",
    fecha + "_" + numero
  );

  await setDoc(referencia, {
    fecha,
    numero,
    elegida,
    acierto,
    puntos: acierto ? 6 : 0,
    creadoEn: serverTimestamp()
  });
}

export async function registrarGiro(usuario) {
  const saldo = await consultarSaldo(usuario);

  if (saldo < 2) {
    throw new Error("SALDO_INSUFICIENTE");
  }

  await addDoc(
    collection(
      db,
      "usuarios",
      usuario.uid,
      "ruleta_giros"
    ),
    {
      puntos: -2,
      creadoEn: serverTimestamp()
    }
  );

  return saldo - 2;
}
