"use client";

import React from "react";
import { Loader2, Trash2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function DeleteButton({ onClick, title = "Delete", pending = false }) {
  const { user } = useAuth() || {};

  if (user?.role !== "admin") return null;

  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      disabled={pending}
      className="p-1.5 text-zinc-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-md transition-colors cursor-pointer disabled:opacity-50"
    >
      {pending ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <Trash2 className="w-4 h-4 stroke-[1.75]" />
      )}
    </button>
  );
}
