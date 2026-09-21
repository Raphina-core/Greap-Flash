# Greap-Flash

Extensión de VS Code para buscar líneas de código o comentarios en el archivo activo usando búsqueda difusa (fuzzy) con ranking — sin necesitar el texto exacto.

Búsqueda difusa con ranking, directo dentro del archivo que tienes abierto en VS Code — sin scrollear, sin recordar la palabra exacta.

# Creador
Este es un proyecto independiente hecho por Rafael Moreno Velez, es open source (codigo abierto), este proyecto es para hacer una extension en visual studio code, la cual te permita buscar lineas especificas de codigo o comentarios en el archivo en donde estes posicionado, usando o no el nombre correcto de la linea a buscar.

# Desarrollo

En desarrollo activo. Apenas se ha publicado un esqueleto en el Marketplace.

# Por qué

VS Code no tiene un equivalente nativo a "fzf en el buffer actual" (como sí existe en Neovim). Ctrl+F busca texto literal; Ctrl+Shift+F busca en todo el proyecto pero prioriza mal los resultados en archivos grandes. Si medio recuerdas una palabra de un comentario perdido en un archivo de miles de líneas, hoy no hay una forma rápida de encontrarla.

GreapFlash resuelve ese caso específico: escribes lo que recuerdas, aunque sea incompleto, y ves en vivo las líneas más probables ordenadas por relevancia.

# Cómo funciona

1. Índice invertido del archivo activo (se actualiza en vivo, con debounce).
2. Fuzzy matching por subsecuencia (estilo fzf) sobre ese índice.
3. Ranking que prioriza inicio de palabra, coincidencias consecutivas y coincidencias en comentarios.
4. Resultados en un QuickPick nativo de VS Code, ordenados por score, actualizándose con cada tecla.

# Uso

- `Ctrl+Alt+G` (o el comando `GreapFlash: Buscar en archivo actual` desde la paleta de comandos).
- Escribe lo que recuerdes.
- Flechas para navegar, Enter para saltar a la línea.

## Roadmap

- [ ] Búsqueda en workspace completo (no solo archivo activo)
- [ ] Soporte para PDFs/libros abiertos como texto plano
- [ ] Publicación en el Marketplace

## Instalar y desarrollar

Url del repositorio de GitHub (Proyecto):
https://github.com/Raphina-core/Greap-Flash.git

\`\`\`bash
git clone <tu-repo>
cd greapflash
npm install
npm run compile
\`\`\`
Presiona F5 en VS Code para probar en un Extension Development Host.

## Creditos

<a href="https://www.flaticon.es/iconos-gratis/uva" title="uva iconos">Uva iconos creados por Magnific - Flaticon</a>

<a href="https://www.flaticon.es/iconos-gratis/rayo" title="rayo iconos">Rayo iconos creados por Febrian Hidayat - Flaticon</a>

Muchas gracias a los de Flaticon, por permitirme usar sus iconos en mi logo.

## Licencia

MIT (o Apache 2.0 — igual que HyperSearch, si quieres que sea compatible con integrarse a otros proyectos open source más adelante).
