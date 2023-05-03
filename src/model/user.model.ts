import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../database/connection';
import crypto from 'crypto';

//sha256 hash
function sha256(_input: string) {
    return crypto.createHash('sha256').update(_input).digest('hex');
}

//auth state
export enum AuthState {
    VALID,
    USER_NOT_FOUND,
    PASSWORD_INCORRECT
};

//auth response
export interface AuthResponse {
    state: AuthState,
    user?: User,
};

//user type
export enum UserType {
    ETUDIANT,
    ADMIN
};

//user interface
export interface UserInterface {
    id: number;
    email: string;
    type: UserType;
    typeName: string;
}

//create user class
export class User extends Model {
    //user id
    declare id: number;
    //user email
    declare email: string;
    //user type
    declare type: UserType;
    //user passowrd
    declare password: string;

    //get public info
    getUserInterface() {
        let iuser: UserInterface = {
            id: this.id,
            email: this.email,
            type: this.type,
            typeName: this.getTypeName()
        };
        return iuser;
    }


    //get type string
    getTypeName() {
        let typeNames: string[] = [
            'etudiant',
            'adminisrateur'
        ];
        return typeNames[this.type];
    }

    //check password for user
    checkPassowrd(_password: string) {
        return this.password == sha256(_password);
    }

    //change the passowrd
    setPassword(_password: string) {
        this.password = _password;
        this.save();
    }

    //authentificate user
    static async authentificate(_email: string, _password: string) {
        //auth info
        let auth: AuthResponse = {
            state: AuthState.VALID
        };
        
        //find user by _email
        let user = await User.findOne({
            where: {
                email: _email
            }
        });
        
        //verify user
        if (!user) {
            auth.state = AuthState.USER_NOT_FOUND;
            return auth;
        }

        //if user exists verify password
        if (!user.checkPassowrd(_password)) {
            auth.state = AuthState.PASSWORD_INCORRECT;
            return auth;
        }

        auth.user = user;
        return auth;
    
    }
}

//init model
User.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    //email
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    //passowrd
    password: {
        type: DataTypes.STRING,
        allowNull: false,
        set(_password: string) {
            this.setDataValue('password', sha256(_password));
        }
    },
    //user type
    type: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: UserType.ETUDIANT,
    }
}, 
//params
{
    sequelize,
    modelName: 'User'
});