const profileRules = {
  hypertension: {
    avoid: [],
    reduce: ["sodium", "deep frying", "processed sauces"],
    increase: ["fiber", "vegetables"],
    caveat: "Use nutrition labels for bread, sauces, and seasonings because sodium varies widely.",
  },
  type_2_diabetes: {
    avoid: [],
    reduce: ["added sugar", "refined starch"],
    increase: ["fiber", "protein"],
    caveat: "Use personal glucose data and clinician guidance for portion decisions.",
  },
  peanut_allergy: {
    avoid: ["peanut", "peanut butter", "groundnut"],
    reduce: [],
    increase: ["protein"],
    caveat: "For severe allergy, verify ingredient labels and cross-contact risk.",
  },
  shellfish_allergy: {
    avoid: ["shrimp", "shellfish", "seafood broth"],
    reduce: ["sodium"],
    increase: ["protein"],
    caveat: "For severe allergy, verify broths, sauces, and shared equipment risk.",
  },
  general_clean: {
    avoid: [],
    reduce: ["ultra-processed ingredients"],
    increase: ["whole-food ingredients", "vegetables"],
    caveat: "Whole-food swaps are general wellness suggestions, not medical advice.",
  },
};

const tasteKits = {
  spicy_asian: {
    sauce: "ginger, garlic, scallions, chili, lime, and low-sodium tamari",
    crunch: "cucumber, cabbage, toasted sesame, or air-crisped edges",
    label: "spicy Asian-inspired",
  },
  american_comfort: {
    sauce: "smoked paprika, black pepper, vinegar, mustard, and a yogurt-based sauce",
    crunch: "lettuce, slaw, pickled onions, or oven-crisped coating",
    label: "American comfort food",
  },
  mediterranean: {
    sauce: "lemon, herbs, garlic, olive oil, and yogurt",
    crunch: "cucumber, greens, chickpeas, or toasted whole-grain crumbs",
    label: "Mediterranean",
  },
  simple_mild: {
    sauce: "lemon, herbs, garlic, and a light yogurt sauce",
    crunch: "lettuce, cucumber, carrots, or baked whole-grain crumbs",
    label: "simple and mild",
  },
};

const seedRecipes = [
  {
    match: ["fried chicken", "chicken sandwich"],
    title: "Oven-Crisp Chicken Sandwich",
    format: "sandwich",
    base: "Build a crispy chicken sandwich with seasoned chicken breast, a whole-grain bun, crunchy vegetables, and a sauce tuned to the user's taste profile.",
    swaps: [
      ["deep-fried chicken", "oven-crisped or air-fried chicken"],
      ["salty pickles", "vinegar slaw or fresh cucumber"],
      ["mayonnaise-heavy sauce", "Greek yogurt sauce"],
    ],
    anchors: ["crispy", "spicy", "sandwich"],
    signal: "crispy, spicy, handheld comfort",
  },
  {
    match: ["ramen", "noodles", "noodle"],
    title: "Craving-Safe Noodle Bowl",
    format: "noodle bowl",
    base: "Make a noodle bowl with a flavorful broth, protein, vegetables, and a sauce profile that keeps the original noodle craving recognizable.",
    swaps: [
      ["high-sodium broth", "low-sodium broth boosted with mushrooms, ginger, and herbs"],
      ["large noodle portion", "moderate noodles plus vegetables"],
      ["processed toppings", "egg, tofu, chicken, mushrooms, or greens"],
    ],
    anchors: ["noodles", "broth", "warm"],
    signal: "warm broth, noodles, umami, slurpable texture",
  },
  {
    match: ["pizza"],
    title: "Vegetable-Forward Pizza",
    format: "pizza",
    base: "Use a thin whole-grain crust, tomato sauce, cheese in a measured amount, and vegetables that keep the pizza format intact.",
    swaps: [
      ["regular sauce", "no-salt-added tomato sauce"],
      ["processed meat", "mushrooms, peppers, onions, or smoked paprika"],
      ["thick refined crust", "thin whole-grain crust"],
    ],
    anchors: ["pizza", "cheesy", "savory"],
    signal: "cheesy, savory, tomato, crisp crust",
  },
  {
    match: ["brownie", "chocolate"],
    title: "Fudgy Cocoa Bean Brownie",
    format: "dessert",
    base: "Make a fudgy chocolate dessert with cocoa, beans or nut-free seed flour, a smaller sweetener portion, and a high-fiber structure.",
    swaps: [
      ["white flour", "black beans or oat flour"],
      ["large sugar portion", "small amount of maple syrup or date paste"],
      ["frosting", "cocoa-yogurt drizzle"],
    ],
    anchors: ["chocolate", "fudgy", "dessert"],
    signal: "fudgy chocolate, sweetness, dense dessert texture",
  },
  {
    match: ["milk tea", "milkshake", "shake"],
    title: "Creamy Lower-Sugar Drink",
    format: "drink",
    base: "Shake tea or fruit with unsweetened milk, vanilla, cinnamon, and texture add-ins that keep the creamy drink experience.",
    swaps: [
      ["syrup", "vanilla, cinnamon, or a small date paste portion"],
      ["tapioca or candy add-ins", "chia seeds or fruit pieces"],
      ["sweetened creamer", "unsweetened soy milk or Greek yogurt"],
    ],
    anchors: ["creamy", "cold", "sweet"],
    signal: "cold, creamy, sweet drink with chewy or thick texture",
  },
];

const examples = {
  chicken: {
    craving: "fried chicken sandwich",
    condition: "hypertension",
    allergies: "",
    taste: "american_comfort",
    strictness: "balanced",
  },
  ramen: {
    craving: "spicy shrimp ramen",
    condition: "shellfish_allergy",
    allergies: "shrimp",
    taste: "spicy_asian",
    strictness: "strict",
  },
  pizza: {
    craving: "pepperoni pizza",
    condition: "hypertension",
    allergies: "",
    taste: "american_comfort",
    strictness: "gentle",
  },
  brownie: {
    craving: "chocolate brownie",
    condition: "type_2_diabetes",
    allergies: "",
    taste: "simple_mild",
    strictness: "balanced",
  },
  milk_tea: {
    craving: "brown sugar milk tea",
    condition: "type_2_diabetes",
    allergies: "",
    taste: "spicy_asian",
    strictness: "balanced",
  },
};

function selectedStrictness() {
  return document.querySelector("input[name='strictness']:checked").value;
}

function findSeed(craving) {
  const lower = craving.toLowerCase();
  return seedRecipes.find((recipe) => recipe.match.some((word) => lower.includes(word))) || seedRecipes[0];
}

function splitTerms(text) {
  return text
    .split(",")
    .map((term) => term.trim().toLowerCase())
    .filter(Boolean);
}

function strictnessText(strictness) {
  if (strictness === "strict") {
    return "This version prioritizes hard constraints and uses the most conservative substitutions.";
  }
  if (strictness === "gentle") {
    return "This version keeps more of the original food experience and makes a few realistic swaps.";
  }
  return "This version balances health constraints with craving satisfaction.";
}

function tradeoffText(strictness, condition) {
  const conditionText = {
    hypertension: "lower sodium and fewer processed sauces",
    type_2_diabetes: "less added sugar and more fiber or protein",
    peanut_allergy: "hard allergen avoidance with label checks",
    shellfish_allergy: "hard shellfish avoidance with safer umami sources",
    general_clean: "more whole-food ingredients and fewer ultra-processed swaps",
  }[condition];

  if (strictness === "strict") {
    return `strict safety first: ${conditionText}, even if the recipe changes more`;
  }
  if (strictness === "gentle") {
    return `smallest useful changes: ${conditionText}, while keeping the original comfort-food feel`;
  }
  return `balanced health gains: ${conditionText}, while preserving the craving`;
}

function buildAdaptation() {
  const craving = document.getElementById("craving").value || "fried chicken sandwich";
  const condition = document.getElementById("condition").value;
  const allergies = splitTerms(document.getElementById("allergies").value);
  const taste = document.getElementById("taste").value;
  const effort = Number(document.getElementById("effort").value);
  const strictness = selectedStrictness();

  const seed = findSeed(craving);
  const rules = profileRules[condition];
  const tasteKit = tasteKits[taste];
  const hardAvoids = [...new Set([...rules.avoid, ...allergies])];

  const effortPhrase = effort <= 2
    ? "Keep prep simple with one pan or one tray."
    : effort >= 4
      ? "Use a few extra steps to improve texture and flavor."
      : "Use a moderate prep level with familiar ingredients.";

  const cleanTradeoff = strictness === "strict"
    ? "Favor whole-food ingredients even if the final dish is less indulgent."
    : strictness === "gentle"
      ? "Keep the original comfort-food identity while reducing the highest-risk ingredients."
      : "Balance whole-food substitutions with the original comfort-food identity.";

  const recipe = `${seed.base} Season it with ${tasteKit.sauce}. Add crunch with ${tasteKit.crunch}. ${effortPhrase} ${strictnessText(strictness)} ${cleanTradeoff}`;

  const substitutions = [...seed.swaps];
  if (condition === "hypertension") {
    substitutions.push(["regular salt or salty sauces", "acid, herbs, spices, and low-sodium versions"]);
  }
  if (condition === "type_2_diabetes") {
    substitutions.push(["added sugar", "vanilla, cinnamon, fruit, or a smaller sweetener portion"]);
  }
  if (hardAvoids.length) {
    substitutions.push([hardAvoids.join(", "), "verified safe alternatives with label checks"]);
  }

  return {
    title: seed.title,
    craving,
    condition,
    strictness,
    tasteLabel: tasteKit.label,
    hardAvoids,
    reduce: rules.reduce,
    increase: rules.increase,
    recipe,
    substitutions,
    caveat: rules.caveat,
    anchors: seed.anchors,
  };
}

function scoreAdaptation(result) {
  const text = `${result.recipe} ${result.substitutions.flat().join(" ")}`.toLowerCase();
  const finalRecipeText = result.recipe.toLowerCase();
  const allergenViolation = result.hardAvoids.some((term) => finalRecipeText.includes(term));
  const nutritionSignals = [
    "whole-grain",
    "vegetables",
    "low-sodium",
    "fiber",
    "protein",
    "unsweetened",
    "air-fried",
    "oven",
    "whole-food",
    "herbs",
    "spices",
  ].filter((term) => text.includes(term)).length;
  const cravingHits = result.anchors.filter((term) => text.includes(term)).length;
  const safety = allergenViolation ? 20 : 100;
  const constraints = allergenViolation ? 40 : Math.min(100, 72 + result.reduce.length * 8 + result.increase.length * 5);
  const nutrition = Math.min(100, 50 + nutritionSignals * 8);
  const craving = Math.min(100, 45 + cravingHits * 18);
  const feasibility = selectedStrictness() === "strict" ? 78 : 86;
  const preference = result.tasteLabel ? 88 : 70;
  const overall = Math.round((safety * 0.26) + (constraints * 0.2) + (nutrition * 0.18) + (craving * 0.18) + (feasibility * 0.1) + (preference * 0.08));
  return { safety, constraints, nutrition, craving, feasibility, preference, overall, allergenViolation };
}

function metricRow(label, value) {
  const row = document.createElement("div");
  row.className = "metric";
  row.innerHTML = `
    <strong>${label}</strong>
    <div class="meter" aria-label="${label}: ${value}"><span style="width:${value}%"></span></div>
  `;
  return row;
}

function render() {
  const result = buildAdaptation();
  const scores = scoreAdaptation(result);

  document.getElementById("recipeTitle").textContent = result.title;
  document.getElementById("overallScore").textContent = scores.overall;
  document.getElementById("recipeBody").textContent = result.recipe;
  document.getElementById("cravingSignal").textContent = result.anchors.length
    ? result.anchors.join(", ")
    : "taste, texture, and familiarity";
  document.getElementById("tradeoffSignal").textContent = tradeoffText(result.strictness, result.condition);

  const substitutions = document.getElementById("substitutions");
  substitutions.innerHTML = "";
  result.substitutions.forEach(([from, to]) => {
    const item = document.createElement("div");
    item.className = "substitution";
    item.innerHTML = `<span>${from} -> ${to}</span><span class="tag">swap</span>`;
    substitutions.appendChild(item);
  });

  const metrics = document.getElementById("metrics");
  metrics.innerHTML = "";
  metrics.appendChild(metricRow("Safety", scores.safety));
  metrics.appendChild(metricRow("Constraint adherence", scores.constraints));
  metrics.appendChild(metricRow("Nutrition improvement", scores.nutrition));
  metrics.appendChild(metricRow("Craving preservation", scores.craving));
  metrics.appendChild(metricRow("Feasibility", scores.feasibility));
  metrics.appendChild(metricRow("Preference fit", scores.preference));

  const safetyNote = scores.allergenViolation
    ? "Potential hard-avoid term appeared in the final recipe. A real system should block or revise this output before showing it."
    : `${result.caveat} This demo can suggest cautious nutrition hypotheses, but it should not diagnose nutrient deficiencies.`;
  document.getElementById("safetyNote").textContent = safetyNote;
}

document.getElementById("generate").addEventListener("click", render);
["craving", "condition", "allergies", "taste", "effort"].forEach((id) => {
  document.getElementById(id).addEventListener("input", render);
});
document.querySelectorAll("input[name='strictness']").forEach((input) => {
  input.addEventListener("change", render);
});
document.querySelectorAll(".example-chip").forEach((button) => {
  button.addEventListener("click", () => {
    const example = examples[button.dataset.example];
    document.getElementById("craving").value = example.craving;
    document.getElementById("condition").value = example.condition;
    document.getElementById("allergies").value = example.allergies;
    document.getElementById("taste").value = example.taste;
    document.querySelector(`input[name='strictness'][value='${example.strictness}']`).checked = true;
    document.querySelectorAll(".example-chip").forEach((chip) => chip.classList.remove("active"));
    button.classList.add("active");
    render();
  });
});

render();
