import { BaseControl } from './base-control.class';

export class InputTextControl extends BaseControl<string> {
  placeholder: string;
  icon: string;
  minLen: number;
  maxLen: number;

  constructor(options: Partial<InputTextControl> & { key: string }) {
    super(options);
    this.controlType = 'inputText';
    this.placeholder = options.placeholder || '';
    this.icon = options.icon || '';
    this.minLen = options.minLen || 1;
    this.maxLen = options.maxLen || 200;
  }
}
