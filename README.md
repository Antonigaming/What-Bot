# What-Bot

## Descripción
Bot de WhatsApp en Termux para gestionar listas de personas.

## Configuración
1. Clonar el repositorio.
2. Instalar dependencias:
    ```sh
    npm install
    ```
3. Configurar el archivo `config.json` con el número del dueño del bot.
4. Ejecutar el bot:
    ```sh
    npm start
    ```

## Comandos
- `listahoy`: Muestra la lista de hoy.
- `listamñ`: Te agrega a la lista de mañana.
- `menulista`: Muestra el menú de listas.
- `borrar lista`: Borra las listas (solo creador).
- `.unirmelista [nombre]`: Únete a la lista de hoy con un nombre.
- `menu`: Muestra los comandos disponibles y una imagen.
