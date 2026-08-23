# Changelog

## 0.3.6 - 2026-08-23

### Added

- Automatically detect the Kress Fleet v0.3.14 per-mower target-zone select and targeted-zone start button.
- Show a localized **Mowing zone / Mähzone** dropdown plus **Mow zone / Zone mähen** button in the mower view.
- Keep selecting a zone separate from starting the mower so a dropdown change alone never launches a mowing task.
- Add optional visual-editor overrides for the target-zone select and targeted-zone button.
- Add tagged GitHub Releases with version notes extracted automatically from the matching `CHANGELOG.md` section.

### Compatibility

- Existing Live Map, coverage, localized status/zone/error compatibility and Landroid Card controls remain unchanged.
- Targeted-zone controls appear only when the matching integration entities exist, so older integration versions continue to work without them.

## 0.3.5

- show Home Assistant-localized Kress error descriptions when integration v0.3.11+ exposes the `Error` enum sensor
- localize the leading Kress mower status through the integration status translations, so e.g. `idle - 106` becomes `Bereit - Ladestation nicht erreichbar` in German
- replace trailing raw codes such as `106` with text such as `Ladestation nicht erreichbar` while preserving Landroid Card's red real-error styling
- keep error code `0` hidden and retain numeric-code fallback with older Kress Fleet integration versions

## 0.3.4

- rename the German Coverage label to `Mähfortschritt`
- keep language selection based on the Home Assistant frontend language


## 0.3.3

- suppress Kress error code `0` from the mower status line
- restore the normal status color when error code `0` means no active error
- preserve the upstream red error styling for real/non-zero errors
- keep human-readable Kress Fleet zone-name replacement


## 0.3.2

Initial custom-HACS-repository release.

- English and German card UI
- localized coverage-period labels
- human-readable active-zone name in the mower status line
- Live Map / mower view switch
- automatic Live Map camera discovery
- automatic coverage selector discovery
- configurable Sections dashboard width
- visual editor for Kress-specific options
- separate runtime dependency on Landroid Card
