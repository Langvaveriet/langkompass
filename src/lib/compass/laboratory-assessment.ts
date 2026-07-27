import { labReferenceStatus } from "@/lib/labs/reference-status";

type LaboratoryResult = {
  analyteKey: string;
  analyteName: string;
  value: number;
  referenceLow: number | null;
  referenceHigh: number | null;
};

export type LaboratoryInsight = {
  analyteKey: string;
  analyteName: string;
  status: "ABOVE" | "BELOW";
  assessment: string;
  possibleFactors: string[];
  nextSteps: string[];
  naturalOptions: string[];
};

export type LaboratoryAssessment = {
  assessedCount: number;
  outsideReferenceCount: number;
  withinReferenceCount: number;
  withoutReferenceCount: number;
  insights: LaboratoryInsight[];
};

type Guidance = Omit<LaboratoryInsight, "analyteKey" | "analyteName" | "status">;

const medicalReview =
  "Mit Beschwerden, deutlicher Abweichung oder anhaltender Veränderung zeitnah ärztlich einordnen lassen.";

function genericGuidance(status: "ABOVE" | "BELOW"): Guidance {
  return {
    assessment: `Der neueste Wert liegt ${status === "ABOVE" ? "über" : "unter"} dem dokumentierten Laborreferenzbereich. Eine einzelne Abweichung beweist keine Erkrankung.`,
    possibleFactors: [
      "Messbedingungen, Flüssigkeitshaushalt, akute Belastung oder vorübergehende Erkrankung",
      "Medikamente, Supplemente oder eine zugrunde liegende gesundheitliche Veränderung",
    ],
    nextSteps: [
      "Messbedingungen, Beschwerden, Medikamente und Supplemente gemeinsam mit einer Fachperson prüfen.",
      "Je nach Kontext eine standardisierte Kontrollmessung vereinbaren.",
      medicalReview,
    ],
    naturalOptions: [
      "Bis zur Klärung auf ausreichenden Schlaf, normale Flüssigkeitszufuhr und eine ausgewogene Ernährung achten.",
      "Keine hoch dosierten Supplemente allein aufgrund dieses Einzelwerts beginnen oder absetzen.",
    ],
  };
}

function inflammationGuidance(key: string, status: "ABOVE" | "BELOW"): Guidance {
  if (status === "BELOW") {
    return {
      assessment: "Ein niedriger Entzündungsmarker ist für sich allein üblicherweise kein Hinweis auf ein behandlungsbedürftiges Problem.",
      possibleFactors: ["Individuelle Ausgangslage und Messmethode"],
      nextSteps: ["Nur zusammen mit Beschwerden und den übrigen Laborwerten beurteilen."],
      naturalOptions: ["Es ist keine gezielte natürliche Anhebung dieses Werts erforderlich."],
    };
  }
  return {
    assessment: `${key === "crp" ? "CRP" : "Die Blutsenkung"} ist ein unspezifischer Entzündungsmarker. Eine Erhöhung zeigt eine mögliche Entzündungsaktivität, nennt aber nicht deren Ursache.`,
    possibleFactors: [
      "Akute oder chronische Infektion beziehungsweise Entzündung",
      "Verletzung, Operation, Gewebebelastung oder andere vorübergehende Prozesse",
      ...(key === "esr" ? ["Auch Blutarmut, Alter und weitere Begleitumstände können die Blutsenkung beeinflussen."] : []),
    ],
    nextSteps: [
      "Zusammen mit Symptomen, Blutbild und dem jeweils anderen Entzündungsmarker beurteilen.",
      "Bei Fieber, deutlicher Verschlechterung oder anhaltender Erhöhung zeitnah ärztlich abklären.",
    ],
    naturalOptions: [
      "Erholung, ausreichend Schlaf und normale Flüssigkeitszufuhr unterstützen die Genesung.",
      "Kein Lebensmittel senkt gezielt die Ursache; entscheidend ist die Klärung des zugrunde liegenden Prozesses.",
    ],
  };
}

function redBloodCellGuidance(status: "ABOVE" | "BELOW"): Guidance {
  if (status === "BELOW") {
    return {
      assessment: "Die Konstellation kann zu einer Blutarmut oder Blutverdünnung passen, muss aber mit den übrigen Blutbildwerten beurteilt werden.",
      possibleFactors: [
        "Eisen-, Vitamin-B12- oder Folatmangel",
        "Blutverlust, Entzündung, Nieren- oder andere chronische Erkrankungen",
        "Verdünnung durch den Flüssigkeitshaushalt",
      ],
      nextSteps: [
        "Hämoglobin, MCV, MCH, Ferritin, Vitamin B12 und Folat gemeinsam prüfen lassen.",
        "Möglichen Blutverlust und Beschwerden wie Luftnot, Herzrasen oder starke Erschöpfung ärztlich abklären.",
      ],
      naturalOptions: [
        "Eisenhaltige Lebensmittel mit Vitamin-C-reichen Lebensmitteln kombinieren; B12- und Folatquellen regelmäßig einplanen.",
        "Eisen oder hoch dosierte Vitamine erst nach geklärter Ursache gezielt ergänzen.",
      ],
    };
  }
  return {
    assessment: "Eine Erhöhung kann durch eine relative Eindickung des Blutes oder eine gesteigerte Bildung roter Blutkörperchen entstehen.",
    possibleFactors: [
      "Flüssigkeitsmangel",
      "Rauchen, Höhenaufenthalt oder nächtliche Atemstörungen",
      "Seltener eine eigenständige Veränderung der Blutbildung",
    ],
    nextSteps: [
      "Unter normalen Trink- und Messbedingungen kontrollieren und Hämoglobin, Hämatokrit und Erythrozyten gemeinsam beurteilen.",
      medicalReview,
    ],
    naturalOptions: [
      "Normal trinken, Rauchen vermeiden und mögliche Schlafapnoe-Symptome abklären lassen.",
      "Keine eigenständige Blutspende oder Medikamentenänderung zur Wertsenkung vornehmen.",
    ],
  };
}

function cellIndexGuidance(key: string, status: "ABOVE" | "BELOW"): Guidance {
  return {
    assessment: `Die Größe beziehungsweise Hämoglobinbeladung der roten Blutkörperchen liegt ${status === "ABOVE" ? "über" : "unter"} der Laborreferenz.`,
    possibleFactors: status === "BELOW"
      ? ["Eisenmangel", "Seltener angeborene Veränderungen der roten Blutkörperchen"]
      : ["Vitamin-B12- oder Folatmangel", "Alkohol, Leber-, Schilddrüsen- oder Medikamenteneinflüsse"],
    nextSteps: [
      `${key === "mcv" ? "MCV" : "MCH"} zusammen mit Hämoglobin, Ferritin, Vitamin B12 und Folat beurteilen.`,
      "Bei anhaltender Abweichung die Ursache ärztlich klären lassen.",
    ],
    naturalOptions: [
      status === "BELOW"
        ? "Eisenreiche Lebensmittel und Vitamin C kombinieren; Eisen erst nach bestätigtem Mangel ergänzen."
        : "B12- und folatreiche Lebensmittel einplanen und Alkoholkonsum kritisch prüfen.",
    ],
  };
}

function whiteCellsOrPlateletsGuidance(
  key: "leukocytes" | "platelets",
  status: "ABOVE" | "BELOW",
): Guidance {
  const platelets = key === "platelets";
  return {
    assessment: `${platelets ? "Die Thrombozytenzahl" : "Die Leukozytenzahl"} liegt ${status === "ABOVE" ? "über" : "unter"} der Laborreferenz und sollte im Verlauf sowie mit Beschwerden eingeordnet werden.`,
    possibleFactors: status === "ABOVE"
      ? platelets
        ? ["Entzündung oder Infektion", "Eisenmangel", "Seltener eine Veränderung der Blutbildung"]
        : ["Infektion oder Entzündung", "Körperlicher Stress, Rauchen oder Medikamente", "Seltener eine Veränderung der Blutbildung"]
      : platelets
        ? ["Virusinfekt, Medikamente oder Immunreaktion", "Leber- oder Milzveränderungen", "Seltener eine Störung der Blutbildung"]
        : ["Virusinfekt oder Medikamente", "Nährstoffmangel oder Autoimmunprozess", "Seltener eine Störung der Blutbildung"],
    nextSteps: [
      "Differenzialblutbild beziehungsweise übriges Blutbild und zeitlichen Verlauf prüfen lassen.",
      `Bei ${platelets ? "ungewöhnlichen Blutungen, punktförmigen Einblutungen" : "Fieber oder ausgeprägter Infektanfälligkeit"} zeitnah medizinisch abklären.`,
    ],
    naturalOptions: [
      "Erholung und eine ausreichende, abwechslungsreiche Ernährung unterstützen die allgemeine Regeneration.",
      "Der Zellwert sollte nicht durch Supplemente auf Verdacht beeinflusst werden.",
    ],
  };
}

function ferritinGuidance(status: "ABOVE" | "BELOW"): Guidance {
  if (status === "BELOW") {
    return {
      assessment: "Ein niedriges Ferritin spricht häufig für geringe Eisenspeicher; die Ursache des Mangels ist ebenso wichtig wie der Speicherwert.",
      possibleFactors: ["Zu geringe Eisenzufuhr oder verminderte Aufnahme", "Blutverlust, etwa aus Magen-Darm-Trakt oder Menstruation", "Erhöhter Bedarf"],
      nextSteps: ["Blutbild und Transferrinsättigung mitbeurteilen und möglichen Blutverlust klären.", "Eisenpräparate mit Dosis und Dauer ärztlich abstimmen."],
      naturalOptions: ["Fleisch, Fisch oder pflanzliche Eisenquellen wie Hülsenfrüchte, Samen und grünes Gemüse mit Vitamin C kombinieren.", "Kaffee und Tee nicht direkt zu eisenreichen Mahlzeiten trinken."],
    };
  }
  return {
    assessment: "Ferritin kann bei gefüllten Eisenspeichern, aber auch als Reaktion auf Entzündung ansteigen. Der Wert allein beweist keine Eisenüberladung.",
    possibleFactors: ["Entzündung oder Infektion", "Leber- und Stoffwechselbelastung", "Eisensupplemente oder seltener Eisenüberladung"],
    nextSteps: ["CRP, Transferrinsättigung, Blutbild und Leberwerte gemeinsam prüfen lassen.", "Eisenhaltige Supplemente bis zur Klärung nicht eigenständig erhöhen."],
    naturalOptions: ["Alkoholkonsum begrenzen und Stoffwechselgesundheit mit Bewegung und ausgewogener Ernährung unterstützen.", "Keine eisenreduzierende Diät oder Blutspende ohne bestätigte Ursache beginnen."],
  };
}

function glucoseGuidance(key: string, status: "ABOVE" | "BELOW"): Guidance {
  if (status === "BELOW") {
    return {
      assessment: "Ein niedriger Glukosewert kann von Nüchternzeit, Mahlzeitenabstand, körperlicher Aktivität oder blutzuckersenkenden Medikamenten beeinflusst sein.",
      possibleFactors: ["Lange Nüchternphase oder ungewohnte Belastung", "Diabetesmedikamente", "Seltener Leber-, Hormon- oder andere Stoffwechselveränderungen"],
      nextSteps: ["Bei Zittern, Schwitzen, Verwirrtheit oder Bewusstseinsstörung sofort medizinische Hilfe suchen.", "Messzeitpunkt, Mahlzeiten und Medikamente mit einer Fachperson prüfen."],
      naturalOptions: ["Regelmäßige, ausgewogene Mahlzeiten passend zur persönlichen Stoffwechselsituation einplanen.", "Bei Diabetes keine Ernährung oder Medikation ohne Behandlungsplan ändern."],
    };
  }
  return {
    assessment: key === "hba1c"
      ? "Ein erhöhtes HbA1c passt zu einer über Wochen erhöhten durchschnittlichen Glukosebelastung, kann aber durch Blutbild-, Nieren- oder Leberveränderungen beeinflusst werden."
      : "Ein erhöhter Glukosewert kann vorübergehend oder anhaltend sein; Nüchternstatus, akute Erkrankung und weitere Messungen sind für die Einordnung wichtig.",
    possibleFactors: ["Insulinresistenz, Prädiabetes oder Diabetes", "Akute Erkrankung, Stress, Schlafmangel oder Medikamente", ...(key === "glucose" ? ["Nicht nüchterne Blutabnahme"] : ["Veränderte Lebensdauer roter Blutkörperchen"])],
    nextSteps: ["Nüchternstatus und Verlauf prüfen; Glukose und HbA1c gegebenenfalls gemeinsam kontrollieren.", "Das persönliche Stoffwechsel- und Herz-Kreislauf-Risiko ärztlich einordnen lassen."],
    naturalOptions: ["Gemüse, Ballaststoffe und unverarbeitete Proteinquellen priorisieren und stark raffinierte Kohlenhydrate sowie zuckerhaltige Getränke begrenzen.", "Regelmäßige Bewegung, Krafttraining und kurze Spaziergänge nach Mahlzeiten können die Glukoseregulation unterstützen.", "Schlaf und – falls relevant – eine langsame, nachhaltige Gewichtsreduktion berücksichtigen."],
  };
}

function lipidGuidance(key: string, status: "ABOVE" | "BELOW"): Guidance {
  const lowHdl = key === "hdl" && status === "BELOW";
  const concern = status === "ABOVE" && key !== "hdl";
  return {
    assessment: concern || lowHdl
      ? "Die Blutfettkonstellation kann das Herz-Kreislauf-Risiko erhöhen; entscheidend ist das Gesamtbild aus LDL, HDL, Triglyceriden und persönlichen Risikofaktoren."
      : "Diese isolierte Blutfettabweichung ist nicht automatisch ungünstig und sollte im gesamten Lipidprofil beurteilt werden.",
    possibleFactors: ["Ernährungsmuster, Alkohol, Bewegung und Körpergewicht", "Schilddrüse, Diabetes oder andere Stoffwechselveränderungen", "Genetische Veranlagung und Medikamente"],
    nextSteps: ["Komplettes Lipidprofil, Blutdruck, Glukosestoffwechsel und familiäres Risiko gemeinsam bewerten lassen.", "Bei deutlich erhöhtem LDL oder familiärer Vorbelastung eine ärztliche Risikobeurteilung vereinbaren."],
    naturalOptions: ["Olivenöl, Nüsse, Samen, Fisch und Gemüse bevorzugen; gesättigte Fette und stark verarbeitete Lebensmittel begrenzen.", "Lösliche Ballaststoffe regelmäßig einbauen, soweit sie zur gewählten Ernährungsform passen.", "Regelmäßige Ausdauer- und Kraftaktivität, Rauchstopp und bei hohen Triglyceriden möglichst wenig Alkohol unterstützen das Risikoprofil."],
  };
}

function electrolyteGuidance(status: "ABOVE" | "BELOW"): Guidance {
  return {
    assessment: `Ein Elektrolytwert ${status === "ABOVE" ? "oberhalb" : "unterhalb"} der Laborreferenz kann Nerven, Muskeln und Herzfunktion betreffen und sollte nicht allein durch Ernährung korrigiert werden.`,
    possibleFactors: ["Flüssigkeitsverlust oder veränderte Wasserzufuhr", "Nierenfunktion, Hormone oder Medikamente", "Ernährung und Supplemente"],
    nextSteps: ["Zeitnah mit Medikamenten- und Supplementliste kontrollieren lassen.", "Bei Herzstolpern, Muskelschwäche, Krämpfen, Verwirrtheit oder deutlichem Unwohlsein dringend medizinische Hilfe suchen."],
    naturalOptions: ["Bis zur Klärung normal und bedarfsgerecht trinken; keine extreme Wasser-, Salz- oder Elektrolytzufuhr.", "Kalium-, Magnesium- oder Calciumpräparate nicht auf Verdacht hoch dosieren."],
  };
}

function kidneyGuidance(key: string, status: "ABOVE" | "BELOW"): Guidance {
  const reducedFiltration = key === "egfr" ? status === "BELOW" : status === "ABOVE";
  return {
    assessment: reducedFiltration
      ? "Die Konstellation kann zu einer verminderten Nierenfiltration passen. Eine chronische Nierenerkrankung wird jedoch nicht aus einer einzelnen Messung diagnostiziert."
      : "Diese isolierte Abweichung zeigt für sich allein keine eingeschränkte Nierenfunktion und muss im Kontext von Muskelmasse, Urin und Verlauf gesehen werden.",
    possibleFactors: ["Flüssigkeitshaushalt und kürzliche intensive Belastung", "Muskelmasse, Fleisch- oder Kreatinzufuhr bei kreatininbasierten Werten", "Blutdruck, Diabetes, Medikamente oder Nierenerkrankung"],
    nextSteps: ["eGFR und Kreatinin im Verlauf sowie Urin-Albumin-Kreatinin-Quotient und Blutdruck prüfen lassen.", "Medikamente und Supplemente auf Nierenrelevanz prüfen; nichts eigenständig absetzen."],
    naturalOptions: ["Blutdruck, Blutzucker, Rauchstopp und regelmäßige Bewegung unterstützen den Nierenschutz.", "Bedarfsgerecht trinken und extreme Protein- oder Salzaufnahme vermeiden; individuelle Vorgaben ärztlich abstimmen."],
  };
}

function urateGuidance(status: "ABOVE" | "BELOW"): Guidance {
  return status === "ABOVE"
    ? {
        assessment: "Eine erhöhte Harnsäure kann das Risiko für Gicht oder Nierensteine erhöhen, führt aber nicht bei jeder Person zu Beschwerden.",
        possibleFactors: ["Alkohol, fruktosereiche Getränke und purinreiche Lebensmittel", "Übergewicht, Insulinresistenz oder rascher Gewichtsverlust", "Nierenfunktion und Medikamente"],
        nextSteps: ["Bei Gelenkschmerz, Rötung oder Nierensteinbeschwerden zeitnah abklären.", "Verlauf, Nierenfunktion und Medikamente ärztlich prüfen."],
        naturalOptions: ["Ausreichend trinken, zuckerhaltige Getränke sowie Bier und Spirituosen begrenzen.", "Innereien und große Mengen purinreicher Fleischprodukte reduzieren; Gewicht nur langsam verändern."],
      }
    : genericGuidance(status);
}

function liverGuidance(key: string, status: "ABOVE" | "BELOW"): Guidance {
  if (status === "BELOW" && key !== "albumin") {
    return {
      assessment: "Ein niedriger Leberenzym- oder Bilirubinwert ist isoliert häufig nicht behandlungsbedürftig und muss im Gesamtmuster beurteilt werden.",
      possibleFactors: ["Individuelle Ausgangslage, Messmethode und übrige Laborwerte"],
      nextSteps: ["Nur bei Beschwerden oder weiteren Abweichungen mit dem gesamten Leberprofil besprechen."],
      naturalOptions: ["Eine gezielte natürliche Anhebung dieses Einzelwerts ist in der Regel nicht erforderlich."],
    };
  }
  if (status === "BELOW" && key === "albumin") {
    return {
      assessment: "Niedriges Albumin kann durch Entzündung, verminderte Bildung, erhöhte Verluste oder unzureichende Versorgung entstehen.",
      possibleFactors: ["Entzündung oder akute Erkrankung", "Leber- oder Nierenveränderung", "Eiweißverlust, Mangelernährung oder verminderte Aufnahme"],
      nextSteps: ["Leberprofil, Nierenwerte, Urin-Albumin und Ernährungssituation gemeinsam prüfen lassen.", medicalReview],
      naturalOptions: ["Eine bedarfsgerechte Eiweiß- und Energiezufuhr sicherstellen, sofern medizinisch nichts dagegenspricht.", "Keine Proteinpräparate ohne Klärung von Nieren- und Leberfunktion beginnen."],
    };
  }
  return {
    assessment: `Ein Leber- oder Galleparameter liegt ${status === "ABOVE" ? "über" : "unter"} der Laborreferenz. Einzelne Leberwerte können die Ursache und den Schweregrad nicht allein bestimmen.`,
    possibleFactors: ["Fettleber beziehungsweise Stoffwechselbelastung oder Alkohol", "Medikamente, Supplemente, Infektion oder Galleabfluss", "Bei ASAT auch starke Muskelbelastung"],
    nextSteps: ["ALAT, ASAT, AP, Bilirubin und Albumin als Muster sowie Medikamente und Alkoholkonsum beurteilen lassen.", "Bei Gelbfärbung, dunklem Urin, hellem Stuhl oder starken Oberbauchbeschwerden dringend medizinisch abklären."],
    naturalOptions: ["Alkohol pausieren oder deutlich begrenzen und nicht notwendige ‚Detox‘-Produkte vermeiden.", "Mediterrane Ernährung, regelmäßige Bewegung und gegebenenfalls langsame Gewichtsreduktion unterstützen die Lebergesundheit.", "Medikamente nicht eigenständig absetzen."],
  };
}

function vitaminGuidance(key: string, status: "ABOVE" | "BELOW"): Guidance {
  const label = key === "vitamin-d" ? "Vitamin D" : key === "vitamin-b12" ? "Vitamin B12" : "Folat";
  if (status === "ABOVE") {
    return {
      assessment: `Ein erhöhter ${label}-Wert entsteht häufig durch Supplemente; der Wert allein belegt keinen zusätzlichen gesundheitlichen Nutzen.`,
      possibleFactors: ["Supplemente oder angereicherte Produkte", "Bei Vitamin B12 seltener Leber-, Nieren- oder Blutbildveränderungen"],
      nextSteps: ["Dosis, Präparate und Einnahmezeitpunkt mit einer Fachperson prüfen.", "Hoch dosierte Einnahme nicht automatisch fortsetzen oder steigern."],
      naturalOptions: ["Nährstoffe bevorzugt über eine abwechslungsreiche Ernährung zuführen, sofern kein behandelter Mangel vorliegt."],
    };
  }
  return {
    assessment: `Ein niedriger ${label}-Wert kann zu einer unzureichenden Versorgung passen; Aufnahme, Bedarf und mögliche Resorptionsstörungen sollten berücksichtigt werden.`,
    possibleFactors: key === "vitamin-d"
      ? ["Geringe UV-B-Exposition", "Geringe Zufuhr, höherer Bedarf oder verminderte Aufnahme"]
      : ["Geringe Zufuhr", "Magen-Darm-Erkrankung oder verminderte Aufnahme", "Bestimmte Medikamente oder erhöhter Bedarf"],
    nextSteps: ["Mangel und passende Dosis fachlich bestätigen lassen; Verlauf nach vereinbarter Behandlung kontrollieren.", ...(key === "folate" ? ["Vor hoch dosiertem Folat einen Vitamin-B12-Mangel ausschließen."] : [])],
    naturalOptions: key === "vitamin-d"
      ? ["Fettreichen Fisch und geeignete angereicherte Lebensmittel einplanen; sichere Sonnenexposition an Hauttyp und Jahreszeit anpassen.", "Supplementdosis nicht allein aus einem Einzelwert ableiten."]
      : key === "vitamin-b12"
        ? ["Fisch, Eier, Milchprodukte oder angereicherte Lebensmittel regelmäßig einplanen; bei Aufnahmestörung reicht Ernährung allein möglicherweise nicht."]
        : ["Grünes Gemüse, Hülsenfrüchte, Avocado und Nüsse regelmäßig einplanen; Zubereitungsverluste gering halten."],
  };
}

function thyroidGuidance(status: "ABOVE" | "BELOW"): Guidance {
  return {
    assessment: `Ein ${status === "ABOVE" ? "erhöhtes" : "erniedrigtes"} TSH kann auf eine veränderte Schilddrüsensteuerung hinweisen, wird aber erst zusammen mit freiem T4 und dem klinischen Kontext aussagekräftig.`,
    possibleFactors: [status === "ABOVE" ? "Mögliche Unterfunktion der Schilddrüse" : "Mögliche Überfunktion oder seltener Störung der Hypophysensteuerung", "Akute Erkrankung, Schwangerschaft oder Medikamente", "Biotin kann manche Schilddrüsenmessungen verfälschen"],
    nextSteps: ["TSH standardisiert kontrollieren und freies T4 ergänzen; bei niedrigem TSH je nach Kontext auch T3.", "Biotin und andere Supplemente vor der Blutabnahme mit Labor beziehungsweise Arzt besprechen."],
    naturalOptions: ["Keine hoch dosierten Jod- oder ‚Schilddrüsen‘-Supplemente ohne Diagnose beginnen.", "Ausgewogene Jodzufuhr und normale Ernährung beibehalten; eine echte Funktionsstörung benötigt gezielte medizinische Behandlung."],
  };
}

function guidanceFor(key: string, status: "ABOVE" | "BELOW"): Guidance {
  if (key === "crp" || key === "esr") return inflammationGuidance(key, status);
  if (["hemoglobin", "hematocrit", "erythrocytes"].includes(key)) return redBloodCellGuidance(status);
  if (key === "mcv" || key === "mch") return cellIndexGuidance(key, status);
  if (key === "leukocytes" || key === "platelets") return whiteCellsOrPlateletsGuidance(key, status);
  if (key === "ferritin") return ferritinGuidance(status);
  if (key === "glucose" || key === "hba1c") return glucoseGuidance(key, status);
  if (["cholesterol", "ldl", "hdl", "triglycerides", "cholesterol-hdl-ratio", "ldl-hdl-ratio"].includes(key)) return lipidGuidance(key, status);
  if (["sodium", "potassium", "calcium", "magnesium"].includes(key)) return electrolyteGuidance(status);
  if (["creatinine", "egfr", "urine-creatinine"].includes(key)) return kidneyGuidance(key, status);
  if (key === "urate") return urateGuidance(status);
  if (["albumin", "bilirubin", "alkaline-phosphatase", "alat", "asat"].includes(key)) return liverGuidance(key, status);
  if (["vitamin-d", "vitamin-b12", "folate"].includes(key)) return vitaminGuidance(key, status);
  if (key === "tsh") return thyroidGuidance(status);
  return genericGuidance(status);
}

export function buildLaboratoryAssessment(
  results: LaboratoryResult[],
): LaboratoryAssessment {
  let withinReferenceCount = 0;
  let withoutReferenceCount = 0;
  const insights: LaboratoryInsight[] = [];

  for (const result of results) {
    const status = labReferenceStatus(
      result.value,
      result.referenceLow,
      result.referenceHigh,
    );
    if (status === "WITHIN") {
      withinReferenceCount += 1;
      continue;
    }
    if (status === "UNAVAILABLE") {
      withoutReferenceCount += 1;
      continue;
    }
    insights.push({
      analyteKey: result.analyteKey,
      analyteName: result.analyteName,
      status,
      ...guidanceFor(result.analyteKey, status),
    });
  }

  return {
    assessedCount: results.length - withoutReferenceCount,
    outsideReferenceCount: insights.length,
    withinReferenceCount,
    withoutReferenceCount,
    insights,
  };
}
