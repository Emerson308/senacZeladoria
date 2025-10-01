
import Toast from 'react-native-toast-message'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

export default function CustomToast(){
    const insets = useSafeAreaInsets();

    const totalOffset = insets.bottom + 20;

    return(
        <Toast
            bottomOffset={totalOffset}
        />
    )
}




