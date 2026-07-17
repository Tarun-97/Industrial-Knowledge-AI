from pathlib import Path
from pypdf import PdfReader

UPLOAD_DIR = Path("app/uploads")
UPLOAD_DIR.mkdir(exist_ok=True)


def save_pdf(file):
    filepath = UPLOAD_DIR / file.filename

    with open(filepath, "wb") as buffer:
        buffer.write(file.file.read())

    return filepath


def extract_text(filepath):
    reader = PdfReader(filepath)

    text = ""

    for page in reader.pages:
        page_text = page.extract_text()

        if page_text:
            text += page_text + "\n"

    return {
        "pages": len(reader.pages),
        "text": text,
        "characters": len(text)
    }