# Registration form and academic directory — draft

This change is incomplete and should not be deployed as an exhaustive national directory.

## Implemented behavior

- Email format checks, a second email entry, and Arabic validation messages.
- Cascading university → faculty/institute → department choices.
- Changing a parent clears and disables its dependent selections.
- Submission requires an association present in the loaded directory.
- Registration messages include the selected faculty and department and the reply address.
- Directory loading failures prevent submission and provide a retry button.
- A successful HTTP response is accepted only when FormSubmit explicitly reports success.

Email format and repeated entry do **not** prove mailbox existence or ownership. The current static GitHub Pages + FormSubmit arrangement has no verification token service. A real ownership check requires a backend/email provider that sends a single-use, expiring link or code, verifies it server-side, and accepts the registration only afterward. Never place a provider secret in the browser or treat a client-side `verified` flag as evidence.

## Sources and coverage

The 58 university names follow the Ministry's [Arabic university network directory](https://www.mesrs.dz/reseau-universitaire-ar/), consulted on 7 October 2026. This is a list of universities, not every higher school, university centre, or private institution.

The enabled dataset contains 109 faculty/institute/annex entries and 426 department options across 28 universities. This count is not a claim of exhaustive coverage for those universities. Each enabled faculty contains its official university source URL in `sources`. Missing associations are not replaced with generic departments or guessed choices.

The structured [Biskra pedagogical directory](https://psp.univ-biskra.dz/), [Mila directory](https://plateformes.univ-mila.dz/portfolio/?lang=ar), and [Naama institutional directory](https://www.cuniv-naama.dz/institutes) provided explicit parent-child lists. Other associations were read from faculty sites linked by their university's official website.

The Ministry's [organisation compendium](https://www.mesrs.dz/fr/textes-juridiques/evolution-organisation-etablissements/) covers faculties and departments but its stated update is November 2021. Its scanned historical tables have been inspected as research material; automatically recognised text is excluded from the enabled form because historical reorganisations and OCR errors can produce incorrect associations.

## Still required before an exhaustive release

1. Verify and complete every university's current faculty and department list, including missing faculties within the 28 partially covered universities.
2. Reconcile renamed and newly created faculties against current official sources and record source dates per institution.
3. For continuous training university (UFC), model its actual regional centres/training specialisations instead of inventing faculties.
4. Choose and configure an email verification provider if ownership verification is required.

The form displays an explicit message for a university without documented departments and prevents sending an unverified association. Because this reduces registration availability compared with the current live form, keep this change in draft until coverage is completed.
