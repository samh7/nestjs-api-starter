import { CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn, VersionColumn } from "typeorm";


@Entity()
export class BaseEntity {

    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @DeleteDateColumn()
    readonly deletedAt: Date;

    @VersionColumn()
    readonly version: number;

    @CreateDateColumn()
    readonly createdAt!: Date;

    @UpdateDateColumn()
    readonly updatedAt!: Date;

}
