# broken-access-control-demo
Ejemplo de vulnerabilidad de Broken Access Control con IDOR (OWASP Top 10:2021).

Descripción:

Descripción del Proyecto
Este proyecto demuestra una vulnerabilidad de Broken Access Control específica, conocida como Insecure Direct Object Reference (IDOR), utilizando una aplicación web sencilla. El ejemplo está basado en el OWASP Top 10:2021 y muestra cómo un atacante puede explotar una referencia directa a un objeto para acceder y modificar recursos sin la debida autorización. También se incluye una solución para mitigar esta vulnerabilidad.

Requisitos Previos
Antes de comenzar, asegúrate de tener instalados los siguientes componentes en tu sistema:

Node.js (versión 14 o superior): Para ejecutar el servidor backend.
MySQL: Para la base de datos que almacenará la información de los usuarios.
Git: Para clonar el repositorio y gestionar el control de versiones.
Instrucciones para Configurar y Ejecutar el Proyecto
Sigue estos pasos para configurar y ejecutar la aplicación en tu entorno local:

Clona el repositorio:

bash
Copiar código
git clone https://github.com/tu-usuario/broken-access-control-demo.git
cd broken-access-control-demo
Instala las dependencias:

Asegúrate de estar en el directorio del proyecto y ejecuta:

bash
Copiar código
npm install
Configura la base de datos MySQL:

Inicia sesión en MySQL:

bash
Copiar código
mysql -u root -p
Crea la base de datos y las tablas necesarias ejecutando el script init.sql:

sql
Copiar código
SOURCE db/init.sql;
Ejecuta el servidor:

En el directorio raíz del proyecto, ejecuta:

bash
Copiar código
node index.js
El servidor debería iniciarse en http://localhost:3000.

Ejemplos de Cómo Reproducir la Vulnerabilidad
Obtener un perfil de usuario:

Para obtener el perfil del usuario con ID 1, usa el siguiente comando en Postman o cURL:

bash
Copiar código
GET http://localhost:3000/profile/1
Esto debería devolver los detalles del perfil de "Juan Perez".

Actualizar un perfil sin autorización adecuada (IDOR):

Intenta actualizar el perfil del usuario con ID 2 (supongamos que "Juan Perez" intenta modificar el perfil de "Maria Gomez"):

bash
Copiar código
PUT http://localhost:3000/profile/2
Headers: { "user-id": "1" } // ID del usuario autenticado
Body: { "name": "Maria Modificada", "email": "maria.modificada@example.com" }
Resultado esperado: El perfil de "Maria Gomez" se actualiza incorrectamente, demostrando la vulnerabilidad de IDOR.

Ejemplo de Cómo Solucionar la Vulnerabilidad
Añadir verificación de permisos:

En el archivo index.js, asegúrate de que el ID del usuario autenticado coincida con el ID del perfil que intenta modificar:

javascript
Copiar código
app.put('/profile/:id', (req, res) => {
    const userId = req.params.id;
    const authenticatedUserId = req.header('user-id');

    if (userId !== authenticatedUserId) {
        return res.status(403).send('Forbidden: You are not allowed to update this profile');
    }

    const { name, email } = req.body;
    const query = 'UPDATE users SET name = ?, email = ? WHERE id = ?';

    db.query(query, [name, email, userId], (err, result) => {
        if (err) throw err;
        res.send('User updated successfully');
    });
});
Repetir la prueba:

Intenta actualizar el perfil de "Maria Gomez" nuevamente con el ID del usuario autenticado como 1:

bash
Copiar código
PUT http://localhost:3000/profile/2
Headers: { "user-id": "1" }
Body: { "name": "Maria Modificada", "email": "maria.modificada@example.com" }
Resultado esperado: Ahora el servidor debería devolver un error 403 Forbidden, demostrando que el usuario no tiene permiso para modificar el perfil de otro usuario.

Conclusión
Este proyecto ilustra cómo una implementación incorrecta de los controles de acceso puede permitir que un atacante acceda a recursos no autorizados. También muestra cómo aplicar una solución efectiva para prevenir este tipo de ataques. Si tienes preguntas o encuentras algún problema, no dudes en abrir un issue en el repositorio.

