"""Run CraveAlign prototype evaluation.

Usage:
    python src/evaluate.py \
        --cases data/sample_cases.jsonl \
        --outputs data/sample_model_outputs.jsonl \
        --out results/pilot_metrics.csv
"""

from __future__ import annotations

import argparse
import csv
import json
from dataclasses import asdict
from pathlib import Path

from rubrics import evaluate_output


def read_jsonl(path: Path) -> list[dict]:
    rows = []
    with path.open("r", encoding="utf-8") as handle:
        for line in handle:
            line = line.strip()
            if line:
                rows.append(json.loads(line))
    return rows


def summarize(results: list[dict]) -> list[dict]:
    systems = sorted({row["system"] for row in results})
    summary = []
    for system in systems:
        subset = [row for row in results if row["system"] == system]
        if not subset:
            continue
        summary.append(
            {
                "case_id": "SUMMARY",
                "system": system,
                "allergen_violation": round(sum(row["allergen_violation"] for row in subset) / len(subset), 3),
                "restricted_term_count": round(sum(row["restricted_term_count"] for row in subset) / len(subset), 3),
                "nutrition_improvement_score": round(sum(row["nutrition_improvement_score"] for row in subset) / len(subset), 3),
                "craving_preservation_score": round(sum(row["craving_preservation_score"] for row in subset) / len(subset), 3),
                "schema_complete": round(sum(row["schema_complete"] for row in subset) / len(subset), 3),
                "overall_score": round(sum(row["overall_score"] for row in subset) / len(subset), 3),
            }
        )
    return summary


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--cases", type=Path, required=True)
    parser.add_argument("--outputs", type=Path, required=True)
    parser.add_argument("--out", type=Path, required=True)
    args = parser.parse_args()

    cases = {case["id"]: case for case in read_jsonl(args.cases)}
    outputs = read_jsonl(args.outputs)

    results = []
    for output in outputs:
        case = cases[output["case_id"]]
        results.append(asdict(evaluate_output(case, output)))

    rows = results + summarize(results)
    args.out.parent.mkdir(parents=True, exist_ok=True)
    with args.out.open("w", encoding="utf-8", newline="") as handle:
        writer = csv.DictWriter(handle, fieldnames=list(rows[0].keys()))
        writer.writeheader()
        writer.writerows(rows)

    for row in summarize(results):
        print(
            f"{row['system']}: overall={row['overall_score']}, "
            f"allergen_violation_rate={row['allergen_violation']}, "
            f"nutrition={row['nutrition_improvement_score']}, "
            f"craving={row['craving_preservation_score']}"
        )


if __name__ == "__main__":
    main()
