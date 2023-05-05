import {  DataTypes, HasManyAddAssociationMixin, HasManyGetAssociationsMixin, HasManyHasAssociationMixin, HasOneGetAssociationMixin, Model } from 'sequelize';
import { sequelize } from '../database/connection';
import { Etudiant } from './etudiant.model';
import { Delegue } from './role/delegue.model';


//create user class
export class Classe extends Model {
    declare id: number;
    declare nom: string;

    //get etudiants
    declare getEtudiants: HasManyGetAssociationsMixin<Etudiant>;
    //add etudiant
    declare addEtudiant: HasManyAddAssociationMixin<Etudiant, number>;
    //has etudiant
    declare hasEtudiant: HasManyHasAssociationMixin<Etudiant, number>;

    //get delegue
    declare getDelegue: HasOneGetAssociationMixin<Delegue>;

    //get etudiant delegue
    async getEtudiantDelegue() {
        const delegue = await this.getDelegue();
        const role = await delegue.getRole();
        const etudiant = await role.getEtudiant();
        return etudiant;
    };
}

//init model
Classe.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    nom: {
        type: DataTypes.STRING,
        allowNull: false
    },
},
//params
{
    sequelize,
    modelName: 'Classe'
});

