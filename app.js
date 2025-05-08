// Tu configuración de Firebase
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_AUTH_DOMAIN",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_STORAGE_BUCKET",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID",
    measurementId: "YOUR_MEASUREMENT_ID"
};

// Inicializar Firebase
const app = firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// Crear usuario en Firestore
document.getElementById('createUserForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const email = document.getElementById('email').value;
    const nombre = document.getElementById('nombre').value;
    const password = document.getElementById('password').value;
    const tipo = document.getElementById('tipo').value;
    const banca_id = tipo === 'vendedor' ? document.getElementById('banca_id').value : null;

    // Crear usuario en Firebase Authentication
    firebase.auth().createUserWithEmailAndPassword(email, password)
        .then(function(userCredential) {
            // Usuario creado, ahora guardamos la información en Firestore
            const user = userCredential.user;
            const userRef = db.collection('usuarios').doc(user.uid);
            return userRef.set({
                nombre: nombre,
                email: email,
                tipo: tipo,
                banca_id: banca_id
            });
        })
        .then(function() {
            alert("Usuario creado exitosamente");
            loadUsers(); // Recargar la lista de usuarios después de crear uno
        })
        .catch(function(error) {
            alert("Error: " + error.message);
        });
});

// Cargar usuarios desde Firestore
function loadUsers() {
    db.collection('usuarios').get().then(function(querySnapshot) {
        const table = document.getElementById('usuariosTable');
        table.innerHTML = `<tr><th>Email</th><th>Nombre</th><th>Tipo</th><th>Banca ID</th></tr>`; // Limpiar la tabla

        querySnapshot.forEach(function(doc) {
            const data = doc.data();
            const row = table.insertRow();
            row.innerHTML = `
                <td>${data.email}</td>
                <td>${data.nombre}</td>
                <td>${data.tipo}</td>
                <td>${data.banca_id || 'N/A'}</td>
            `;
        });
    });
}

// Cargar los usuarios cuando se carga la página
window.onload = loadUsers;
