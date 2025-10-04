
import Toast, {ToastConfig, ErrorToast} from 'react-native-toast-message'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

const toastConfig: ToastConfig = {
    error : (props) => (
        <ErrorToast
            {...props}
            text1NumberOfLines={0}
            text2NumberOfLines={0}
            style={{height: 'auto', minHeight: 60, borderLeftColor: 'red'}}
        />
    )
}

export default function CustomToast(){
    const insets = useSafeAreaInsets();

    const totalOffset = insets.bottom + 20;

    return(
        <Toast
            bottomOffset={totalOffset}
            config={toastConfig}
        />
    )
}




