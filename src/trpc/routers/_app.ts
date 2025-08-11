import { z } from 'zod';
import { baseProcedure, createTRPCRouter } from '../init';
export const appRouter = createTRPCRouter({
  invoke: baseProcedure
    .input(
      z.object({
        email: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      await inngest.send({
        name: 'test/hello.world', 
        email: input.email,
      });
      
    }),

  createAI: baseProcedure
    .input(
      z.object({
        text: z.string(),
      }),
    )
    .query((opts) => {
      return {
        greeting: `hello ${opts.input.text}`,
      };
    }),
});
// export type definition of API
export type AppRouter = typeof appRouter;