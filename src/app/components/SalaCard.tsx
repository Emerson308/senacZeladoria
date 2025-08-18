import { TouchableOpacity } from "react-native"
import { Card, Text } from "react-native-paper"
import { Sala } from "../types/types"


interface propsSalaCard{
    sala: Sala;
    key: number
}

export default function SalaCard(props: propsSalaCard){


    return (
        <TouchableOpacity className="mb-4 mx-3 rounded-lg shadow-md bg-white">
            <Card>
                <Card.Content>
                    {/* O componente Title e Paragraph foram descontinuados */}
                    {/* Usando o componente Text do Paper com a propriedade variant */}
                    <Text variant="headlineSmall">{props.sala.nome_numero}</Text>
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

    )
}