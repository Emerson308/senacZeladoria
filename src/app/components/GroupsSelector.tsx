
import React, { useState, useEffect, useRef, useCallback } from "react"
import { Text, TouchableOpacity, View } from "react-native"
import { UserGroup } from "../types/apiTypes"


interface GroupsSelectorProps{
    usersGroups: UserGroup[],
    selectedGroupsProps: number[],
    setSelectedGroupsProps: (groups: number[]) => void
}

const DEBOUNCE_DELAY = 300

const GroupsSelector = ({usersGroups, selectedGroupsProps=[], setSelectedGroupsProps} : GroupsSelectorProps) => {

    const [selectedGroups, setSelectedGroups] = useState<number[]>([])

    const timeoutRef = useRef<NodeJS.Timeout | null>(null)

    useEffect(() => {
        setSelectedGroups(selectedGroupsProps)
    }, [selectedGroupsProps])


    const setSelectedGroupsFunction = (groups: number[]) => {
        setSelectedGroups(groups);

        setSelectedGroupsProps(groups);
    }


    
    return (
        <>
            <Text style={{ marginBottom: 5 }}>Selecione o(s) Grupo(s) (Opcional):</Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginBottom: 16 }} >
                {
                    usersGroups.map((group) => (
                        <TouchableOpacity 
                            key={group.id}
                            className={
                                !selectedGroups.includes(group.id) ?
                                ' border-2 border-gray-500 rounded-2xl py-1 px-2 mr-2 mb-2' :
                                ' border-2 border-sblue text-sblue bg-sblue/20 rounded-2xl py-1 px-2 mr-2 mb-2 '
                            }
                            onPress={() => {
                                if(selectedGroups.includes(group.id)){
                                    setSelectedGroupsFunction(selectedGroups.filter(id => id !== group.id))
                                } else{
                                    setSelectedGroupsFunction([...selectedGroups, group.id])
                                }
                            }}
                        >
                            <Text className=" text-sm" >{group.name}</Text>
                        </TouchableOpacity>
                    ))
                }
            </View>

        </>
    )
}

export default GroupsSelector
