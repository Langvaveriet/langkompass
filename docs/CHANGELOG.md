# LångKompass – Changelog

## 2026-07-27 – Wirkstoffe beim Bearbeiten zugänglich machen

- Produktdaten und Wirkstoffverwaltung befinden sich jetzt in einem gemeinsamen
  Bearbeitungsbereich.
- Bestehende Wirkstoffe können dort geändert und weitere direkt hinzugefügt
  werden.
- Nach einer Wirkstoffänderung öffnet sich das betroffene Präparat automatisch
  wieder.

## 2026-07-27 – Mehrere Wirkstoffe direkt erfassen

- Kombipräparate können bereits bei der Neuanlage mit bis zu 20 Wirkstoffen
  erfasst werden.
- Weitere Wirkstoffkarten werden über einen großen Touch-Button ergänzt und
  können vor dem Speichern wieder entfernt werden.
- Mindestens ein Wirkstoff und eindeutige Wirkstoffnamen werden serverseitig
  erzwungen.

## 2026-07-27 – Trainingseinheiten abbrechen und löschen

- Laufende Trainings können nach ausdrücklicher Bestätigung abgebrochen werden;
  bereits erfasste Sätze bleiben dabei im Verlauf nachvollziehbar.
- Abgebrochene Einheiten werden nicht als Trainingserfolg, Fortschritt oder
  Bestwert gewertet.
- Beendete Trainingseinheiten lassen sich im Verlauf nach einer separaten
  Bestätigung mitsamt allen Sätzen endgültig löschen.
- Eigentumsprüfung und Bestätigungswerte werden für beide Vorgänge
  serverseitig erzwungen.

## 2026-07-26 – Sichere PWA-Grundlage und Fehlerzuordnung

- Manifest, App-Metadaten und Service Worker machen die Web-App auf
  unterstützten Geräten installierbar.
- Offline wird ausschließlich ein öffentlicher, verständlicher Hinweis
  angezeigt; private Seiten und Gesundheitsdaten gelangen nicht in den Cache.
- Jede dynamische Anfrage erhält eine zufällige technische Korrelations-ID ohne
  Benutzer- oder Gesundheitsbezug.
- Der Betriebs-Smoke-Test prüft nun zusätzlich Offline-Seite, Manifest, Service
  Worker und Korrelations-ID.

## 2026-07-26 – Rezeptinformationen vervollständigt

- Rezeptdetails weisen nachvollziehbare mögliche Mikronährstoffquellen anhand
  der tatsächlich enthaltenen Zutaten aus.
- Die Hinweise nennen bewusst keine erfundenen Mengen und sind klar von einer
  medizinischen oder vollständigen Nährwertberechnung getrennt.
- Bis zu drei passende Rezeptalternativen werden nach Ernährungsrichtung und
  gemeinsamen Lebensmittelgruppen geordnet.
- Tests sichern die Quellenzuordnung und die stabile Alternativenauswahl.

## 2026-07-26 – Persönliche Labor-Zielbereiche

- Für jeden bereits dokumentierten Laborparameter lässt sich ein optionaler,
  dauerhaft gespeicherter persönlicher Orientierungsbereich festlegen.
- Persönliche Ziele bleiben sichtbar und fachlich strikt von den jeweiligen
  Labor-Referenzbereichen getrennt.
- Verlauf, Untersuchungsansicht und Arztbericht zeigen die Zielbereiche ohne
  medizinische Bewertung; leere Zielgrenzen lassen sich bewusst speichern.
- JSON- und Labor-CSV-Export enthalten die persönlichen Zielgrenzen.

## 2026-07-26 – Jahres- und Arztbericht

- Compass kann die vorhandenen Gesundheitsdaten zusätzlich über 365 Tage
  zusammenfassen.
- Ein eigener, druckbarer Arztbericht bündelt Datenabdeckung, dokumentierte
  Beobachtungen, Alltags-, Körper-, Trainings- und Laborwerte sowie aktive
  Supplemente.
- Der Bericht bleibt eine gekennzeichnete Selbstdokumentation, stellt keine
  Diagnose und überträgt keine Daten an externe Anbieter.
- Eine angepasste Druckansicht blendet Navigation und Bedienelemente aus und
  eignet sich zum lokalen Sichern als PDF.

## 2026-07-26 – Mobiler und betrieblicher Abschlusscheck

- Der öffentliche Betriebsstatus prüft Anwendung und PostgreSQL mit einer
  minimalen Datenbankabfrage, ohne interne oder persönliche Daten offenzulegen.
- Der reproduzierbare Smoke-Test kontrolliert zusätzlich den Betriebsstatus und
  erkennt damit auch eine nicht erreichbare Produktionsdatenbank.
- Navigation und Abmeldung besitzen auf kleinen Displays mindestens 44 Pixel
  hohe Touch-Ziele; die Kopfleiste nutzt die verfügbare mobile Breite besser.
- Die Anmeldeseite wurde bei 390 Pixel Breite ohne horizontales Überlaufen
  kontrolliert. Angemeldete Safari-Abnahme und isolierte Backup-Rückspielprobe
  bleiben als bewusste manuelle Betriebsprüfungen dokumentiert.

## 2026-07-26 – Vollständige Kontolöschung

- Die Einstellungen enthalten einen klar getrennten Gefahrenbereich für die
  endgültige Löschung des Benutzerkontos und aller zugehörigen Daten.
- Checkbox, exaktes Bestätigungswort und eine höchstens fünf Minuten alte,
  erneut per Passkey verifizierte Sitzung schützen vor versehentlicher oder
  unberechtigter Ausführung.
- Gesundheits-, Ernährungs-, Trainings-, Labor-, Supplement-, Planungs- und
  Authentifizierungsdaten werden in einer Datenbanktransaktion gelöscht.
- Ein Test mit einem isolierten Wegwerfkonto bestätigt die Löschreihenfolge auch
  für restriktiv verknüpfte Trainings- und Rezeptdaten. Globale Katalogrezepte
  bleiben unberührt.

## 2026-07-26 – Vollständiger Datenexport

- In den Einstellungen lässt sich ein vollständiges, versioniertes JSON-Archiv
  aller benutzerbezogenen Profil-, Gesundheits- und Planungsdaten laden.
- Tageswerte, Ernährung, Training, Laborwerte und Supplemente stehen zusätzlich
  als getrennte UTF-8-CSV-Dateien für Tabellenprogramme zur Verfügung.
- Der Export ist ausschließlich mit aktiver Sitzung erreichbar und wird nicht
  zwischengespeichert. Sitzungstokens, Passkey-Schlüssel und Zugangstokens
  werden bewusst nicht ausgegeben.
- Datums- und Dezimalwerte werden portabel serialisiert; CSV-Freitext ist gegen
  die Ausführung eingeschleuster Tabellenformeln abgesichert.

## 2026-07-26 – Rezeptkatalog auf 120 Gerichte erweitert

- Frühstück, Mittagessen, Abendessen und Snacks enthalten jetzt jeweils exakt
  30 mediterran-ketogene Vorschläge.
- 100 zusätzliche Gerichte ergänzen den bisherigen Katalog mit unterschiedlichen
  Proteinquellen, vegetarischen Varianten und Zubereitungsarten.
- Zutatenmengen und Lebensmittelmerkmale bleiben strukturiert; Energie und
  Makronährwerte werden aus den hinterlegten Zutatenwerten berechnet.
- Tests sichern 120 eindeutige Schlüssel und Namen, die gleichmäßige Verteilung
  sowie die bestehenden Profilfilter dauerhaft ab.

## 2026-07-26 – Einkaufsliste aus dem Wochenplan

- Geplante Rezepte einer Kalenderwoche erzeugen automatisch eine gemeinsame
  Einkaufsliste.
- Wiederkehrende Zutaten mit gleicher strukturierter Einheit werden addiert;
  verschiedene Einheiten bleiben getrennt und nachvollziehbar.
- Große, kategorisierte Touch-Zeilen lassen sich dauerhaft pro Benutzer und
  Woche abhaken.
- Offene Positionen können über das mobile Teilen-Menü übergeben oder als
  mengenlesbare Textliste für Pon kopiert werden.
- Eine direkte Pon-Synchronisierung wird nicht vorgetäuscht: Pon dokumentiert
  derzeit keine öffentliche Web-API oder OAuth-Anbindung für Drittanbieter.

## 2026-07-26 – Kernabläufe und Routenschutz abgesichert

- Ein reproduzierbarer Smoke-Test bestätigt für 15 Kernrouten die
  serverseitige Weiterleitung zur Anmeldung, wenn keine Sitzung besteht.
- Testbare Eingabeverträge sichern Tageserfassung, Mahlzeiten, Trainingssätze,
  Laborwerte und Supplementeinnahmen mit Grenz- und Korrekturfällen ab.
- Unmögliche Kalendertage, partielle Skalenwerte und ungültige Uhrzeiten werden
  nicht länger stillschweigend normalisiert oder akzeptiert.
- Die Fachtests wurden von 50 auf 67 reproduzierbare Testfälle erweitert.

## 2026-07-26 – Finalisierung und reproduzierbarer Betrieb begonnen

- Zentrale Lade-, Fehler- und Nicht-gefunden-Zustände ergänzen verständliche
  Wiederholungs- und Rückkehrmöglichkeiten ohne interne Fehlerdetails.
- Ein idempotenter Bootstrap-Befehl bereitet das einzige Benutzerkonto auf
  einer frischen Datenbank für die Passkey-Einrichtung vor.
- Die bisherige Next.js-Standard-README wurde durch eine projektspezifische
  Installations-, Prüf- und Deployment-Anleitung ersetzt.
- Der Plesk-Betrieb, Backup-Umfang und eine sichere Wiederherstellungsprobe sind
  als Runbook dokumentiert.

## 2026-07-25 – Freie Bewegungswerte korrigiert

- Individuelle Schrittzahlen und aktive Minuten werden nun in Einerschritten
  akzeptiert.
- Trinkmenge und Distanz erlauben zwei Dezimalstellen entsprechend der
  serverseitigen Validierung.
- Die nativen Zahlen-Spinner wurden ausgeblendet, damit sie auf mobilen
  Browsern nicht mit der eingeblendeten Einheit kollidieren.

## 2026-07-25 – Tageserfassung vervollständigt

- Der Morgen-Check kann optional den Bauchumfang als eigene Messreihe mit
  Zentimeterwert und Messzeitpunkt erfassen.
- Der Abend-Check enthält zusätzlich Stimmung, Hunger, Trinkmenge, Schritte,
  zurückgelegte Kilometer und aktive Minuten.
- Häufige Werte lassen sich über große Touch-Chips auswählen; freie Zahlen sind
  weiterhin als Fallback möglich.
- Alle neuen Angaben werden serverseitig begrenzt und validiert.
- Schritte, aktive Zeit und Trinkmenge erscheinen in der 7-Tage-Übersicht.
- Die strukturierten Werte und der Bauchumfang fließen in den lokalen Health
  Context ein, ohne Freitext zu übertragen.
- Apple Health wurde bewusst auf eine späte Ausbaustufe nach Finalisierung der
  Web-App verschoben.

## 2026-07-25 – Architekturentscheidung für Apple Health

- Die technische Machbarkeit wurde gegen den aktuellen Next.js-, Better-Auth-
  und Prisma-Stand geprüft.
- Eine reine PWA und ein produktiver Remote-Website-Wrapper wurden als nicht
  tragfähige HealthKit-Architektur ausgeschlossen.
- Next.js bleibt Web-Client und Server; eine lokal gebündelte iOS-Oberfläche
  erhält eine eigene Swift-HealthKit-Brücke und verwendet versionierte Route
  Handler.
- Passkey-basierte Gerätekopplung, getrennte importierte Gesundheitsdaten,
  idempotente Synchronisation und ein schrittweiser Geräte-Spike wurden in ADR
  0001 verbindlich dokumentiert.

## 2026-07-25 – Lokale Wochen- und Monatsberichte

- Compass bietet große Touch-Chips für einen lokalen 7- oder 30-Tage-Bericht.
- Datenabdeckung und sämtliche Kennzahlen richten sich nach dem gewählten
  Zeitraum statt nach einem fest eingebauten Monatsfenster.
- Schlaf, Energie und Wohlbefinden werden zwischen erster und zweiter
  Kalenderhälfte rein beschreibend verglichen, sofern beide Hälften Daten
  enthalten.
- Die lokale Zusammenfassung nennt belegte Veränderungen ohne medizinische
  Bewertung, Modellaufruf oder Tokenkosten.

## 2026-07-25 – Anbieterunabhängiger Compass-Adapter

- Ein versionierter Anfrage- und Antwortvertrag trennt den Health Context von
  konkreten KI-Anbietern und der Benutzeroberfläche.
- Eine lokale Referenzimplementierung formuliert ausschließlich belegte Fakten
  samt Datenpfaden und kennzeichnet fehlende Datengrundlagen.
- Remote-Adapter werden technisch blockiert, solange eine externe Übertragung
  nicht ausdrücklich für den konkreten Aufruf freigegeben wurde.
- Die Compass-Seite zeigt Provider, Übertragungsstatus, Datengrundlage und
  Sicherheitsgrenzen transparent an.

## 2026-07-25 – Lokaler Health Context Generator

- Compass AI erzeugt einen versionierten, zweckgebundenen Gesundheitskontext
  aus strukturierten Daten der letzten 30 Tage und den neuesten Laborwerten.
- Direkte Identifikatoren, Notizen, Symptom-Freitext, Arztkommentare sowie
  Labor- und Praxisnamen werden bewusst ausgeschlossen.
- Die neue Compass-Seite zeigt Datenabdeckung, strukturierte Beobachtungen,
  fehlende Datengrundlagen und den vollständigen technischen Kontext.
- Der Kontext bleibt lokal; in diesem Schritt findet keine Übertragung an einen
  externen KI-Anbieter statt.

## 2026-07-25 – Laborreferenzwerte wiederverwenden

- Referenzbereiche werden pro Benutzer und Laborparameter dauerhaft als
  Eingabevorgabe gespeichert.
- Bei späteren Untersuchungen werden die zuletzt gespeicherten Grenzen nach
  Auswahl des Parameters automatisch eingesetzt und bleiben veränderbar.
- Bereits vorhandene Laborergebnisse liefern einmalig die bisherigen
  Referenzwerte, solange noch keine eigene Vorgabe gespeichert wurde.
- Eine Korrektur des Referenzbereichs aktualisiert zugleich die Vorgabe für
  zukünftige Untersuchungen.

## 2026-07-25 – Supplementverlauf abschließen

- Einnahmen lassen sich inklusive Zeitpunkt, Menge, Einheit, Wirkung,
  Verträglichkeit und Notiz korrigieren.
- Frühere Stände bleiben mit Korrekturgrund und Zeitpunkt als Historie erhalten.
- Versehentliche Einnahmen können nach ausdrücklicher Bestätigung gelöscht
  werden.
- Eine eigene Verlaufseite filtert nach Zeitraum und Präparat, fasst erfasste
  Beobachtungen zusammen und visualisiert dokumentierte Einnahmen pro Tag.

## 2026-07-25 – Supplemente und Wirkstoffe verwalten

- Produktdaten, Standarddosis, Einnahmegrund und Notizen lassen sich ändern.
- Kombipräparate unterstützen mehrere strukturierte Wirkstoffe mit optionalen
  Gesamt- und elementaren Mengen.
- Wirkstoffe können einzeln bearbeitet oder nach Bestätigung gelöscht werden;
  mindestens ein Wirkstoff bleibt je Präparat erhalten.
- Abgesetzte Präparate lassen sich archivieren und wiederherstellen, ohne ihre
  Einnahmehistorie zu verlieren.

## 2026-07-25 – Strukturierte Supplementerfassung

- Supplemente speichern Produkt, Darreichungsform, Standarddosis, Grund und
  einen Hauptwirkstoff inklusive optionaler elementarer Menge.
- Die übliche Einnahme lässt sich mit einem Fingertipp zum aktuellen Zeitpunkt
  dokumentieren.
- Eine genauere Erfassung ergänzt abweichende Menge, Zeitpunkt, beobachtete
  Wirkung, Verträglichkeit und eine optionale Notiz.
- Dashboard und Hauptnavigation führen direkt in den neuen Bereich.

## 2026-07-25 – Laborwerte korrigieren und Untersuchungen löschen

- Laborwerte lassen sich nachträglich inklusive Referenzbereich und Notiz
  korrigieren.
- Vorherige Werte bleiben mit Korrekturgrund und Zeitpunkt als
  Änderungshistorie erhalten.
- Ganze Untersuchungen können nach ausdrücklicher Bestätigung mitsamt ihren
  Laborwerten gelöscht werden.

## 2026-07-25 – Laborwerte im Verlauf

- Erfasste Laborparameter lassen sich über große Touch-Chips für einen
  historischen Verlauf auswählen.
- Bis zu 24 Messungen erscheinen chronologisch als zugängliches Diagramm und
  zusätzlich als datierte Werteliste.
- Deutsche und schwedische Parameterbezeichnungen sowie die gespeicherte
  Einheit bleiben sichtbar.
- Änderungen werden rein beschreibend dargestellt; der jeweilige
  Laborreferenzbereich wird pro Messpunkt getrennt berücksichtigt.

## 2026-07-25 – Strukturierte Laborerfassung

- Untersuchungen speichern Messzeitpunkt, Nüchtern-Status und optionale
  Begleitangaben benutzergebunden.
- 35 Laborparameter stehen gruppiert als große Touch-Auswahl mit fester
  Einheit bereit; alle Parameter des vorliegenden schwedischen Bluttestberichts
  sind über ihre Originalbezeichnungen strukturiert zugeordnet.
- Die schwedischen Originalbezeichnungen erscheinen direkt unter den deutschen
  Parameternamen in der Eingabemaske.
- Messwerte und die Referenzgrenzen des jeweiligen Laborberichts werden als
  historische Datensätze gespeichert und sachlich gegenübergestellt.
- Das Dashboard zeigt jetzt die tatsächliche Anzahl erfasster Laborwerte.
- Die automatische Einkaufsliste aus dem Wochenplan ist in der Roadmap als
  späteres Feature vorgemerkt.

## 2026-07-25 – Automatische Wochenplanung

- Der Wochenplan füllt auf Wunsch sieben Tage mit drei Hauptmahlzeiten oder
  zusätzlich mit Snacks.
- Persönliche Ernährungsrichtungen, Ausschlüsse, Histaminrücksicht und maximale
  Zubereitungszeit werden vor der Auswahl serverseitig geprüft.
- Favorisierte Katalogrezepte werden zuerst berücksichtigt; weitere passende
  Gerichte werden stabil und abwechslungsreich über die Woche verteilt.
- Bereits geplante oder erfasste Mahlzeiten werden niemals überschrieben.
- Zwei große Aktionen ersetzen zusätzliche Formulareingaben und machen die
  automatische Planung touchfreundlich.

## 2026-07-25 – Rezeptsuche und Bibliotheksfilter

- Eine eigene Rezeptbibliotheksseite durchsucht persönliche Rezepte nach Name
  und strukturierten Zutaten.
- Große, horizontal wischbare Chips filtern nach Favoriten oder eigenen
  Vorlagen, Mahlzeitentyp und maximaler Zubereitungszeit.
- Suchbegriff und Filter bleiben in der URL erhalten und können geteilt,
  neu geladen oder schrittweise angepasst werden.
- Ergebnisanzahl, Zurücksetzen und ein erklärender Leerzustand halten die
  Suche auch auf kleinen Bildschirmen übersichtlich.
- Die eingebettete Bibliothek auf der Ernährungsseite führt direkt zur
  vollständigen Suche.

## 2026-07-25 – Rezept-Detailansicht

- Favoriten und eigene Mahlzeitenvorlagen öffnen eine benutzergebundene
  Detailseite mit Zutaten, Mengen und geschätzten Nährwerten.
- Katalogrezepte zeigen zusätzlich Zubereitungszeit, Portionen,
  Ernährungsrichtungen und einzelne Zubereitungsschritte.
- Ein großer Datumswähler ermöglicht die direkte Übernahme in den bestehenden
  Wochenplan; alternativ lässt sich das Rezept sofort erfassen.
- Nicht vorhandene oder fremde Rezept-IDs liefern keine Rezeptdaten aus.
- Alle zentralen Aktionen besitzen mindestens 48 Pixel hohe Touch-Ziele.

## 2026-07-25 – Persönliche Rezeptbibliothek

- Katalogrezepte lassen sich eindeutig als Favoriten speichern und wieder
  entfernen.
- Die Rezeptbibliothek trennt Favoriten von selbst angelegten
  Mahlzeitenvorlagen, ohne parallele oder doppelte Rezeptdaten zu erzeugen.
- Ein nur für den Wochenplan benötigtes Katalogrezept wird künftig nicht
  automatisch als Favorit dargestellt.
- Bestehende gespeicherte Katalogrezepte bleiben bei der Umstellung erhalten.
- Alle Aktionen bleiben benutzergebunden und verwenden große Touch-Ziele.

## 2026-07-25 – Persönliche Rezeptfilter

- Das Gesundheitsprofil erfasst optionale Ernährungsrichtungen,
  ausgeschlossene Lebensmittelgruppen, Histaminrücksicht und maximale
  Zubereitungszeit über große Touch-Chips.
- Rezeptvorschläge werden serverseitig nach allen gespeicherten Profilangaben
  gefiltert und zeigen die Anzahl passender Katalogideen.
- Auch die Server-Actions zum Speichern und Einplanen prüfen den persönlichen
  Filter erneut, sodass ausgeschlossene Vorschläge nicht über manipulierte
  Formulardaten übernommen werden können.
- Fehlen passende Rezepte, erklärt die Oberfläche den Grund und führt direkt
  zur Anpassung der Profilfilter.
- Die Angaben dienen der Vorschlagssteuerung und werden nicht als medizinische
  Diagnose oder vollständige Allergenprüfung dargestellt.
- Die Smartphone-Ansicht wurde bei 390 Pixeln ohne Seitenüberlauf und mit
  mindestens 44 Pixel hohen Auswahlflächen geprüft.

## 2026-07-24 – Erweiterbarer globaler Rezeptkatalog

- Rezeptvorschläge werden aus einem globalen PostgreSQL-Katalog statt direkt
  aus der Benutzeroberfläche geladen.
- Katalogrezepte und Zutaten sind normalisiert, strukturiert filterbar und von
  persönlichen Rezeptvorlagen getrennt.
- Ein streng validierter JSON-Import ergänzt oder aktualisiert bis zu 1.000
  Rezepte pro Datei anhand stabiler Schlüssel, ohne Duplikate anzulegen.
- Der mitgelieferte Rezeptkatalog wird bei jedem Build idempotent synchronisiert;
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
