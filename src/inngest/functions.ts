import { openai, createAgent } from "@inngest/agent-kit";
import { inngest } from "./client";

export const helloWorld = inngest.createFunction(
  { id: "hello-world" },
  { event: "test/hello.world" },
  async ({ event, step }) => {
    try {
      const summarizer = createAgent({
        name: "summarizer",
        system: "You are an expert summarizer. You summarize readable, concise, simple content.",
        model: openai({ 
          model: "gpt-4",
          apiKey: process.env.OPENAI_API_KEY // Make sure this is set
        }),
      });
      
      const { output } = await summarizer.run(
        'Summarize the following content: ' + event.data.value
      );
      return { message: output };
    } catch (error) {
      console.error('OpenAI API Error:', error);
      throw new Error('Failed to process text: Authentication error');
    }
  },
);