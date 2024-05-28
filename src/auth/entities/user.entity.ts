import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

//Tener relacion con una tabla de la base de datos
@Entity('users')
export class User {

  @PrimaryGeneratedColumn('uuid')
  id: string;


  @Column('text', { unique: true })
  email: string;

  @Column('text')
  password: string;

  @Column('text')
  fullname: string;

  @Column('bool', { default: true })
  isActive: boolean;

  @Column('text', { array: true, default: ['user'] })
  roles: string[];
  
}
