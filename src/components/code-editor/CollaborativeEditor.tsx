"use client";

import * as Y from "yjs";
import LiveblocksProvider from "@liveblocks/yjs";
import { useCallback, useEffect, useState } from "react";
import styles from "./CollaborativeEditor.module.css";
import { Editor } from "@monaco-editor/react";
import { editor } from "monaco-editor";
import { MonacoBinding } from "y-monaco";
import { Awareness } from "y-protocols/awareness";
import { TypedLiveblocksProvider, useRoom } from "@/app/liveblocks.config";
import { Toolbar } from "./Toolbar";
import { Cursors } from "./Cursors";
import { cn } from "@/lib/utils";
import axios from "axios";
import { useToast } from "@/components/ui/use-toast";
import { languages } from "./utils";
import InputWindow from "./InputWindow";
import OutputWindow from "./OutputWindow";
import { Button } from "../ui/button";
import { Loader2, Play } from "lucide-react";
import CodeAI from "./CodeAI";

// Collaborative code editor with undo/redo, live cursors, and live avatars
export function CollaborativeEditor({ progLang }: { progLang: string }) {
  const room = useRoom();
  const [provider, setProvider] = useState<TypedLiveblocksProvider>();
  const [editorRef, setEditorRef] = useState<editor.IStandaloneCodeEditor>();
  const [loading, setLoading] = useState(false);
  const [outputDetails, setOutputDetails] = useState<any>();
  const [input, setInput] = useState<string>("");

  const { toast } = useToast();

  // Set up Liveblocks Yjs provider and attach Monaco editor
  useEffect(() => {
    let yProvider: TypedLiveblocksProvider;
    let yDoc: Y.Doc;
    let binding: MonacoBinding;

    if (editorRef) {
      yDoc = new Y.Doc();
      const yText = yDoc.getText("monaco");
      yProvider = new LiveblocksProvider(room, yDoc);
      setProvider(yProvider);

      // Attach Yjs to Monaco
      binding = new MonacoBinding(
        yText,
        editorRef.getModel() as editor.ITextModel,
        new Set([editorRef]),
        yProvider.awareness as Awareness
      );
    }

    return () => {
      yDoc?.destroy();
      yProvider?.destroy();
      binding?.destroy();
    };
  }, [editorRef, room]);

  const handleOnMount = useCallback((e: editor.IStandaloneCodeEditor) => {
    setEditorRef(e);
  }, []);

  const checkStatus = async (token: string) => {
    const options = {
      method: "GET",
      url: process.env.NEXT_PUBLIC_RAPID_URL + "/" + token,
      params: { base64_encoded: "true", fields: "*" },
      headers: {
        "X-RapidAPI-Host": process.env.NEXT_PUBLIC_RAPID_API_HOST,
        "X-RapidAPI-Key": process.env.NEXT_PUBLIC_RAPID_API_KEY,
      },
    };
    try {
      let response = await axios.request(options);
      let statusId = response.data.status?.id;

      // Processed - we have a result
      if (statusId === 1 || statusId === 2) {
        // still processing
        setTimeout(() => {
          checkStatus(token);
        }, 2000);
        return;
      } else {
        const data = response.data;
        setOutputDetails(data);
        toast({
          title: "Compilation Successful",
          description: "Your code has been compiled successfully.",
        });
        return;
      }
    } catch (err) {
      console.log("err", err);
      toast({
        title: "Compilation Failed",
        description: "Your code could not be compiled.",
      });
    }
  };

  const getLanguage = () => {
    const availableLangObj = languages.filter(
      (lang) => lang.value === progLang.toLowerCase()
    )[0];
    return {
      id: availableLangObj?.id,
      language: availableLangObj?.value,
    };
  };

  const handleCompile = async () => {
    const formData = {
      language_id: getLanguage().id,
      // encode source code in base64
      source_code: btoa(editorRef?.getModel()?.getValue() as string),
      stdin: btoa(input),
    };
    const options = {
      method: "POST",
      url: process.env.NEXT_PUBLIC_RAPID_URL,
      params: { base64_encoded: "true", fields: "*" },
      headers: {
        "content-type": "application/json",
        "Content-Type": "application/json",
        "X-RapidAPI-Host": process.env.NEXT_PUBLIC_RAPID_API_HOST,
        "X-RapidAPI-Key": process.env.NEXT_PUBLIC_RAPID_API_KEY,
      },
      data: formData,
    };

    setLoading(true);

    axios
      .request(options)
      .then(function (response) {
        const token = response.data.token;
        checkStatus(token);
        setLoading(false);
      })
      .catch((err) => {
        let error = err.response ? err.response.data : err;
        console.log(error);
      });
  };

  const setInputCB = (str: string) => {
    setInput(str);
  };

  const setText = (input: string) => {
    if (editorRef) {
      editorRef
        .getModel()
        ?.setValue(editorRef.getModel()?.getValue() + "\n\n" + input);
    }
  };

  return (
    <div className={styles.container}>
      {provider ? <Cursors yProvider={provider} /> : null}
      <div className="flex">
        <div className={cn(styles.editorContainer)}>
          <div className="flex items-center justify-center bg-gradient-to-r from-emerald-400 to-cyan-400">
            <div>{editorRef ? <Toolbar editor={editorRef} /> : null}</div>
            <CodeAI
              language={progLang ? progLang.toLowerCase() : "typescript"}
              setEditorContentCB={setText}
            />
            <div className="mx-3">
              <Button
                onClick={() => {
                  handleCompile();
                }}
              >
                {!loading ? (
                  <Play className="h-4 w-4" />
                ) : (
                  <Loader2 className="h-4 w-4 animate-spin" />
                )}
              </Button>
            </div>
          </div>
          <div className="h-[70vh]">
            <Editor
              onMount={handleOnMount}
              height="100%"
              width="100hw"
              theme="vs-dark"
              defaultLanguage={progLang ? progLang.toLowerCase() : "typescript"}
              defaultValue=""
              options={{
                tabSize: 2,
                padding: { top: 20 },
              }}
            />
          </div>
        </div>
        <div>
          <OutputWindow outputDetails={outputDetails} />
          <InputWindow setInputCB={setInputCB} input={input} />
        </div>
      </div>
    </div>
  );
}
