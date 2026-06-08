import { CommonModule } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  inject,
} from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { CustomerService } from '../../../services/customer/customer';
import { Customer } from '../../../core/types/types';

@Component({
  selector: 'app-update-customer',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './update-customer.html',
  styleUrls: ['./update-customer.css'],
})
export class UpdateCustomer implements OnInit, OnDestroy {
  constructor(private customerService: CustomerService) {}

  @Input() customerId!: number;

  @Output() close = new EventEmitter<void>();
  @Output() customerUpdated = new EventEmitter<void>();

  private cdr = inject(ChangeDetectorRef);
  private fb = inject(FormBuilder);

  private resetTimeout?: ReturnType<typeof setTimeout>;

  private originalIsStarred = false;
  private originalIsArchived = false;

  loadingData = true;
  loadError = false;

  loading = false;
  buttonText = 'Salvar Alterações';
  buttonIcon = 'save';
  buttonState: 'default' | 'success' | 'error' = 'default';

  customerForm = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(150)]],
    cpf: [
      '',
      [
        Validators.required,
        Validators.pattern(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/),
        this.cpfValidator.bind(this),
      ],
    ],
    phone: ['', [Validators.required, Validators.pattern(/^\(\d{2}\)\s\d{5}-\d{4}$/)]],
    birthDate: ['', Validators.required],
    email: ['', [Validators.required, Validators.email, Validators.maxLength(150)]],
  });

  get name() {
    return this.customerForm.controls.name;
  }

  get cpf() {
    return this.customerForm.controls.cpf;
  }

  get phone() {
    return this.customerForm.controls.phone;
  }

  get birthDate() {
    return this.customerForm.controls.birthDate;
  }

  get email() {
    return this.customerForm.controls.email;
  }

  ngOnInit(): void {
    this.customerForm.disable();

    this.customerService.findById(this.customerId).subscribe({
      next: (customer) => {
        this.originalIsStarred = customer.isStarred;
        this.originalIsArchived = customer.isArchived;

        this.customerForm.patchValue({
          name: customer.name,
          cpf: customer.cpf,
          phone: customer.phone,
          email: customer.email,
          birthDate: this.formatDateForInput(customer.birthDate),
        });

        this.customerForm.enable();
        this.loadingData = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.loadError = true;
        this.loadingData = false;
        this.cdr.detectChanges();
      },
    });
  }

  private formatDateForInput(dateStr: string): string {
    if (!dateStr) return '';
    return dateStr.split('T')[0];
  }

  //------------------------------------------------

  closing = false;

  onClose(): void {
    this.closing = true;
    setTimeout(() => this.close.emit(), 180);
  }

  //------------------------------------------------

  formatCPF(event: Event): void {
    const input = event.target as HTMLInputElement;
    let value = input.value.replace(/\D/g, '');
    value = value.substring(0, 11);

    if (value.length <= 3) {
      value = value.replace(/^(\d{0,3})/, '$1');
    } else if (value.length <= 6) {
      value = value.replace(/^(\d{3})(\d{0,3})/, '$1.$2');
    } else if (value.length <= 9) {
      value = value.replace(/^(\d{3})(\d{3})(\d{0,3})/, '$1.$2.$3');
    } else {
      value = value.replace(/^(\d{3})(\d{3})(\d{3})(\d{0,2})/, '$1.$2.$3-$4');
    }

    this.cpf.setValue(value, { emitEvent: false });
    this.cpf.updateValueAndValidity({ emitEvent: false });
  }

  cpfValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;

    if (!value) return null;

    const numericCPF = value.replace(/\D/g, '');

    if (numericCPF.length < 11) return null;

    return this.validateCPF(numericCPF) ? null : { invalidCpf: true };
  }

  validateCPF(cpf: string): boolean {
    cpf = cpf.replace(/\D/g, '');

    if (cpf.length !== 11) return false;
    if (/^(\d)\1+$/.test(cpf)) return false;

    let sum = 0;
    for (let i = 0; i < 9; i++) {
      sum += Number(cpf.charAt(i)) * (10 - i);
    }

    let firstDigit = (sum * 10) % 11;
    if (firstDigit === 10) firstDigit = 0;
    if (firstDigit !== Number(cpf.charAt(9))) return false;

    sum = 0;
    for (let i = 0; i < 10; i++) {
      sum += Number(cpf.charAt(i)) * (11 - i);
    }

    let secondDigit = (sum * 10) % 11;
    if (secondDigit === 10) secondDigit = 0;
    if (secondDigit !== Number(cpf.charAt(10))) return false;

    return true;
  }

  formatPhone(event: Event): void {
    const input = event.target as HTMLInputElement;
    let value = input.value.replace(/\D/g, '');
    value = value.substring(0, 11);

    if (value.length === 0) {
      this.customerForm.patchValue({ phone: '' }, { emitEvent: false });
      return;
    }

    if (value.length <= 2) {
      value = value.replace(/^(\d{0,2})/, '($1');
    } else if (value.length <= 7) {
      value = value.replace(/^(\d{2})(\d{0,5})/, '($1) $2');
    } else {
      value = value.replace(/^(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3');
    }

    if (value === '(') value = '';

    this.customerForm.patchValue({ phone: value }, { emitEvent: false });
  }

  private setButtonState(state: 'default' | 'success' | 'error', text: string, icon: string): void {
    this.buttonState = state;
    this.buttonText = text;
    this.buttonIcon = icon;
  }

  private resetButton(): void {
    if (this.resetTimeout) clearTimeout(this.resetTimeout);

    this.resetTimeout = setTimeout(() => {
      this.buttonState = 'default';
      this.buttonText = 'Salvar Alterações';
      this.buttonIcon = 'save';
      this.loading = false;
      this.resetTimeout = undefined;
      this.cdr.detectChanges();
    }, 2000);
  }

  /* SUBMIT */
  onSubmit(): void {
    if (this.resetTimeout) {
      clearTimeout(this.resetTimeout);
      this.resetTimeout = undefined;
    }

    if (this.customerForm.invalid) {
      this.customerForm.markAllAsTouched();
      this.loading = false;
      this.setButtonState('error', 'Preencha os campos', 'error');
      this.resetButton();
      return;
    }

    this.loading = true;
    this.setButtonState('default', 'Salvando...', 'hourglass_top');

    const raw = this.customerForm.getRawValue();

    const payload: Customer = {
      name: raw.name ?? '',
      cpf: raw.cpf ?? '',
      phone: raw.phone ?? '',
      email: raw.email ?? '',
      birthDate: raw.birthDate ?? '',
      isStarred: this.originalIsStarred,
      isArchived: this.originalIsArchived,
    };

    this.customerService.update(this.customerId, payload).subscribe({
      next: () => {
        this.loading = false;
        this.setButtonState('success', 'Cliente atualizado', 'check_circle');
        this.resetButton();
        this.cdr.detectChanges();
        this.customerUpdated.emit();

        setTimeout(() => {
          this.onClose();
        }, 500);
      },

      error: (error) => {
        this.loading = false;
        const backendError = error.error;
        this.setButtonState('error', backendError.message ?? 'Erro ao salvar', 'error');
        this.resetButton();
        this.cdr.detectChanges();

        alert(backendError.error);
      },
    });
  }

  ngOnDestroy(): void {
    if (this.resetTimeout) clearTimeout(this.resetTimeout);
  }
}
