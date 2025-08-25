import type { ParamListBase } from '@react-navigation/native';
import type { DrawerNavigationProp } from '@react-navigation/drawer';


export type DrawerParamList = {
    Home: undefined;
    Notifications: undefined;
    Profile: { userId: string };
  };
  

  export type DrawerNavProps<T extends keyof DrawerParamList> = {
    navigation: DrawerNavigationProp<ParamListBase>;
    route: T;
  };