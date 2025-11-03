"use client"
import { useState, useRef } from "react"
import Editor from "@monaco-editor/react"
import { Button } from "@/components/ui/button"
import { IconLoader2, IconCheck, IconCode } from "@tabler/icons-react"

interface CodeEditorProps {
  onSubmit: (code: string) => void;
  starterCode?: string;
  language?: string;
  isSubmitting?: boolean;
  isCompleted?: boolean;
}

export default function CodeEditor({ 
  onSubmit, 
  starterCode = "// Write your code here",
  language = "javascript",
  isSubmitting = false,
  isCompleted = false
}: CodeEditorProps) {
  const [code, setCode] = useState(starterCode)
  const editorRef = useRef<any>(null)

  const handleEditorDidMount = (editor: any) => {
    editorRef.current = editor
  }

  const handleSubmit = () => {
    if (isSubmitting || isCompleted) return
    onSubmit(code)
  }

  const handleRun = () => {
    // This would run the code in a sandbox environment
    console.log("Running code:", code)
  }

  return (
    <div className="flex flex-col h-full bg-card">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b bg-muted/50">
        <div className="flex items-center gap-2">
          <IconCode className="w-5 h-5 text-primary" />
          <h3 className="font-semibold text-foreground">Code Editor</h3>
          <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">
            {language}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRun}
            disabled={isSubmitting || isCompleted}
          >
            <IconCode className="w-4 h-4 mr-2" />
            Run
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting || isCompleted}
            size="sm"
          >
            {isSubmitting ? (
              <>
                <IconLoader2 className="w-4 h-4 mr-2 animate-spin" />
                Submitting...
              </>
            ) : isCompleted ? (
              <>
                <IconCheck className="w-4 h-4 mr-2" />
                Completed
              </>
            ) : (
              "Submit Code"
            )}
          </Button>
        </div>
      </div>


      <div className="flex-1">
        <Editor
          height="100%"
          language={language}
          value={code}
          onChange={(val) => setCode(val || "")}
          onMount={handleEditorDidMount}
          theme="vs-dark"
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            lineNumbers: "on",
            roundedSelection: false,
            scrollBeyondLastLine: false,
            automaticLayout: true,
            tabSize: 2,
            insertSpaces: true,
            wordWrap: "on",
            suggestOnTriggerCharacters: true,
            acceptSuggestionOnEnter: "on",
            quickSuggestions: true,
            parameterHints: { enabled: true },
            hover: { enabled: true },
            contextmenu: true,
            selectOnLineNumbers: true,
            glyphMargin: true,
            folding: true,
            bracketPairColorization: { enabled: true },
            guides: {
              bracketPairs: true,
              indentation: true
            }
          }}
        />
      </div>

      {/* Footer */}
      <div className="p-3 border-t bg-muted/30">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-4">
            <span>Lines: {code.split('\n').length}</span>
            <span>Characters: {code.length}</span>
          </div>
          <div className="flex items-center gap-2">
            <span>Monaco Editor</span>
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          </div>
        </div>
      </div>
    </div>
  )
}
