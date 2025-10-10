
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { ParamListBase } from '@react-navigation/native';
import type { DrawerNavigationProp } from '@react-navigation/drawer';
import { RegistroSala, Sala } from '../../types/apiTypes';


export type AdminStackParamList = {
    Home: undefined;
    DetalhesSala: {id: string};
    Usuarios: undefined;
    RegistrosLimpeza: undefined;
    AdminTabs: undefined;
    Perfil: undefined;
    AlterarSenha: undefined;
    FormSala: {sala?: Sala};
    Notifications: undefined;
    LimpezasAndamento: undefined;
    ConcluirLimpeza: {registroSala: RegistroSala};
    // Logout: undefined
}

declare global {
    namespace ReactNavigation {
        interface RootParamList extends AdminStackParamList {}
    }
}

export type TelaHome = NativeStackScreenProps<AdminStackParamList, 'Home'>
export type TelaDetalhesSala = NativeStackScreenProps<AdminStackParamList, 'DetalhesSala'>
export type TelaEditarSala = NativeStackScreenProps<AdminStackParamList, 'FormSala'>
export type TelaConcluirLimpeza = NativeStackScreenProps<AdminStackParamList, 'ConcluirLimpeza'>



// export type UserDrawerParamList = {
//     Home: undefined;
//     // Notifications: undefined;
//     // Profile: { userId: string };
//   };
  

//   export type UserDrawerNavProps<T extends keyof UserDrawerParamList> = {
//     navigation: DrawerNavigationProp<ParamListBase>;
//     route: T;
//   };



