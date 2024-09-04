import { AnimalType, AnimalStatus } from './constants';


export interface Animal {
    id: number;
    name: string;
    age: number;
    breed: string;
    animal_type: AnimalType;
    status: AnimalStatus;
}

export interface Volunteer {
    id: number;
    username: string;
    email: string;
    status: string;
}

export interface Adopter {
    id: number;
    username: string;
    email: string;
    status: string;
}

export interface Adoption {
    id: number;
    animal: Animal; // Now an Animal object
    adopter: Adopter; // Now an Adopter object
    volunteer: Volunteer; // Now a Volunteer object
    adoption_date: string;
    status: string;
  }
