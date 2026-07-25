# LångKompass – Roadmap

Die verbindliche Reihenfolge richtet sich nach Projektbriefing und
Architektur-Charta. Neue Funktionen werden in kleinen, stabilen Schritten
umgesetzt.

## Aktueller Schwerpunkt

- Web-App funktional vervollständigen und bestehende Kernabläufe prüfen
- Tageserfassung um die noch fehlenden strukturierten Alltagswerte ergänzen
- mobile Bedienung, Datenkonsistenz und verständliche Übersichten absichern

Die Tageserfassung enthält nun zusätzlich Bauchumfang, Stimmung, Hunger,
Trinkmenge, Schritte, Distanz und aktive Minuten. Diese Werte fließen auch in
Dashboard und lokale Compass-Berichte ein.

## Später: Apple Health

Die technische Entscheidung und die überprüfbaren Ausbaustufen sind in
[`decisions/0001-apple-health-integration.md`](decisions/0001-apple-health-integration.md)
dokumentiert. Next.js bleibt Web-Client und Server; die produktive iOS-App
erhält einen lokal gebündelten Mobile-Client und eine kleine native
HealthKit-Brücke. Die Umsetzung erfolgt bewusst erst nach der Finalisierung der
Web-App und gehört zu den letzten geplanten größeren Erweiterungen.

## Danach

### Einkaufsliste aus dem Wochenplan

Aus den geplanten Rezepten einer Woche soll eine zusammengefasste Einkaufsliste
entstehen. Gleiche Zutaten werden nach kompatiblen Einheiten gebündelt,
Portionszahlen berücksichtigt und Positionen als erledigt markierbar.

## Optionale Features

### Generative KI-Anbindung

Eine kostenpflichtige Remote-KI wird nicht vorausgesetzt. Der vorhandene
Providervertrag bleibt als technische Erweiterungsgrenze erhalten; eine
Aktivierung erfolgt nur nach bewusster Entscheidung. Ein lokales Modell kann
später über eine gesicherte private Verbindung ergänzt werden.

### Einnahmepläne und Erinnerungen

Supplemente können später um frei aktivierbare Einnahmepläne und ruhige
Erinnerungen ergänzt werden. Die bestehende manuelle Dokumentation bleibt davon
unabhängig vollständig nutzbar.

### Geschützte Dokumentenablage

Laborberichte, Arztbriefe, Befunde, Bilder und PDFs können später außerhalb
öffentlich erreichbarer Verzeichnisse gespeichert und ausschließlich über
autorisierte Server-Endpunkte abgerufen werden. OCR oder KI-Verarbeitung erfolgt
nur nach bewusster Benutzeraktion.

## Zukünftige Features

Weitere spätere Module gemäß Architektur-Charta sind Exporte, eine allgemeine
Offline-Erfassung und weitere externe Integrationen. Lokale Wochen- und
Monatsberichte sind bereits umgesetzt.
