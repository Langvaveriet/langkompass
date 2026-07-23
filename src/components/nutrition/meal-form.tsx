"use client";

import { useState } from "react";

import { saveMeal } from "@/app/ernaehrung/actions";
import { ChipSelector } from "@/components/health-input/chip-selector";
import type {
  FoodCategory,
  MealType,
  PortionSize,
} from "@/generated/prisma/enums";
import { foodCatalog, foodCatalogByKey } from "@/lib/nutrition/food-catalog";
import {
  postMealSymptomOptions,
  reactionDelayOptions,
} from "@/lib/nutrition/post-meal-reactions";

type SelectedFoodValue = {
  key: string;
  portion: PortionSize;
};

type MealFormValues = {
  id?: string;
  type: MealType;
  time: string;
  foods: SelectedFoodValue[];
  customFood: string;
  customQuantity: string;
  notes: string;
  postMealSymptomTags: string[];
  reactionDelayMinutes: number | null;
};

type MealFormProps = { entryDate: string; values: MealFormValues };

const mealTypes = [
  { value: "BREAKFAST", label: "Frühstück", emoji: "🌅" },
  { value: "LUNCH", label: "Mittag", emoji: "☀️" },
  { value: "DINNER", label: "Abend", emoji: "🌙" },
  { value: "SNACK", label: "Snack", emoji: "🍎" },
  { value: "DRINK", label: "Getränk", emoji: "🥤" },
] as const;

const portionSizes = ["SMALL", "MEDIUM", "LARGE"] as const;

const foodGroups = [
  {
    key: "BASICS",
    label: "Grundlagen",
    emoji: "🥗",
    categories: ["GRAIN", "VEGETABLE", "FRUIT"] satisfies FoodCategory[],
  },
  {
    key: "PROTEIN",
    label: "Eiweiß & Beilagen",
    emoji: "🍳",
    categories: [
      "LEGUME",
      "NUT_SEED",
      "DAIRY",
      "EGG",
      "MEAT",
      "FISH_SEAFOOD",
      "FAT_OIL",
      "CONDIMENT",
    ] satisfies FoodCategory[],
  },
  {
    key: "CONVENIENCE",
    label: "Snacks & Fertiges",
    emoji: "🍫",
    categories: ["SWEET", "PREPARED_MEAL", "OTHER"] satisfies FoodCategory[],
  },
  {
    key: "DRINKS",
    label: "Getränke",
    emoji: "🥤",
    categories: ["BEVERAGE"] satisfies FoodCategory[],
  },
] as const;

type FoodGroupKey = (typeof foodGroups)[number]["key"];

export function MealForm({ entryDate, values }: MealFormProps) {
  const [selectedFoods, setSelectedFoods] = useState<SelectedFoodValue[]>(
    values.foods,
  );
  const [activeFoodGroup, setActiveFoodGroup] = useState<FoodGroupKey>(
    values.type === "DRINK" ? "DRINKS" : "BASICS",
  );

  const selectedFoodKeys = new Set(selectedFoods.map((food) => food.key));
  const activeGroup = foodGroups.find((group) => group.key === activeFoodGroup)!;
  const visibleFoods = foodCatalog.filter((food) =>
    (activeGroup.categories as readonly FoodCategory[]).includes(food.category),
  );

  function toggleFood(key: string) {
    setSelectedFoods((current) =>
      current.some((food) => food.key === key)
        ? current.filter((food) => food.key !== key)
        : [...current, { key, portion: "MEDIUM" }],
    );
  }

  function selectPortion(key: string, portion: PortionSize) {
    setSelectedFoods((current) =>
      current.map((food) => food.key === key ? { ...food, portion } : food),
    );
  }

  return (
    <form action={saveMeal} className="grid gap-7">
      <input type="hidden" name="entryDate" value={entryDate} />
      {values.id ? <input type="hidden" name="mealId" value={values.id} /> : null}

      <fieldset className="grid gap-3">
        <legend className="text-sm font-semibold text-text-primary">Mahlzeit</legend>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
          {mealTypes.map((option) => (
            <label key={option.value} className="cursor-pointer">
              <input className="peer sr-only" type="radio" name="type" value={option.value} defaultChecked={values.type === option.value} />
              <span className="flex min-h-16 flex-col items-center justify-center gap-1 rounded-[var(--radius-md)] border border-border-strong bg-surface-primary px-2 py-2 text-sm font-semibold text-text-primary transition peer-checked:border-forest-strong peer-checked:bg-forest-soft peer-checked:text-forest-strong peer-focus-visible:ring-2 peer-focus-visible:ring-forest-strong">
                <span aria-hidden="true">{option.emoji}</span>{option.label}
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      <div className="grid gap-2">
        <label htmlFor="consumedTime" className="text-sm font-semibold text-text-primary">Uhrzeit</label>
        <input id="consumedTime" name="consumedTime" type="time" required defaultValue={values.time} className="min-h-12 rounded-[var(--radius-md)] border border-border-strong bg-surface-primary px-4 text-base text-text-primary focus:border-forest-strong focus:ring-2 focus:ring-forest-soft" />
      </div>

      <fieldset className="grid gap-3">
        <legend className="text-sm font-semibold text-text-primary">Was war dabei?</legend>
        <p className="text-sm text-text-muted">Lebensmittel auswählen und danach die passende Menge antippen.</p>

        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4" aria-label="Lebensmittelbereiche">
          {foodGroups.map((group) => {
            const selectedCount = foodCatalog.filter(
              (food) =>
                (group.categories as readonly FoodCategory[]).includes(food.category) &&
                selectedFoodKeys.has(food.key),
            ).length;
            const active = group.key === activeFoodGroup;

            return (
              <button
                key={group.key}
                type="button"
                aria-pressed={active}
                onClick={() => setActiveFoodGroup(group.key)}
                className={[
                  "relative min-h-14 rounded-[var(--radius-md)] border px-3 py-2 text-left text-sm font-semibold transition",
                  active
                    ? "border-forest-strong bg-forest-soft text-forest-strong"
                    : "border-border-strong bg-surface-raised text-text-primary hover:border-forest-strong",
                ].join(" ")}
              >
                <span aria-hidden="true" className="mr-1">{group.emoji}</span>
                {group.label}
                {selectedCount > 0 ? (
                  <span className="absolute right-2 top-2 inline-flex min-h-5 min-w-5 items-center justify-center rounded-full bg-forest-strong px-1 text-[11px] text-surface">
                    {selectedCount}
                  </span>
                ) : null}
              </button>
            );
          })}
        </div>

        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-text-muted">
          {activeGroup.label}
        </p>
        <div className="flex flex-wrap gap-2">
          {visibleFoods.map((food) => {
            const selected = selectedFoods.some((item) => item.key === food.key);
            const unit = food.unit === "MILLILITER" ? "ml" : "g";

            return (
              <button key={food.key} type="button" aria-pressed={selected} onClick={() => toggleFood(food.key)} className={["inline-flex min-h-11 items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition", selected ? "border-forest-strong bg-forest-soft text-forest-strong ring-2 ring-forest-soft" : "border-border-strong bg-surface-primary text-text-primary hover:border-forest-strong"].join(" ")}>
                <span aria-hidden="true">{food.emoji}</span>
                <span>{food.name}</span>
                <span className="text-xs opacity-70">ca. {food.portions.MEDIUM} {unit}</span>
              </button>
            );
          })}
        </div>
      </fieldset>

      {selectedFoods.length > 0 ? (
        <section className="grid gap-3 rounded-[var(--radius-lg)] bg-surface-muted p-4" aria-label="Mengen auswählen">
          <h3 className="font-semibold text-text-primary">Mengen auswählen</h3>
          {selectedFoods.map((selectedFood) => {
            const food = foodCatalogByKey.get(selectedFood.key)!;
            const unit = food.unit === "MILLILITER" ? "ml" : "g";

            return (
              <div key={food.key} className="grid gap-3 rounded-[var(--radius-md)] bg-surface-primary p-3">
                <input type="hidden" name="foodKeys" value={food.key} />
                <input type="hidden" name={`portion-${food.key}`} value={selectedFood.portion} />
                <p className="text-sm font-semibold text-text-primary"><span aria-hidden="true">{food.emoji}</span> {food.name}</p>
                <div className="grid grid-cols-3 gap-2">
                  {portionSizes.map((portion) => (
                    <button key={portion} type="button" aria-pressed={selectedFood.portion === portion} onClick={() => selectPortion(food.key, portion)} className={["min-h-11 rounded-[var(--radius-md)] border px-2 text-sm font-semibold transition", selectedFood.portion === portion ? "border-forest-strong bg-forest-soft text-forest-strong" : "border-border-strong bg-surface-raised text-text-primary"].join(" ")}>
                      {food.portions[portion]} {unit}
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </section>
      ) : null}

      <div className="grid gap-3 rounded-[var(--radius-md)] border border-border-subtle p-4">
        <label htmlFor="customFood" className="text-sm font-semibold text-text-primary">Etwas anderes <span className="font-normal text-text-muted">(optional)</span></label>
        <input id="customFood" name="customFood" defaultValue={values.customFood} placeholder="Lebensmittel ergänzen" className="min-h-12 rounded-[var(--radius-md)] border border-border-strong bg-surface-primary px-4 text-base text-text-primary placeholder:text-text-muted focus:border-forest-strong focus:ring-2 focus:ring-forest-soft" />
        <label htmlFor="customQuantity" className="text-sm font-semibold text-text-primary">Ungefähre Menge in Gramm <span className="font-normal text-text-muted">(optional)</span></label>
        <input id="customQuantity" name="customQuantity" type="number" min="1" max="5000" step="1" inputMode="numeric" defaultValue={values.customQuantity} placeholder="z. B. 150" className="min-h-12 rounded-[var(--radius-md)] border border-border-strong bg-surface-primary px-4 text-base text-text-primary placeholder:text-text-muted focus:border-forest-strong focus:ring-2 focus:ring-forest-soft" />
      </div>

      <details className="rounded-[var(--radius-md)] border border-border-subtle">
        <summary className="cursor-pointer px-4 py-3 text-sm font-semibold text-text-primary">Reaktion danach <span className="font-normal text-text-muted">(optional)</span></summary>
        <div className="grid gap-6 border-t border-border-subtle p-4">
          <ChipSelector
            name="postMealSymptomTags"
            label="Welche Beschwerden sind aufgetreten?"
            options={[...postMealSymptomOptions]}
            defaultValues={values.postMealSymptomTags}
          />

          <fieldset className="grid gap-3">
            <legend className="text-sm font-semibold text-text-primary">Wann ungefähr?</legend>
            <div className="flex flex-wrap gap-2">
              {reactionDelayOptions.map((option) => (
                <label key={option.value} className="cursor-pointer">
                  <input
                    className="peer sr-only"
                    type="radio"
                    name="reactionDelayMinutes"
                    value={option.value}
                    defaultChecked={values.reactionDelayMinutes === option.value}
                  />
                  <span className="inline-flex min-h-11 items-center rounded-full border border-border-strong bg-surface-primary px-4 py-2 text-sm font-medium text-text-primary transition peer-checked:border-forest-strong peer-checked:bg-forest-soft peer-checked:text-forest-strong peer-checked:ring-2 peer-checked:ring-forest-soft peer-focus-visible:ring-2 peer-focus-visible:ring-forest-strong">
                    {option.label}
                  </span>
                </label>
              ))}
            </div>
          </fieldset>
        </div>
      </details>

      <details className="rounded-[var(--radius-md)] border border-border-subtle">
        <summary className="cursor-pointer px-4 py-3 text-sm font-semibold text-text-primary">Optionale Notiz</summary>
        <div className="border-t border-border-subtle p-4">
          <textarea name="notes" rows={3} defaultValue={values.notes} placeholder="Nur wenn etwas Besonderes wichtig ist." className="w-full rounded-[var(--radius-md)] border border-border-strong bg-surface-primary px-4 py-3 text-base text-text-primary placeholder:text-text-muted focus:border-forest-strong focus:ring-2 focus:ring-forest-soft" />
        </div>
      </details>

      <button type="submit" className="min-h-14 rounded-[var(--radius-md)] bg-forest-strong px-6 py-4 text-base font-semibold text-surface transition hover:opacity-90">
        {values.id ? "Änderungen speichern" : "Mahlzeit speichern"}
      </button>
    </form>
  );
}
