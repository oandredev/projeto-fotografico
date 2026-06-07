import {
  trigger,
  transition,
  style,
  animate,
  query,
  stagger,
  AnimationTriggerMetadata,
} from '@angular/animations';

/* =========================
   FADE
========================= */
export const fadeAnimation = trigger('fade', [
  transition(':enter', [style({ opacity: 0 }), animate('200ms ease-out', style({ opacity: 1 }))]),
  transition(':leave', [animate('150ms ease-in', style({ opacity: 0 }))]),
]);

/* =========================
   FADE + SLIDE
========================= */
export const fadeSlideAnimation = trigger('fadeSlide', [
  transition(':enter', [
    style({
      opacity: 0,
      transform: 'translateY(12px)',
    }),
    animate(
      '250ms cubic-bezier(0.22, 1, 0.36, 1)',
      style({
        opacity: 1,
        transform: 'translateY(0)',
      }),
    ),
  ]),
]);

/* =========================
   FLOAT UP
========================= */
export const floatUpAnimation = trigger('floatUp', [
  transition(
    ':enter',
    [
      style({
        transform: 'translateY(25px)',
        opacity: 0,
      }),
      animate(
        '{{ duration }} {{ delay }} cubic-bezier(0.2, 0.8, 0.2, 1)',
        style({
          transform: 'translateY(0)',
          opacity: 1,
        }),
      ),
    ],
    {
      params: {
        duration: '300ms',
        delay: '0ms',
      },
    },
  ),
]);

/* =========================
   STAGGER LIST
========================= */
export const staggerListAnimation = trigger('staggerList', [
  transition(':enter', [
    query(
      ':enter',
      [
        style({
          opacity: 0,
          transform: 'translateY(10px)',
        }),
        stagger(60, [
          animate(
            '250ms ease-out',
            style({
              opacity: 1,
              transform: 'translateY(0)',
            }),
          ),
        ]),
      ],
      { optional: true },
    ),
  ]),
]);

/* =========================
   BUNDLE EXPORT
========================= */
export const APP_ANIMATIONS = [
  fadeAnimation,
  fadeSlideAnimation,
  floatUpAnimation,
  staggerListAnimation,
];
