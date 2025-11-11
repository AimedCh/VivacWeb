const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');

const BACKEND_URL = 'https://vivac-backend-production.up.railway.app';
const PROXY_PORT = 3001;

const server = http.createServer((req, res) => {
    // Agregar headers CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    console.log(`\n🔵 ${req.method} ${req.url}`);

    // Manejar preflight requests
    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }

    // Solo permitir POST para endpoints de autenticación
    if ((req.url === '/auth/login' || req.url === '/auth/register' || req.url === '/auth/request-password-reset' || req.url === '/auth/reset-password') && req.method === 'POST') {
        let body = '';

        req.on('data', chunk => {
            body += chunk.toString();
        });

        req.on('end', () => {
            try {
                const backendUrl = BACKEND_URL + req.url;

                const options = {
                    method: req.method,
                    headers: {
                        'Content-Type': 'application/json',
                        'Content-Length': Buffer.byteLength(body)
                    }
                };

                console.log(`📤 Enviando a: ${backendUrl}`);
                console.log(`📦 Datos:`, body);

                const proxyReq = https.request(backendUrl, options, (proxyRes) => {
                    let responseBody = '';

                    proxyRes.on('data', chunk => {
                        responseBody += chunk.toString();
                    });

                    proxyRes.on('end', () => {
                        console.log(`📥 Status: ${proxyRes.statusCode}`);
                        console.log(`📥 Respuesta:`, responseBody);

                        res.writeHead(proxyRes.statusCode, {
                            'Access-Control-Allow-Origin': '*',
                            'Content-Type': 'application/json'
                        });
                        res.end(responseBody);
                    });
                });

                proxyReq.on('error', (error) => {
                    console.error('❌ Error en proxy:', error.message);
                    res.writeHead(500, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({
                        success: false,
                        message: 'Error conectando con el servidor backend: ' + error.message
                    }));
                });

                proxyReq.write(body);
                proxyReq.end();
            } catch (error) {
                console.error('❌ Error:', error.message);
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({
                    success: false,
                    message: 'Error en el proxy: ' + error.message
                }));
            }
        });
    } else {
        // Servir archivos estáticos (HTML, CSS, JS, etc.)
        try {
            let filePath = req.url === '/' ? '/login.html' : req.url;
            filePath = path.join(__dirname, filePath);

            // Prevenir directory traversal attacks
            const realPath = path.resolve(filePath);
            const baseDir = path.resolve(__dirname);

            if (!realPath.startsWith(baseDir)) {
                console.log(`❌ Acceso denegado: ${filePath}`);
                res.writeHead(403, { 'Content-Type': 'text/html' });
                res.end('<h1>403 - Acceso denegado</h1>');
                return;
            }

            // Leer archivo de forma síncrona para evitar problemas
            try {
                const data = fs.readFileSync(filePath);

                // Determinar el tipo de contenido
                const ext = path.extname(filePath);
                let contentType = 'text/plain';

                if (ext === '.html') contentType = 'text/html';
                else if (ext === '.css') contentType = 'text/css';
                else if (ext === '.js') contentType = 'application/javascript';
                else if (ext === '.json') contentType = 'application/json';
                else if (ext === '.jpg' || ext === '.jpeg') contentType = 'image/jpeg';
                else if (ext === '.png') contentType = 'image/png';
                else if (ext === '.gif') contentType = 'image/gif';

                console.log(`✅ Sirviendo: ${filePath}`);
                res.writeHead(200, { 'Content-Type': contentType });
                res.end(data);
            } catch (readErr) {
                console.log(`❌ Archivo no encontrado: ${filePath}`);
                res.writeHead(404, { 'Content-Type': 'text/html' });
                res.end('<h1>404 - Archivo no encontrado</h1>');
            }
        } catch (err) {
            console.error(`❌ Error sirviendo archivo:`, err.message);
            res.writeHead(500, { 'Content-Type': 'text/html' });
            res.end('<h1>500 - Error interno del servidor</h1>');
        }
    }
});

server.listen(PROXY_PORT, () => {
    console.log(`🚀 Proxy CORS corriendo en http://localhost:${PROXY_PORT}`);
    console.log(`📡 Reenviando solicitudes a: ${BACKEND_URL}`);
    console.log(`✅ Endpoints disponibles:`);
    console.log(`   - POST http://localhost:${PROXY_PORT}/auth/login`);
    console.log(`   - POST http://localhost:${PROXY_PORT}/auth/register`);
    console.log(`   - POST http://localhost:${PROXY_PORT}/auth/request-password-reset`);
    console.log(`   - POST http://localhost:${PROXY_PORT}/auth/reset-password`);
});

