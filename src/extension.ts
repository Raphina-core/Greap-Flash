import * as vscode from 'vscode';
import { SearchEngine } from './search/searchEngine';

type Item = vscode.QuickPickItem & { line: number };
let cache: { uri: string; version: number; engine: SearchEngine } | undefined;

const FLASH_STEPS = [0.5, 0.35, 0.22, 0.1]; // opacidad del destello
const FLASH_MS = 90;
const MAX_RESULTS = 100;
const TITLE_FRAMES = ['🍇', '🍇⚡', '🍇✨', '🍇']; // fotogramas del título
const TITLE_MS = 450;
const MARKETPLACE_URL = 'https://marketplace.visualstudio.com/items?itemName=Raphina-core-12.greapflash';

function getEngine(doc: vscode.TextDocument): SearchEngine {
  const uri = doc.uri.toString();
  if (cache?.uri === uri && cache.version === doc.version) return cache.engine;
  const lines = Array.from({ length: doc.lineCount }, (_, i) => doc.lineAt(i).text);
  cache = { uri, version: doc.version, engine: new SearchEngine(lines, doc.languageId) };
  return cache.engine;
}

// Evita que "$(algo)" dentro del código se pinte como ícono y recorta líneas enormes
function safeLabel(text: string): string {
  const t = text.trim();
  const cut = t.length > 160 ? t.slice(0, 160) + '…' : t;
  return cut.replace(/\$\(/g, '$\u200b(');
}

// Aproximación: marca las letras de la búsqueda, en orden, dentro de la línea
function matchRanges(text: string, query: string, line: number): vscode.Range[] {
  const t = text.toLowerCase();
  const q = query.toLowerCase().replace(/\s+/g, '');
  const ranges: vscode.Range[] = [];
  let from = 0;
  for (const ch of q) {
    const idx = t.indexOf(ch, from);
    if (idx === -1) return [];
    ranges.push(new vscode.Range(line, idx, line, idx + 1));
    from = idx + 1;
  }
  return ranges;
}

// Destello amarillo que se desvanece al saltar a la línea elegida
function flashLine(editor: vscode.TextEditor, line: number) {
  const range = new vscode.Range(line, 0, line, 0);
  const types = FLASH_STEPS.map(a =>
    vscode.window.createTextEditorDecorationType({
      isWholeLine: true,
      backgroundColor: `rgba(255, 196, 0, ${a})`,
    }),
  );
  let i = 0;
  const tick = () => {
    types.forEach(t => editor.setDecorations(t, []));
    if (i < types.length) {
      editor.setDecorations(types[i++], [range]);
      setTimeout(tick, FLASH_MS);
    } else {
      types.forEach(t => t.dispose());
    }
  };
  tick();
}

export function activate(context: vscode.ExtensionContext) {
  // ---- Botón fijo en la barra de estado (se puede apagar en los ajustes) ----
  let launcher: vscode.StatusBarItem | undefined;
  const syncLauncher = () => {
    const enabled = vscode.workspace
      .getConfiguration('greapflash')
      .get<boolean>('showStatusBarButton', true);
    if (enabled && !launcher) {
      launcher = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
      launcher.text = '$(zap) GreapFlash';
      launcher.tooltip = 'Buscar en este archivo (Ctrl+Alt+G)';
      launcher.command = 'greapflash.search';
      launcher.show(); // sin show() el botón no aparece
    } else if (!enabled && launcher) {
      launcher.dispose();
      launcher = undefined;
    }
  };
  syncLauncher();
  context.subscriptions.push(
    vscode.workspace.onDidChangeConfiguration(e => {
      if (e.affectsConfiguration('greapflash.showStatusBarButton')) syncLauncher();
    }),
    { dispose: () => launcher?.dispose() },
  );

  // ---- Comando de búsqueda ----
  context.subscriptions.push(
    vscode.commands.registerCommand('greapflash.search', () => {
      const editor = vscode.window.activeTextEditor;
      if (!editor) return;

      const engine = getEngine(editor.document);
      const original = editor.selection;
      const originalView = editor.visibleRanges[0];

      // Aviso visible de que está activo: se crea, se muestra y se destruye en cada uso
      const status = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 1000);
      status.text = '$(zap) GreapFlash activo';
      status.backgroundColor = new vscode.ThemeColor('statusBarItem.warningBackground');
      status.show();

      const lineDeco = vscode.window.createTextEditorDecorationType({
        isWholeLine: true,
        backgroundColor: new vscode.ThemeColor('editor.findMatchHighlightBackground'),
        overviewRulerColor: new vscode.ThemeColor('editorOverviewRuler.findMatchForeground'),
        overviewRulerLane: vscode.OverviewRulerLane.Center,
      });
      const charDeco = vscode.window.createTextEditorDecorationType({
        backgroundColor: new vscode.ThemeColor('editor.findMatchBackground'),
        borderRadius: '2px',
      });

      const qp = vscode.window.createQuickPick<Item>();
      qp.placeholder = 'Escribe lo que recuerdes…';

      // Título con animación de uvas y rayo (se puede apagar en los ajustes)
      const animate = vscode.workspace.getConfiguration('greapflash').get<boolean>('animateTitle', true);
      let frame = 0;
      let count = -1; // -1 = todavía no se ha buscado nada
      const renderTitle = () => {
        const icon = animate ? TITLE_FRAMES[frame] : '⚡';
        qp.title = count < 0
          ? `${icon} GreapFlash · búsqueda en este archivo`
          : `${icon} GreapFlash · "${qp.value}" · ${count} resultado${count === 1 ? '' : 's'}`;
      };
      renderTitle();
      const timer = animate
        ? setInterval(() => { frame = (frame + 1) % TITLE_FRAMES.length; renderTitle(); }, TITLE_MS)
        : undefined;

      // Logo pequeño como botón de la barra del título (abre la página de la extensión)
      const logoBtn: vscode.QuickInputButton = {
        iconPath: vscode.Uri.file(context.asAbsolutePath('greapflash-icon.png')),
        tooltip: 'GreapFlash en el Marketplace',
      };

      const pasteBtn: vscode.QuickInputButton = { iconPath: new vscode.ThemeIcon('clippy'), tooltip: 'Pegar del portapapeles' };
      const clearBtn: vscode.QuickInputButton = { iconPath: new vscode.ThemeIcon('clear-all'), tooltip: 'Borrar búsqueda' };
      qp.buttons = [logoBtn, pasteBtn, clearBtn];

      const goTo = (line: number) => {
        const col = editor.document.lineAt(line).firstNonWhitespaceCharacterIndex;
        const pos = new vscode.Position(line, col);
        editor.selection = new vscode.Selection(pos, pos);
        editor.revealRange(new vscode.Range(pos, pos), vscode.TextEditorRevealType.InCenterIfOutsideViewport);
      };

      const preview = (line: number) => {
        goTo(line);
        editor.setDecorations(lineDeco, [new vscode.Range(line, 0, line, 0)]);
        editor.setDecorations(charDeco, matchRanges(editor.document.lineAt(line).text, qp.value, line));
      };

      const update = (value: string) => {
        const results = engine.search(value, MAX_RESULTS);
        qp.items = results.map(r => ({
          label: safeLabel(engine.lines[r.line]),
          description: `L${r.line + 1}`,
          iconPath: r.isComment
            ? new vscode.ThemeIcon('comment', new vscode.ThemeColor('charts.green'))
            : new vscode.ThemeIcon('code', new vscode.ThemeColor('charts.blue')),
          line: r.line,
          alwaysShow: true, // IMPORTANTE: si no, VS Code vuelve a filtrar por su cuenta
        }));
        count = results.length;
        renderTitle();
        if (results.length === 0) {
          editor.setDecorations(lineDeco, []);
          editor.setDecorations(charDeco, []);
        }
      };

      qp.onDidChangeValue(update);
      qp.onDidChangeActive(items => { if (items[0]) preview(items[0].line); });

      qp.onDidTriggerButton(async btn => {
        if (btn === logoBtn) {
          vscode.env.openExternal(vscode.Uri.parse(MARKETPLACE_URL));
          return;
        }
        if (btn === clearBtn) qp.value = '';
        else if (btn === pasteBtn) {
          const text = await vscode.env.clipboard.readText();
          qp.value = text.split(/\r?\n/)[0].trim();
        }
        update(qp.value);
      });

      let accepted = false;
      qp.onDidAccept(() => { accepted = true; qp.hide(); });
      qp.onDidHide(() => {
        const target = qp.activeItems[0];
        if (timer) clearInterval(timer); // detener la animación
        lineDeco.dispose();
        charDeco.dispose();
        status.dispose();
        if (accepted && target) {
          goTo(target.line);
          flashLine(editor, target.line);
        } else {
          editor.selection = original; // Esc: vuelve a donde estabas
          if (originalView) editor.revealRange(originalView, vscode.TextEditorRevealType.AtTop);
        }
        qp.dispose();
      });

      qp.show();
    }),
  );
}

export function deactivate() {}