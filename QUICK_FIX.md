# ⚡ Solución Rápida - Errores de Login

## 🔴 Errores que tienes:

1. **"Failed to load resource: 403"** - Error de conexión al backend
2. **"The given origin is not allowed for the given client ID"** - Error de Google Sign-In

---

## ✅ Solución en 3 pasos:

### PASO 1: Inicia el Proxy (IMPORTANTE)
```bash
node proxy.js
```

Deberías ver:
```
🚀 Proxy CORS corriendo en http://localhost:3001
```

**NO CIERRES ESTA VENTANA**

---

### PASO 2: Abre el navegador

Accede a:
```
http://localhost:3001/login.html
```

O si usas XAMPP:
```
http://localhost/400web/login.html
```

---

### PASO 3: Prueba el Registro

1. Haz clic en **"Regístrate"**
2. Completa:
   - Nombre: `Test User`
   - Email: `test@example.com`
   - Contraseña: `Test@1234`
   - Confirmar: `Test@1234`
3. Acepta términos
4. Haz clic en **"Crear cuenta"**

---

### PASO 4: Prueba el Login

1. Usa las credenciales que creaste
2. Deberías ver: **"¡Bienvenido Test User!"**
3. Serás redirigido al dashboard

---

## 🔧 Para Google Sign-In (Opcional)

Si quieres que funcione "Continuar con Google":

1. Ve a: https://console.cloud.google.com/
2. Busca tu proyecto
3. Ve a **APIs & Services** → **Credentials**
4. Haz clic en tu OAuth 2.0 Client ID
5. En **Authorized JavaScript origins**, agrega:
   - `http://localhost`
   - `http://localhost:3001`
   - `http://127.0.0.1`
6. Guarda

---

## 📝 Resumen

| Problema | Solución |
|----------|----------|
| Error 403 en login | Ejecuta `node proxy.js` |
| Google Sign-In error | Autoriza dominio en Google Cloud |
| No puedo registrarme | Verifica que el proxy esté corriendo |

---

## 🆘 Si aún no funciona

1. Abre la consola del navegador (F12)
2. Ve a la pestaña **Console**
3. Intenta hacer login
4. Copia los errores que veas
5. Comparte los errores para ayudarte mejor

---

**¡Listo! Ahora deberías poder hacer login y registro sin problemas.**

