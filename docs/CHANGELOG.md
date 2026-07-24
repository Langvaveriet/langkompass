# LångKompass – Changelog

## 2026-07-24 – Erweiterbarer globaler Rezeptkatalog

- Rezeptvorschläge werden aus einem globalen PostgreSQL-Katalog statt direkt
  aus der Benutzeroberfläche geladen.
- Katalogrezepte und Zutaten sind normalisiert, strukturiert filterbar und von
  persönlichen Rezeptvorlagen getrennt.
- Ein streng validierter JSON-Import ergänzt oder aktualisiert bis zu 1.000
  Rezepte pro Datei anhand stabiler Schlüssel, ohne Duplikate anzulegen.
- Die vorhandenen 20 Rezepte werden bei jedem Build idempotent synchronisiert;
  zusätzlich importierte Rezeptpakete bleiben erhalten.
- Eine dokumentierte Beispieldatei dient als Vorlage für weitere eigene oder
  lizenzierte Rezeptpakete.
- Der vollständige Datenweg vom PostgreSQL-Katalog bis zur mobilen
  Vorschlagskarte wurde bei 390 Pixeln ohne Seitenüberlauf geprüft.

## 2026-07-24 – Mediterran-ketogene Rezeptvorschläge

- Ein kuratierter Katalog stellt 20 strukturierte Vorschläge für Frühstück,
  Mittagessen, Abendessen und Snacks bereit.
- Große Mahlzeitenchips und „Anderes vorschlagen“ ermöglichen eine schnelle
  Auswahl ohne Texteingabe oder Dropdown.
- Jeder Vorschlag enthält Zutatenmengen, Zubereitung, Zeit sowie geschätzte
  Energie- und Makronährwerte pro Portion.
- Vorschläge lassen sich als persönliche Vorlage speichern oder direkt für
  den gewählten Tag in den Wochenplan übernehmen.
- Rezeptvorlagen speichern Herkunft, Ernährungsmerkmale und optionale
  Quellenangaben für spätere lizenzierte Integrationen strukturiert.
- Chefkoch wird ausschließlich als externe Ideensuche verlinkt; fremde
  Rezepttexte und Bilder werden nicht automatisch übernommen.
- Die Smartphone-Ansicht wurde bei 390 Pixeln ohne Seitenüberlauf geprüft.

## 2026-07-24 – Mahlzeitenplan auf dem Dashboard

- Das Dashboard zeigt den heutigen Wochenplan mit geplantem Rezept und
  Erfassungsstatus je Mahlzeit.
- Ein kompakter Fortschritt nennt, wie viele geplante Mahlzeiten bereits
  erfasst sind.
- Große Touch-Ziele öffnen direkt den Wochenplan oder die Ernährung des Tages.
- Ohne Tagesplanung führt ein nächster Schritt direkt zur Wochenplanung.

## 2026-07-24 – Touch-freundlicher Mahlzeiten-Wochenplan

- Eine neue Wochenansicht plant Frühstück, Mittagessen, Abendessen und Snacks
  aus den persönlichen Mahlzeitenvorlagen.
- Sieben große Tageschips, Vor-/Zurück-Navigation und Vorlagenkarten ersetzen
  klassische Dropdown-Auswahlfelder.
- Pro Tag und Mahlzeitentyp bleibt genau ein strukturierter Planplatz bestehen;
  Vorlagen lassen sich vor der Erfassung wechseln oder entfernen.
- Geplante Mahlzeiten können am gewählten Tag direkt erfasst werden und bleiben
  mit dem tatsächlich erzeugten Mahlzeitendatensatz verknüpft.
- Eine transaktionale Sperre verhindert doppelte Erfassungen; zukünftige
  Mahlzeiten können nicht vorzeitig als gegessen markiert werden.
- Die Smartphone-Ansicht wurde bei 390 Pixeln ohne Seitenüberlauf geprüft.

## 2026-07-24 – Strukturierte Mahlzeitenvorlagen

- Bestehende Mahlzeiten lassen sich mit einem automatisch vorgeschlagenen
  Namen als persönliche Vorlage speichern.
- Vorlagen bewahren Lebensmittel, Mengen, Kategorien, Kalorien und
  Gesundheitsmerkmale als strukturierte Snapshots.
- Eine Vorlage erfasst die Mahlzeit am gewählten Tag mit einem Fingertipp;
  Reaktionen und persönliche Notizen werden nicht übernommen.
- Gleichnamige Vorlagen werden aktualisiert und entfernte Vorlagen bleiben
  archiviert, statt Gesundheitsdaten sofort zu löschen.
- Die horizontal wischbaren Karten besitzen mindestens 48 Pixel hohe
  Aktionsflächen und verursachen auf Smartphone-Breite keinen Seitenüberlauf.

## 2026-07-24 – Frühere Mahlzeiten schnell wiederholen

- Bis zu fünf unterschiedliche frühere Mahlzeiten erscheinen als
  touch-freundliche Schnellvorschläge.
- Lebensmittel, Mengen, Kategorien, Merkmale und Kalorien-Snapshots lassen
  sich mit einer Aktion auf den gewählten Tag übernehmen.
- Beschwerden und persönliche Notizen werden bewusst nicht kopiert.
- Identische Mahlzeiten werden zusammengefasst, damit die Auswahl übersichtlich
  bleibt.

## 2026-07-24 – Übungsfortschritt im Trainingsverlauf

- Übungen lassen sich im Trainingsverlauf über grafische Touch-Chips auswählen.
- Bis zu zwölf abgeschlossene Einheiten zeigen den höchsten vergleichbaren
  Satzwert als zugängliches Verlaufsdiagramm.
- Gewichtsübungen verwenden Kilogramm, Körpergewichtsübungen Wiederholungen.
- Zeitraum, letzter Wert, Veränderung und eine sachliche Textzusammenfassung
  ergänzen das Diagramm.

## 2026-07-24 – Persönliche Trainingsbestwerte

- Der Trainingsverlauf zeigt automatisch persönliche Bestwerte je Übung.
- Höchstes erfasstes Gewicht, maximale Wiederholungen und Datengrundlage
  werden aus allen abgeschlossenen Einheiten berechnet.
- Körpergewichtsübungen werden ohne künstlichen Gewichtswert dargestellt.
- Die Bestwertkarten sind auf Smartphones horizontal wischbar.

## 2026-07-24 – Satzvorgaben in Trainingsplänen

- Für jede Planübung lassen sich Satzanzahl und Wiederholungsziel über Touch-Picker festlegen.
- Bestehende Planübungen starten mit der Vorgabe 3 × 10.
- Während der Einheit zeigen Übungschips erledigte und geplante Sätze.
- Wiederholungen werden aus dem letzten Satz derselben Übung oder der Planvorgabe vorbelegt.

## 2026-07-24 – Gewicht beim Folgesatz übernehmen

- Beim nächsten Satz wird das zuletzt gespeicherte Gewicht derselben Übung
  automatisch vorbelegt.
- Beim ersten Satz einer neuen Einheit dient das zuletzt verwendete Gewicht aus
  einem früheren abgeschlossenen Training als Vorbelegung.
- Beim Wechsel der Übung wird deren eigener letzter Gewichtswert geladen,
  damit keine Werte zwischen Übungen vermischt werden.

## 2026-07-24 – Trainingsverlauf

- Die letzten 30 abgeschlossenen Einheiten sind in einem eigenen Verlauf
  verfügbar.
- Jede Einheit zeigt Planname, Zeitpunkt, Dauer, Übungen und Satzanzahl.
- Aufklappbare Übungsdetails zeigen Wiederholungen, Gewicht und optionale
  Anstrengung zusammen mit der jeweiligen Übungsgrafik.

## 2026-07-24 – Fehlerkorrektur Morgenerfassung

- Die gültigen Nullwerte der Schmerz- und Stress-Slider blockieren das
  Speichern des Morgen-Checks nicht mehr.
- Validierungsfehler nennen jetzt das tatsächlich betroffene Eingabefeld und
  dessen gültigen Wertebereich.

## 2026-07-24 – Wiederverwendbare Trainingspläne

- Mehrere benannte Trainingspläne lassen sich anlegen, bearbeiten und
  archivieren.
- Übungen werden einem Plan über große, grafische Touch-Karten zugeordnet.
- Eine Trainingseinheit startet gezielt mit einem Plan und bietet nur dessen
  Übungen zur Satzerfassung an.
- Auch die horizontal wischbaren Übungs-Chips während des Trainings zeigen die
  vorhandenen Übungsgrafiken.
- Bereits erfasste freie Trainingseinheiten bleiben vollständig erhalten.
- Das Dashboard zeigt laufende oder heute abgeschlossene Trainings sowie die
  Anzahl verfügbarer Trainingspläne als direkten Einstieg an.

## 2026-07-24 – Strukturierte Trainingserfassung

- Trainingseinheiten können gestartet und abgeschlossen werden.
- Sätze speichern Übung, Reihenfolge, Wiederholungen, Gewicht und optionale
  Anstrengung.
- Wiederholungen und Gewicht lassen sich mobil über Plus-/Minus-Picker
  einstellen.
- Übungen werden über große, horizontal wischbare Touch-Chips ausgewählt.
- Die letzten drei abgeschlossenen Einheiten zeigen Dauer und Satzanzahl.
- Alle Trainingsdaten sind einem Benutzer zugeordnet und serverseitig
  validiert.
