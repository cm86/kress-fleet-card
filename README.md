# Kress Fleet Card

A Home Assistant dashboard card for the **Kress Fleet** integration.

Kress Fleet Card wraps the existing [Landroid Card](https://github.com/Barma-lej/landroid-card) and adds Kress Fleet specific functionality:

- switch between mower view and the Kress Fleet Live Map
- open a zoomable Live Map detail view with mouse-wheel zoom and drag-to-pan
- select the Live Map coverage period
- select a named Fleet RTK mowing zone and start mowing that exact zone
- automatically show the matching transparent Kress mower image from the mower model
- automatic English/German labels
- automatic discovery of the Live Map camera and coverage-period selector
- human-readable active zone names from the Kress Fleet zone-name sensor
- suppresses Kress error code `0` as "no error" instead of showing a red `- 0`
- configurable width for Home Assistant Sections dashboards
- visual editor for the main Kress-specific options

> This project is independent and is not affiliated with or endorsed by Kress.

## Requirements

> Kress Fleet integration v0.3.14+ is required for the targeted-zone dropdown/button. v0.3.11+ provides localized mower error descriptions.

Before installing this card, install:

1. [HACS](https://www.hacs.xyz/)
2. [Kress Fleet integration](https://github.com/cm86/home-assistant-kress-fleet)
3. [Landroid Card](https://github.com/Barma-lej/landroid-card)

**Landroid Card is a runtime dependency and must be installed separately.**
Its source code and assets are not bundled with Kress Fleet Card.

## Installation with HACS

Kress Fleet Card is currently distributed as a **custom HACS repository**.

### 1. Install Landroid Card

1. Open HACS.
2. Search for **Landroid Card**.
3. Download/install it.
4. Reload the Home Assistant frontend if requested.

### 2. Add Kress Fleet Card as a custom repository

1. Open HACS.
2. Open the menu in the top-right corner.
3. Select **Custom repositories**.
4. Add:

   ```text
   https://github.com/cm86/kress-fleet-card
   ```

5. Select **Dashboard** as the repository type.
6. Add the repository.
7. Open **Kress Fleet Card** in HACS.
8. Download/install it.
9. Hard-refresh/reload the Home Assistant frontend.

HACS should register the JavaScript resource automatically.

If it does not, add this resource manually under **Settings → Dashboards → Resources**:

```text
/hacsfiles/kress-fleet-card/kress-fleet-card.js
```

Resource type: **JavaScript Module**

## Usage

Minimal configuration:

```yaml
type: custom:kress-fleet-card
entity: lawn_mower.your_mower
```

The card automatically tries to find the Kress Fleet Live Map camera, coverage-period selector, target-zone selector and targeted-zone start button belonging to the same Home Assistant device.

It also automatically detects the mower's Kress Fleet `zone_name` sensor and uses its human-readable value in the mower status line instead of numeric labels such as `Zone 2`.

The card can also be added and configured through the Home Assistant visual card editor.

## Automatic Kress model image

By default, Kress Fleet Card reads the mower model from the Home Assistant device registry. For a model such as `KR236E` it probes the matching Kress static asset:

```text
https://static-models.kress-robotik.com/KR236E_256.png
```

When the asset exists, it is passed to Landroid Card as the normal mower `image`, so it appears in exactly the same mower-image position and keeps Landroid Card's existing size, placement and animation behavior. Missing remote assets fall back to Landroid Card's normal image.

A manually configured `image:` always has priority. This keeps existing local `/local/...` mower images unchanged. Remove the manual `image:` line when you want the automatic Kress model image to take over.

Set `auto_model_image: false` to disable remote model-image loading entirely. The browser then makes no request to `static-models.kress-robotik.com`.

## Targeted zone mowing

With Kress Fleet integration v0.3.14+ the mower view automatically shows a **Mowing zone / Mähzone** dropdown and a **Mow zone / Zone mähen** button. The dropdown contains the user-assigned zone names from that mower's active Fleet map.

Selecting a zone only arms the target; the mower is not started until the button is pressed. The normal Landroid Start/Pause/Dock controls remain unchanged.

The integration resolves the displayed zone name back to the exact Fleet zone ID and sends the same single-zone command shape observed from the official Fleet web UI. No zone name or number is hard-coded in the card.

## Live Map example

The Live Map view combines the Kress Fleet map with the mower controls and the selectable coverage period. Clicking the map opens the zoomable detail viewer by default. Use the mouse wheel to zoom around the pointer, drag to pan, double-click or press `0` to reset, and press `Esc` to close.

![Kress Fleet Card Live Map](images/live-map-example.png)

## Optional configuration

```yaml
type: custom:kress-fleet-card
entity: lawn_mower.your_mower

# Optional explicit entities. Normally auto-detected.
map_camera: camera.your_mower_live_map
coverage_select: select.your_mower_coverage_period
target_zone_select: select.your_mower_mowing_zone
mow_zone_button: button.your_mower_mow_selected_zone

# Optional zone-name sensor. Normally auto-detected.
zone_name_sensor: sensor.your_mower_zone_name

# Optional error sensor. Normally auto-detected.
error_sensor: sensor.your_mower_error

# mower | map
default_view: mower

# Remember the last selected mower/map view in this browser.
remember_view: true

# auto | 3 | 6 | 9 | 12 | full
grid_columns: full

# Optional maximum Live Map image height.
map_max_height: 700

# Automatically load the matching Kress product image (default: true).
# A manual image: value always wins.
auto_model_image: true

# Zoomable detail view on map click (default: true).
# Set false to use Home Assistant camera more-info instead.
map_detail_zoom: true
```

Most normal Landroid Card options can still be passed through the Kress Fleet Card YAML configuration.

## Coverage period

On German Home Assistant installations, the Coverage control is labeled **Mähfortschritt**.

The integration keeps stable internal values such as:

```text
today
last_2_days
last_3_days
...
last_7_days
```

Kress Fleet Card displays localized labels in the UI, for example on German Home Assistant:

```text
Heute
Letzte 2 Tage
Letzte 3 Tage
...
Letzte 7 Tage
```

## Updating and release notes

Tagged releases use semantic versions such as `v0.3.8`. The repository's release workflow automatically publishes the matching `CHANGELOG.md` section as GitHub release notes, so HACS can show a real version and **Release notes / Versionshinweise** instead of only a commit hash.

For maintainers, push the normal commit first and tag it only after the repository checks are green:

```bash
git tag v0.3.8
git push origin v0.3.8
```

## Troubleshooting

### `Custom element doesn't exist: kress-fleet-card`

Make sure Kress Fleet Card is installed in HACS and that the frontend resource is loaded. Then hard-refresh the browser/app frontend.

### Card waits for `Landroid Card`

Install **Landroid Card** through HACS and ensure its frontend resource is loaded.

### Old JavaScript version is still shown

Hard-refresh the browser or clear the Home Assistant frontend cache.

### Status shows a red `- 0`

Kress Fleet uses error code `0` for **no active error**. Kress Fleet Card
suppresses that zero and restores the normal status color. Real non-zero
errors remain visible and keep the Landroid Card error styling.

## License

Kress Fleet Card is licensed under the MIT License. See [LICENSE](LICENSE).

Landroid Card is a separate runtime dependency and is also distributed under the MIT License. See [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md).
