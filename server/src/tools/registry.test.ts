import { describe, it, expect, vi } from 'vitest';
import { ToolRegistry, type BaseTool } from './registry.js';

describe('ToolRegistry - Autonomous Tool Invocation & Schema Validation', () => {
  const createMockTool = (overrides?: Partial<BaseTool>): BaseTool => ({
    name: 'sample_calculator',
    description: 'Calculates basic operations',
    parameterSchema: {
      operation: { type: 'string', required: true, description: 'Math operation' },
      amount: { type: 'number', required: true, description: 'Numeric operand' },
      note: { type: 'string', required: false, description: 'Optional annotation' },
    },
    execute: vi.fn(async (params: { amount: number }) => ({ result: params.amount * 2 })),
    ...overrides,
  });

  it('should register and retrieve a tool correctly', () => {
    const registry = new ToolRegistry();
    const tool = createMockTool();

    registry.register(tool);
    expect(registry.get('sample_calculator')).toBe(tool);
    expect(registry.listTools()).toHaveLength(1);
    expect(registry.listTools()[0].name).toBe('sample_calculator');
  });

  it('should execute a registered tool when parameters are valid', async () => {
    const registry = new ToolRegistry();
    const tool = createMockTool();
    registry.register(tool);

    const result = await registry.executeTool('sample_calculator', {
      operation: 'multiply',
      amount: 25,
    });

    expect(result).toEqual({ result: 50 });
    expect(tool.execute).toHaveBeenCalledWith({
      operation: 'multiply',
      amount: 25,
    });
  });

  it('should throw an error when executing an unregistered tool', async () => {
    const registry = new ToolRegistry();

    await expect(registry.executeTool('unknown_tool', {})).rejects.toThrow(
      'Tool "unknown_tool" is not registered in ToolRegistry.'
    );
  });

  it('should throw an error when required parameter is missing', async () => {
    const registry = new ToolRegistry();
    registry.register(createMockTool());

    await expect(
      registry.executeTool('sample_calculator', { operation: 'add' })
    ).rejects.toThrow(
      'Tool "sample_calculator" schema validation error: required parameter "amount" is missing.'
    );
  });

  it('should throw an error when parameter type is mismatched', async () => {
    const registry = new ToolRegistry();
    registry.register(createMockTool());

    await expect(
      registry.executeTool('sample_calculator', {
        operation: 'add',
        amount: 'not-a-number',
      })
    ).rejects.toThrow(
      'Tool "sample_calculator" schema validation error: parameter "amount" expected number, received string.'
    );
  });

  it('should throw an error when parameters are not an object', async () => {
    const registry = new ToolRegistry();
    registry.register(createMockTool());

    await expect(
      registry.executeTool('sample_calculator', null as unknown as Record<string, unknown>)
    ).rejects.toThrow('parameters must be an object');
  });
});
