import { Sandbox } from '@e2b/code-interpreter';
import { openai, createAgent } from "@inngest/agent-kit";
import { inngest } from "./client";
import { getSandbox } from './util';

export const helloWorld = inngest.createFunction(
  { id: "hello-world" },
  { event: "test/hello.world" },
  async ({ event, step }) => {
    try {
      const sandboxId = await step.run("get-sandbox-id", async () => {
        const sandbox = await Sandbox.create("vibe-nextjs-newai");
        return sandbox.sandboxId;
      });

      const summarizer = createAgent({
        name: "summarizer",
        system: "You are an expert summarizer. You summarize readable, concise, simple content.",
        model: openai({ 
          model: "gpt-3.5-turbo",
          apiKey: process.env.OPENAI_API_KEY
        }),
      });
      
      const { output } = await summarizer.run(
        'Summarize the following content: ' + event.data.value
      );

      const sandboxUrl = await step.run("get-sandbox-url", async () => {
        const sandbox = await getSandbox(sandboxId);
        return sandbox.getHost(3000);
      });

      return { 
        message: output,
        sandboxUrl 
      };
    } catch (error) {
      console.error('OpenAI API Error:', error);
      throw new Error('Failed to process text: Authentication error');
    }
  }
);