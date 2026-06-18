from __future__ import annotations

import re
from typing import Iterable


FILLER_WORDS = {
    "uh",
    "um",
    "hmm",
    "like",
    "please",
    "kindly",
    "actually",
    "basically",
    "just",
}

SINGLE_DIGIT_WORDS = {
    "zero": "0",
    "oh": "0",
    "one": "1",
    "two": "2",
    "three": "3",
    "four": "4",
    "five": "5",
    "six": "6",
    "seven": "7",
    "eight": "8",
    "nine": "9",
}

NUMBER_WORDS = {
    **{word: int(value) for word, value in {
        "zero": 0,
        "one": 1,
        "two": 2,
        "three": 3,
        "four": 4,
        "five": 5,
        "six": 6,
        "seven": 7,
        "eight": 8,
        "nine": 9,
        "ten": 10,
        "eleven": 11,
        "twelve": 12,
        "thirteen": 13,
        "fourteen": 14,
        "fifteen": 15,
        "sixteen": 16,
        "seventeen": 17,
        "eighteen": 18,
        "nineteen": 19,
        "twenty": 20,
        "thirty": 30,
        "forty": 40,
        "fifty": 50,
        "sixty": 60,
        "seventy": 70,
        "eighty": 80,
        "ninety": 90,
    }.items()},
    "hundred": 100,
    "thousand": 1000,
    "lakh": 100000,
    "million": 1000000,
}


def merge_spelled_letters(text: str) -> str:
    def _replace(match: re.Match[str]) -> str:
        letters = re.findall(r"[A-Za-z]", match.group(0))
        return "".join(letters).upper()

    pattern = re.compile(r"\b(?:[A-Za-z]\s+){1,}[A-Za-z]\b")
    return pattern.sub(_replace, text)


def strip_fillers(text: str, fillers: Iterable[str] = FILLER_WORDS) -> str:
    pattern = re.compile(rf"\b(?:{'|'.join(sorted(map(re.escape, fillers), key=len, reverse=True))})\b", re.IGNORECASE)
    return re.sub(r"\s{2,}", " ", pattern.sub(" ", text)).strip()


def _parse_number_words(tokens: list[str]) -> str | None:
    if not tokens:
        return None

    if all(token in SINGLE_DIGIT_WORDS for token in tokens):
        return "".join(SINGLE_DIGIT_WORDS[token] for token in tokens)

    total = 0
    current = 0
    for token in tokens:
        value = NUMBER_WORDS.get(token)
        if value is None:
            return None
        if value == 100:
            current = max(current, 1) * value
        elif value >= 1000:
            current = max(current, 1) * value
            total += current
            current = 0
        else:
            current += value
    return str(total + current)


def convert_spoken_numbers(text: str) -> str:
    tokens = re.findall(r"[A-Za-z]+|\d+|[^\w\s]+", text)
    output: list[str] = []
    buffer: list[str] = []

    def flush_buffer() -> None:
        nonlocal buffer
        if not buffer:
            return
        parsed = _parse_number_words(buffer)
        if parsed is None:
            output.extend(buffer)
        else:
            output.append(parsed)
        buffer = []

    for token in tokens:
        lowered = token.lower()
        if lowered in NUMBER_WORDS or lowered in SINGLE_DIGIT_WORDS:
            buffer.append(lowered)
        else:
            flush_buffer()
            output.append(token)
    flush_buffer()

    text_out = " ".join(output)
    text_out = re.sub(r"\s+([,.;:])", r"\1", text_out)
    text_out = re.sub(r"(?<=\w)\s*@\s*(?=\w)", "@", text_out)
    text_out = re.sub(r"(?<=\w)\s*\.\s*(?=\w)", ".", text_out)
    text_out = re.sub(r"(?<=https:)\s*/\s*", "/", text_out)
    text_out = re.sub(r"(?<=http:)\s*/\s*", "/", text_out)
    return re.sub(r"\s{2,}", " ", text_out).strip()


def normalize_agent_text(text: str) -> str:
    normalized = merge_spelled_letters(text or "")
    normalized = convert_spoken_numbers(normalized)
    normalized = strip_fillers(normalized)
    normalized = re.sub(r"\s+", " ", normalized).strip()
    normalized = re.sub(r"\bemail id\b", "email", normalized, flags=re.IGNORECASE)
    normalized = re.sub(r"\bmobile number\b", "mobile", normalized, flags=re.IGNORECASE)
    return normalized
