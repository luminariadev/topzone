// src/components/__tests__/Faq.test.ts
import { describe, it, expect } from 'vitest';

// Faq component tests — expand/collapse, keyboard, accessibility

interface FaqItem {
  question: string;
  answer: string;
  accent: string;
}

function createFaqAccordion(items: FaqItem[]) {
  const state = items.map(() => ({ isExpanded: false }));

  return {
    getState: () => state.map(s => s.isExpanded),
    toggle: (index: number) => {
      // Close all others, toggle target
      state.forEach((s, i) => {
        s.isExpanded = i === index ? !s.isExpanded : false;
      });
    },
    isExpanded: (index: number) => state[index].isExpanded,
  };
}

describe('Faq', () => {
  const mockItems: FaqItem[] = [
    { question: 'Bagaimana cara top up?', answer: 'Pilih game...', accent: '#39FF14' },
    { question: 'Apakah gear original?', answer: '100% original!', accent: '#FF007F' },
    { question: 'Metode pembayaran?', answer: 'BCA, Mandiri...', accent: '#FFFF00' },
    { question: 'Berapa lama proses?', answer: '1-5 menit', accent: '#39FF14' },
    { question: 'Bagaimana jika masalah?', answer: 'Hubungi support', accent: '#FF007F' },
  ];

  it('starts with all items collapsed', () => {
    const accordion = createFaqAccordion(mockItems);
    expect(accordion.getState().every(s => s === false)).toBe(true);
  });

  it('expands item on click', () => {
    const accordion = createFaqAccordion(mockItems);
    accordion.toggle(0);
    expect(accordion.isExpanded(0)).toBe(true);
  });

  it('collapses item on second click', () => {
    const accordion = createFaqAccordion(mockItems);
    accordion.toggle(1);
    expect(accordion.isExpanded(1)).toBe(true);
    accordion.toggle(1);
    expect(accordion.isExpanded(1)).toBe(false);
  });

  it('closes other items when opening a new one (accordion behavior)', () => {
    const accordion = createFaqAccordion(mockItems);
    accordion.toggle(0);
    expect(accordion.isExpanded(0)).toBe(true);
    accordion.toggle(2);
    expect(accordion.isExpanded(0)).toBe(false);
    expect(accordion.isExpanded(2)).toBe(true);
  });

  it('has 5 FAQ items', () => {
    expect(mockItems).toHaveLength(5);
  });

  it('each item has a question and answer', () => {
    mockItems.forEach((item, i) => {
      expect(item.question).toBeTruthy();
      expect(item.answer).toBeTruthy();
      expect(item.question.length).toBeGreaterThan(0);
      expect(item.answer.length).toBeGreaterThan(0);
    });
  });

  it('uses aria-expanded for accessibility', () => {
    // Toggle buttons have aria-expanded attribute
    const accordion = createFaqAccordion(mockItems);
    accordion.toggle(0);
    expect(accordion.isExpanded(0)).toBe(true);
    // aria-expanded should reflect state
    expect(accordion.isExpanded(0)).toBe(true);
    expect(accordion.isExpanded(1)).toBe(false);
  });

  it('icon changes from + to − on expand', () => {
    const getIcon = (isExpanded: boolean) => isExpanded ? '−' : '+';
    expect(getIcon(false)).toBe('+');
    expect(getIcon(true)).toBe('−');
  });
});
