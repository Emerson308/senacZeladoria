
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

export type RootStackParamList = {
    Home: undefined;
    DetalhesSala: {id: number};
    // Logout: undefined
}

declare global {
    namespace ReactNavigation {
        interface RootParamList extends RootStackParamList {}
    }
}

export type TelaDetalhesSala = NativeStackScreenProps<RootStackParamList, 'DetalhesSala'>
export type TelaHome = NativeStackScreenProps<RootStackParamList, 'Home'>

