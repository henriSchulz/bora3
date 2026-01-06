import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState, useEffect } from "react";
import {
  ConditionalRule,
  IconFormat,
  Condition,
} from "@/types/widgets";
import 'katex/dist/katex.min.css';
import katex from 'katex';
import { Trash2 } from "lucide-react";
import Image from "next/image";

interface IconConditionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  conditions: ConditionalRule<IconFormat>[];
  onSave: (conditions: ConditionalRule<IconFormat>[]) => void;
  availableIcons: string[];
}

const isIntervalCondition = (condition: Condition) => {
  return (
    condition === Condition.IsInExclusiveInterval ||
    condition === Condition.IsInInclusiveInterval ||
    condition === Condition.IsInLeftExclusiveRightInclusiveInterval ||
    condition === Condition.IsInLeftInclusiveRightExclusiveInterval
  );
};

const conditionToLatex: Record<Condition, string> = {
  [Condition.Equals]: "x = v",
  [Condition.LessThan]: "x < v",
  [Condition.GreaterThan]: "x > v",
  [Condition.NotEquals]: "x \\neq v",
  [Condition.LessThanEquals]: "x \\leq v",
  [Condition.GreaterThanEquals]: "x \\geq v",
  [Condition.IsInExclusiveInterval]: "a < x < b",
  [Condition.IsInInclusiveInterval]: "a \\leq x \\leq b",
  [Condition.IsInLeftExclusiveRightInclusiveInterval]: "a < x \\leq b",
  [Condition.IsInLeftInclusiveRightExclusiveInterval]: "a \\leq x < b",
};

const renderLatex = (latex: string) => {
  try {
    const html = katex.renderToString(latex, {
      throwOnError: false,
      displayMode: false,
    });
    return <span dangerouslySetInnerHTML={{ __html: html }} />;
  } catch (e) {
    return <span>{latex}</span>;
  }
};

export function IconConditionsModal({
  isOpen,
  onClose,
  conditions,
  onSave,
  availableIcons,
}: IconConditionsModalProps) {
  const [localConditions, setLocalConditions] = useState(conditions);

  const handleAddCondition = () => {
    const newCondition: ConditionalRule<IconFormat> = {
      condition: Condition.Equals,
      value: 0,
      format: { icon: availableIcons[0] || "" },
    };
    setLocalConditions([...localConditions, newCondition]);
  };

  const handleRemoveCondition = (index: number) => {
    setLocalConditions(localConditions.filter((_, i) => i !== index));
  };

  const handleConditionChange = (
    index: number,
    field: keyof ConditionalRule<IconFormat>,
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
    field: keyof IconFormat,
    value: any
  ) => {
    const newConditions = [...localConditions];
    (newConditions[index].format as any)[field] = value;
    setLocalConditions(newConditions);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Icon Conditions</DialogTitle>
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
                <SelectTrigger className="w-[180px]">
                  {renderLatex(conditionToLatex[rule.condition])}
                </SelectTrigger>
                <SelectContent>
                  {Object.values(Condition).map((c) => (
                    <SelectItem key={c} value={c}>
                      {renderLatex(conditionToLatex[c])}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {isIntervalCondition(rule.condition) ? (
                <div className="flex items-center gap-2 flex-1">
                  <Input
                    type="number"
                    value={(rule.value as [number, number])[0]}
                    onChange={(e) =>
                      handleValueChange(index, 0, Number(e.target.value))
                    }
                    className="flex-1 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                  <span>-</span>
                  <Input
                    type="number"
                    value={(rule.value as [number, number])[1]}
                    onChange={(e) =>
                      handleValueChange(index, 1, Number(e.target.value))
                    }
                    className="flex-1 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
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
                  className="flex-1 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
              )}
              <Select
                value={rule.format.icon}
                onValueChange={(value) =>
                  handleFormatChange(index, "icon", value)
                }
              >
                <SelectTrigger className="w-[120px]">
                  <SelectValue>
                    <div className="flex items-center gap-2">
                      <Image
                        src={`/icons/${rule.format.icon}`}
                        alt={rule.format.icon}
                        width={20}
                        height={20}
                      />
                      <span className="text-xs truncate">{rule.format.icon.split('.')[0]}</span>
                    </div>
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {availableIcons.map((icon) => (
                    <SelectItem key={icon} value={icon}>
                      <div className="flex items-center gap-2">
                        <Image
                          src={`/icons/${icon}`}
                          alt={icon}
                          width={20}
                          height={20}
                        />
                        <span>{icon.split('.')[0]}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                variant="ghost"
                size="icon"
                className="text-destructive hover:text-destructive/90 hover:bg-destructive/10 shrink-0"
                onClick={() => handleRemoveCondition(index)}
              >
                <Trash2 className="h-4 w-4" />
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
