import { useContext, useEffect } from "react"
import { AuthContext } from "../AuthContext"


export default function Logout(){

    const authContext = useContext(AuthContext)

    if (!authContext){
        return null
    }

    const { signOut } = authContext

    useEffect(() => {
        signOut()
    }, [])

    return null
}