
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { ParamListBase } from '@react-navigation/native';
import type { DrawerNavigationProp } from '@react-navigation/drawer';
import { RegistroSala } from '../../types/apiTypes';


export type UserStackParamList = {
    Home: undefined;
    DetalhesSala: {id: string};
    UserTabs: undefined
    Perfil: undefined
    Logout: undefined;
    AlterarSenha: undefined;
    Notifications: undefined;
    LimpezasAndamento: undefined;
    ConcluirLimpeza: {registroSala: RegistroSala};
    // Logout: undefined
}

declare global {
    namespace ReactNavigation {
        interface RootParamList extends UserStackParamList {}
    }
}

export type TelaDetalhesSala = NativeStackScreenProps<UserStackParamList, 'DetalhesSala'>
export type TelaHome = NativeStackScreenProps<UserStackParamList, 'Home'>
export type TelaConcluirLimpeza = NativeStackScreenProps<UserStackParamList, 'ConcluirLimpeza'>



export type UserDrawerParamList = {
    Home: undefined;
    // Notifications: undefined;
    // Profile: { userId: string };
  };
  

  export type UserDrawerNavProps<T extends keyof UserDrawerParamList> = {
    navigation: DrawerNavigationProp<ParamListBase>;
    route: T;
  };



