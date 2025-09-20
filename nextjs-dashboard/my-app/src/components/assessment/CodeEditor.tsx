"use client"
import Editor from "@monaco-editor/react"

export default function CodeEditor({ onSubmit }: { onSubmit: (code: string) => void }) {
  let code = "// write your code here"

  return (
    <div className="flex flex-col h-full">
      <Editor
        height="100%"
        defaultLanguage="javascript"
        defaultValue={code}
        onChange={(val) => {
          code = val || ""
        }}
      />
      <button
        onClick={() => onSubmit(code)}
        className="mt-2 px-4 py-2 bg-green-600 text-white rounded"
      >
        Submit Code
      </button>
    </div>
  )
}
