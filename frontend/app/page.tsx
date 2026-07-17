"use client";

import {
  useEffect,
  useState,
} from "react";

import UploadDocument from "@/components/documents/UploadDocument";
import DocumentList from "@/components/documents/DocumentList";
import ChatInterface from "@/components/chat/ChatInterface";

import { getDocuments } from "@/services/api";


type DocumentItem = {
  name: string;
  pages: number;
  chunks: number;
};


export default function Home() {

  const [
    documents,
    setDocuments,
  ] = useState<DocumentItem[]>([]);


  const [
    loadingDocuments,
    setLoadingDocuments,
  ] = useState(false);


  const [
    documentsError,
    setDocumentsError,
  ] = useState("");


  const loadDocuments = async () => {

    try {

      setLoadingDocuments(true);

      setDocumentsError("");

      const data =
        await getDocuments();

      setDocuments(
        data.documents || []
      );

    } catch (error) {

      console.error(
        "Failed to load documents:",
        error
      );

      setDocumentsError(
        "Unable to load documents. Make sure the backend is running."
      );

    } finally {

      setLoadingDocuments(false);

    }

  };


  useEffect(() => {

    loadDocuments();

  }, []);


  const handleUploadSuccess = (
    document: DocumentItem
  ) => {

    setDocuments((prev) => [

      ...prev,

      document,

    ]);

  };


  const totalPages =
    documents.reduce(
      (total, document) =>
        total + document.pages,
      0
    );


  const totalChunks =
    documents.reduce(
      (total, document) =>
        total + document.chunks,
      0
    );


  return (

    <main className="min-h-screen bg-slate-50">


      {/* Header */}

      <header className="border-b bg-white">

        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">

          <div>

            <h1 className="text-xl font-bold tracking-tight">

              Industrial Knowledge AI

            </h1>


            <p className="text-sm text-slate-500">

              AI-powered industrial knowledge assistant

            </p>

          </div>


          <div className="flex items-center gap-2 text-sm text-green-600">

            <span className="h-2 w-2 rounded-full bg-green-500" />

            System Online

          </div>

        </div>

      </header>


      {/* Dashboard */}

      <div className="mx-auto grid max-w-7xl gap-6 p-6 lg:grid-cols-[320px_1fr]">


        {/* Sidebar */}

        <aside className="space-y-6">


          {/* Upload Document */}

          <UploadDocument

            onUploadSuccess={
              handleUploadSuccess
            }

          />


          {/* Knowledge Base Statistics */}

          <div className="rounded-xl border bg-white p-4 shadow-sm">


            <div className="mb-4 flex items-center justify-between">


              <h3 className="font-semibold">

                Knowledge Base

              </h3>


              <button

                onClick={loadDocuments}

                disabled={loadingDocuments}

                className="text-sm text-slate-500 hover:text-slate-900 disabled:opacity-50"

              >

                {loadingDocuments
                  ? "Loading..."
                  : "Refresh"}

              </button>


            </div>


            {/* Error Message */}

            {documentsError && (

              <p className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">

                {documentsError}

              </p>

            )}


            {/* Statistics */}

            <div className="grid grid-cols-3 gap-2">


              <div className="rounded-lg bg-slate-50 p-3 text-center">

                <p className="text-xl font-bold">

                  {documents.length}

                </p>


                <p className="text-xs text-slate-500">

                  Documents

                </p>

              </div>


              <div className="rounded-lg bg-slate-50 p-3 text-center">

                <p className="text-xl font-bold">

                  {totalPages}

                </p>


                <p className="text-xs text-slate-500">

                  Pages

                </p>

              </div>


              <div className="rounded-lg bg-slate-50 p-3 text-center">

                <p className="text-xl font-bold">

                  {totalChunks}

                </p>


                <p className="text-xs text-slate-500">

                  Chunks

                </p>

              </div>


            </div>


            <p className="mt-4 text-sm text-slate-500">

              Upload technical documents to build your industrial knowledge base.

            </p>


          </div>


          {/* Document Library */}

          <DocumentList

            documents={documents}

          />


        </aside>


        {/* Chat Area */}

        <section>

          <ChatInterface />

        </section>


      </div>

    </main>

  );

}