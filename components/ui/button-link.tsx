import * as React from "react";
import Link from "next/link";
import { buttonVariants, type ButtonProps } from "./button";
import { cn } from "@/lib/utils";

type ButtonLinkProps = React.ComponentProps<typeof Link> &
  Pick<ButtonProps, "variant" | "size" | "block">;

/** A Next.js <Link> styled as a design-system button. */
export function ButtonLink({ className, variant, size, block, ...props }: ButtonLinkProps) {
  return <Link className={cn(buttonVariants({ variant, size, block }), className)} {...props} />;
}
