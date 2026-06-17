# =============================================================================
# FILE: email_campaign/resume_utils.py
# Resume text extraction (PDF / DOCX / Image via EasyOCR) + Groq AI parsing
# =============================================================================

import re
import io
import json
import hashlib
import logging

logger = logging.getLogger(__name__)

# Simple in-memory cache (same pattern as visiting card utils)
_cache = {}


# =============================================================================
# TEXT EXTRACTION  (PDF · DOCX · Image-OCR fallback via EasyOCR)
# =============================================================================

def extract_text_from_file(file) -> str:
    """
    Extracts raw text from an uploaded PDF or DOCX file.

    Strategy:
        PDF  → pdfplumber (structured text)
               → PyMuPDF  (fallback structured text)
               → EasyOCR  (final fallback for scanned / image-only PDFs)
        DOCX → python-docx
               → EasyOCR  (final fallback if docx has no text paragraphs)

    Returns a plain text string.
    """
    filename = file.name.lower()

    if filename.endswith('.pdf'):
        return _extract_from_pdf(file)
    elif filename.endswith('.docx'):
        return _extract_from_docx(file)
    else:
        raise ValueError(
            f"Unsupported file type: {file.name}. Only PDF and DOCX are supported."
        )


# ---------------------------------------------------------------------------
# PDF extraction
# ---------------------------------------------------------------------------

def _extract_from_pdf(file) -> str:
    """Extract text from PDF: pdfplumber → PyMuPDF → EasyOCR (scanned)."""

    # ── Strategy 1: pdfplumber (best for text-layer PDFs) ──────────────────
    try:
        import pdfplumber
        file.seek(0)
        with pdfplumber.open(file) as pdf:
            pages_text = [
                page.extract_text()
                for page in pdf.pages
                if page.extract_text()
            ]
        result = '\n'.join(pages_text).strip()
        if result:
            logger.info("PDF text extracted with pdfplumber")
            return result
        logger.info("pdfplumber returned empty — trying PyMuPDF")
    except ImportError:
        logger.warning("pdfplumber not installed — trying PyMuPDF")
    except Exception as e:
        logger.warning(f"pdfplumber failed: {e} — trying PyMuPDF")

    # ── Strategy 2: PyMuPDF (fitz) ─────────────────────────────────────────
    pdf_bytes = None
    try:
        import fitz  # PyMuPDF
        file.seek(0)
        pdf_bytes = file.read()
        doc = fitz.open(stream=pdf_bytes, filetype="pdf")
        pages_text = [page.get_text() for page in doc]
        result = '\n'.join(pages_text).strip()
        if result:
            logger.info("PDF text extracted with PyMuPDF")
            return result
        logger.info("PyMuPDF returned empty — falling back to EasyOCR")
    except ImportError:
        logger.warning("PyMuPDF not installed — trying EasyOCR")
        file.seek(0)
        pdf_bytes = file.read()
    except Exception as e:
        logger.warning(f"PyMuPDF failed: {e} — trying EasyOCR")
        if pdf_bytes is None:
            file.seek(0)
            pdf_bytes = file.read()

    # ── Strategy 3: EasyOCR (scanned / image-only PDFs) ───────────────────
    return _ocr_pdf_bytes(pdf_bytes)


def _ocr_pdf_bytes(pdf_bytes: bytes) -> str:
    """
    Render each PDF page as an image and run EasyOCR on it.
    Requires: PyMuPDF (fitz) for rendering + easyocr.
    """
    try:
        import fitz
        import easyocr
        import numpy as np
    except ImportError as e:
        raise ImportError(
            f"OCR dependencies missing ({e}). "
            "Install: pip install PyMuPDF easyocr"
        )

    try:
        reader = easyocr.Reader(['en'], gpu=False, verbose=False)
        doc    = fitz.open(stream=pdf_bytes, filetype="pdf")
        all_text: list[str] = []

        for page in doc:
            # Render at 2× zoom for better OCR accuracy
            mat  = fitz.Matrix(2, 2)
            pix  = page.get_pixmap(matrix=mat)
            img  = np.frombuffer(pix.samples, dtype=np.uint8).reshape(
                pix.height, pix.width, pix.n
            )
            # EasyOCR expects RGB; PyMuPDF gives RGB or RGBA
            if pix.n == 4:
                img = img[:, :, :3]

            results  = reader.readtext(img, detail=0, paragraph=True)
            all_text.append('\n'.join(results))

        result = '\n'.join(all_text).strip()
        logger.info("PDF text extracted with EasyOCR")
        return result

    except Exception as e:
        raise RuntimeError(f"EasyOCR PDF extraction failed: {e}")


# ---------------------------------------------------------------------------
# DOCX extraction
# ---------------------------------------------------------------------------

def _extract_from_docx(file) -> str:
    """Extract text from DOCX: python-docx → EasyOCR (image-heavy DOCX)."""

    # ── Strategy 1: python-docx ────────────────────────────────────────────
    try:
        from docx import Document
        file.seek(0)
        doc        = Document(file)
        paragraphs = [p.text for p in doc.paragraphs if p.text.strip()]
        result     = '\n'.join(paragraphs).strip()
        if result:
            logger.info("DOCX text extracted with python-docx")
            return result
        logger.info("python-docx returned empty — trying EasyOCR on embedded images")
    except ImportError:
        raise ImportError("python-docx not installed. Run: pip install python-docx")
    except Exception as e:
        raise RuntimeError(f"DOCX extraction failed: {e}")

    # ── Strategy 2: EasyOCR on embedded images ─────────────────────────────
    try:
        import zipfile, easyocr, numpy as np
        from PIL import Image

        file.seek(0)
        docx_bytes = file.read()
        reader     = easyocr.Reader(['en'], gpu=False, verbose=False)
        all_text: list[str] = []

        with zipfile.ZipFile(io.BytesIO(docx_bytes)) as z:
            image_names = [n for n in z.namelist() if n.startswith('word/media/')]
            for name in image_names:
                with z.open(name) as img_file:
                    img     = Image.open(img_file).convert('RGB')
                    results = reader.readtext(np.array(img), detail=0, paragraph=True)
                    all_text.append('\n'.join(results))

        result = '\n'.join(all_text).strip()
        if result:
            logger.info("DOCX images extracted with EasyOCR")
            return result
    except Exception as e:
        logger.warning(f"EasyOCR on DOCX failed: {e}")

    return ''


# =============================================================================
# FALLBACK REGEX PARSER
# =============================================================================

def _fallback_parse(raw_text: str) -> dict:
    """
    Regex-based parser used when Groq API is unavailable or returns garbage.
    """
    lines  = [l.strip() for l in raw_text.split('\n') if l.strip()]
    result = {
        "name":        "",
        "email":       "",
        "phone":       "",
        "designation": "",
        "address":     "",
    }

    remaining_lines = []

    for line in lines:
        # Extract email
        if not result['email']:
            m = re.search(r'[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}', line)
            if m:
                result['email'] = m.group()
                continue

        # Extract phone (first match wins)
        if not result['phone']:
            m = re.search(r'[\+]?[\d\s\-\(\)]{7,15}', line)
            if m and sum(c.isdigit() for c in m.group()) >= 7:
                result['phone'] = m.group().strip()
                continue
        else:
            m = re.search(r'[\+]?[\d\s\-\(\)]{7,15}', line)
            if m and sum(c.isdigit() for c in m.group()) >= 7:
                continue  # skip extra phone lines

        # Skip URLs / social media
        if re.search(
            r'www\.|http|\.com|\.in|\.net|\.org|\.io|linkedin|github|twitter|facebook',
            line.lower()
        ):
            continue

        remaining_lines.append(line)

    designation_keywords = [
        'manager', 'director', 'engineer', 'developer', 'designer',
        'executive', 'officer', 'head', 'lead', 'founder', 'ceo',
        'cto', 'coo', 'cfo', 'president', 'vice', 'assistant',
        'consultant', 'analyst', 'coordinator', 'specialist',
        'associate', 'intern', 'sales', 'marketing', 'hr',
        'finance', 'accountant', 'partner', 'supervisor',
        'technician', 'advisor', 'representative', 'architect',
        'programmer', 'tester', 'qa', 'devops', 'full stack',
        'frontend', 'backend', 'data scientist', 'ml engineer',
    ]

    for line in remaining_lines:
        line_lower = line.lower()

        if re.search(r'\d{5,}', line):
            continue

        is_designation = any(kw in line_lower for kw in designation_keywords)

        if not result['name'] and not is_designation:
            result['name'] = line
        elif not result['designation'] and is_designation:
            result['designation'] = line
        else:
            if result['address']:
                result['address'] += ', ' + line
            else:
                result['address'] = line

    return result


# =============================================================================
# GROQ AI PARSER
# =============================================================================

def parse_resume_with_groq(raw_text: str) -> dict:
    """
    Sends extracted resume text to Groq and returns structured JSON.
    Falls back to regex parser if Groq fails or returns empty data.

    Returns dict with keys: name, email, phone, designation, address
    """

    # Truncate very long resumes (Groq has token limits; first 3000 chars is enough)
    text_for_ai = raw_text[:3000] if len(raw_text) > 3000 else raw_text

    # Cache check
    cache_key = hashlib.md5(text_for_ai.encode()).hexdigest()
    if cache_key in _cache:
        logger.info("Returning cached resume parse result")
        return _cache[cache_key]

    prompt = f"""You are a resume parser. Extract the candidate's contact information from the text below.
The text may be extracted from a PDF, DOCX, or OCR-processed image — expect some formatting noise.

Return ONLY a valid JSON object with these exact keys (use empty string if not found):
{{
  "name": "",
  "email": "",
  "phone": "",
  "designation": "",
  "address": ""
}}

Rules:
- name: Full name of the candidate (proper Title Case)
- email: Email address only (format: xxx@xxx.xxx)
- phone: Primary phone number only, with country code if present
- designation: Current or most recent job title / role (e.g. Software Engineer, Product Manager)
- address: City, State, Country if present. Exclude email and website.
- If a field is ambiguous or not clearly present, return empty string.
- Do NOT include any markdown, explanation, or extra text. JSON only.

Resume text:
{text_for_ai}

Return only the JSON object."""

    try:
        from groq import Groq
        from django.conf import settings

        api_key = getattr(settings, 'GROQ_API_KEY', None)
        if not api_key:
            raise ValueError("GROQ_API_KEY not configured in settings.py")

        client = Groq(api_key=api_key)

        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {
                    "role": "system",
                    "content": (
                        "You are a resume parser. "
                        "Always return valid JSON only. "
                        "No markdown, no explanation, no extra text."
                    ),
                },
                {
                    "role": "user",
                    "content": prompt,
                },
            ],
            max_tokens=512,
            temperature=0.1,
        )

        text = response.choices[0].message.content.strip()

        # Strip markdown fences if Groq adds them
        text = re.sub(r'^```json\s*', '', text)
        text = re.sub(r'^```\s*',     '', text)
        text = re.sub(r'\s*```$',     '', text)
        text = text.strip()

        parsed = json.loads(text)

        keys   = ["name", "email", "phone", "designation", "address"]
        result = {k: parsed.get(k, "") for k in keys}

        # Sanity check: if all fields empty, fall back to regex
        filled = sum(1 for v in result.values() if str(v).strip())
        if filled == 0:
            logger.warning("Groq returned all-empty result — using fallback parser")
            return _fallback_parse(raw_text)

        _cache[cache_key] = result
        logger.info("Groq resume parsing successful")
        return result

    except json.JSONDecodeError as e:
        logger.warning(f"Groq JSON parse error: {e} — using fallback parser")
        return _fallback_parse(raw_text)

    except Exception as e:
        logger.error(f"Groq API error: {e} — using fallback parser")
        return _fallback_parse(raw_text)