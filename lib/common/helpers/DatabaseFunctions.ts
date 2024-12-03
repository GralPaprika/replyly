import {PgColumn} from "drizzle-orm/pg-core";
import {eq} from "drizzle-orm";

export const isTrue = (column: PgColumn) => eq(column, true)

export const isFalse = (column: PgColumn) => eq(column, false)