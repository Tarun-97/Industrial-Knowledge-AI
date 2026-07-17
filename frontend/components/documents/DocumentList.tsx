"use client";

type DocumentItem = {
  name: string;
  pages?: number;
  chunks?: number;
};

type DocumentListProps = {
  documents: DocumentItem[];
};

export default function DocumentList({
  documents,
}: DocumentListProps) {
  return (
    <div className="rounded-xl border bg-white p-4 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-semibold">
          Documents
        </h3>

        <span className="rounded-full bg-slate-100 px-2 py-1 text-xs text-slate-500">
          {documents.length}
        </span>
      </div>

      {documents.length === 0 ? (
        <div className="rounded-lg border border-dashed p-6 text-center">
          <div className="mb-2 text-3xl">
            📄
          </div>

          <p className="text-sm font-medium">
            No documents yet
          </p>

          <p className="mt-1 text-xs text-slate-500">
            Upload a PDF to build your knowledge base.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {documents.map((document, index) => (
            <div
              key={`${document.name}-${index}`}
              className="rounded-lg border p-3 transition hover:bg-slate-50"
            >
              <div className="flex items-start gap-3">
                <div className="text-xl">
                  📄
                </div>

                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">
                    {document.name}
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    {document.pages || 0} pages
                    {" · "}
                    {document.chunks || 0} chunks
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}