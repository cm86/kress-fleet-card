# Einrichtung des GitHub-Repositories mit VS Code

Diese ZIP-Datei ist bereits die fertige Repository-Struktur.

## 1. ZIP entpacken

Entpacke `kress-fleet-card-v0.3.4-hacs.zip`.

Danach solltest du einen Ordner namens:

```text
kress-fleet-card
```

haben.

## 2. In VS Code öffnen

In Visual Studio Code:

```text
File -> Open Folder...
```

und den Ordner `kress-fleet-card` auswählen.

## 3. Leeres Repository auf GitHub anlegen

Auf GitHub:

```text
https://github.com/new
```

Einstellungen:

```text
Repository name: kress-fleet-card
Visibility: Public
```

WICHTIG: NICHT auswählen:

```text
Add a README file
Add .gitignore
Choose a license
```

Das Repo wirklich leer erstellen.

Die Zieladresse ist anschließend:

```text
https://github.com/cm86/kress-fleet-card
```

## 4. VS-Code-Terminal öffnen

In VS Code:

```text
Terminal -> New Terminal
```

Prüfen, dass das Terminal im Ordner `kress-fleet-card` steht:

```bash
pwd
ls -la
```

## 5. Git initialisieren

```bash
git init
git branch -M main
```

## 6. Dateien hinzufügen

```bash
git add .
```

Kontrolle:

```bash
git status
```

## 7. Ersten Commit erstellen

```bash
git commit -m "Initial release of Kress Fleet Card v0.3.4"
```

## 8. GitHub-Repository verbinden

```bash
git remote add origin https://github.com/cm86/kress-fleet-card.git
```

Kontrolle:

```bash
git remote -v
```

## 9. Push nach GitHub

```bash
git push -u origin main
```

## 10. Repository auf GitHub kontrollieren

Öffnen:

```text
https://github.com/cm86/kress-fleet-card
```

Im Root müssen mindestens vorhanden sein:

```text
kress-fleet-card.js
hacs.json
README.md
LICENSE
THIRD_PARTY_NOTICES.md
CHANGELOG.md
```

## 11. GitHub-Beschreibung setzen

Auf der GitHub-Seite rechts bei **About** auf das Zahnrad klicken.

Description:

```text
Home Assistant dashboard card for the Kress Fleet integration
```

Topics:

```text
home-assistant
hacs
lovelace
custom-card
kress
lawn-mower
mower-robot
```

## 12. Installation in HACS testen

Voraussetzung: `Landroid Card` ist bereits über HACS installiert.

Dann:

```text
HACS
-> Menü oben rechts
-> Custom repositories / Benutzerdefinierte Repositories
```

Repository:

```text
https://github.com/cm86/kress-fleet-card
```

Typ:

```text
Dashboard
```

Repository hinzufügen und anschließend **Kress Fleet Card** installieren.

## 13. Home Assistant neu laden

Nach der Installation Browser/HA-App einmal hart neu laden.

Falls HACS die Ressource nicht automatisch angelegt hat:

```text
Einstellungen -> Dashboards -> Ressourcen
```

URL:

```text
/hacsfiles/kress-fleet-card/kress-fleet-card.js
```

Typ:

```text
JavaScript Module
```

## 14. Karte testen

```yaml
type: custom:kress-fleet-card
entity: lawn_mower.DEIN_MAEHER
```

Prüfen:

- Mäher-Ansicht
- Live Map
- Coverage-Auswahl
- deutsche Texte `Heute`, `Letzte 2 Tage`, ...
- visueller Karteneditor

## Spätere Änderungen

Im VS-Code-Terminal:

```bash
git status
git add .
git commit -m "Beschreibung der Änderung"
git push
```

Für den jetzigen Betrieb als benutzerdefiniertes HACS-Repository ist kein
GitHub Release erforderlich.
