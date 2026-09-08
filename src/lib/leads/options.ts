/**
 * Plain option lists with no imports, so a client component can use them
 * without pulling the zod schema (and, through it, the whole product data
 * file with all its long-form copy) into the browser bundle.
 */
export const employmentTypes = ["salaried", "self-employed-professional", "self-employed-business", "other"] as const;
export const cibilBands = ["750+", "700-749", "650-699", "below-650", "unknown"] as const;

export type EmploymentType = (typeof employmentTypes)[number];
export type CibilBand = (typeof cibilBands)[number];
