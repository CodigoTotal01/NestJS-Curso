import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

//Tener relacion con una tabla de la base de datos
@Entity('users')
export class User {

  @PrimaryGeneratedColumn('uuid')
  id: string;


  @Column()
  email: string;

  password: string;

  fullname: string;

  isActive: boolean;

  roles: string[];
  
}
