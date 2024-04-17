"use client";

import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Documents } from "@prisma/client";
import { useRouter } from "next/navigation";
import { Loader } from "lucide-react";

export default function DisplayFiles() {
  const router = useRouter();

  const { data: docs, isPending } = useQuery({
    queryKey: ["getFiles"],
    queryFn: async () => {
      const { data } = await axios.get("/api/create-document");
      return data as Documents[];
    },
  });

  return (
    <>
      {isPending ? (
        <div className="flex items-center justify-center">
          <Loader className="h-5 w-5 animate-spin duration-500" />
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>File Name</TableHead>
              <TableHead>File Type</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead className="text-right">Updated At</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {docs?.map((doc) => (
              <TableRow key={doc.id}>
                <TableCell
                  onClick={() => {
                    router.push(`/dashboard/${doc.id}`);
                  }}
                  className="cursor-pointer hover:text-white"
                >
                  {doc.name}
                </TableCell>
                <TableCell>
                  {doc.language.slice(0, 1).toUpperCase() +
                    doc.language.slice(1).toLowerCase()}
                </TableCell>
                <TableCell>{new Date(doc.createdAt).toDateString()}</TableCell>
                <TableCell className="text-right">
                  {new Date(doc.updatedAt).toDateString()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </>
  );
}
