"use client";

import React, { useState } from "react";
import { Button } from "../ui/button";
import { Bot, Copy, Loader2, MoveUpLeft } from "lucide-react";
import { Input } from "../ui/input";
import { useMutation } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTrigger,
} from "../ui/dialog";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";
import { useToast } from "../ui/use-toast";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

type Payload = {
  prompt: string;
  customContent: string;
};

type GeminiPayload = {
  userQuery: string;
  generations: string;
  language: string;
};

export default function CodeAI({
  setEditorContentCB,
  language,
}: {
  setEditorContentCB: (input: string) => void;
  language: string;
}) {
  const [input, setInput] = useState("");
  const [res, setRes] = useState("");
  const [open, setOpen] = useState<boolean>(false);
  const [model, setModel] = useState<string>("openai");
  const [generations, setGenerations] = useState<string>("1");
  const { toast } = useToast();

  const { mutate: handleSubmission, isPending: isLoading } = useMutation({
    mutationFn: async () => {
      if (model === "openai") {
        const payload: Payload = {
          prompt: input,
          customContent: `Generate a program in ${language} for the given problem. Strictly generate just the code, the description and content about the code is not required. Don't include the name of the programming language or \'\'\' anywhere. Strictly don't include any Notes, definitons or comments.  Generate ${generations} different codes with different approaches and out of the ${generations}, write the best approach for it at the bottom separated by <--- Most Accurate Code --->.`,
        };

        const response = await fetch("/api/generate", {
          method: "POST",
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          throw new Error("Failed to send message");
        }

        return response.body;
      } else if (model === "gemini") {
        const payload: GeminiPayload = {
          userQuery: input,
          language: language,
          generations: generations,
        };

        const response = await fetch("/api/gemini", {
          method: "POST",
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          throw new Error("Failed to send message");
        }

        return response.body;
      }
    },
    onError: () => {
      return toast({
        title: "Error",
        description: "Error generating the response",
      });
    },
    onSuccess: async (stream) => {
      if (!stream || stream === null) {
        toast({
          title: "Error",
          description: "Error generating the response",
        });
      } else {
        const reader = stream.getReader();
        const decoder = new TextDecoder();
        let done = false;

        let accResponse = "";

        while (!done) {
          const { value, done: doneReading } = await reader.read();
          done = doneReading;
          const chunkValue = decoder.decode(value);

          accResponse += chunkValue;
          setRes(accResponse);
        }
      }
    },
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Bot className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-fit min-w-[600px] bg-black">
        <div className="items-center pt-5 gap-4 flex">
          <Input
            placeholder="Prompt goes here..."
            id="name"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="col-span-3"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSubmission();
              }
            }}
          />
          <Select
            defaultValue="openai"
            onValueChange={(value) => setModel(value)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Model" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="openai">Open AI</SelectItem>
                <SelectItem value="gemini">Gemini</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div className="flex gap-4 items-center">
          <span>Number of generations</span>
          <Select
            defaultValue="1"
            onValueChange={(value) => setGenerations(value)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Model" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {[...Array(5)].map((_, i) => (
                  <SelectItem key={i} value={(i + 1).toString()}>
                    {(i + 1).toString()}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <ScrollArea className="h-[60vh]">
          <div className="bg-gray-800 w-full flex rounded-lg relative">
            <div className="absolute top-5 right-5 flex space-x-4 flex-1">
              <MoveUpLeft
                onClick={() => {
                  setEditorContentCB(res);
                  setOpen(false);
                }}
                className="h-4 w-4 text-gray-600 hover:text-gray-900 cursor-pointer"
              />
              <Copy
                onClick={() => {
                  navigator.clipboard.writeText(res);
                  toast({
                    title: "Copied to clipboard",
                    description:
                      "The generated code has been copied to the clipboard.",
                  });
                }}
                className="h-4 w-4 text-gray-600 hover:text-gray-900 cursor-pointer"
              />
            </div>
            {res.length > 0 ? (
              <div>
                <pre className="p-5">{res}</pre>
              </div>
            ) : (
              <div className="py-16 items-center flex flex-1 justify-center text-center">
                <div className="items-center ">
                  <Bot className="h-12 w-full" />
                  <p>Write a prompt to generate the code.</p>
                </div>
              </div>
            )}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
        <DialogFooter>
          <Button
            onClick={() => {
              handleSubmission();
            }}
            className="w-full"
            variant={"secondary"}
          >
            <span>Generate</span>
            {isLoading ? (
              <span className="ml-2">
                <Loader2 className="h-4 w-4 animate-spin duration-500" />
              </span>
            ) : null}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
