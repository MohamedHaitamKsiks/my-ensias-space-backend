import { BelongsToGetAssociationMixin, BelongsToManyGetAssociationsMixin, DataTypes, HasManyAddAssociationMixin, HasManyGetAssociationsMixin, HasManyHasAssociationMixin, HasManyRemoveAssociationMixin, HasOneGetAssociationMixin, Model } from 'sequelize';
import { sequelize } from '../database/connection';
import { User, UserInterface } from './user.model';
import { Role } from './role/role.model';
import { Poste } from './forum/post.model';
import { Forum } from './forum/forum.mode';
import { Acces, Permission } from './forum/acces.model';
import { Club } from './club.model';

//interface
export interface EtudiantInterface {
    id: number,
    nom: string,
    prenom: string,
    cin: string,
    phone: string,
    user?: UserInterface
};

//create user class
export class Etudiant extends Model {
    //declar params
    declare id: number;
    declare nom: string;
    declare prenom: string;
    declare cin: string;
    declare phone: string;
    declare userId: number;

    async getEtudiantInterface(){
        const etudiantInterface: EtudiantInterface = {
            id: this.id,
            nom: this.nom,
            prenom: this.prenom,
            cin: this.cin,
            phone: this.phone,
            user: (await User.findByPk(this.userId))?.getUserInterface()
        };
        return etudiantInterface;
    }

    //postes
    declare addPoste: HasManyAddAssociationMixin<Poste, number>;
    declare getPoste: HasManyGetAssociationsMixin<Poste>;
    declare removePoste: HasManyRemoveAssociationMixin<Poste, number>;

    //get user
    declare getUser: BelongsToGetAssociationMixin<User>;

    //get clubs
    declare getClubs: BelongsToManyGetAssociationsMixin<Club>;

    //role
    declare getRoles: HasManyGetAssociationsMixin<Role>;
    declare hasRole: HasManyHasAssociationMixin<Role, number>;
    declare addRole: HasManyAddAssociationMixin<Role, number>;
    declare removeRole: HasManyRemoveAssociationMixin<Role, number>;

    //create forum
    async createForum(_sujet: string, _desciption: string) {
        //create forum
        const newForum = await Forum.create({
            sujet: _sujet
        });
        //add this etudiant as admin
        const adminAcces = await Acces.create({
            EtudiantId: this.id,
            permission: Permission.ADMIN
        });
        await newForum.addAcces(adminAcces);
        //add description poste
        await this.postInForum(newForum, _desciption);
        return newForum;
    }

    //close forum
    async closeForum(_forum: Forum) {
        //check if admin
        const acces = await _forum.getAccesOf(this);
        if (!acces || !acces.isAdmin()) {
            return false;
        }
        //close forum
        _forum.estFerme = true;
        await _forum.save();
        return true;
    }

    //post in forum
    async postInForum(_forum: Forum,_texte: string) {
        //check if closed
        if (_forum.estFerme) 
            return null;
        
        //check if can write
        const acces = await _forum.getAccesOf(this);
        if (!acces || !acces.canWrite()) 
            return null;

        //create poste
        const poste = await Poste.create({
            texte: _texte
        });
        
        //add poste
        await this.addPoste(poste);
        await _forum.addPoste(poste);
        await poste.reload();

        return poste;
    }

    //read forum
    async readForum(_forum: Forum) {
        //check if can read
        const acces = await _forum.getAccesOf(this);
        if (!acces || !acces.canRead()) {
            return null;
        }
        //add poste
        const postes = await _forum.getPostes();
        return postes;
    }

    //set access for user
    async setAccesToForum(_forum: Forum, _etudiant: Etudiant, _permission: Permission) {
        //check if admin
        const acces = await _forum.getAccesOf(this);
        if (!acces || !acces.isAdmin()) {
            return false;
        }
        //create if not existe
        let etudiantAcces: Acces|null = await _forum.getAccesOf(_etudiant);
        if (!etudiantAcces) {
            etudiantAcces = await Acces.create({
                EtudiantId: _etudiant.id,
                permission: _permission
            });
            await _forum.addAcces(etudiantAcces);
        }
        //destroy if none permission (no need to keep it)
        if (etudiantAcces.permission == Permission.NONE) {
            await etudiantAcces.destroy();
        }
        //acces set succes
        return true;
        
    }
    

    
}

//init model
Etudiant.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nom: {
        type: DataTypes.STRING,
    },
    prenom: {
        type: DataTypes.STRING
    },
    cin: {
        type: DataTypes.STRING
    },
    phone: {
        type: DataTypes.STRING
    }
},
//params
{
    sequelize,
    modelName: 'Etudiant'
});


