import React, { useContext, useState } from "react";
import { View, ScrollView, TouchableOpacity } from 'react-native';
import { Card, Button, Text } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { AuthContext } from "../AuthContext";
// import '../styles/global.css'; // Certifique-se de que o NativeWind está configurado

export default function UserDashboardScreen() {
    const authContext = useContext(AuthContext);

    if (!authContext) {
        return null;
    }

    const navigation = useNavigation();

    const salas = [
        { id: '1', nome: 'Sala de TI', descricao: 'Sala de reuniões da equipe de TI.' },
        { id: '2', nome: 'Sala de Reunião Principal', descricao: 'Sala para grandes apresentações e reuniões.' },
        { id: '3', nome: 'Sala de Design', descricao: 'Equipada com computadores e tablets de última geração.' },
        { id: '4', nome: 'Sala de Design', descricao: 'Equipada com computadores e tablets de última geração.' },
        { id: '5', nome: 'Sala de Design', descricao: 'Equipada com computadores e tablets de última geração.' },
        { id: '6', nome: 'Sala de Design', descricao: 'Equipada com computadores e tablets de última geração.' },
        { id: '7', nome: 'Sala de Design', descricao: 'Equipada com computadores e tablets de última geração.' },
        { id: '8', nome: 'Sala de Design', descricao: 'Equipada com computadores e tablets de última geração.' },
        { id: '9', nome: 'Sala de Design', descricao: 'Equipada com computadores e tablets de última geração.' },
        { id: '10', nome: 'Sala de Design', descricao: 'Equipada com computadores e tablets de última geração.' },
        { id: '11', nome: 'Sala de Design', descricao: 'Equipada com computadores e tablets de última geração.' },
        { id: '12', nome: 'Sala de Design', descricao: 'Equipada com computadores e tablets de última geração.' },
        { id: '13', nome: 'Sala de Design', descricao: 'Equipada com computadores e tablets de última geração.' },
        { id: '14', nome: 'Sala de Design', descricao: 'Equipada com computadores e tablets de última geração.' },
        { id: '15', nome: 'Sala de Design', descricao: 'Equipada com computadores e tablets de última geração.' },
        { id: '16', nome: 'Sala de Design', descricao: 'Equipada com computadores e tablets de última geração.' },
    ];

    return (
        <View className="flex-1 bg-gray-100 p-4">
            <ScrollView>
                {salas.map((sala) => (
                    <TouchableOpacity key={sala.id} className="mb-4 mx-3 rounded-lg shadow-md bg-white">
                        <Card>
                            <Card.Content>
                                {/* O componente Title e Paragraph foram descontinuados */}
                                {/* Usando o componente Text do Paper com a propriedade variant */}
                                <Text variant="headlineSmall">{sala.nome}</Text>
                                {/* <Text variant="bodyMedium">{sala.descricao}</Text> */}
                            </Card.Content>
                            {/* <Card.Actions>
                                <Button
                                    mode="text"
                                    // onPress={() => navigation.navigate('DetalhesSala', { salaId: sala.id })}
                                >
                                    Ver Detalhes
                                </Button>
                            </Card.Actions> */}
                        </Card>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
    );
};