
📄 Proyecto: Login y Escritura en Google Drive

1. Objetivo
Este proyecto permite:
- Autenticarse con Google desde una página HTML.
- Conectar con un Web App de Google Apps Script.
- Escribir datos en un archivo datos.txt dentro de una carpeta de Drive.
- Leer el contenido del archivo y mostrarlo en la página.

---

2. Componentes

a) Google Apps Script (Code.gs)
Funciones principales:
- initAuth: fuerza la autorización de Drive y crea auth_test.txt.
- doGet: devuelve el contenido de datos.txt como JSON.  
  - Si recibe ?test=1, devuelve un mensaje de conexión autorizada.
- doPost: recibe datos desde el HTML, valida el token de Google y escribe una nueva línea en datos.txt.
- verifyIdToken: valida el idToken recibido desde el login de Google.

b) Configuración (config.js)
Contiene las constantes necesarias:
`javascript
const CONFIG = {
  SCRIPTURL: "https://script.google.com/macros/s/TUWEBAPPURL/exec",
  CLIENTID: "TUCLIENT_ID",
  FOLDERID: "TUFOLDER_ID"
};
`

c) HTML (index.html)
Incluye:
- Botón de login con Google.
- Aviso de autorización de Drive.
- Formulario para enviar datos (nombre + mensaje).
- Botón de Test de conexión completo que prueba doGet y testConnection.

---

3. Flujo de funcionamiento

1. Autorización inicial  
   - Ejecutar initAuth en el editor de Apps Script.  
   - Aceptar permisos de Drive.  
   - Se crea auth_test.txt en la carpeta.

2. Login en HTML  
   - El usuario inicia sesión con Google.  
   - Se obtiene un idToken.

3. Escritura en Drive  
   - El formulario envía nombre, mensaje y idToken al Web App (doPost).  
   - El Web App valida el token y escribe una nueva línea en datos.txt.

4. Lectura de datos  
   - El botón de test llama al Web App con ?test=1 → confirma conexión.  
   - Luego llama a doGet → devuelve el contenido actual de datos.txt.

---

4. Ejemplo de salida JSON

Después de enviar dos mensajes distintos:

`json
Resultado testConnection:
{
  "estado": "ok",
  "mensaje": "Conexión con Web App y Drive autorizada"
}

Contenido de datos.txt:
{
  "estado": "ok",
  "contenido": "2026-03-18T16:03:51.108Z | adriandelpiano@gmail.com | Adrian | Hola mundo\n2026-03-18T16:05:12.876Z | adriandelpiano@gmail.com | Adrian | Segundo mensaje"
}
`

---

5. Checklist para futuras integraciones

- [ ] Crear proyecto en Apps Script.  
- [ ] Copiar funciones initAuth, doGet, doPost, verifyIdToken.  
- [ ] Deploy como Web App → copiar URL.  
- [ ] Actualizar SCRIPT_URL en config.js.  
- [ ] Incluir CLIENT_ID válido en config.js y en el HTML.  
- [ ] Ejecutar initAuth una vez para conceder permisos.  
- [ ] Probar login y formulario desde el HTML.  
- [ ] Usar botón de test para verificar conexión y lectura de datos.
- [ ] 
