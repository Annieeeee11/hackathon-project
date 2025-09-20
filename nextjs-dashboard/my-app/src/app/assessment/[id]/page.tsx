"use client"

import CodeEditor from "@/components/assessment/CodeEditor"
import ResultPanel from "@/components/assessment/ResultPanel"
import { useState } from "react"

interface Result {
  success: boolean
  feedback: string
}

export default function AssessmentPage({ params }: { params: { id: string } }) {
  const [result, setResult] = useState<Result | null>(null)

  const handleSubmit = (code: string) => {
    // Mock Judge0
    setResult({ success: true, feedback: "Looks great! Just optimize loop." })
  }

  return (
    <div className="grid grid-cols-2 gap-4 h-full">
      <CodeEditor onSubmit={handleSubmit} />
      <ResultPanel result={result} />
    </div>
  )
}
