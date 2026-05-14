export interface ControlDependency {
  dependence_control_name: string;
  is_display_dependence_control_value: string;
  is_display_compare_operator: number;
}

export class BaseControl<T> {
  key: string;
  label: string;
  value: T | null;
  required: boolean;
  disabled: boolean;
  helpText: string;
  focus: boolean;
  controlType: string;
  order: number;
  controlDependencies: ControlDependency[];

  constructor(options: Partial<BaseControl<T>> & { key: string }) {
    this.key = options.key;
    this.label = options.label || '';
    this.value = options.value ?? null;
    this.required = options.required || false;
    this.disabled = options.disabled || false;
    this.helpText = options.helpText || '';
    this.focus = options.focus || false;
    this.controlType = options.controlType || '';
    this.order = options.order || 0;
    this.controlDependencies = options.controlDependencies || [];
  }
}
