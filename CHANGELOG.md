# Change Log

Todos los cambios importantes de la extensión "greapflash" se documentan en este archivo.

El formato sigue [Keep a Changelog](https://keepachangelog.com/es-ES/1.1.0/).

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