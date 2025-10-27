
import React, {createContext, useState, useContext, useCallback, useEffect, useRef, useMemo} from "react";
import { Sala, RegistroSala, Notification} from '../types/apiTypes'
import { obterSalas, excluirSalaService } from "../servicos/servicoSalas";
import { iniciarLimpezaSala, marcarSalaComoSujaService } from "../servicos/servicoLimpezas";
import { showErrorToast } from "../utils/functions";
import { listarNotificacoes, lerNotificacao, lerTodasAsNotificacoes } from "../servicos/servicoNotificacoes";
import { useAuthContext } from "./AuthContext";


interface NotificationsContextType{
    notifications: Notification[]
    contagemNotificacoesNaoLidas: number,
    refreshing: boolean,
    carregarNotificacoes: (refreshing?: boolean) => Promise<void>,
    readAllNotifications: () => Promise<void>,
    readNotification: (NotificationId: number) => Promise<void>
}

const NotificationsContext = createContext<NotificationsContextType | undefined>(undefined)

interface NotificationsProviderProps{
    children: React.ReactNode
}

export const NotificationsProvider = ({children}: NotificationsProviderProps) => {

    const {user} = useAuthContext()
    const [notifications, setNotifications] = useState<Notification[]>([])
    const [refreshing, setRefreshing] = useState(false)

    const contagemNotificacoesNaoLidas = useMemo(() => notifications.filter(item => item.lida === false).length, [notifications])

    const carregarNotificacoes = useCallback(async (refreshing?:boolean) => {
        if(!user?.groups.includes(1)){
            setNotifications([])
            return
        }

        if(refreshing === true){
            setRefreshing(true)
        }
        const listarNotificacoesResult = await listarNotificacoes()
        if(!listarNotificacoesResult.success){
            showErrorToast({errMessage: listarNotificacoesResult.errMessage})
            return;
        }
        setNotifications(listarNotificacoesResult.data)
        
        if(refreshing === true){
            setRefreshing(false)
        }

    }, [user])

    const readAllNotifications = useCallback(async () => {
        const lerTodasAsNotificacoesResult = await lerTodasAsNotificacoes()
        if(!lerTodasAsNotificacoesResult.success){
            showErrorToast({errMessage: lerTodasAsNotificacoesResult.errMessage})
            return
        }
        
        await carregarNotificacoes()
    },[carregarNotificacoes])

    const readNotification = useCallback(async (id: number) => {
        const lerNotificacaoResult = await lerNotificacao(id)
        if(!lerNotificacaoResult.success){
            showErrorToast({errMessage: lerNotificacaoResult.errMessage})
            return
        }

        await carregarNotificacoes()
    }, [carregarNotificacoes])

    useEffect(() => {
        carregarNotificacoes()

        const intervalId = setInterval(() => carregarNotificacoes(), 60000);

        return () => clearInterval(intervalId);
    }, [carregarNotificacoes])

    const values : NotificationsContextType = {
        notifications,
        contagemNotificacoesNaoLidas,
        refreshing,
        carregarNotificacoes,
        readAllNotifications,
        readNotification
    }

    return <NotificationsContext.Provider value={values}>{children}</NotificationsContext.Provider>
}

export const useNotifications = () => {
    const context = useContext(NotificationsContext)
    if(context === undefined){
        throw new Error('useNotifications must be used within a NotificationsProvider');
    }

    return context
}


