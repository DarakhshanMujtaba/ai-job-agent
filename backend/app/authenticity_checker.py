import re

# Common AI-cliche phrases that make writing sound generic and robotic.
AI_CLICHE_PHRASES = [
    r"results-driven",
    r"passionate about leveraging",
    r"dynamic professional",
    r"proven track record",
    r"synergy",
    r"go-getter",
    r"team player with excellent",
    r"detail-oriented individual",
    r"thrives in a fast-paced environment",
    r"wear many hats",
    r"hit the ground running",
    r"self-starter",
    r"outside the box",
    r"cutting-edge solutions",
    r"seamlessly integrate",
    r"unwavering commitment",
]

# Patterns that suggest the LLM followed a hidden instruction embedded in the
# job description (a prompt injection attack), rather than writing naturally.
INJECTION_INDICATORS = [
    r"as requested",
    r"i have read the job post completely",
    r"i understand the requirements? of the position",
    r"defeated",
    r"i would like to mention that",
    r"#[a-zA-Z0-9+/]{10,}={0,2}",   # looks like a base64-style encoded token
    r"\*\*[a-z]+\*\*",               # unusual markdown-bolded single trigger word
]


def check_authenticity(text: str) -> dict:
    """
    Scan text for common AI-cliche phrases using simple pattern matching.
    Returns a report with flagged phrases and a basic authenticity note.
    """
    text_lower = text.lower()
    flagged = []

    for pattern in AI_CLICHE_PHRASES:
        if re.search(pattern, text_lower):
            flagged.append(pattern.replace(r"\b", "").replace("\\", ""))

    if len(flagged) == 0:
        verdict = "Sounds natural - no common AI-cliche phrases detected."
    elif len(flagged) <= 2:
        verdict = "Mostly natural, but a couple of generic phrases were found."
    else:
        verdict = "Sounds AI-generated - multiple generic phrases detected. Consider rewriting with specific, concrete details."

    return {
        "flagged_phrases": flagged,
        "verdict": verdict
    }


def check_for_injection(text: str) -> dict:
    """
    Scan generated text for signs that the LLM followed a hidden instruction
    embedded in untrusted input (e.g. a job description), rather than writing
    the content the user actually asked for. This is a defense-in-depth check -
    it runs AFTER generation, in addition to the system prompt instruction.
    """
    matches = []

    for pattern in INJECTION_INDICATORS:
        found = re.findall(pattern, text, re.IGNORECASE)
        if found:
            matches.extend(found)

    is_suspicious = len(matches) > 0

    return {
        "is_suspicious": is_suspicious,
        "matched_patterns": matches,
        "note": (
            "Warning: this content may have been influenced by a hidden "
            "instruction embedded in the job posting. Review before using."
            if is_suspicious
            else "No injection indicators detected."
        )
    }