# 🧹 Projeto senacZeladoria

Este projeto é uma plataforma digital completa para a gestão e fiscalização da manutenção de espaços físicos (salas, laboratórios, escritórios). O sistema substitui fluxos de trabalho manuais por um processo eficiente e em tempo real, garantindo rastreabilidade total e a excelência na qualidade dos serviços de limpeza.

### **Funcionalidade Geral**

O sistema conecta diferentes perfis de usuário em um ciclo de manutenção contínuo:

* **Equipe de Zeladoria:** Focada na execução, utiliza o aplicativo como um diário de bordo digital. O processo inicia com "Iniciar Limpeza" e é finalizado com o upload obrigatório de fotos como comprovação do serviço. Ao concluir, a sala recebe o status "Limpa", cuja validade é monitorada automaticamente (por horas definidas para a sala) ou é interrompida por um reporte de sujeira.

* **Usuários Solicitantes de Serviço:** Atuam como fiscais e facilitadores. Em caso de não conformidade ou sujeira (desorganização, incidentes), podem "Marcar como Suja" instantaneamente. Essa ação prioriza o serviço, enviando uma notificação imediata à manutenção e alterando o status da sala.

* **Administração** Detém o controle e a visibilidade totais. Gerencia usuários, cadastra e edita salas, e acessa o histórico completo e filtrável de todas as operações de limpeza (responsável, data/hora e fotos). Administradores também podem acumular os perfis de Zeladoria e Solicitante, podendo executar todas as funções.

### **Benefícios Chave**

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

* **Detalhes da Sala**

  * **Dados Essenciais:** Exibe o **Nome**, **Status**, **Imagem**, **Capacidade**, **Localização**, **Descrição** e se a sala está **Ativa ou Inativa**.
  * **Informações de Manutenção:** Detalha as **Instruções de Limpeza** (se houver), a **Última Limpeza** registrada, sua **Validade** (em horas) e a lista de **Responsáveis** designados para a limpeza da sala.
  * **Ações Contextuais:** Botões de função são exibidos condicionalmente, conforme o perfil do usuário:
      * **Reportar Sujeira** (Disponível se não estiver Suja).
      * **Iniciar Limpeza** (Zeladoria).
      * **Editar** e **Excluir** (Administração, se a sala for passível de exclusão).
  * **Acesso ao Histórico:** Um botão dedicado leva à **Tela de Registros da Sala** (Histórico de Limpezas), sendo visível apenas para usuários com perfil **Administrador ou Zeladoria**.

* **Concluir Limpeza (Acesso zelador)**

  * **Comprovação Obrigatória:** Permite o **upload de fotos**, sendo **obrigatório** o envio de pelo menos uma imagem para comprovar a realização do serviço e a qualidade da limpeza.
  * **Registro de Detalhes:** O zelador pode adicionar **Observações (opcional)** sobre o serviço realizado ou quaisquer incidentes.
  * **Monitoramento de Tempo:** Exibe o horário de **Início da Limpeza** e possui um **timer funcional** que calcula o **Tempo de Limpeza** em tempo real, garantindo a precisão da métrica de velocidade.
 
* **Registros (Acesso admin ou zelador)**

  * **Ferramentas de Busca:** Inclui um campo de pesquisa para filtrar rapidamente os registros por **nome da sala** ou **nome de usuário do zelador**.
  * **Visão Analítica:** Exibe um gráfico que resume a **velocidade das limpezas** concluídas (Rápida, Média, Lenta) em todo o sistema.
  * **Card de Registro:** Cada card resume uma sessão de limpeza, apresentando:
      * **Identificação:** Nome da Sala e Zelador responsável.
      * **Tempo:** Horário de **Início** e **Fim** do registro, e o **Tempo de Limpeza** total, que é codificado por cores (verde para rápido, vermelho para lento).
      * **Evidências:** Indicadores visuais de **número de imagens** anexadas e se há **Observações** do zelador.
  * **Drill-Down:** Ao clicar no card, o usuário é levado à **Detalhes da Limpeza**, que mostra detalhes ainda mais aprofundados sobre aquele registro específico.

* **Detalhes de Limpeza (Acesso admin ou zelador)**

  * **Evidências Visuais:** Exibe todas as **Imagens** anexadas pelo zelador durante o serviço (em formato de galeria, se houver mais de uma foto).
  * **Detalhes do Serviço:** Consolida a informação crucial sobre a execução:
      * **Responsável:** O nome do zelador que realizou o serviço.
      * **Observações:** O texto inserido pelo zelador na conclusão da limpeza.
  * **Metadados de Tempo:** Mostra com precisão o horário de **Início** e **Fim** do registro, e o **Tempo de Limpeza** total, com a codificação de cor para indicar a velocidade de execução.

* **Estatísticas e Relatórios (Acesso Admin)**

  * **Ferramentas de Cabeçalho:** Contém dois botões utilitários cruciais para a gestão: um que direciona para a **Tela de Registros** (Histórico de Limpezas completo) e outro que redireciona para o **PDF dos QR Codes das Salas** para download e impressão.
  * **Visão Geral (Gráficos):**
      * **Status de Limpeza:** Gráfico de barras que exibe a proporção de salas em cada status: **Limpa**, **Limpeza Pendente**, **Suja** e **Em Limpeza**.
      * **Status de Salas:** Gráfico que mostra a contagem de salas **Ativas** vs. **Inativas**.
      * **Velocidade de Limpeza:** Gráfico que analisa o histórico de limpezas concluídas, classificando a velocidade de execução (Rápida, Média, Lenta) dos zeladores.
  
  * **Relatórios Detalhados (Drill-Down):**
      * **Limpezas em Andamento:** Lista todas as limpezas ativas, exibindo **timer de duração**, **usuário responsável** e **sala**, permitindo ao administrador o monitoramento em tempo real.
      * **Limpezas de Zeladores:** Lista todos os zeladores. O card exibe a **contagem total de limpezas** e o gráfico de **velocidade individual** (Rápida/Média/Lenta). Clicar no card leva a uma tela com o registro de cada limpeza realizada por aquele zelador.
      * **Limpezas de Salas:** Lista todas as salas. O card exibe **imagem**, **nome**, **contagem total de limpezas** e status **Ativa/Inativa**. Clicar no card leva a uma tela com o registro de cada limpeza realizada naquela sala.

* **Usuários (Acesso Admin)**

  * **Ferramentas de Pesquisa e Filtragem:**
      * **Pesquisa:** Permite buscar usuários por **username**.
      * **Filtros Avançados:** Filtra a listagem por **Status do Usuário** (Admin ou Usuário Padrão) e por **Grupos** específicos (Solicitante de Serviços, Zeladoria ou Sem Grupos).
  * **Cards de Usuários:** Exibe informações essenciais e permissões de cada conta:
      * **Identificação:** Imagem (se houver), **Username**, **Email** e **Nome Completo**.
      * **Permissões:** Tags visuais indicam se o usuário é **Admin** ou **Usuário Padrão**, e quais **Grupos** (Zeladoria, Solicitante de Serviços) ele pertence.
  * **Criação de Usuário (Formulário):** O botão **"Criar Usuário"** abre um formulário modal que permite ao administrador cadastrar novas contas, exigindo:
      * **Dados de Acesso:** Nome de Usuário, Senha e Confirmação de Senha.
      * **Dados Pessoais:** Nome Completo e Email.
      * **Definição de Perfil:** Um *multiselect* para atribuição opcional aos **Grupos** de trabalho e um *picker* para definir o status de **Admin** ou **Usuário Comum**.

* **Notificações:**
  * **Gestão de Alertas:** O usuário pode **marcar uma notificação específica como lida** ou **marcar todas as pendentes como lidas** de uma só vez, para gerenciar o volume de alertas.
  * **Cards Informativos:** Cada card de notificação exibe o **horário do evento** e informações essenciais da sala relacionada. O status de **lida ou não lida** é indicado visualmente.
  * **Ação Rápida:** Ao clicar em um card, o usuário é direcionado imediatamente à tela **Detalhes sala**, onde a sala em questão é destacada, permitindo que a **Equipe de Zeladoria inicie a limpeza** ou que o administrador verifique o status de manutenção.

* **Perfil**

  * **Dados de Identificação:** Exibe o **Username**, **Email**, **Nome Completo**, **Nível de Permissão** (Admin/Padrão) e os **Grupos do Usuário** (Zeladoria, Solicitante de Serviços).
  * **Gestão da Foto de Perfil:** O usuário pode **adicionar** uma foto de perfil (galeria ou câmera) ao clicar no avatar ou **deletá-la** usando o botão "X".
  * **Ferramentas de Cabeçalho (Contextuais):**
      * **Salas Atribuídas:** Botão que exibe uma lista das salas pelas quais o zelador é responsável, permitindo navegação rápida para a sala.
      * **Meus Registros:** Botão que redireciona o usuário para a lista de todos os seus registros de limpeza individuais (visível apenas para Zeladores).
  * **Ações de Segurança:**
      * **Alterar Senha:** Permite que o usuário modifique sua senha atual.
      * **Sair:** Desconecta o usuário do aplicativo, encerrando a sessão.












