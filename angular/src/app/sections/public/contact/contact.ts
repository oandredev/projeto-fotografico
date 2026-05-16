import { CommonModule } from '@angular/common';
import { Component, OnDestroy, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MessageService } from '../../../services/message/message';
import { Message } from '../../../core/types/types';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './contact.html',
  styleUrls: ['./contact.css'],
})
export class Contact implements OnDestroy {
  constructor(private messageService: MessageService) {}

  private cdr = inject(ChangeDetectorRef);
  private fb = inject(FormBuilder);
  private resetTimeout?: ReturnType<typeof setTimeout>;

  loading = false;
  buttonText = 'Enviar Mensagem';
  buttonIcon = 'send';
  buttonState: 'default' | 'success' | 'error' = 'default';

  contactForm = this.fb.group({
    name: ['', Validators.required],
    phone: ['', [Validators.required, Validators.pattern(/^\(\d{2}\)\s\d{5}-\d{4}$/)]],
    email: ['', [Validators.required, Validators.email]],
    subject: ['', [Validators.required, Validators.maxLength(150)]],
    message: ['', [Validators.required, Validators.maxLength(500)]],
  });

  /* GETTERS */

  get name() {
    return this.contactForm.controls.name;
  }

  get email() {
    return this.contactForm.controls.email;
  }

  get phone() {
    return this.contactForm.controls.phone;
  }

  get subject() {
    return this.contactForm.controls.subject;
  }

  get message() {
    return this.contactForm.controls.message;
  }

  /* PHONE FORMAT */

  formatPhone(event: Event): void {
    const input = event.target as HTMLInputElement;

    let value = input.value.replace(/\D/g, '');

    value = value.substring(0, 11);

    if (value.length <= 2) {
      value = value.replace(/^(\d{0,2})/, '($1');
    } else if (value.length <= 7) {
      value = value.replace(/^(\d{2})(\d{0,5})/, '($1) $2');
    } else {
      value = value.replace(/^(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3');
    }

    this.contactForm.patchValue(
      {
        phone: value,
      },
      {
        emitEvent: false,
      },
    );
  }

  /* BUTTON STATE */

  private setButtonState(state: 'default' | 'success' | 'error', text: string, icon: string): void {
    this.buttonState = state;
    this.buttonText = text;
    this.buttonIcon = icon;
  }
  private resetButton(): void {
    if (this.resetTimeout) {
      clearTimeout(this.resetTimeout);
    }

    this.resetTimeout = setTimeout(() => {
      this.buttonState = 'default';
      this.buttonText = 'Enviar Mensagem';
      this.buttonIcon = 'send';
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

    if (this.contactForm.invalid) {
      this.contactForm.markAllAsTouched();
      this.loading = false;
      this.setButtonState('error', 'Preencha os campos', 'error');
      this.resetButton();
      return;
    }

    this.loading = true;
    this.setButtonState('default', 'Enviando...', 'hourglass_top');

    const raw = this.contactForm.getRawValue();

    const payload: Message = {
      name: raw.name ?? '',
      phone: raw.phone ?? '',
      email: raw.email ?? '',
      subject: raw.subject ?? '',
      body: raw.message ?? '',
      isStarred: false,
      isArchived: false,
    };

    this.messageService.save(payload).subscribe({
      next: () => {
        this.contactForm.reset();
        this.loading = false;
        this.setButtonState('success', 'Mensagem enviada', 'check_circle');
        this.resetButton();
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error(error);
        this.loading = false;
        this.setButtonState('error', 'Erro ao enviar', 'error');
        this.resetButton();
        this.cdr.detectChanges();
      },
    });
  }

  ngOnDestroy(): void {
    if (this.resetTimeout) {
      clearTimeout(this.resetTimeout);
    }
  }
}
