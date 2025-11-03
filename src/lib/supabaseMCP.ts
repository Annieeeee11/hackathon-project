import { createClient } from "@supabase/supabase-js";

// MCP-specific Supabase client configuration
import { SupabaseClient } from "@supabase/supabase-js";

export class SupabaseMCP {
  private client: SupabaseClient;
  private mcpKey: string;
  private url: string;
  private serviceRoleKey: string;

  constructor() {
    this.url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    this.serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
    this.mcpKey = process.env.SUPABASE_MCP_KEY!;
    
    // Initialize with service role for MCP operations
    this.client = createClient(this.url, this.serviceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });
  }

  // MCP-specific methods
  async callMCP(operation: string, params: Record<string, unknown> = {}) {
    try {
      console.log(`[MCP] Calling operation: ${operation}`, params);

      // For now, we'll use standard Supabase operations
      // This can be extended based on specific MCP requirements
      switch (operation) {
        case 'query':
          return await this.query(params as { table: string; select?: string; filters?: Record<string, unknown> });
        case 'insert':
          return await this.insert(params as { table: string; data: Record<string, unknown> | Record<string, unknown>[] });
        case 'update':
          return await this.update(params as { table: string; data: Record<string, unknown>; filters: Record<string, unknown> });
        case 'delete':
          return await this.delete(params as { table: string; filters: Record<string, unknown> });
        case 'rpc':
          return await this.callFunction(params as { functionName: string; args?: Record<string, unknown> });
        default:
          throw new Error(`Unknown MCP operation: ${operation}`);
      }
    } catch (error) {
      console.error(`[MCP] Error in operation ${operation}:`, error);
      throw error;
    }
  }

  // Query data with MCP context
  async query(params: { table: string; select?: string; filters?: Record<string, unknown> }) {
    const { table, select = '*', filters = {} } = params;
    
    let query = this.client.from(table).select(select);
    
    // Apply filters
    Object.entries(filters).forEach(([key, value]) => {
      query = query.eq(key, value);
    });
    
    const { data, error } = await query;
    
    if (error) {
      throw new Error(`MCP Query Error: ${error.message}`);
    }
    
    return {
      success: true,
      data,
      operation: 'query',
      table,
      timestamp: new Date().toISOString()
    };
  }

  // Insert data with MCP context
  async insert(params: { table: string; data: Record<string, unknown> | Record<string, unknown>[] }) {
    const { table, data } = params;
    
    const { data: result, error } = await this.client
      .from(table)
      .insert(data)
      .select();
    
    if (error) {
      throw new Error(`MCP Insert Error: ${error.message}`);
    }
    
    return {
      success: true,
      data: result,
      operation: 'insert',
      table,
      timestamp: new Date().toISOString()
    };
  }

  // Update data with MCP context
  async update(params: { table: string; data: Record<string, unknown>; filters: Record<string, unknown> }) {
    const { table, data, filters } = params;
    
    let query = this.client.from(table).update(data);
    
    // Apply filters for update
    Object.entries(filters).forEach(([key, value]) => {
      query = query.eq(key, value);
    });
    
    const { data: result, error } = await query.select();
    
    if (error) {
      throw new Error(`MCP Update Error: ${error.message}`);
    }
    
    return {
      success: true,
      data: result,
      operation: 'update',
      table,
      timestamp: new Date().toISOString()
    };
  }

  // Delete data with MCP context
  async delete(params: { table: string; filters: Record<string, unknown> }) {
    const { table, filters } = params;
    
    let query = this.client.from(table).delete();
    
    // Apply filters for delete
    Object.entries(filters).forEach(([key, value]) => {
      query = query.eq(key, value);
    });
    
    const { data, error } = await query;
    
    if (error) {
      throw new Error(`MCP Delete Error: ${error.message}`);
    }
    
    return {
      success: true,
      data,
      operation: 'delete',
      table,
      timestamp: new Date().toISOString()
    };
  }

  // Call Supabase function with MCP context
  async callFunction(params: { functionName: string; args?: Record<string, unknown> }) {
    const { functionName, args = {} } = params;
    
    const { data, error } = await this.client.rpc(functionName, args);
    
    if (error) {
      throw new Error(`MCP Function Error: ${error.message}`);
    }
    
    return {
      success: true,
      data,
      operation: 'rpc',
      function: functionName,
      timestamp: new Date().toISOString()
    };
  }

  // Get MCP connection status
  async getStatus() {
    try {
      // Test connection with a simple query
      const { error } = await this.client
        .from('information_schema.tables')
        .select('table_name')
        .limit(1);
      
      return {
        connected: !error,
        url: this.url,
        mcpKey: this.mcpKey ? 'configured' : 'missing',
        timestamp: new Date().toISOString(),
        error: error?.message
      };
    } catch (error) {
      return {
        connected: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      };
    }
  }
}

// Export singleton instance
export const supabaseMCP = new SupabaseMCP();
