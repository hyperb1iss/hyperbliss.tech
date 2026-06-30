export {}

declare global {
  type ModelContextToolInput = Record<string, unknown>
  type ModelContextToolResult = unknown

  interface ModelContextToolAnnotations {
    readOnlyHint?: boolean
    untrustedContentHint?: boolean
  }

  interface ModelContextClient {
    requestUserInteraction?<T>(callback: () => T | Promise<T>): Promise<T>
  }

  type ModelContextToolExecute = (
    input: ModelContextToolInput,
    client: ModelContextClient,
  ) => ModelContextToolResult | Promise<ModelContextToolResult>

  interface ModelContextTool {
    name: string
    title?: string
    description: string
    inputSchema?: Record<string, unknown>
    annotations?: ModelContextToolAnnotations
  }

  interface ModelContextRegisteredTool extends ModelContextTool {
    execute: ModelContextToolExecute
  }

  interface ModelContextRegisterToolOptions {
    signal?: AbortSignal
    exposedTo?: string[]
  }

  interface ModelContextExecuteToolOptions {
    signal?: AbortSignal
  }

  interface ModelContext extends EventTarget {
    registerTool(tool: ModelContextRegisteredTool, options?: ModelContextRegisterToolOptions): void
    getTools?(): Promise<ModelContextTool[]>
    executeTool?(tool: ModelContextTool, input?: string, options?: ModelContextExecuteToolOptions): Promise<unknown>
    ontoolchange?: ((event: Event) => void) | null
  }

  interface Document {
    modelContext?: ModelContext
  }

  interface Navigator {
    modelContext?: ModelContext
  }
}
