# LångKompass-Projektdokumentation

## Dokumente

- `LangKompass_Architektur-Charta.docx` – technische und fachliche Leitplanken
- `Projektbriefing.docx` – Projektziele, Funktionsumfang und Arbeitskontext
- `CHANGELOG.md` – kurze Übersicht abgeschlossener Entwicklungsschritte

## Passkey-Authentifizierung

Die Anwendung verwendet Better Auth mit Passkeys nach WebAuthn/FIDO2. Es gibt
keine öffentliche Registrierung und keinen Passwort-Fallback. Die erforderlichen
Umgebungsvariablen sind in `.env.example` dokumentiert. Echte Schlüssel werden
nicht eingecheckt.

`PASSKEY_SETUP_TOKEN` wird nur für den ersten Passkey benötigt. Sobald dieser
eingerichtet ist, wird die Variable aus der Produktionsumgebung entfernt.
Weitere Passkeys können ausschließlich innerhalb einer angemeldeten Sitzung
unter `/konto/sicherheit` ergänzt werden.

## Vertrauliche Unterlagen

Persönliche Gesundheits- und Labordokumente liegen ausschließlich im lokalen
Verzeichnis `private-docs/`. Dieses Verzeichnis ist über `.gitignore` von der
Versionsverwaltung und damit von GitHub ausgeschlossen.

## Rezeptkatalog erweitern

Neue Katalogrezepte werden als JSON-Array importiert. Aufbau und zulässige
Werte zeigt `recipe-catalog-import.example.json`. Jeder Eintrag benötigt einen
dauerhaft stabilen `key`. Ein erneuter Import desselben Schlüssels aktualisiert
das Rezept und seine Zutaten; andere Katalogrezepte werden nicht entfernt.

Vom Projektverzeichnis aus wird eine Datei vollständig validiert und danach
transaktional importiert:

```bash
pnpm run catalog:import -- /vollständiger/pfad/rezeptpaket.json
```

Ohne Dateipfad synchronisiert der folgende Befehl nur den mitgelieferten
Startkatalog. Dies geschieht durch `prebuild` auch automatisch vor jedem Build:

```bash
pnpm run catalog:sync
```
