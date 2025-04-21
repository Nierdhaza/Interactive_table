'use client';

import { useRouter } from 'next/navigation';

import styles from './BackButton.module.css';
import { ButtonHTMLAttributes } from 'react';

export default function BackButton(buttonProps: ButtonHTMLAttributes<HTMLButtonElement>) {
  const router = useRouter();

  return (
    <button
      className={styles.backButton}
      onClick={(e) => {
        buttonProps.onClick?.(e);
        router.back();
      }}
      {...buttonProps}
    >
      ←
    </button>
  );
}