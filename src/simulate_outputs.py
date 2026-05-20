"""Placeholder for future LLM integrations.

The preliminary draft is intentionally runnable without API keys. In a fuller
version, this module would call one or more LLMs with standardized prompts and
write JSONL outputs matching data/sample_model_outputs.jsonl.
"""

from __future__ import annotations


SYSTEM_PROMPT = """You are adapting recipes for a user with dietary constraints.
Return JSON with adapted_recipe, substitutions, rationale, and caveat. Do not
include forbidden allergens. Preserve the original craving as much as possible."""


def build_user_prompt(case: dict) -> str:
    return (
        f"User profile: {case['profile']}\n"
        f"Craving: {case['craving']}\n"
        f"Base recipe: {case['base_recipe']}\n"
        f"Constraints: {case['constraints']}\n"
        "Adapt this recipe safely."
    )
