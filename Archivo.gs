/**
 * Inicializa la autorización de Drive.
 * Se ejecuta una sola vez desde el editor de Apps Script.
 * Crea un archivo "auth_test.txt" en la carpeta indicada para forzar permisos.
 */
function initAuth() {
  var folderId = "TU_FOLDER_ID"; // Reemplazar con el ID real de la carpeta en Drive
  var folder = DriveApp.getFolderById(folderId);
  folder.createFile("auth_test.txt", "Autorización inicial concedida", MimeType.PLAIN_TEXT);
}

/**
 * Maneja las solicitudes GET al Web App.
 * - Si recibe el parámetro ?test=1 → devuelve confirmación de conexión.
 * - Si no, devuelve el contenido actual de datos.txt.
 */
function doGet(e) {
  if (e && e.parameter && e.parameter.test) {
    return ContentService.createTextOutput(
      JSON.stringify({estado:"ok", mensaje:"Conexión con Web App y Drive autorizada"})
    ).setMimeType(ContentService.MimeType.JSON);
  }

  var folderId = "TU_FOLDER_ID";
  var folder = DriveApp.getFolderById(folderId);
  var files = folder.getFilesByName("datos.txt");
  var contenido = "";

  if (files.hasNext()) {
    var file = files.next();
    contenido = file.getBlob().getDataAsString();
  }

  return ContentService.createTextOutput(
    JSON.stringify({estado:"ok", contenido:contenido})
  ).setMimeType(ContentService.MimeType.JSON);
}

/**
 * Maneja las solicitudes POST al Web App.
 * - Recibe token de Google, nombre y mensaje desde el HTML.
 * - Valida el token con verifyIdToken.
 * - Escribe una nueva línea en datos.txt con fecha, correo y datos enviados.
 */
function doPost(e) {
  var respuesta = { estado: "ok", pasos: [], error: null };

  try {
    var data = JSON.parse(e.postData.contents);
    var payload = verifyIdToken(data.token);
    if (!payload) {
      respuesta.estado = "error";
      respuesta.error = "Token inválido";
      return ContentService.createTextOutput(JSON.stringify(respuesta))
                           .setMimeType(ContentService.MimeType.JSON);
    }

    var email = payload.email;
    var folderId = "TU_FOLDER_ID";
    var folder = DriveApp.getFolderById(folderId);

    // Leer contenido previo de datos.txt
    var files = folder.getFilesByName("datos.txt");
    var contenido = "";
    if (files.hasNext()) {
      var file = files.next();
      contenido = file.getBlob().getDataAsString();
      folder.removeFile(file); // eliminar archivo viejo
    }

    // Agregar nueva línea con fecha, correo y datos
    var nuevaLinea = `${new Date().toISOString()} | ${email} | ${data.nombre} | ${data.mensaje}`;
    contenido += "\n" + nuevaLinea;

    // Crear archivo actualizado
    folder.createFile("datos.txt", contenido, MimeType.PLAIN_TEXT);

    return ContentService.createTextOutput(JSON.stringify(respuesta))
                         .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    respuesta.estado = "error";
    respuesta.error = "Error en doPost: " + err;
    return ContentService.createTextOutput(JSON.stringify(respuesta))
                         .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Valida el idToken recibido desde el login de Google.
 * Llama al endpoint oficial de Google para verificar el token.
 */
function verifyIdToken(idToken) {
  try {
    var url = "https://oauth2.googleapis.com/tokeninfo?id_token=" + idToken;
    var response = UrlFetchApp.fetch(url);
    return JSON.parse(response.getContentText());
  } catch (err) {
    return null;
  }
}
