import { AnimalSpecies } from '../enums/animal-species';
import { AnimalGender } from '../enums/animal-gender';

export interface AnimalProps {
  id?: string;
  tutorId: string;
  name: string;
  species: AnimalSpecies;
  breed?: string | null;
  gender: AnimalGender;
  birthDate?: Date | null;
  weight?: number | null;
  color?: string | null;
  microchipNumber?: string | null;
  photoUrl?: string | null;
  allergies?: string | null;
  notes?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
}

export class Animal {
  public readonly id?: string;
  public tutorId: string;
  public name: string;
  public species: AnimalSpecies;
  public breed?: string | null;
  public gender: AnimalGender;
  public birthDate?: Date | null;
  public weight?: number | null;
  public color?: string | null;
  public microchipNumber?: string | null;
  public photoUrl?: string | null;
  public allergies?: string | null;
  public notes?: string | null;
  public readonly createdAt?: Date;
  public readonly updatedAt?: Date;
  public readonly deletedAt?: Date | null;

  constructor(props: AnimalProps) {
    this.id = props.id;
    this.tutorId = props.tutorId;
    this.name = props.name;
    this.species = props.species;
    this.breed = props.breed;
    this.gender = props.gender;
    this.birthDate = props.birthDate;
    this.weight = props.weight;
    this.color = props.color;
    this.microchipNumber = props.microchipNumber;
    this.photoUrl = props.photoUrl;
    this.allergies = props.allergies;
    this.notes = props.notes;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
    this.deletedAt = props.deletedAt;
  }
}
