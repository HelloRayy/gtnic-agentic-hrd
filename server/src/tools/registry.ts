export interface ToolParamDef {
  type: 'string' | 'number' | 'boolean' | 'object';
  required?: boolean;
  description?: string;
}

export interface BaseTool<TParams = any, TResult = any> {
  name: string;
  description: string;
  parameterSchema: Record<string, ToolParamDef>;
  execute(params: TParams): Promise<TResult>;
}

export class ToolRegistry {
  private tools: Map<string, BaseTool> = new Map();

  public register(tool: BaseTool): void {
    this.tools.set(tool.name, tool);
  }

  public get(name: string): BaseTool | undefined {
    return this.tools.get(name);
  }

  public async executeTool<TParams = any, TResult = any>(name: string, params: TParams): Promise<TResult> {
    const tool = this.tools.get(name);
    if (!tool) {
      throw new Error(`Tool "${name}" is not registered in ToolRegistry.`);
    }

    this.validateParams(tool, params);
    return (await tool.execute(params)) as TResult;
  }

  private validateParams(tool: BaseTool, params: any): void {
    if (!params || typeof params !== 'object') {
      throw new Error(`Tool "${tool.name}" invocation failed: parameters must be an object.`);
    }

    for (const [key, schema] of Object.entries(tool.parameterSchema)) {
      const val = params[key];
      if (schema.required && (val === undefined || val === null || val === '')) {
        throw new Error(`Tool "${tool.name}" schema validation error: required parameter "${key}" is missing.`);
      }
      if (val !== undefined && val !== null) {
        const actualType = typeof val;
        if (schema.type === 'object' && actualType !== 'object') {
          throw new Error(`Tool "${tool.name}" schema validation error: parameter "${key}" must be an object.`);
        } else if (schema.type !== 'object' && actualType !== schema.type) {
          throw new Error(`Tool "${tool.name}" schema validation error: parameter "${key}" expected ${schema.type}, received ${actualType}.`);
        }
      }
    }
  }

  public listTools(): { name: string; description: string; parameterSchema: Record<string, ToolParamDef> }[] {
    return Array.from(this.tools.values()).map(t => ({
      name: t.name,
      description: t.description,
      parameterSchema: t.parameterSchema,
    }));
  }
}

export const toolRegistry = new ToolRegistry();
