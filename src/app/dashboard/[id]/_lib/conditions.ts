import { Condition } from "@/types/widgets";

export function evaluateCondition(value: number, condition: Condition, conditionValue: number | [number, number]): boolean {
    switch (condition) {
        case Condition.Equals:
            return value === conditionValue;
        case Condition.NotEquals:
            return value !== conditionValue;
        case Condition.LessThan:
            return value < (conditionValue as number);
        case Condition.GreaterThan:
            return value > (conditionValue as number);
        case Condition.LessThanEquals:
            return value <= (conditionValue as number);
        case Condition.GreaterThanEquals:
            return value >= (conditionValue as number);
        case Condition.IsInInclusiveInterval:
            if (Array.isArray(conditionValue)) {
                return value >= conditionValue[0] && value <= conditionValue[1];
            }
            return false;
        case Condition.IsInExclusiveInterval:
            if (Array.isArray(conditionValue)) {
                return value > conditionValue[0] && value < conditionValue[1];
            }
            return false;
        case Condition.IsInLeftInclusiveRightExclusiveInterval:
            if (Array.isArray(conditionValue)) {
                return value >= conditionValue[0] && value < conditionValue[1];
            }
            return false;
        case Condition.IsInLeftExclusiveRightInclusiveInterval:
            if (Array.isArray(conditionValue)) {
                return value > conditionValue[0] && value <= conditionValue[1];
            }
            return false;
        default:
            return false;
    }
}