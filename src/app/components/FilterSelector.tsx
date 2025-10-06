import { View, Text } from "react-native";
import { TouchableRipple } from "react-native-paper";
import {Ionicons} from '@expo/vector-icons'

interface FilterButton<T>{
    label: string,
    value: T,
}

type condicionalTypeFilterProps<T extends string = string> = {
    type: 'single',
    value: T,
    onValueChange: (value: T) => void,
    defaultValue: T,
    buttons: FilterButton<T>[]
} | {
    type: 'multiple',
    value: T[],
    defaultValue: T[],
    onValueChange: (value: T[]) => void,
    buttons: FilterButton<T>[]
}

type FilterSelectorProps<T extends string = string> = {
    label: string,
} & condicionalTypeFilterProps<T>


export default function FilterSelector<T extends string = string>(props: FilterSelectorProps<T>) {
    const { label, buttons, type = 'single' } = props;

    if (type === 'multiple') {
        const { value, onValueChange, defaultValue } = props as Extract<FilterSelectorProps<T>, { type: 'multiple' }>;

        return (
            <View key={label} className=" gap-2 my-2">
                <Text className="font-bold">{label}</Text>
                <View className="flex-row gap-2 flex-wrap">
                    {buttons.map((button) => {
                        const selected = value.includes(button.value);
                        return (
                            <TouchableRipple
                                key={button.value}
                                onPress={() => {
                                    if (selected) {
                                        onValueChange(value.filter(v => v !== button.value));
                                    } else {
                                        onValueChange([...value, button.value]);
                                    }
                                }}
                                borderless={true}
                                className={
                                    selected
                                        ? "flex-row bg-sgray/30 items-center border rounded-full p-1 px-3"
                                        : "flex-row items-center border border-gray-300 rounded-full p-1 px-3"
                                }
                            >
                                <View className=" flex-row items-center gap-1">
                                    <Text className=" text-sm">{button.label}</Text>
                                    {selected &&
                                        <Ionicons name="close-outline" size={16} color="black" />
                                    }
                                </View>
                            </TouchableRipple>
                        );
                    })}
                </View>
            </View>
        );
    }

    if (type === 'single') {
        const { value, onValueChange, defaultValue } = props as Extract<FilterSelectorProps<T>, { type: 'single' }>;

        const toggleValue = (val: T) => {
            if (val === value) {
                onValueChange(defaultValue);
            } else {
                onValueChange(val);
            }
        };

        return (
            <View key={label} className=" gap-2 my-2">
                <Text className="font-bold">{label}</Text>
                <View className="flex-row gap-2 flex-wrap">
                    {buttons.map((button) => (
                        <TouchableRipple
                            key={button.value}
                            onPress={() => toggleValue(button.value)}
                            borderless={true}
                            className={
                                button.value === value
                                    ? "flex-row bg-sgray/30 items-center border rounded-full p-1 px-3"
                                    :
                                    "flex-row items-center border border-gray-300 rounded-full p-1 px-3"}
                        >
                            <View className=" flex-row items-center gap-1">
                                <Text className=" text-sm">{button.label}</Text>
                                {button.value === value &&
                                    <Ionicons name="close-outline" size={16} color="black" />
                                }
                            </View>
                        </TouchableRipple>
                    ))}
                </View>
            </View>
        );
    }

    return null;
}