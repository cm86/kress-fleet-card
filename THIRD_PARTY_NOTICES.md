# Third-party notices

## Landroid Card

Kress Fleet Card requires **Landroid Card** at runtime.

- Project: Barma-lej/landroid-card
- Source: https://github.com/Barma-lej/landroid-card
- License: MIT
- Authors/copyright: the Landroid Card authors and contributors

Landroid Card source code and assets are **not bundled** with this repository.
Users install Landroid Card separately, normally through HACS.

Kress Fleet Card is an independent project and is not affiliated with or
endorsed by the Landroid Card project, Kress, or their respective owners.

## Kress model images

When automatic model images are enabled, the card may load a mower product image at runtime from `https://static-models.kress-robotik.com/` based on the model reported by Home Assistant. These images are not bundled, copied, redistributed, or modified by this repository. A manual `image:` configuration takes priority, and remote image loading can be disabled with `auto_model_image: false`.
