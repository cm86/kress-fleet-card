# Changelog

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
