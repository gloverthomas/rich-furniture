"use client";

import { useMemo, useState } from "react";
import type { Product } from "@/lib/commerce/types";
import { formatMoney } from "@/lib/format";
import { useCart } from "@/components/cart/CartContext";
import { Button } from "@/components/ui/Button";
import styles from "./product-form.module.css";

interface ProductFormProps {
  product: Product;
}

function defaultSelection(product: Product): Record<string, string> {
  return Object.fromEntries(product.options.map((option) => [option.name, option.values[0]]));
}

export function ProductForm({ product }: ProductFormProps) {
  const [selected, setSelected] = useState<Record<string, string>>(() => defaultSelection(product));
  const { addLine, isPending, error } = useCart();

  const variant = useMemo(
    () =>
      product.variants.find((candidate) =>
        candidate.selectedOptions.every((option) => selected[option.name] === option.value),
      ) ?? null,
    [product.variants, selected],
  );

  const selectValue = (name: string, value: string) => {
    setSelected((current) => ({ ...current, [name]: value }));
  };

  return (
    <div className={styles.form}>
      <p className={`type-price ${styles.price}`} aria-live="polite">
        {variant ? formatMoney(variant.price) : formatMoney(product.priceRange.minVariantPrice)}
      </p>

      {product.options.map((option) => (
        <fieldset key={option.name} className={styles.optionGroup}>
          <legend className={`type-eyebrow ${styles.legend}`}>{option.name}</legend>
          <div className={styles.values} role="radiogroup" aria-label={option.name}>
            {option.values.map((value) => {
              const isActive = selected[option.name] === value;
              return (
                <button
                  key={value}
                  type="button"
                  role="radio"
                  aria-checked={isActive}
                  className={`${styles.value} ${isActive ? styles.valueActive : ""}`}
                  onClick={() => selectValue(option.name, value)}
                >
                  {value}
                </button>
              );
            })}
          </div>
        </fieldset>
      ))}

      <div className={styles.actions}>
        <Button
          type="button"
          disabled={!variant || !variant.availableForSale || isPending}
          onClick={() => variant && addLine(variant.id)}
        >
          {isPending ? "Adding…" : "Add to cart"}
        </Button>
        <p className={`type-small ${styles.leadTime}`}>
          Built to order in Copenhagen · 6–10 weeks
        </p>
      </div>

      {error && (
        <p role="alert" className={`type-small ${styles.error}`}>
          {error}
        </p>
      )}
    </div>
  );
}
