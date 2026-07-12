import Link from "next/link";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import styles from "./button.module.css";

type Variant = "solid" | "outline" | "ghost";

interface ButtonBaseProps {
  variant?: Variant;
  children: ReactNode;
}

type ButtonAsButton = ButtonBaseProps &
  ComponentPropsWithoutRef<"button"> & { href?: undefined };

type ButtonAsLink = ButtonBaseProps & { href: string };

const variantClass: Record<Variant, string> = {
  solid: styles.solid,
  outline: styles.outline,
  ghost: styles.ghost,
};

export function Button(props: ButtonAsButton | ButtonAsLink) {
  if (props.href !== undefined) {
    const { href, variant = "solid", children } = props;
    return (
      <Link href={href} className={`${styles.button} ${variantClass[variant]}`}>
        <span className={styles.label}>{children}</span>
      </Link>
    );
  }

  const { variant = "solid", children, ...rest } = props;
  return (
    <button {...rest} className={`${styles.button} ${variantClass[variant]}`}>
      <span className={styles.label}>{children}</span>
    </button>
  );
}
