"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';

interface MCPResponse {
  message?: string;
  result?: any;
  status?: any;
  error?: string;
  endpoints?: any;
}

export default function MCPTestPage() {
  const [response, setResponse] = useState<MCPResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [operation, setOperation] = useState('query');
  const [params, setParams] = useState('{"table": "users", "select": "*"}');

  const testMCPStatus = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/mcp');
      const data = await res.json();
      setResponse(data);
    } catch (error) {
      setResponse({ error: 'Failed to get MCP status' });
    } finally {
      setLoading(false);
    }
  };

  const callMCPOperation = async () => {
    setLoading(true);
    try {
      let parsedParams;
      try {
        parsedParams = JSON.parse(params);
      } catch {
        throw new Error('Invalid JSON in parameters');
      }

      const res = await fetch('/api/mcp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          operation,
          params: parsedParams
        })
      });

      const data = await res.json();
      setResponse(data);
    } catch (error) {
      setResponse({ 
        error: error instanceof Error ? error.message : 'Failed to call MCP operation' 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Supabase MCP Test Interface</h1>
      
      <div className="space-y-6">
        {/* Status Check */}
        <div className="bg-card rounded-lg border p-6">
          <h2 className="text-xl font-semibold mb-4">MCP Status Check</h2>
          <Button onClick={testMCPStatus} disabled={loading}>
            {loading ? 'Checking...' : 'Check MCP Status'}
          </Button>
        </div>

        {/* Operation Test */}
        <div className="bg-card rounded-lg border p-6">
          <h2 className="text-xl font-semibold mb-4">Test MCP Operation</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Operation:</label>
              <select 
                value={operation} 
                onChange={(e) => setOperation(e.target.value)}
                className="w-full p-2 border border-border rounded-md bg-background"
              >
                <option value="query">Query</option>
                <option value="insert">Insert</option>
                <option value="update">Update</option>
                <option value="delete">Delete</option>
                <option value="rpc">Function Call</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Parameters (JSON):</label>
              <textarea
                value={params}
                onChange={(e) => setParams(e.target.value)}
                rows={6}
                className="w-full p-2 border border-border rounded-md bg-background font-mono text-sm"
                placeholder="Enter JSON parameters..."
              />
            </div>

            <Button onClick={callMCPOperation} disabled={loading}>
              {loading ? 'Executing...' : 'Execute MCP Operation'}
            </Button>
          </div>
        </div>

        {/* Response Display */}
        {response && (
          <div className="bg-card rounded-lg border p-6">
            <h2 className="text-xl font-semibold mb-4">Response</h2>
            <pre className="bg-muted p-4 rounded-md overflow-auto text-sm">
              {JSON.stringify(response, null, 2)}
            </pre>
          </div>
        )}

        {/* Example Operations */}
        <div className="bg-card rounded-lg border p-6">
          <h2 className="text-xl font-semibold mb-4">Example Operations</h2>
          <div className="space-y-3 text-sm">
            <div>
              <strong>Query:</strong>
              <code className="block bg-muted p-2 rounded mt-1">
                {`{"table": "users", "select": "*", "filters": {"id": 1}}`}
              </code>
            </div>
            <div>
              <strong>Insert:</strong>
              <code className="block bg-muted p-2 rounded mt-1">
                {`{"table": "users", "data": {"name": "John", "email": "john@example.com"}}`}
              </code>
            </div>
            <div>
              <strong>Update:</strong>
              <code className="block bg-muted p-2 rounded mt-1">
                {`{"table": "users", "data": {"name": "Jane"}, "filters": {"id": 1}}`}
              </code>
            </div>
            <div>
              <strong>Function Call:</strong>
              <code className="block bg-muted p-2 rounded mt-1">
                {`{"functionName": "get_user_stats", "args": {"user_id": 1}}`}
              </code>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
