# GIGW 3.0 rule mapping

Authoritative source: the NIC/MeitY [GIGW 3.0 manual](https://guidelines.india.gov.in/gigw3/) and its **Guidelines** section. This project does not assign invented numbered references where the manual's web presentation is thematic rather than a stable checkpoint identifier.

| Rule ID | GIGW reference | Requirement | Automated? | Method |
|---|---|---|---|---|
| GIGW-A11Y-LANG | Accessibility: Guidelines and Attributes | Programmatic language declaration | Yes | Inspect `html[lang]` in rendered DOM |
| GIGW-A11Y-IMG-ALT | Accessibility guidance; GIGW references WCAG 2.1 | Text alternatives for non-text content | Partial | Detect missing `alt`/accessible name only; meaning is manual |
| GIGW-QUALITY-TITLE | Quality: Guidelines and Attributes | Identifiable pages | Yes | Inspect non-empty `title` |
| GIGW-MANUAL-ALT-MEANING | Accessibility guidance | Alternative text appropriate to context | No | Human contextual review |
| GIGW-MANUAL-POLICIES | Lifecycle Management: Guidelines and Attributes | Governance/policy/process evidence | No | Organisational evidence review |

Generic `QUALITY-*`, `SECURITY-*`, and `AXE-*` results are intentionally **not** called GIGW-specific. Axe results report WCAG-related automated findings independently. All manual requirements remain `MANUAL`, never `PASS`.
