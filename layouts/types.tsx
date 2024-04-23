import type { NativeStackScreenProps } from "@react-navigation/native-stack";

  
export type RootStackParamList = {
    "Operation": undefined;
    "Settings": undefined;
};

export type PINScreenProps = NativeStackScreenProps<
    RootStackParamList,
    "Operation"
>;
