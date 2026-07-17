"use client";

import { useState } from "react";
import { uploadPDF } from "@/services/upload";

type UploadDocumentProps = {
  onUploadSuccess: (document: {
    name: string;
    pages: number;
    chunks: number;
  }) => void;
};

export default function UploadDocument({
  onUploadSuccess,
}: UploadDocumentProps) {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState("");

  const handleUpload = async () => {
    if (!file) return;

    try {
      setUploading(true);
      setError("");

      const data = await uploadPDF(file);

      onUploadSuccess({
        name: data.filename,
        pages: data.pages,
        chunks: data.chunks,
      });

      setResult(data);

      setFile(null);
    } catch (err) {
      setError("Failed to upload document.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-4 rounded-xl border bg-white p-6 shadow-sm">
      <h2 className="text-xl font-semibold">
        Upload Document
      </h2>

      <input
        type="file"
        accept=".pdf"
        onChange={(e) => {
          setFile(e.target.files?.[0] || null);
          setResult(null);
          setError("");
        }}
        className="block w-full text-sm"
      />

      {file && (
        <p className="text-sm text-slate-500">
          Selected: {file.name}
        </p>
      )}

      <button
        onClick={handleUpload}
        disabled={!file || uploading}
        className="rounded-md bg-slate-900 px-4 py-2 text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {uploading ? "Processing..." : "Upload PDF"}
      </button>

      {error && (
        <p className="text-sm text-red-500">
          {error}
        </p>
      )}

      {result && (
        <div className="rounded-md bg-slate-100 p-4">
          <p className="font-medium">
            {result.filename}
          </p>

          <p className="text-sm text-slate-600">
            Pages: {result.pages}
          </p>

          <p className="text-sm text-slate-600">
            Chunks: {result.chunks}
          </p>
        </div>
      )}
    </div>
  );
}