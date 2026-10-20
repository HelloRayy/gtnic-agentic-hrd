export interface BaseTool<TParams = any, TResult = any> {
  name: string;
  description: string;
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
    return (await tool.execute(params)) as TResult;
  }

  public listTools(): { name: string; description: string }[] {
    return Array.from(this.tools.values()).map(t => ({
      name: t.name,
      description: t.description,
    }));
  }
}

export const toolRegistry = new ToolRegistry();
