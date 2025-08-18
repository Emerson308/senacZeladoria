import React, { useContext, useState } from "react";
import { View, ScrollView, TouchableOpacity } from 'react-native';
import { Card, Button, Text } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { AuthContext } from "../AuthContext";
import SalaCard from "../components/SalaCard";
import { Sala } from "../types/types";
// import '../styles/global.css'; // Certifique-se de que o NativeWind está configurado

export default function UserDashboardScreen() {
    const authContext = useContext(AuthContext);

    if (!authContext) {
        return null;
    }

    const navigation = useNavigation();
    const teste : Sala = { id: 1, nome_numero: 'Sala de TI', capacidade: 30, descricao: 'Sala de reuniões da equipe de TI.', localizacao: "Bloco A", status_limpeza: "Limpeza Pendente", ultima_limpeza_data_hora: "2025-07-09T12:00:00Z", ultima_limpeza_funcionario: null}

    const salas: Sala[] = [
        { id: 1, nome_numero: 'Sala de TI', capacidade: 30, descricao: 'Sala de reuniões da equipe de TI.', localizacao: "Bloco A", status_limpeza: "Limpeza Pendente", ultima_limpeza_data_hora: null, ultima_limpeza_funcionario: null},
        { id: 2, nome_numero: 'Sala de Reunião Principal', capacidade: 30, descricao: 'Sala para grandes apresentações e reuniões.', localizacao: "Bloco A", status_limpeza: "Limpeza Pendente", ultima_limpeza_data_hora: null, ultima_limpeza_funcionario: null},
        { id: 3, nome_numero: 'Sala de Design', capacidade: 30, descricao: 'Equipada com computadores e tablets de última geração.', localizacao: "Bloco A", status_limpeza: "Limpeza Pendente", ultima_limpeza_data_hora: null, ultima_limpeza_funcionario: null},
        { id: 4, nome_numero: 'Sala de Design', capacidade: 30, descricao: 'Equipada com computadores e tablets de última geração.', localizacao: "Bloco A", status_limpeza: "Limpeza Pendente", ultima_limpeza_data_hora: null, ultima_limpeza_funcionario: null},
        { id: 5, nome_numero: 'Sala de Design', capacidade: 30, descricao: 'Equipada com computadores e tablets de última geração.', localizacao: "Bloco A", status_limpeza: "Limpeza Pendente", ultima_limpeza_data_hora: null, ultima_limpeza_funcionario: null},
        { id: 6, nome_numero: 'Sala de Design', capacidade: 30, descricao: 'Equipada com computadores e tablets de última geração.', localizacao: "Bloco A", status_limpeza: "Limpeza Pendente", ultima_limpeza_data_hora: null, ultima_limpeza_funcionario: null},
        { id: 7, nome_numero: 'Sala de Design', capacidade: 30, descricao: 'Equipada com computadores e tablets de última geração.', localizacao: "Bloco A", status_limpeza: "Limpeza Pendente", ultima_limpeza_data_hora: null, ultima_limpeza_funcionario: null},
        { id: 8, nome_numero: 'Sala de Design', capacidade: 30, descricao: 'Equipada com computadores e tablets de última geração.', localizacao: "Bloco A", status_limpeza: "Limpeza Pendente", ultima_limpeza_data_hora: null, ultima_limpeza_funcionario: null},
        { id: 9, nome_numero: 'Sala de Design', capacidade: 30, descricao: 'Equipada com computadores e tablets de última geração.', localizacao: "Bloco A", status_limpeza: "Limpeza Pendente", ultima_limpeza_data_hora: null, ultima_limpeza_funcionario: null},
        { id: 10, nome_numero: 'Sala de Design', capacidade: 30, descricao: 'Equipada com computadores e tablets de última geração.', localizacao: "Bloco A", status_limpeza: "Limpeza Pendente", ultima_limpeza_data_hora: null, ultima_limpeza_funcionario: null},
        { id: 11, nome_numero: 'Sala de Design', capacidade: 30, descricao: 'Equipada com computadores e tablets de última geração.', localizacao: "Bloco A", status_limpeza: "Limpeza Pendente", ultima_limpeza_data_hora: null, ultima_limpeza_funcionario: null},
        { id: 12, nome_numero: 'Sala de Design', capacidade: 30, descricao: 'Equipada com computadores e tablets de última geração.', localizacao: "Bloco A", status_limpeza: "Limpeza Pendente", ultima_limpeza_data_hora: null, ultima_limpeza_funcionario: null},
        { id: 13, nome_numero: 'Sala de Design', capacidade: 30, descricao: 'Equipada com computadores e tablets de última geração.', localizacao: "Bloco A", status_limpeza: "Limpeza Pendente", ultima_limpeza_data_hora: null, ultima_limpeza_funcionario: null},
        { id: 14, nome_numero: 'Sala de Design', capacidade: 30, descricao: 'Equipada com computadores e tablets de última geração.', localizacao: "Bloco A", status_limpeza: "Limpeza Pendente", ultima_limpeza_data_hora: null, ultima_limpeza_funcionario: null},
        { id: 15, nome_numero: 'Sala de Design', capacidade: 30, descricao: 'Equipada com computadores e tablets de última geração.', localizacao: "Bloco A", status_limpeza: "Limpeza Pendente", ultima_limpeza_data_hora: null, ultima_limpeza_funcionario: null},
        { id: 16, nome_numero: 'Sala de Design', capacidade: 30, descricao: 'Equipada com computadores e tablets de última geração.', localizacao: "Bloco A", status_limpeza: "Limpeza Pendente", ultima_limpeza_data_hora: null, ultima_limpeza_funcionario: null},
    ];

    return (
        <View className="flex-1 bg-gray-100 p-4">
            <View className="bg-gray-100 w-full h-40 mb-6 justify-center p-2">
                <Text className=" text-3xl font-bold">Salas</Text>
            </View>
            <ScrollView className="p-3">
                {salas.map((sala) => (
                    <SalaCard key={sala.id} sala={sala}/>
                    // <View></View>
                ))}
            </ScrollView>
        </View>
    );
};