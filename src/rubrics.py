"""Rule and rubric helpers for CraveAlign prototype evaluation."""

from __future__ import annotations

from dataclasses import dataclass


HIGH_SODIUM_TERMS = {
    "soy sauce",
    "hot sauce",
    "pickles",
    "pepperoni",
    "parmesan",
    "jarred alfredo",
    "seafood broth",
    "garlic salt",
}

ADDED_SUGAR_TERMS = {
    "brown sugar",
    "syrup",
    "frosting",
    "ice cream",
    "sweetened creamer",
    "sprinkles",
    "candy",
}

POSITIVE_SUBSTITUTION_TERMS = {
    "low-sodium",
    "no-salt-added",
    "whole-grain",
    "fiber",
    "vegetable",
    "vegetables",
    "beans",
    "chia",
    "Greek yogurt",
    "unsweetened",
    "air-fried",
    "oven",
    "tofu",
}

CRAVING_ANCHORS = {
    "noodles": {"noodle", "noodles", "ramen"},
    "fried chicken sandwich": {"chicken", "sandwich", "crispy"},
    "brown sugar milk tea": {"tea", "creamy", "milk"},
    "shrimp ramen": {"ramen", "noodle", "broth"},
    "pepperoni pizza": {"pizza", "cheese", "crust"},
    "chocolate brownie": {"brownie", "chocolate", "cocoa"},
    "wrap": {"wrap", "tortilla"},
    "pasta": {"pasta", "creamy"},
    "milkshake": {"shake", "milk", "creamy"},
    "trail mix": {"trail", "crunchy", "snack"},
}


@dataclass(frozen=True)
class EvaluationResult:
    case_id: str
    system: str
    allergen_violation: bool
    restricted_term_count: int
    nutrition_improvement_score: int
    craving_preservation_score: int
    schema_complete: bool
    overall_score: float


def normalize(text: str) -> str:
    return text.lower()


def contains_any(text: str, terms: list[str] | set[str]) -> bool:
    lowered = normalize(text)
    return any(term.lower() in lowered for term in terms)


def count_terms(text: str, terms: list[str] | set[str]) -> int:
    lowered = normalize(text)
    return sum(1 for term in terms if term.lower() in lowered)


def score_craving_preservation(craving: str, output_text: str) -> int:
    lowered_craving = normalize(craving)
    anchors = set()
    for key, values in CRAVING_ANCHORS.items():
        if key in lowered_craving:
            anchors.update(values)

    if not anchors:
        anchors = set(lowered_craving.split())

    hits = count_terms(output_text, anchors)
    if hits >= 3:
        return 5
    if hits == 2:
        return 4
    if hits == 1:
        return 3
    return 1


def score_nutrition_improvement(output_text: str, reduce_targets: list[str], increase_targets: list[str]) -> int:
    score = 0
    score += count_terms(output_text, POSITIVE_SUBSTITUTION_TERMS)

    lowered = normalize(output_text)
    if "sodium" in reduce_targets and ("low-sodium" in lowered or "no-salt-added" in lowered):
        score += 2
    if "added sugar" in reduce_targets and ("unsweetened" in lowered or "less sugar" in lowered or "reducing added sugar" in lowered):
        score += 2
    if "deep frying" in reduce_targets and ("air-fried" in lowered or "oven" in lowered):
        score += 2
    if "fiber" in increase_targets and ("fiber" in lowered or "beans" in lowered or "chia" in lowered or "whole-grain" in lowered):
        score += 2
    if "protein" in increase_targets and ("protein" in lowered or "tofu" in lowered or "chicken" in lowered or "egg" in lowered):
        score += 1

    return min(score, 10)


def evaluate_output(case: dict, output: dict) -> EvaluationResult:
    output_text = " ".join(
        str(output.get(field, ""))
        for field in ["adapted_recipe", "substitutions", "rationale", "caveat"]
    )
    constraints = case.get("constraints", {})
    avoid_terms = constraints.get("avoid", [])
    reduce_targets = constraints.get("reduce", [])
    increase_targets = constraints.get("increase", [])

    # Check the final recipe body for hard allergen violations. Substitution
    # explanations may legitimately mention the removed allergen.
    allergen_violation = contains_any(str(output.get("adapted_recipe", "")), avoid_terms)
    restricted_terms = set()
    if "sodium" in reduce_targets:
        restricted_terms.update(HIGH_SODIUM_TERMS)
    if "added sugar" in reduce_targets:
        restricted_terms.update(ADDED_SUGAR_TERMS)
    restricted_term_count = count_terms(output_text, restricted_terms)

    nutrition_score = score_nutrition_improvement(output_text, reduce_targets, increase_targets)
    craving_score = score_craving_preservation(case["craving"], output_text)
    schema_complete = all(output.get(field) for field in ["adapted_recipe", "substitutions", "rationale", "caveat"])

    safety_component = 0 if allergen_violation else 5
    restriction_component = max(0, 5 - restricted_term_count)
    schema_component = 2 if schema_complete else 0
    overall = (
        safety_component * 0.30
        + restriction_component * 0.20
        + nutrition_score * 0.20
        + craving_score * 0.20
        + schema_component * 0.10
    )

    return EvaluationResult(
        case_id=case["id"],
        system=output["system"],
        allergen_violation=allergen_violation,
        restricted_term_count=restricted_term_count,
        nutrition_improvement_score=nutrition_score,
        craving_preservation_score=craving_score,
        schema_complete=schema_complete,
        overall_score=round(overall, 2),
    )
