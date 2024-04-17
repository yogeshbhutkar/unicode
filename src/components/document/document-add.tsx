"use client";

import React from "react";
import { Loader, Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Language } from "@prisma/client";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "../ui/use-toast";

export default function DocumentAdd() {
  const [language, setLanguage] = React.useState<Language>("PYTHON");
  const [name, setName] = React.useState("");
  const [isOpen, setIsOpen] = React.useState(false);

  const { mutate: handleSubmit, isPending } = useMutation({
    mutationFn: async () => {
      await axios.post("/api/create-document", {
        name,
        language,
      });
    },
    onSuccess: () => {
      setIsOpen(false);
      toast({
        title: "Document created",
        description: "Your document has been created successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description:
          "An error occurred while creating your file, please retry again later.",
      });
    },
  });

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-1" />
          <span>Create a file</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create file</DialogTitle>
          <DialogDescription>
            Customize filename and file type. Click create when you&apos;re
            done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4 w-full">
            <Label htmlFor="language" className="text-right">
              Language
            </Label>
            <Select
              defaultValue="PYTHON"
              onValueChange={(e) => setLanguage(e as Language)}
            >
              <SelectTrigger className="w-fit">
                <SelectValue placeholder="Theme" />
              </SelectTrigger>
              <SelectContent>
                {Object.keys(Language).map((language) => (
                  <SelectItem key={language} value={language}>
                    {language.slice(0, 1).toUpperCase() +
                      language.slice(1).toLocaleLowerCase()}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button
            onClick={() => handleSubmit()}
            className="hover:bg-green-600 hover:text-white w-full"
            type="submit"
          >
            Create
            {isPending ? (
              <Loader className="ml-1 h-3 w-3 animate-spin duration-500" />
            ) : (
              ""
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
