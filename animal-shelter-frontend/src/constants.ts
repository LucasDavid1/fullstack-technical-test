export const ANIMAL_TYPES = ['dog', 'cat'] as const;
export const ANIMAL_STATUSES = ['adopted', 'for_adoption'] as const;

export type AnimalType = typeof ANIMAL_TYPES[number];
export type AnimalStatus = typeof ANIMAL_STATUSES[number];

export type AdoptionStatus = 'completed' | 'in_process';

export const ADOPTION_STATUSES: { value: AdoptionStatus; label: string }[] = [
  { value: 'completed', label: 'Completed' },
  { value: 'in_process', label: 'In Process' },
];
