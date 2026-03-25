export interface LLMProvider {
  /** Optional Ollama model name (e.g. llama3, mistral). */
  generate(prompt: string, modelName?: string): Promise<string>;
}
