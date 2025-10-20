import React, {createContext, useState, useContext, useCallback, useEffect, useRef} from "react";
import { Sala, RegistroSala} from '../types/apiTypes'
import { obterSalas, excluirSalaService } from "../servicos/servicoSalas";
import { iniciarLimpezaSala, marcarSalaComoSujaService } from "../servicos/servicoLimpezas";
import { showErrorToast } from "../utils/functions";
import { AuthContext } from "../AuthContext";

type LimpezaStatus = 'Todas' | 'Limpa' | 'Limpeza Pendente' | 'Em Limpeza' | 'Suja'
type SalaStatus = 'Todas' | 'Ativas' | 'Inativas'

interface SalasContextType {
    salas: Sala[],
    carregando: boolean,
    refreshing: boolean,
    filtroLimpezaStatus: LimpezaStatus,
    filtroSalaStatus: SalaStatus,
    searchSalaText: string,
    setFiltroLimpezaStatus: (status: LimpezaStatus) => void;
    setFiltroSalaStatus: (status: SalaStatus) => void;
    setFiltroSearchSalaText: (status: string) => void;
    carregarSalas: () => Promise<void>,
    iniciarLimpeza: (id: string) => Promise<void>,
    marcarSalaComoSuja: (id: string, observacao?: string) => Promise<void>,
    excluirSala: (id: string) => Promise<void>,
}

const SalasContext = createContext<SalasContextType | undefined>(undefined)

interface SalasProviderProps{
    children: React.ReactNode
}

export const SalasProvider = ({children}: SalasProviderProps) => {
    const authContext = useContext(AuthContext)

    if(!authContext){
        return null
    }

    const {user, userRole} = authContext;

    const [salas, setSalas] = useState<Sala[]>([])
    const [carregando, setCarregando] = useState(false)
    const [refreshing, setRefreshing] = useState(false)

    const [filtroLimpezaStatus, setFiltroLimpezaStatus] = useState<LimpezaStatus>('Todas')
    const [filtroSalaStatus, setFiltroSalaStatus] = useState<SalaStatus>('Todas')
    const [searchSalaText, setSearchSalaText] = useState('')

    const searchRef = useRef(searchSalaText);
    const isInitialMount = useRef(true);

    useEffect(() => {
        searchRef.current = searchSalaText;
    }, [searchSalaText]);


    const carregarSalas = useCallback(async (currentSearchText: string = searchRef.current) => {
        setRefreshing(true)
        
        // console.log(`Chamada API com: Filtro Limpeza=${filtroLimpezaStatus}, Filtro Sala=${filtroSalaStatus}, Busca=${currentSearchText}`)
        
        const salasResult = await obterSalas({
            statusLimpeza: filtroLimpezaStatus,
            statusSala: filtroSalaStatus,
            searchSalaText: currentSearchText
        })

        if(!salasResult.success){
            showErrorToast({errMessage: salasResult.errMessage})
            setRefreshing(false)
            return;
        }

        let dadosSalas = salasResult.data

        if(filtroSalaStatus === 'Todas' && userRole === 'user'){
            dadosSalas = dadosSalas.filter(sala => sala.ativa)
        }

        if(userRole === 'admin' && filtroSalaStatus === 'Todas'){
            dadosSalas.sort((a, b) => (a.ativa === b.ativa) ? 0 : a.ativa ? -1 : 1)
        }

        setSalas(dadosSalas)
        setRefreshing(false)

    }, [filtroLimpezaStatus, filtroSalaStatus, userRole]) 


    useEffect(() => {
        if(isInitialMount.current){
            carregarSalas();
            isInitialMount.current = false;
        }
    }, [])


    useEffect(() => {
        if (searchSalaText.length > 0) {
            return;
        }
        
        carregarSalas(); 

    }, [filtroLimpezaStatus, filtroSalaStatus, carregarSalas, searchSalaText]) 


    useEffect(() => {
        // console.log('Valor disparado no useEffect de Busca: ' + searchSalaText)
        
        if(searchSalaText === ''){
            carregarSalas(''); 
            return;
        }

        if (isInitialMount.current) return;
        
        const timeoutId = setTimeout(() => {
            // console.log('Debounce concluído. Chamando carregarSalas()')
            carregarSalas()
        }, 1000)

        return () => {
            clearTimeout(timeoutId)
        }
    }, [searchSalaText, carregarSalas]) 


    const iniciarLimpeza = async (id: string) => {
        const iniciarLimpezaSalaResult = await iniciarLimpezaSala(id);
        if(!iniciarLimpezaSalaResult.success){
            showErrorToast({errMessage: iniciarLimpezaSalaResult.errMessage})
            return;
        }
        await carregarSalas()
    }

    const marcarSalaComoSuja = async (id: string, observacoes?: string) => {
        const marcarSalaComoSujaServiceResult = await marcarSalaComoSujaService(id, observacoes)
        if(!marcarSalaComoSujaServiceResult.success){
            showErrorToast({errMessage: marcarSalaComoSujaServiceResult.errMessage})
            return;
        }
        await carregarSalas()

    }

    async function excluirSala(id: string){
        const excluirSalaServiceResult = await excluirSalaService(id);
        if(!excluirSalaServiceResult.success){
            showErrorToast({errMessage: excluirSalaServiceResult.errMessage})
        }
        await carregarSalas();
    }


    const values: SalasContextType = {
        salas,
        carregando,
        refreshing,
        filtroLimpezaStatus,
        filtroSalaStatus,
        searchSalaText,
        setFiltroLimpezaStatus,
        setFiltroSalaStatus,
        setFiltroSearchSalaText : setSearchSalaText,
        carregarSalas: () => carregarSalas(searchRef.current), 
        iniciarLimpeza,
        marcarSalaComoSuja,
        excluirSala,
    }

    return <SalasContext.Provider value={values}>{children}</SalasContext.Provider>
}

export const useSalas = () => {
    const context = useContext(SalasContext)
    if(context === undefined){
        throw new Error('useSalas must be used within a SalasProvider');
    }
    return context;
}
