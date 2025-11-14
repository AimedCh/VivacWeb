# 🚀 Cómo Iniciar el Desarrollo

## Paso 1: Instalar dependencias (primera vez)
```bash
npm install
```

## Paso 2: Iniciar el proxy CORS
```bash
node proxy.js
```

Deberías ver:
```
🚀 Proxy CORS corriendo en http://localhost:3001
📡 Reenviando solicitudes a: https://vivac-backend-production.up.railway.app
✅ Endpoints disponibles:
   - POST http://localhost:3001/auth/login
   - POST http://localhost:3001/auth/register
   - POST http://localhost:3001/auth/request-password-reset
   - POST http://localhost:3001/auth/reset-password
```

## Paso 3: Abrir en el navegador

### Opción A: Si usas XAMPP
- Abre: `http://localhost/400web/login.html`

### Opción B: Si usas Node.js
- El proxy también sirve archivos estáticos
- Abre: `http://localhost:3001/login.html`

## Paso 4: Probar el registro

1. Haz clic en **"Regístrate"**
2. Completa el formulario:
   - **Nombre**: Tu nombre
   - **Email**: tu-email@example.com
   - **Contraseña**: Mínimo 8 caracteres (con mayúsculas y números)
   - **Confirmar contraseña**: Igual a la anterior
3. Acepta los términos y haz clic en **"Crear cuenta"**

## Paso 5: Probar el login

1. Usa las credenciales que acabas de crear
2. Deberías ver un mensaje de bienvenida
3. Serás redirigido al dashboard

## ⚠️ Solución de Problemas

### Error: "Error de conexión. Verifica CORS..."
- Asegúrate de que el proxy está corriendo (`node proxy.js`)
- Verifica que estés accediendo desde `localhost` o `127.0.0.1`

### Error: "The given origin is not allowed for the given client ID"
- Este es un error de Google Sign-In
- Necesitas autorizar tu dominio en Google Cloud Console
- Ver: SETUP_INSTRUCTIONS.md

### Error: "Failed to load resource: 403"
- El backend no está disponible
- Verifica que el proxy esté corriendo
- Verifica la conexión a internet

## 📝 Notas

- El proxy automáticamente detecta si estás en localhost y usa el proxy local
- En producción, usará directamente el backend de Railway
- Los cambios en HTML/CSS/JS se reflejan inmediatamente (sin necesidad de reiniciar)

