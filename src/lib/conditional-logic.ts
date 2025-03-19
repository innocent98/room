import type { ConditionalLogic, ConditionalRule } from "@/constants/types"

/**
 * Evaluates if a field should be shown based on its conditional logic and current form values
 */
export function evaluateConditionalLogic(
  conditionalLogic: ConditionalLogic | undefined,
  formValues: Record<string, any>,
): boolean {
  // If no conditional logic or not enabled, always show the field
  if (!conditionalLogic || !conditionalLogic.enabled) {
    return true
  }

  // Evaluate each rule
  const ruleResults = conditionalLogic.rules.map((rule) => evaluateRule(rule, formValues))

  // If no rules, default to showing the field
  if (ruleResults.length === 0) {
    return true
  }

  // For "show" action, at least one rule must be true
  // For "hide" action, all rules must be false to show the field
  // For "require" action, we're just determining visibility here, not validation
  if (conditionalLogic.action === "show") {
    return ruleResults.some((result) => result)
  } else if (conditionalLogic.action === "hide") {
    return !ruleResults.some((result) => result)
  }

  // Default to showing
  return true
}

/**
 * Evaluates a single conditional rule
 */
function evaluateRule(rule: ConditionalRule, formValues: Record<string, any>): boolean {
  const fieldValue = formValues[rule.fieldId]

  // If the field doesn't have a value yet, the rule doesn't apply
  if (fieldValue === undefined || fieldValue === null) {
    return false
  }

  switch (rule.operator) {
    case "equals":
      return fieldValue === rule.value

    case "not_equals":
      return fieldValue !== rule.value

    case "contains":
      if (Array.isArray(fieldValue)) {
        return fieldValue.includes(rule.value)
      }
      return String(fieldValue).includes(String(rule.value))

    case "not_contains":
      if (Array.isArray(fieldValue)) {
        return !fieldValue.includes(rule.value)
      }
      return !String(fieldValue).includes(String(rule.value))

    case "greater_than":
      return Number(fieldValue) > Number(rule.value)

    case "less_than":
      return Number(fieldValue) < Number(rule.value)

    default:
      return false
  }
}

