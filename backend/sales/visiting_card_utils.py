# /visiting_card_utils.py
import re, hashlib, json, logging
from django.conf import settings

logger = logging.getLogger(__name__)
_cache = {}


def _fallback_parse(raw_text: str) -> dict:
    lines = [l.strip() for l in raw_text.split('\n') if l.strip()]
    result = {
        "person_name": "", "company_name": "", "email": "",
        "phone": "", "designation": "", "address": "",
    }
    remaining_lines = []

    for line in lines:
        if not result['email']:
            m = re.search(r'[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}', line)
            if m:
                result['email'] = m.group()
                continue

        if not result['phone']:
            m = re.search(r'[\+]?[\d\s\-\(\)]{7,15}', line)
            if m and sum(c.isdigit() for c in m.group()) >= 7:
                result['phone'] = m.group().strip()
                continue
        else:
            m = re.search(r'[\+]?[\d\s\-\(\)]{7,15}', line)
            if m and sum(c.isdigit() for c in m.group()) >= 7:
                continue

        if re.search(r'www\.|http|\.com|\.in|\.net|\.org|\.io|linkedin|twitter|facebook|instagram', line.lower()):
            continue

        remaining_lines.append(line)

    designation_keywords = [
        'manager', 'director', 'engineer', 'developer', 'designer',
        'executive', 'officer', 'head', 'lead', 'founder', 'ceo',
        'cto', 'coo', 'cfo', 'president', 'vice', 'assistant',
        'consultant', 'analyst', 'coordinator', 'specialist',
        'associate', 'intern', 'sales', 'marketing', 'hr',
        'finance', 'accountant', 'partner', 'supervisor',
        'technician', 'advisor', 'representative', 'agent',
    ]

    for line in remaining_lines:
        line_lower = line.lower()
        if re.search(r'\d{5,}', line):
            continue
        is_designation = any(kw in line_lower for kw in designation_keywords)

        if not result['person_name'] and not is_designation:
            result['person_name'] = line
        elif not result['designation'] and is_designation:
            result['designation'] = line
        elif not result['company_name']:
            if not re.search(r'\d{4,}', line):
                result['company_name'] = line
            else:
                result['address'] = (result['address'] + ', ' + line).lstrip(', ')
        else:
            result['address'] = (result['address'] + ', ' + line).lstrip(', ')

    return result


def parse_card_with_groq(raw_text: str) -> dict:
    cache_key = hashlib.md5(raw_text.encode()).hexdigest()
    if cache_key in _cache:
        return _cache[cache_key]

    prompt = f"""You are a business card parser. Extract contact information from the text below.
Return ONLY a valid JSON object with these exact keys (use empty string if not found):
{{
  "person_name": "",
  "company_name": "",
  "email": "",
  "phone": "",
  "designation": "",
  "address": ""
}}
Rules:
- person_name: Full name of the person
- company_name: Name of the company (NOT a phone number). Normalize "Pvt:" to "Pvt." and "Ltd:" to "Ltd.". If the company name letters conflict with the website domain or email domain (e.g. company reads "NE Technologies" but domain is "nltecsolutions.com"), trust the domain and correct the company name to match (e.g. "NL Technologies"). OCR often confuses similar letters like E/L, 0/O, 1/I — use the domain as the source of truth.
- email: Email address only, return as-is from the text
- phone: All phone numbers found, comma-separated. Include country code if present
- designation: Job title or role
- address: Full address if present

Business card text:
{raw_text}

Return only the JSON object, no markdown, no explanation."""

    try:
        from groq import Groq
        api_key = getattr(settings, 'GROQ_API_KEY', None)
        if not api_key:
            raise ValueError("GROQ_API_KEY not configured in settings.py")

        client = Groq(api_key=api_key)
        completion = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {"role": "system", "content": "You are a business card parser. Always return valid JSON only."},
                {"role": "user", "content": prompt}
            ],
            max_tokens=512,
            temperature=0.1,
        )

        text = completion.choices[0].message.content.strip()
        text = re.sub(r'^```json\s*', '', text)
        text = re.sub(r'^```\s*', '', text)
        text = re.sub(r'\s*```$', '', text).strip()

        parsed = json.loads(text)
        keys = ["person_name", "company_name", "email", "phone", "designation", "address"]
        result = {k: parsed.get(k, "") for k in keys}

        if result['company_name'] and re.search(r'\d{5,}', result['company_name']):
            result['company_name'] = ""

        if sum(1 for v in result.values() if str(v).strip()) == 0:
            return _fallback_parse(raw_text)

        _cache[cache_key] = result
        return result

    except json.JSONDecodeError:
        return _fallback_parse(raw_text)
    except Exception as e:
        logger.error(f"Groq API error: {e}")
        return _fallback_parse(raw_text)