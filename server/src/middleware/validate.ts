import { Request, Response, NextFunction } from "express";
import { ZodIssue, ZodTypeAny } from "zod";

function humanize(issue: ZodIssue): string {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const i = issue as any;
  if (issue.code === "too_small" && i.origin === "string")
    return `Must be at least ${i.minimum} character${i.minimum === 1 ? "" : "s"}`;
  if (issue.code === "too_big" && i.origin === "string")
    return `Must be at most ${i.maximum} characters`;
  if (issue.code === "invalid_type" && i.input === undefined) return "This field is required";
  if (issue.code === "invalid_type" && i.expected === "number") return "Must be a valid number";
  if (issue.code === "too_small" && i.origin === "number") return "Must be greater than 0";
  return issue.message;
}

export function validateBody(schema: ZodTypeAny) {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      const fields: Record<string, string> = {};
      for (const issue of result.error.issues) {
        const key = issue.path.join(".");
        if (!fields[key]) fields[key] = humanize(issue);
      }
      res.status(400).json({ error: "Please fix the errors below.", fields });
      return;
    }
    req.body = result.data;
    next();
  };
}
