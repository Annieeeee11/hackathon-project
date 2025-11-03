import { NextRequest, NextResponse } from 'next/server';
import { supabaseMCP } from '@/lib/supabaseMCP';

export async function GET() {
  try {
    // Get MCP status
    const status = await supabaseMCP.getStatus();
    
    return NextResponse.json({
      message: 'Supabase MCP Status',
      status,
      endpoints: {
        status: '/api/mcp (GET)',
        query: '/api/mcp (POST) - { "operation": "query", "params": {...} }',
        insert: '/api/mcp (POST) - { "operation": "insert", "params": {...} }',
        update: '/api/mcp (POST) - { "operation": "update", "params": {...} }',
        delete: '/api/mcp (POST) - { "operation": "delete", "params": {...} }',
        function: '/api/mcp (POST) - { "operation": "rpc", "params": {...} }'
      }
    });
  } catch (error) {
    console.error('MCP Status Error:', error);
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'Unknown error',
        message: 'Failed to get MCP status'
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { operation, params } = body;

    if (!operation) {
      return NextResponse.json(
        { error: 'Operation is required' },
        { status: 400 }
      );
    }

    // Call MCP operation
    const result = await supabaseMCP.callMCP(operation, params);
    
    return NextResponse.json({
      message: `MCP operation '${operation}' completed successfully`,
      result
    });

  } catch (error) {
    console.error('MCP Operation Error:', error);
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'Unknown error',
        message: 'MCP operation failed'
      },
      { status: 500 }
    );
  }
}
