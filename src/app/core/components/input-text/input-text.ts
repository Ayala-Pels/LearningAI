import {
  Component, OnInit, OnChanges, AfterViewInit,
  input, output, viewChild, signal, SimpleChange, ElementRef
} from '@angular/core';
import { AbstractControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextControl } from '../../classes/input-text-control.class';

@Component({
  selector: 'app-input-text',
  imports: [ReactiveFormsModule, InputTextModule],
  templateUrl: './input-text.html',
  styleUrl: './input-text.css',
})
export class InputText implements OnInit, OnChanges, AfterViewInit {
  formGroup = input.required<FormGroup>();
  control = input.required<InputTextControl>();

  valueChange = output<string>();

  inputRef = viewChild<ElementRef>('inputText');

  showControl = signal(true);
  maxLength = signal(200);
  minLength = signal(1);

  get inputControl(): AbstractControl | null {
    return this.formGroup().get(this.control().key);
  }

  ngOnInit(): void {
    const ctrl = this.control();
    if (ctrl.maxLen) this.maxLength.set(ctrl.maxLen);
    if (ctrl.minLen) this.minLength.set(ctrl.minLen);
    this.setupDependencies();
  }

  ngAfterViewInit(): void {
    if (this.control().focus) {
      this.inputRef()?.nativeElement.focus();
    }
  }

  ngOnChanges(changes: { [key: string]: SimpleChange }): void {
    if (changes['control']) {
      const ctrl: InputTextControl = changes['control'].currentValue;
      if (ctrl.maxLen) this.maxLength.set(ctrl.maxLen);
      if (ctrl.minLen) this.minLength.set(ctrl.minLen);
      this.setupDependencies();
    }
  }

  onBlur(event: Event): void {
    this.valueChange.emit((event.target as HTMLInputElement).value);
  }

  private setupDependencies(): void {
    const ctrl = this.control();
    if (!ctrl.controlDependencies?.length) return;

    ctrl.controlDependencies.forEach(dep => {
      this.formGroup().controls[dep.dependence_control_name]?.valueChanges
        .subscribe(() => this.evaluateDependencies());
    });

    this.evaluateDependencies();
  }

  private evaluateDependencies(): void {
    const ctrl = this.control();
    if (!ctrl.controlDependencies?.length) return;

    const allMet = ctrl.controlDependencies.every(dep => {
      const value = this.formGroup().controls[dep.dependence_control_name]?.value;
      if (dep.is_display_dependence_control_value == null || value == null) return true;
      return value === dep.is_display_dependence_control_value;
    });

    this.showControl.set(allMet);
  }
}
