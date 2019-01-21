import {BaseEntity,Column,Entity,Index,JoinColumn,JoinTable,ManyToMany,ManyToOne,OneToMany,OneToOne,PrimaryColumn,PrimaryGeneratedColumn,RelationId} from "typeorm";
import * as crypto from 'crypto'

@Entity("user",{schema:"mynest"})
export class user {

    @Column("varchar",{ 
        nullable:true,
        length:255,
        name:"aboutme"
        })
    aboutme:string | null;
        

    @Column("datetime",{ 
        nullable:false,
        default: () => "CURRENT_TIMESTAMP",
        name:"createAt"
        })
    createAt:Date;
        

    @Column("varchar",{ 
        nullable:true,
        length:255,
        name:"email"
        })
    email:string | null;
        

    @PrimaryGeneratedColumn({
        type:"int", 
        name:"id"
        })
    id:number;
        

    @Column("varchar",{ 
        nullable:false,
        length:255,
        name:"nackname"
        })
    nackname:string;
        

    @Column("varchar",{ 
        nullable:false,
        length:255,
        name:"password"
        })
    password:string;
        

    @Column("varchar",{ 
        nullable:true,
        length:255,
        name:"phone"
        })
    phone:string | null;
        

    @Column("varchar",{ 
        nullable:true,
        length:255,
        name:"sex"
        })
    sex:string | null;
        

    @Column("datetime",{ 
        nullable:false,
        default: () => "CURRENT_TIMESTAMP",
        name:"updateAt"
        })
    updateAt:Date;

    verifyPassword(pass: string) {
        let h = crypto.createHmac('sha256', pass).digest('hex')
        return this.password === h
    }
        
    static setPassword(password: string) {
        if (password) {
            return crypto.createHmac('sha256', password).digest('hex')
        } else {
            return undefined
        }
    }
}
