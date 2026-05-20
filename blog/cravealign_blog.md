# What If Healthy Eating Did Not Start With "No"?

Most nutrition advice is framed around restriction.

Do not eat too much sodium. Avoid added sugar. Stay away from peanuts. Cut down on fried foods. These rules matter, especially for people managing allergies or chronic health conditions. But they do not solve the everyday problem of craving.

People still want crispy chicken sandwiches. They still want creamy pasta, sweet milk tea, pizza, brownies, ramen, and food that feels familiar. If an AI dietary advisor simply says "eat something healthier," it may be technically correct and practically useless.

People also do not all want food in the same way. A recipe that feels comforting to one person may feel bland, unfamiliar, or culturally mismatched to another. Some users may want the strictest version of a recipe because of a serious health constraint. Others may need a gentler change that they can actually stick with.

CraveAlign starts from a different question:

Can an AI system help someone satisfy a craving while still respecting their real dietary constraints?

Imagine a user with hypertension who wants a fried chicken sandwich. A weak system might say, "Use less salt." A better system would preserve what the user wants: crispy texture, spicy flavor, a sandwich format, and a satisfying meal. It might suggest oven-crisped chicken, a whole-grain bun, vinegar slaw instead of salty pickles, and a yogurt-based sauce made with no-salt-added spices.

The same idea applies to cravings more broadly. A craving may be about crunch, creaminess, saltiness, heat, smell, temperature, or the feeling of a familiar meal. In some cases, it may also be worth asking whether the craving points to a broader nutrition need, such as not eating enough protein, iron-rich foods, or total energy. But an AI system should treat that as a cautious hypothesis, not a diagnosis.

That sounds simple, but evaluating it is hard.

A generated recipe can look fluent while still failing in important ways. It might include an allergen. It might ignore sodium. It might technically reduce sugar but produce something nobody wants to eat. Or it might make a confident health claim that should really be left to a clinician.

That is why CraveAlign treats evaluation as the core research problem.

The proposed benchmark gives models a user profile, a craving, a base recipe, and dietary constraints. The model has to adapt the recipe. Then the output is evaluated across five dimensions:

- Safety: Does it avoid unsafe ingredients and misleading claims?
- Constraint adherence: Does it respect the user's restrictions?
- Feasibility: Could someone actually make it?
- Nutrition improvement: Did it make the dish meaningfully healthier?
- Preference fit: Does it match the user's taste and cultural food expectations?
- Trade-off quality: Does it follow the requested strict, balanced, or gentle adaptation level?
- Craving preservation: Does it still feel like the original food?

Some of these can be checked automatically. If a user has a peanut allergy and the output contains peanut butter, that is a clear failure. But other judgments need humans. Is a black bean brownie still satisfying as a brownie? Is a low-sodium ramen still close enough to ramen? Would a real person cook this?

Those disagreements are not a nuisance. They are the point. In applied AI systems, human feedback helps define what quality means, especially in domains where correctness is not a single number.

The feedback should not stop after the model gives an answer. A useful system would ask: Did you actually make this? Did it taste good? Did it satisfy the craving? Which swap felt wrong? That loop turns everyday user experience into evaluation data.

The long-term vision is not to replace dietitians or medical judgment. It is to build better evaluation infrastructure for AI systems that operate near health, behavior, and personal preference. A useful dietary advisor should not just generate recipes. It should be measurable, inspectable, and improvable.

Healthy eating should be safe. But it also has to be livable.
