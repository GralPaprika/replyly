import {PgColumn} from "drizzle-orm/pg-core";
import {AnyColumn, eq, sql} from "drizzle-orm";

export const isTrue = (column: PgColumn) => eq(column, true)

export const isFalse = (column: PgColumn) => eq(column, false)

export const contains = (column: AnyColumn, str: string) => sql`position(${column} in ${str}) > 0`