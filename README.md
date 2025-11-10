# 🧹 Projeto senacZeladoria

Este projeto é uma plataforma digital completa para a gestão e fiscalização da manutenção de espaços físicos (salas, laboratórios, escritórios). O sistema substitui fluxos de trabalho manuais por um processo eficiente e em tempo real, garantindo rastreabilidade total e a excelência na qualidade dos serviços de limpeza.

**Funcionalidade Geral**

O sistema conecta diferentes perfis de usuário em um ciclo de manutenção contínuo:

* **Equipe de Zeladoria:** Focada na execução, utiliza o aplicativo como um diário de bordo digital. O processo inicia com "Iniciar Limpeza" e é finalizado com o upload obrigatório de fotos como comprovação do serviço. Ao concluir, a sala recebe o status "Limpa", cuja validade é monitorada automaticamente (por horas definidas para a sala) ou é interrompida por um reporte de sujeira.

* **Usuários Solicitantes de Serviço:** Atuam como fiscais e facilitadores. Em caso de não conformidade ou sujeira (desorganização, incidentes), podem "Marcar como Suja" instantaneamente. Essa ação prioriza o serviço, enviando uma notificação imediata à manutenção e alterando o status da sala.

* **Administração** Detém o controle e a visibilidade totais. Gerencia usuários, cadastra e edita salas, e acessa o histórico completo e filtrável de todas as operações de limpeza (responsável, data/hora e fotos). Administradores também podem acumular os perfis de Zeladoria e Solicitante, podendo executar todas as funções.

**Benefícios Chave**

* Rastreabilidade Total: Cada evento crucial (início e conclusão) é carimbado com data, hora e associado ao usuário responsável, criando um log inalterável da manutenção.

* Garantia de Qualidade: A exigência de comprovação visual (fotos) na conclusão do serviço assegura a verificação do padrão de limpeza.

* Comunicação Imediata: O sistema utiliza notificações in-app para alertar a equipe de manutenção sobre reportes de sujeira em tempo real ou limpezas expiradas, acelerando o tempo de resposta.

* Segurança e Controle de Acesso: O acesso é estritamente baseado em perfis, garantindo que as permissões de execução de tarefas sejam limitadas e pertinentes à função de cada colaborador.

## Telas do app

* **Salas:**
  * **Visibilidade Adaptável:** A listagem exibe salas ativas (para a Zeladoria/Solicitantes) ou todas as salas (para a Administração), com cards que mostram o **nome, imagem e status** atual da sala (Limpa, Suja, Pendente).
  * **Ferramentas de Navegação:**
      * **Filtros Avançados:** Permitem a busca rápida e precisa por salas.
      * **Leitor de QR Code:** Acesso direto para identificar salas no campo.
      * **Acesso a Notificações:** Link rápido para a central de alertas do usuário.
  * **Ações Dinâmicas:** Os cards de sala apresentam botões contextuais que dependem do status da sala e do perfil do usuário, incluindo:
      * **Início de Limpeza** (Zeladoria).
      * **Reportar Sujeira** (Solicitantes).
      * **Edição e Deleção** (Administração).
  * **Botões de Status:** Inclui os botões **"Limpezas em Andamento"** (se houver tarefas pendentes para o Zelador) e **"Criar Sala"** (para o Administrador).

 * **Notificações:**

   A central de **Notificações** consolida todos os alertas relevantes para o usuário, funcionando como uma caixa de entrada de tarefas prioritárias:
  
  * **Gestão de Alertas:** O usuário pode **marcar uma notificação específica como lida** ou **marcar todas as pendentes como lidas** de uma só vez, para gerenciar o volume de alertas.
  * **Cards Informativos:** Cada card de notificação exibe o **horário do evento** e informações essenciais da sala relacionada. O status de **lida ou não lida** é indicado visualmente.
  * **Ação Rápida:** Ao clicar em um card, o usuário é direcionado imediatamente à tela **Detalhes sala**, onde a sala em questão é destacada, permitindo que a **Equipe de Zeladoria inicie a limpeza** ou que o administrador verifique o status de manutenção.












