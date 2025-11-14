# 🔧 Instrucciones de Configuración - VivacWeb

## ❌ Problemas Actuales

### 1. Error de Google Sign-In (403)
```
[GSI_LOGGER]: The given origin is not allowed for the given client ID.
```

**Causa**: El dominio desde el que accedes no está autorizado en Google Cloud Console.

**Solución**:
1. Ve a: https://console.cloud.google.com/
2. Selecciona tu proyecto
3. Ve a **APIs & Services** → **Credentials**
4. Busca tu OAuth 2.0 Client ID: `118582736340-9fnfvji5lcb77k5t3sjq101pta6dakaj.apps.googleusercontent.com`
5. Haz clic en él y ve a **Authorized JavaScript origins**
6. Agrega estos orígenes:
   - `http://localhost`
   - `http://localhost:80`
   - `http://127.0.0.1`
   - `http://localhost:3000` (si usas otro puerto)
7. Guarda los cambios

### 2. Error de Conexión al Backend (Failed to load resource: 403)
```
Failed to load resource: the server responded with a status of 403
```

**Causa**: Problema de CORS o el backend no está disponible.

**Solución A - Si tienes acceso al backend**:
- Asegúrate de que el backend en `https://vivac-backend-production.up.railway.app` esté corriendo
- Verifica que CORS esté habilitado para `http://localhost`

**Solución B - Usar un proxy local** (Recomendado para desarrollo):
1. Ejecuta el proxy local:
   ```bash
   node proxy.js
   ```
2. Cambia la URL del API en `login.html` y `register.html`:
   ```javascript
   const API_URL = "http://localhost:3001"; // En lugar de la URL de production
   ```

## 📋 Pasos para Probar

1. **Abre la terminal en la carpeta del proyecto**
2. **Inicia el proxy** (si lo necesitas):
   ```bash
   node proxy.js
   ```
3. **Abre en el navegador**:
   - `http://localhost/400web/login.html`
   - O `http://127.0.0.1/400web/login.html`

4. **Prueba el registro primero**:
   - Ve a `register.html`
   - Crea una cuenta con:
     - Nombre: `Test User`
     - Email: `test@example.com`
     - Contraseña: `Test@1234`

5. **Luego prueba el login**:
   - Usa las credenciales que acabas de crear

## 🔍 Verificar Errores

Abre la consola del navegador (F12) y busca:
- Errores de CORS
- Errores de conexión al backend
- Errores de Google Sign-In

## 📝 Notas Importantes

- El backend debe estar corriendo para que funcione el login/registro
- Google Sign-In requiere que el dominio esté autorizado
- Si usas XAMPP, el dominio es `http://localhost` o `http://127.0.0.1`

