import { test } from 'node:test';
import { equal, ok } from 'node:assert/strict';
import { SearchEngine } from './searchEngine';

const ts = [
  '// calcula el total del carrito',          // 0
  'function calcularTotal(items) {',          // 1
  '  return items.length;',                   // 2
  '/* nota larga',                            // 3
  '   segunda linea del bloque */',           // 4
  'const s = "http://x.com"; // fin',          // 5
  'export function conversión() {}',          // 6
];

test('encuentra por subsecuencia', () => {
  equal(new SearchEngine(ts, 'typescript').search('calctot')[0].line, 1);
});

test('tolera un error de dedo', () => {
  const r = new SearchEngine(ts, 'typescript').search('crrito')[0];
  equal(r.line, 0);
  ok(r.isComment);
});

test('ignora acentos en el archivo y en la búsqueda', () => {
  const e = new SearchEngine(ts, 'typescript');
  equal(e.search('conversion')[0].line, 6);
  equal(e.search('conversión')[0].line, 6);
});

test('comentario de bloque en varias líneas', () => {
  ok(new SearchEngine(ts, 'typescript').search('bloque')[0].isComment);
});

test('el // real sí es comentario', () => {
  ok(new SearchEngine(ts, 'typescript').search('fin')[0].isComment);
});

test('// dentro de un string no marca la línea como comentario', () => {
  const e = new SearchEngine(['const u = "http://x.com";'], 'typescript');
  equal(e.search('http')[0].isComment, false);
});

test('# dentro de un string no marca comentario (python)', () => {
  const e = new SearchEngine(['x = "hola # mundo"', 'y = 1  # nota'], 'python');
  equal(e.search('mundo')[0].isComment, false);
  equal(e.search('nota')[0].isComment, true);
});

test('sin coincidencias devuelve lista vacía', () => {
  equal(new SearchEngine(ts, 'typescript').search('zzzzzz').length, 0);
});