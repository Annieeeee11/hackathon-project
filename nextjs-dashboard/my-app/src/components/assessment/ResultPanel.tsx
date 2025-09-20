interface Result {
    success: boolean
    feedback: string
  }
  
  export default function ResultPanel({ result }: { result: Result | null }) {
    if (!result) return <p>No submission yet.</p>
    return (
      <div className="p-4 bg-white rounded-xl shadow">
        <h3 className="font-bold">Result</h3>
        <p className={result.success ? "text-green-600" : "text-red-600"}>
          {result.feedback}
        </p>
      </div>
    )
  }
  