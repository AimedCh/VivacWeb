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

    // Permitir POST/GET para endpoints de autenticación y vivacs
    const isAuthEndpoint = (req.url === '/auth/login' || req.url === '/auth/register' || req.url === '/auth/request-password-reset' || req.url === '/auth/reset-password') && req.method === 'POST';
    const isVivacsEndpoint = (req.url.startsWith('/vivacs') && req.url.split('/').length === 2) && (req.method === 'POST' || req.method === 'GET');
    const isUpdateVivacEndpoint = /^\/vivacs\/[^/]+$/.test(req.url) && req.method === 'PATCH';
    const isUploadPhotosEndpoint = /^\/vivacs\/[^/]+\/upload-photos$/.test(req.url) && req.method === 'POST';
    const isDeletePhotosEndpoint = /^\/vivacs\/[^/]+\/delete-photos$/.test(req.url) && req.method === 'DELETE';
    const isUploadImageEndpoint = req.url === '/images/upload' && req.method === 'POST';

    console.log(`📋 isAuthEndpoint: ${isAuthEndpoint}`);
    console.log(`📋 isVivacsEndpoint: ${isVivacsEndpoint}`);
    console.log(`📋 isUpdateVivacEndpoint: ${isUpdateVivacEndpoint}`);
    console.log(`📋 isUploadPhotosEndpoint: ${isUploadPhotosEndpoint}`);
    console.log(`📋 isDeletePhotosEndpoint: ${isDeletePhotosEndpoint}`);
    console.log(`📋 isUploadImageEndpoint: ${isUploadImageEndpoint}`);

    if (isAuthEndpoint || isVivacsEndpoint || isUpdateVivacEndpoint || isUploadImageEndpoint) {
        // Manejar JSON endpoints
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
                        'Content-Type': 'application/json'
                    }
                };

                // Solo agregar Content-Length si hay body
                if (body) {
                    options.headers['Content-Length'] = Buffer.byteLength(body);
                }

                // Pasar el header Authorization si existe
                if (req.headers.authorization) {
                    options.headers['Authorization'] = req.headers.authorization;
                    console.log(`🔐 Authorization header encontrado`);
                }

                console.log(`📤 Enviando a: ${backendUrl}`);
                if (body) {
                    console.log(`📦 Datos:`, body);
                }

                const proxyReq = https.request(backendUrl, options, (proxyRes) => {
                    let responseBody = '';

                    proxyRes.on('data', chunk => {
                        responseBody += chunk.toString();
                    });

                    proxyRes.on('end', () => {
                        console.log(`📥 Status: ${proxyRes.statusCode}`);
                        console.log(`📥 Respuesta:`, responseBody.substring(0, 500)); // Limitar output

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

                if (body) {
                    proxyReq.write(body);
                }
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
    } else if (isUploadPhotosEndpoint || isDeletePhotosEndpoint) {
        // Manejar endpoints de fotos (multipart/form-data o binary)
        let chunks = [];

        req.on('data', chunk => {
            chunks.push(chunk);
        });

        req.on('end', () => {
            try {
                const backendUrl = BACKEND_URL + req.url;
                const body = Buffer.concat(chunks);

                const options = {
                    method: req.method,
                    headers: {
                        'Content-Type': req.headers['content-type'],
                        'Content-Length': body.length
                    }
                };

                // Pasar el header Authorization si existe
                if (req.headers.authorization) {
                    options.headers['Authorization'] = req.headers.authorization;
                    console.log(`🔐 Authorization header encontrado`);
                }

                console.log(`📤 Enviando a: ${backendUrl}`);
                console.log(`📦 Tamaño: ${body.length} bytes`);

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
    console.log(`   - GET http://localhost:${PROXY_PORT}/vivacs`);
    console.log(`   - POST http://localhost:${PROXY_PORT}/vivacs`);
    console.log(`   - POST http://localhost:${PROXY_PORT}/vivacs/{id}/upload-photos`);
    console.log(`   - DELETE http://localhost:${PROXY_PORT}/vivacs/{id}/delete-photos`);
});
    
