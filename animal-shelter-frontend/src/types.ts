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
    animal: Animal;
    adopter: Adopter;
    volunteer: Volunteer;
    adoption_date: string;
    status: string;
}
