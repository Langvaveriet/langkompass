import assert from "node:assert/strict";
import test from "node:test";

import {
  buildShoppingList,
  formatShoppingQuantity,
  shoppingListTransferText,
} from "./shopping-list";

test("bündelt gleiche Zutaten mit gleicher Einheit", () => {
  const items = buildShoppingList([
    { foodKey: "tomato", name: "Tomaten", category: "VEGETABLE", quantity: "200", unit: "GRAM" },
    { foodKey: "tomato", name: "Tomaten", category: "VEGETABLE", quantity: 150, unit: "GRAM" },
    { foodKey: "tomato", name: "Tomaten", category: "VEGETABLE", quantity: 1, unit: "PIECE" },
  ]);

  assert.equal(items.length, 2);
  assert.deepEqual(items.map(({ quantity, unit, occurrences }) => ({ quantity, unit, occurrences })), [
    { quantity: 350, unit: "GRAM", occurrences: 2 },
    { quantity: 1, unit: "PIECE", occurrences: 1 },
  ]);
});

test("bündelt freie Zutatenbezeichnungen unabhängig von Großschreibung", () => {
  const [item] = buildShoppingList([
    { foodKey: null, name: "Olivenöl", category: "FAT_OIL", quantity: "10", unit: "MILLILITER" },
    { foodKey: null, name: "olivenöl", category: "FAT_OIL", quantity: "15", unit: "MILLILITER" },
  ]);

  assert.equal(item.quantity, 25);
  assert.equal(item.occurrences, 2);
});

test("formatiert Mengen für Anzeige und Pon-Übergabe", () => {
  const items = buildShoppingList([
    { foodKey: "yogurt", name: "Joghurt", category: "DAIRY", quantity: "250.5", unit: "GRAM" },
    { foodKey: null, name: "Pfeffer", category: "CONDIMENT", quantity: null, unit: null },
  ]);

  assert.equal(formatShoppingQuantity(250.5, "GRAM"), "250,5 g");
  assert.equal(
    shoppingListTransferText(items),
    "250,5 g Joghurt\nnach Bedarf Pfeffer",
  );
});
