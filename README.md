# GreapFlash

Búsqueda difusa con ranking dentro del archivo que tienes abierto en VS Code: escribe lo que recuerdes, aunque sea incompleto o tenga errores de dedo, y salta a la línea al instante.

Funciona en Windows, macOS y Linux, sin instalar nada extra.

[![GreapFlash en acción](https://github.com/Raphina-core/Greap-Flash/raw/main/media/demo.gif)](https://github.com/Raphina-core/Greap-Flash/blob/main/media/demo.gif)

## Para qué sirve

`Ctrl+F` busca texto literal, y `Ctrl+Shift+F` busca en todo el proyecto. Pero si recuerdas a medias una variable, una función o un comentario perdido en un archivo de miles de líneas, no hay una forma rápida de encontrarlo.

GreapFlash resuelve ese caso: escribes lo que recuerdas y ves en vivo las líneas más probables, ordenadas por relevancia.

- Tolera acentos (`funcion` encuentra `función`) y errores de dedo.
- Encuentra lo que escribas aunque no sean letras seguidas (`calctot` encuentra `calcularTotal`).
- Distingue comentarios de código con íconos de color.
- Solo trabaja cuando la invocas: no consume recursos en segundo plano.

## Uso

1. Abre el buscador de cualquiera de estas formas:
   - Atajo `Ctrl+Alt+G` (`Cmd+Alt+G` en macOS).
   - Botón **⚡ GreapFlash** en la barra de estado (abajo a la derecha).
   - Botón del rayo en la barra superior del editor.
   - Comando `GreapFlash: Buscar en archivo actual` en la paleta de comandos.
2. Escribe lo que recuerdes.
3. Muévete por los resultados con las flechas o con el ratón: el editor te muestra cada línea en vivo.
4. **Enter** salta a la línea elegida. **Esc** cancela y te devuelve a donde estabas.

Mientras el buscador está abierto, la barra de estado se pone amarilla con "GreapFlash activo", y el título muestra tu búsqueda y el número de resultados. En la barra del título hay botones para pegar y para borrar la búsqueda.

## Ajustes

| Ajuste | Por defecto | Qué hace |
|---|---|---|
| `greapflash.showStatusBarButton` | `true` | Muestra el botón de GreapFlash en la barra de estado |
| `greapflash.animateTitle` | `true` | Anima el título del buscador con las uvas y el rayo |

## Cómo funciona

1. Índice invertido del archivo activo, que se reconstruye cuando el archivo cambia.
2. Búsqueda difusa por subsecuencia (estilo fzf) sobre las palabras únicas del archivo.
3. Tolerancia a errores de dedo con distancia de Levenshtein y normalización de acentos.
4. Ranking que prioriza el inicio de palabra, las coincidencias consecutivas y las coincidencias en comentarios.
5. Resultados en un QuickPick nativo de VS Code, ordenados por relevancia y actualizados con cada tecla.

## Instalación

- **VS Code:** búscala como "GreapFlash" en el panel de extensiones, o desde el [Marketplace](https://marketplace.visualstudio.com/items?itemName=Raphina-core-12.greapflash).
- **Cursor, Antigravity y otros editores basados en VS Code:** descarga el archivo `.vsix` desde la sección [Releases](https://github.com/Raphina-core/Greap-Flash/releases) e instálalo con "Extensiones: Instalar desde VSIX…".

## Roadmap

- [x] Publicación en el Marketplace de VS Code
- [x] Botón en la barra de estado y aviso visual de que está activa
- [ ] Búsqueda de símbolos como `=>` o `};`
- [ ] Comentarios y frases partidos en varias líneas
- [ ] Búsqueda en todo el proyecto (no solo en el archivo activo)
- [ ] Soporte para PDFs o libros abiertos como texto plano
- [ ] Interfaz opcional con temas de color

## Limitaciones actuales

- No busca símbolos como `=>` o `};`.
- No encuentra frases ni comentarios partidos en varias líneas.
- Los strings de varias líneas (como las triples comillas de Python) no se detectan al clasificar comentarios.

## Desarrollo

```bash
git clone https://github.com/Raphina-core/Greap-Flash.git
cd Greap-Flash
npm install
npm run compile
```

Pulsa **F5** en VS Code para probarla en una ventana de desarrollo (Extension Development Host). Para correr los tests del motor de búsqueda: `npm run test:core`.

## Acerca del proyecto

GreapFlash es un proyecto independiente y de código abierto, creado por Rafael Moreno Velez. Nació de una necesidad real: encontrar líneas y comentarios en un frontend de más de 3500 líneas sin recordar el texto exacto.

Se desarrolló con apoyo de herramientas de IA (código, razonamiento y documentación). La idea, el nombre, el logo, la arquitectura elegida y la revisión final son del autor.

## Créditos

- [Uva iconos creados por Magnific - Flaticon](https://www.flaticon.es/iconos-gratis/uva "uva iconos")
- [Rayo iconos creados por Febrian Hidayat - Flaticon](https://www.flaticon.es/iconos-gratis/rayo "rayo iconos")

Gracias a Flaticon por permitir usar sus iconos en el logo.

## Licencia

MIT. El texto completo está en el archivo `LICENSE`, en la raíz del proyecto.