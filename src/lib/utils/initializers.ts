import JSONWorker from 'monaco-editor/esm/vs/language/json/json.worker?worker'
import EditorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker'
import * as monacoEditor from 'monaco-editor'

export const monacoInitializer = () => {
  // trigger the editor to setupMode
  const model = monacoEditor.editor.createModel('', 'json')
  monacoEditor.editor.setModelLanguage(model, 'json')

  self.MonacoEnvironment = {
    getWorker: function (workerId, label) {
      switch (label) {
        case 'json':
          return new JSONWorker()
        default:
          return new EditorWorker()
      }
    }
  }
}

