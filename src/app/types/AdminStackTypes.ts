
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { ParamListBase } from '@react-navigation/native';
import type { DrawerNavigationProp } from '@react-navigation/drawer';


export type AdminStackParamList = {
    Home: undefined;
    DetalhesSala: {id: number};
    // Logout: undefined
}

declare global {
    namespace ReactNavigation {
        interface RootParamList extends AdminStackParamList {}
    }
}

export type TelaHome = NativeStackScreenProps<AdminStackParamList, 'Home'>
export type TelaDetalhesSala = NativeStackScreenProps<AdminStackParamList, 'DetalhesSala'>



export type UserDrawerParamList = {
    Home: undefined;
    // Notifications: undefined;
    // Profile: { userId: string };
  };
  

  export type UserDrawerNavProps<T extends keyof UserDrawerParamList> = {
    navigation: DrawerNavigationProp<ParamListBase>;
    route: T;
  };



