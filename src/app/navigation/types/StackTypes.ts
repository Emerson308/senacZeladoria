
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { ParamListBase } from '@react-navigation/native';
import type { DrawerNavigationProp } from '@react-navigation/drawer';
import { RegistroSala, Sala, Usuario } from '../../types/apiTypes';


export type UserStackParamList = {
    Home: undefined
    DetalhesSala: {id: string};
    Tabs: undefined
    Perfil: undefined
    AlterarSenha: undefined;
    Notifications: undefined;
    LimpezasAndamento: undefined;
    Limpeza: {type: 'Concluir' | 'Observar', registroSala: RegistroSala};
    QrCodeScanner: undefined;
    Registros: {sala?: Sala, zelador?: Usuario}
    
}

type AdminScreens = {
    Usuarios: undefined;
    EstatisticasLimpeza: undefined,
    EstatisticaCardList: {type: 'LimpezasEmAndamento' | 'LimpezasZeladores' | 'LimpezasSalas'}
    FormSala: {sala?: Sala};
    
}

export type AdminStackParamList = UserStackParamList & AdminScreens

declare global {
    namespace ReactNavigation {
        interface RootParamList extends UserStackParamList {}
    }
}

declare global {
    namespace ReactNavigation {
        interface RootParamList extends AdminStackParamList {}
    }
}


export type TelaDetalhesSala = NativeStackScreenProps<AdminStackParamList, 'DetalhesSala'>
export type TelaEditarSala = NativeStackScreenProps<AdminStackParamList, 'FormSala'>
export type TelaLimpeza = NativeStackScreenProps<AdminStackParamList, 'Limpeza'>
export type TelaEstatisticaCardList = NativeStackScreenProps<AdminStackParamList, 'EstatisticaCardList'>
export type TelaRegistros = NativeStackScreenProps<AdminStackParamList, 'Registros'>





