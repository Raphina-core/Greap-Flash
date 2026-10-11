import * as vscode from 'vscode';
import { SearchEngine } from './search/searchEngine';

type Item = vscode.QuickPickItem & { line: number };
let cache: { uri: string; version: number; engine: SearchEngine } | undefined;

function getEngine(doc: vscode.TextDocument): SearchEngine {
  const uri = doc.uri.toString();
  if (cache?.uri === uri && cache.version === doc.version) return cache.engine;
  const lines = Array.from({ length: doc.lineCount }, (_, i) => doc.lineAt(i).text);
  cache = { uri, version: doc.version, engine: new SearchEngine(lines) };
  return cache.engine;
}

export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    vscode.commands.registerCommand('greapflash.search', () => {
      const editor = vscode.window.activeTextEditor;
      if (!editor) return;

      const engine = getEngine(editor.document);
      const original = editor.selection;
      const qp = vscode.window.createQuickPick<Item>();
      qp.placeholder = 'Escribe lo que recuerdes…';

      const reveal = (line: number) => {
        const pos = new vscode.Position(line, 0);
        editor.selection = new vscode.Selection(pos, pos);
        editor.revealRange(new vscode.Range(pos, pos), vscode.TextEditorRevealType.InCenterIfOutsideViewport);
      };

      qp.onDidChangeValue(value => {
        qp.items = engine.search(value).map(r => ({
          label: `${r.isComment ? '$(comment) ' : ''}${engine.lines[r.line].trim()}`,
          description: `L${r.line + 1}`,
          line: r.line,
          alwaysShow: true,   // IMPORTANTE: si no, VS Code vuelve a filtrar por su cuenta
        }));
      });

      qp.onDidChangeActive(items => { if (items[0]) reveal(items[0].line); }); // vista previa
      let accepted = false;
      qp.onDidAccept(() => { accepted = true; qp.hide(); });
      qp.onDidHide(() => {
        if (accepted && qp.activeItems[0]) reveal(qp.activeItems[0].line);
        else editor.selection = original;
        qp.dispose();
      });

      qp.show();
    }),
  );
}

export function deactivate() {}