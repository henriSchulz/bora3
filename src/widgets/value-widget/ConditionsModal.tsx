import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import {
  ConditionalRule,
  ColorFormat,
  Condition,
} from "@/types/widgets";

interface ConditionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  conditions: ConditionalRule<ColorFormat>[];
  onSave: (conditions: ConditionalRule<ColorFormat>[]) => void;
}

const isIntervalCondition = (condition: Condition) => {
  return (
    condition === Condition.IsInExclusiveInterval ||
    condition === Condition.IsInInclusiveInterval ||
    condition === Condition.IsInLeftExclusiveRightInclusiveInterval ||
    condition === Condition.IsInLeftInclusiveRightExclusiveInterval
  );
};

export function ConditionsModal({
  isOpen,
  onClose,
  conditions,
  onSave,
}: ConditionsModalProps) {
  const [localConditions, setLocalConditions] = useState(conditions);

  const handleAddCondition = () => {
    const newCondition: ConditionalRule<ColorFormat> = {
      condition: Condition.Equals,
      value: 0,
      format: { color: "#000000" },
    };
    setLocalConditions([...localConditions, newCondition]);
  };

  const handleRemoveCondition = (index: number) => {
    setLocalConditions(localConditions.filter((_, i) => i !== index));
  };

  const handleConditionChange = (
    index: number,
    field: keyof ConditionalRule<ColorFormat>,
    value: any
  ) => {
    const newConditions = [...localConditions];
    const oldRule = newConditions[index];

    // If the condition type is changing, we may need to adjust the value type
    if (field === "condition") {
      const isNewInterval = isIntervalCondition(value);
      const isOldInterval = isIntervalCondition(oldRule.condition);

      if (isNewInterval && !isOldInterval) {
        (newConditions[index] as any).value = [0, 0];
      } else if (!isNewInterval && isOldInterval) {
        (newConditions[index] as any).value = 0;
      }
    }

    (newConditions[index] as any)[field] = value;
    setLocalConditions(newConditions);
  };

  const handleValueChange = (index: number, subIndex: number, value: number) => {
    const newConditions = [...localConditions];
    const oldValue = newConditions[index].value;
    if (Array.isArray(oldValue)) {
      const newValue = [...oldValue];
      newValue[subIndex] = value;
      (newConditions[index] as any).value = newValue;
    } else {
      (newConditions[index] as any).value = value;
    }
    setLocalConditions(newConditions);
  };

  const handleFormatChange = (
    index: number,
    field: keyof ColorFormat,
    value: any
  ) => {
    const newConditions = [...localConditions];
    (newConditions[index].format as any)[field] = value;
    setLocalConditions(newConditions);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Conditions</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {localConditions.map((rule, index) => (
            <div key={index} className="flex items-center gap-2">
              <Select
                value={rule.condition}
                onValueChange={(value) =>
                  handleConditionChange(index, "condition", value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select condition" />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(Condition).map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {isIntervalCondition(rule.condition) ? (
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    value={(rule.value as [number, number])[0]}
                    onChange={(e) =>
                      handleValueChange(index, 0, Number(e.target.value))
                    }
                  />
                  <span>-</span>
                  <Input
                    type="number"
                    value={(rule.value as [number, number])[1]}
                    onChange={(e) =>
                      handleValueChange(index, 1, Number(e.target.value))
                    }
                  />
                </div>
              ) : (
                <Input
                  type="number"
                  value={rule.value as number}
                  onChange={(e) =>
                    handleConditionChange(
                      index,
                      "value",
                      Number(e.target.value)
                    )
                  }
                />
              )}
              <Input
                type="color"
                value={rule.format.color}
                onChange={(e) =>
                  handleFormatChange(index, "color", e.target.value)
                }
              />
              <Button
                variant="destructive"
                onClick={() => handleRemoveCondition(index)}
              >
                Remove
              </Button>
            </div>
          ))}
          <Button onClick={handleAddCondition}>Add Condition</Button>
        </div>
        <DialogFooter>
          <Button onClick={() => onSave(localConditions)}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
