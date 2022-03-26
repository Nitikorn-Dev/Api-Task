
export interface User {
    // id?: number;
    // name?: string;
    username: string;
    email: string;
    // role?: UserRole;
    // accessTypes: [
    //    ,
    //     'addTeams',
    //     'updateTeams',
    //     'deleteTeams'
    //   ]
    password: string;
    // icon?: string;
}

// export enum UserAccess {
//     DELETE_USER = 'getTeams';
//     UPDATE_ROLE = 'updateRole'
// }

export enum UserRole {
    ADMIN = 'admin',
    CHIEFEDITOR = 'chiefeditor',
    EDITOR = 'editor',
    USER = 'user'
}