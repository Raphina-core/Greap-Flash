# Change Log

Todos los cambios importantes de la extensión "greapflash" se documentan en este archivo.

El formato sigue [Keep a Changelog](https://keepachangelog.com/es-ES/1.1.0/).

## [1.1.1] - 2026-10-20

### Agregado
- Botón **GreapFlash** en la barra de estado para abrir el buscador sin recordar el atajo. Se puede ocultar con el ajuste `greapflash.showStatusBarButton`.
- Botón con un rayo en la barra superior del editor.
- Aviso visible de que el buscador está activo: la barra de estado se pone amarilla con el texto "GreapFlash activo".
- El título del buscador muestra lo que escribes y el número de resultados.
- Título animado con uvas y rayo. Se puede apagar con el ajuste `greapflash.animateTitle`.
- Íconos de color para distinguir los comentarios (verde) del código (azul).
- Resaltado en el editor de la línea que estás previsualizando y de las letras que coinciden con tu búsqueda.
- Destello amarillo que se desvanece al saltar a una línea con Enter.
- Botones de pegar y de borrar la búsqueda, y un botón con el logo, en la barra del título del buscador.
- Ahora se muestran hasta 100 resultados (antes 50).

### Cambiado
- Al cancelar con Esc, vuelven el cursor y también la posición de la pantalla (scroll) donde estabas.
- Al saltar a una línea, el cursor queda en el primer carácter que no es un espacio.
- Las líneas muy largas se recortan a 160 caracteres en la lista, y el texto `$(` dentro del código ya no se interpreta como un ícono.
- La extensión se activa al terminar de iniciar VS Code (`onStartupFinished`) para poder mostrar el botón de la barra de estado. La búsqueda en sí solo se ejecuta cuando la invocas.

### Limitaciones conocidas
- No busca símbolos como `=>` o `};`.
- No encuentra frases ni comentarios partidos en varias líneas.
- Los strings de varias líneas (como las triples comillas de Python) no se detectan al clasificar comentarios.

## [1.0.2] - 2026-10-11

### Agregado
- Normalización de acentos: `funcion` y `función` ahora se encuentran entre sí, tanto en el archivo como en lo que escribes.
- Detección de comentarios según el lenguaje del archivo (`languageId`): `//` y `/* */` en JavaScript, TypeScript, Java, C/C++, Go, Rust y similares; `#` en Python, Ruby, shell y YAML; `--` en SQL y Lua; `<!-- -->` en HTML.
- Soporte de comentarios de bloque que ocupan varias líneas.
- GIF de demostración en el README.
- Tests del núcleo de búsqueda (`npm run test:core`).
- Campos `license` y `keywords` en el `package.json`.

### Cambiado
- Los marcadores de comentario dentro de strings (por ejemplo `"http://..."` o `"hola # mundo"`) ya no se cuentan como comentarios.
- Versión mínima de VS Code bajada a 1.85.0 para que funcione en más equipos.
- README reorganizado: se agregaron las limitaciones actuales y se corrigió la sección de instalación.
- `.vscodeignore` actualizado para no empaquetar tests ni el GIF.

### Limitaciones conocidas
- No busca símbolos como `=>` o `};`.
- No encuentra frases ni comentarios partidos en varias líneas.
- Los strings de varias líneas (como las triples comillas de Python) no se detectan al clasificar comentarios.

## [1.0.1]

### Agregado
- Primera versión publicada en el Marketplace.
- Búsqueda difusa por subsecuencia (estilo fzf) en el archivo activo, con índice invertido.
- Tolerancia a errores de dedo con distancia de Levenshtein.
- Ranking que prioriza inicio de palabra, coincidencias consecutivas y coincidencias en comentarios.
- Resultados en un QuickPick nativo de VS Code, con vista previa al navegar y salto a la línea con Enter.
- Comando `GreapFlash: Buscar en archivo actual` y atajo `Ctrl+Alt+G` (`Cmd+Alt+G` en macOS).