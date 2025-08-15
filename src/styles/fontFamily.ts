import { DefaultTheme } from "@react-navigation/native";
import defaultTheme from "tailwindcss/defaultTheme"

export const fontFamily = {
    regular: ['Roboto', ...defaultTheme.fontFamily.sans],
    bold: "Roboto_700Bold",
    medium: "Roboto_500Medium",
    arial:['Arial', ...defaultTheme.fontFamily.sans]
}

