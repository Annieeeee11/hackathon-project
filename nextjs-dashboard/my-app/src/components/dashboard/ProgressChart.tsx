export default function ProgressChart() {
    return (
      <div className="p-4 bg-white rounded-xl shadow">
        <h3 className="font-bold mb-2">Overall Progress</h3>
        <p className="text-gray-600 text-sm">
          Placeholder chart — integrate Recharts or ECharts here.
        </p>
        <div className="w-full bg-gray-200 rounded-full h-3 mt-2">
          <div className="bg-green-500 h-3 rounded-full" style={{ width: "60%" }} />
        </div>
        <p className="text-sm text-gray-500 mt-1">60% overall completion</p>
      </div>
    )
  }
  