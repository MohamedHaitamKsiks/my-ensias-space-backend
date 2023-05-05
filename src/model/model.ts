import { Classe } from "./classe.model";
import { Etudiant } from "./etudiant.model";
import { Emploi } from "./emploi/emploi.model";
import { Delegue } from "./role/delegue.model";
import { Role } from "./role/role.model";
import { User } from "./user.model";


export function setupModelRelation() {
    //link to user
    Etudiant.belongsTo(User, { as: 'user' });

    //link students
    Classe.hasMany(Etudiant);

    //link roles to etudiants
    Etudiant.hasMany(Role);
    Role.belongsTo(Etudiant);

    //classe to delegue
    Classe.hasOne(Delegue);
    Delegue.belongsTo(Classe);

    //role to delegue
    Role.hasOne(Delegue);
    Delegue.belongsTo(Role);

    //emploi to classe
    Classe.hasMany(Emploi);
    Emploi.belongsTo(Classe);

}