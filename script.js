// ============================================
// VALIDACIÓN DE EMAIL Y CONTRASEÑA
// ============================================

// Email validation helper - Validación más estricta
function isValidEmail(email) {
    // RFC 5322 simplified regex para validación de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    // Validaciones adicionales
    if (!emailRegex.test(email)) return false;
    if (email.length > 254) return false; // Máximo permitido por RFC
    if (email.startsWith('.') || email.endsWith('.')) return false;
    if (email.includes('..')) return false;
    return true;
}

// Password validation helper - Mínimo 8 caracteres
function isValidPassword(password) {
    if (password.length < 8) return false;
    return true;
}

// ============================================
// TOGGLE PASSWORD VISIBILITY
// ============================================

const togglePassword = document.getElementById('togglePassword');
const passwordInput = document.getElementById('password');

togglePassword.addEventListener('click', function() {
    const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
    passwordInput.setAttribute('type', type);
    this.classList.toggle('show');
});

// ============================================
// FORM VALIDATION
// ============================================

const loginForm = document.getElementById('loginForm');
const emailInput = document.getElementById('email');
const errorMessage = document.getElementById('errorMessage');

loginForm.addEventListener('submit', function(e) {
    e.preventDefault();

    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();

    // Reset error state
    emailInput.classList.remove('error');
    passwordInput.classList.remove('error');
    errorMessage.classList.remove('show');
    errorMessage.textContent = '';

    let hasError = false;
    let errorText = '';

    // Validar email
    if (!email) {
        emailInput.classList.add('error');
        errorText = '* El email es requerido';
        hasError = true;
    } else if (!isValidEmail(email)) {
        emailInput.classList.add('error');
        errorText = '* Email inválido. Usa formato: usuario@dominio.com';
        hasError = true;
    }

    // Validar contraseña
    if (!password) {
        passwordInput.classList.add('error');
        errorText = '* La contraseña es requerida';
        hasError = true;
    } else if (!isValidPassword(password)) {
        passwordInput.classList.add('error');
        errorText = '* La contraseña debe tener al menos 8 caracteres';
        hasError = true;
    }

    if (hasError) {
        errorMessage.textContent = errorText;
        errorMessage.classList.add('show');
        return;
    }

    // Validar credenciales (demo)
    if (email === 'maria.diaz@gmail.com' && password === 'password123') {
        loginSuccess(email);
    } else {
        emailInput.classList.add('error');
        passwordInput.classList.add('error');
        errorMessage.textContent = '* Email o contraseña incorrectos';
        errorMessage.classList.add('show');
    }
});

// ============================================
// LOGIN SUCCESS FUNCTION
// ============================================

function loginSuccess(email, loginMethod = 'email') {
    // Extract user name from email
    const userName = email.split('@')[0].split('.').map(part =>
        part.charAt(0).toUpperCase() + part.slice(1)
    ).join(' ');

    const loginTime = new Date().getTime();

    // Save user info to localStorage
    localStorage.setItem('userName', userName);
    localStorage.setItem('userEmail', email);
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('loginTime', loginTime);
    localStorage.setItem('loginMethod', loginMethod);

    // Guardar en historial de usuarios
    guardarUsuarioEnHistorial(userName, email, loginMethod, loginTime);

    // Show success message
    alert('¡Login exitoso! Bienvenido ' + userName);

    // Redirect to dashboard
    window.location.href = 'dashboard.html';
}

// ============================================
// GUARDAR USUARIO EN HISTORIAL
// ============================================

function guardarUsuarioEnHistorial(userName, userEmail, loginMethod, loginTime) {
    // Obtener historial actual
    let usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');

    // Crear objeto de usuario
    const nuevoUsuario = {
        userName: userName,
        userEmail: userEmail,
        loginMethod: loginMethod,
        loginTime: loginTime
    };

    // Agregar a historial
    usuarios.push(nuevoUsuario);

    // Guardar en localStorage
    localStorage.setItem('usuarios', JSON.stringify(usuarios));

    console.log('Usuario guardado en historial:', nuevoUsuario);
}

// ============================================
// REMOVE ERROR STYLING ON INPUT
// ============================================

emailInput.addEventListener('input', function() {
    if (this.classList.contains('error')) {
        this.classList.remove('error');
        errorMessage.classList.remove('show');
    }
});

passwordInput.addEventListener('input', function() {
    if (this.classList.contains('error')) {
        this.classList.remove('error');
        errorMessage.classList.remove('show');
    }
});

// ============================================
// FORGOT PASSWORD LINK
// ============================================

const forgotPasswordLink = document.querySelector('.forgot-password');
if (forgotPasswordLink) {
    forgotPasswordLink.addEventListener('click', function(e) {
        e.preventDefault();
        window.location.href = 'forgot-password.html';
    });
}

// ============================================
// REGISTER LINK
// ============================================

const registerLink = document.querySelector('.register-link a');
registerLink.addEventListener('click', function(e) {
    e.preventDefault();
    window.location.href = 'register.html';
});

// ============================================
// GOOGLE SIGN IN - REAL IMPLEMENTATION
// ============================================

// Callback function for Google Sign-In
function handleCredentialResponse(response) {
    // Decode JWT token
    const base64Url = response.credential.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    const userData = JSON.parse(jsonPayload);

    const loginTime = new Date().getTime();

    // Guardar datos del usuario
    localStorage.setItem('userName', userData.name);
    localStorage.setItem('userEmail', userData.email);
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('loginMethod', 'google');
    localStorage.setItem('loginTime', loginTime);

    // Guardar en historial de usuarios
    guardarUsuarioEnHistorial(userData.name, userData.email, 'google', loginTime);

    // Mostrar mensaje de éxito
    alert('¡Login con Google exitoso! Bienvenido ' + userData.name);

    // Redirigir al dashboard
    window.location.href = 'dashboard.html';
}

// Initialize Google Sign-In
window.onload = function() {
    google.accounts.id.initialize({
        client_id: '118582736340-9fnfvji5lcb77k5t3sjq101pta6dakaj.apps.googleusercontent.com',
        callback: handleCredentialResponse
    });

    // Render the Google Sign-In button
    const googleBtn = document.querySelector('.btn-google');
    if (googleBtn) {
        google.accounts.id.renderButton(
            googleBtn,
            {
                theme: 'outline',
                size: 'large',
                width: '100%',
                text: 'signin_with'
            }
        );
    }
};

