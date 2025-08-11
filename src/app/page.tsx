"use client"

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";
import { Button } from "@/components/ui/button";
import { toast } from 'sonner';
import { Input } from "@/components/ui/input";

const Page = () => {
  const [value, setValue] = useState("");
  const trpc = useTRPC();
  const invoke = useMutation(trpc.invoke.mutationOptions({
    onSuccess: () => {
      toast.success("Text submitted for summarization!");
      setValue(""); // Clear input after successful submission
    },
    onError: (error) => {
      const message = error instanceof Error ? error.message : "Failed to process text. Please try again.";
      toast.error(message);
      console.error('Summarization error:', error);
    },
  }));

  const handleSubmit = () => {
    if (!value.trim()) {
      toast.error("Please enter some text to summarize");
      return;
    }
    invoke.mutate({ value: value.trim() });
  };

  return (
    <div className="p-4 max-w-7xl mx-auto space-y-4">
      <Input 
        value={value} 
        onChange={(e) => setValue(e.target.value)}
        placeholder="Enter text to summarize..."
        disabled={invoke.isPending}
      />
      <Button 
        disabled={invoke.isPending || !value.trim()} 
        onClick={handleSubmit}
      >
        {invoke.isPending ? "Processing..." : "Summarize"}
      </Button>
    </div>
  );
};

export default Page;
