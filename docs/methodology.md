# Methodology and limitations

The scanner captures a rendered DOM, response headers, and browser-level accessibility findings. Deterministic checks return pass/fail; checks needing context return manual or warning. The automated assessment score is `passed / (passed + failed) × 100`; manual checks are excluded.

It cannot assess correctness, policy evidence, usability with people, full keyboard/focus visibility, CAPTCHA, authentication-only content, PDF accessibility, or browser/network behaviour not reached in one page load. Results are technical evidence, not legal advice or GIGW/STQC certification.
