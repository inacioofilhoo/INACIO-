# Fluxos do Almoxarifado PEC

Fluxogramas desenhados a partir das Work Instructions aprovadas do Almoxarifado (BRPEC-WH-WHA). Versão executiva interativa (nota de consistência, matriz de inconsistências, achados e raio-X em raias): `index.html`.

Legenda: azul cheio = início/fim · losango = decisão · laranja = ponto de HSSE · vermelho tracejado = lacuna (a WI não diz) · cinza tracejado = ligação com outra WI.

## Mapa das WIs

```mermaid
flowchart LR
  nf(["Material chega com NF<br/><small>transportadora ou motorista APM</small>"]):::start
  pcm(["Controlador de manutenção"]):::start
  lid(["Líder de execução"]):::start
  area(["RH ou Depot"]):::start
  subgraph REC["Recebimento de material"]
    w7["WI007<br/>Recebimento e armazenamento de estocáveis"]
    w6["WI006<br/>Itens de aplicação direta"]
    w5["WI005<br/>Divergências de estocáveis"]
  end
  subgraph ENT["Entrega de material"]
    w2["WI002<br/>Entrega manual e baixa em Work Task"]
    w9["WI009<br/>EPIs para RH e Depot"]
  end
  subgraph PRE["Preventiva 250 h"]
    w1["WI001<br/>Terminal Tractors"]
    w3["WI003<br/>Reach Stacker"]
  end
  subgraph EST["Estorno"]
    w4["WI004<br/>Estorno de estocáveis"]
  end
  nf -->|item GPN| w7
  nf -->|item GPG| w6
  w7 -.->|não confere| w5
  pcm -->|Teams PCM x Estoque| w1
  pcm -->|Teams PCM x Estoque| w3
  pcm -->|app de requisição| w2
  lid -->|e-mail| w4
  area -->|e-mail| w9
  classDef start fill:#0d5a8a,stroke:#0d5a8a,color:#fff
  classDef dec fill:#e0edf6,stroke:#0d5a8a,color:#15212c
  classDef hsse fill:#fdf0de,stroke:#a85a06,color:#15212c
  classDef gap fill:#fdebe9,stroke:#b42318,stroke-dasharray:5 4,color:#b42318
  classDef ref fill:#fff,stroke:#586776,stroke-dasharray:3 3,color:#15212c
```

- **Nota:** Clique numa WI à esquerda para ver o fluxo dela. As setas tracejadas mostram onde uma WI leva a outra.
- **Lacuna:** A WI008 não está no PDF. A numeração pula de WI007 para WI009.
- **Revisar:** As ligações entre WIs (WI007 → WI005, WI007 ↔ WI006) foram deduzidas do conteúdo. Nenhuma WI cita outra no campo Related doc.

## WI001 · Separação de Materiais de Preventivas de 250 h de Terminal Tractors

**Versão:** 2.0 · **Emissão:** 12/03/2026 · **Processo:** Preventiva · **Criação:** Zenaide Ellen · **Aprovação:** Bruno Abreu · **HSSE:** Ticiana Ferreira

```mermaid
flowchart TD
  s(["Controlador posta a requisição no Teams<br/><small>grupo PCM x Estoque</small>"]):::start
  n1["1. Receber a requisição<br/><small>Teams · equipamento da preventiva do próximo turno</small>"]
  n2["2. Baixar e imprimir a requisição<br/><small>Teams · impressora</small>"]
  n3["3. Identificar a requisição impressa<br/><small>com o equipamento informado pelo controlador</small>"]
  n4["4. Localizar os itens no estoque<br/><small>Excel · planilha de inventário, coluna Endereço</small>"]
  n5["5. Coletar os itens no estoque"]
  h5>"HSSE: atenção no percurso<br/>risco de torção de tornozelo"]:::hsse
  n6["6. Separar os materiais no carrinho móvel"]
  n7["7. Baixar os materiais no IFS<br/><small>tela Maintenance Material Requisition, conforme as tasks</small>"]
  n8["8. Alocar os itens na estação de materiais<br/><small>próxima à baia da preventiva do TT</small>"]
  h8>"HSSE: capacete e óculos<br/>no percurso pela oficina"]:::hsse
  n9["9. Posicionar o carrinho vazio<br/><small>na marcação ao lado da estação</small>"]
  e(["Materiais prontos para a preventiva"]):::start
  s --> n1 --> n2 --> n3 --> n4 --> n5 --> n6 --> n7 --> n8 --> n9 --> e
  n5 -.- h5
  n8 -.- h8
  classDef start fill:#0d5a8a,stroke:#0d5a8a,color:#fff
  classDef dec fill:#e0edf6,stroke:#0d5a8a,color:#15212c
  classDef hsse fill:#fdf0de,stroke:#a85a06,color:#15212c
  classDef gap fill:#fdebe9,stroke:#b42318,stroke-dasharray:5 4,color:#b42318
  classDef ref fill:#fff,stroke:#586776,stroke-dasharray:3 3,color:#15212c
```

- **Lacuna:** Não diz o que fazer se um item da requisição faltar no estoque ou se o endereço da planilha estiver errado.
- **Revisar:** Só a WI001 tem a etapa 9 (devolver o carrinho vazio). A WI003, que é o mesmo processo para Reach Stacker, termina na etapa 8.
- **Revisar:** Erros de digitação: “Posicinar/Posicine”, “tosão de tornozelo”, “Requistion”.

## WI003 · Separação de Itens de Preventivas de 250 h de Reach Stacker

**Versão:** 1.0 · **Emissão:** 10/06/2026 · **Processo:** Preventiva · **Criação:** Zenaide Ellen · **Aprovação:** Bruno Abreu · **HSSE:** Ticiana Ferreira

```mermaid
flowchart TD
  s(["Controlador posta a requisição no Teams<br/><small>grupo PCM x Estoque</small>"]):::start
  n1["1. Receber a requisição<br/><small>Teams · equipamento da preventiva do próximo turno</small>"]
  n2["2. Baixar e imprimir a requisição<br/><small>Teams · impressora</small>"]
  n3["3. Identificar a requisição impressa<br/><small>com o equipamento informado pelo controlador</small>"]
  n4["4. Localizar os itens no estoque<br/><small>Excel · planilha de inventário, coluna Endereço</small>"]
  n5["5. Coletar os itens no estoque"]
  h5>"HSSE: atenção no percurso<br/>risco de torção de tornozelo"]:::hsse
  n6["6. Separar os materiais no carrinho móvel"]
  n7["7. Baixar os materiais no IFS<br/><small>tela Maintenance Material Requisition, conforme as tasks</small>"]
  n8["8. Posicionar os itens na estação de materiais<br/><small>próxima à baia da preventiva de RS</small>"]
  h8>"HSSE: capacete e óculos<br/>no percurso pela oficina"]:::hsse
  e(["Materiais prontos para a preventiva"]):::start
  s --> n1 --> n2 --> n3 --> n4 --> n5 --> n6 --> n7 --> n8 --> e
  n5 -.- h5
  n8 -.- h8
  classDef start fill:#0d5a8a,stroke:#0d5a8a,color:#fff
  classDef dec fill:#e0edf6,stroke:#0d5a8a,color:#15212c
  classDef hsse fill:#fdf0de,stroke:#a85a06,color:#15212c
  classDef gap fill:#fdebe9,stroke:#b42318,stroke-dasharray:5 4,color:#b42318
  classDef ref fill:#fff,stroke:#586776,stroke-dasharray:3 3,color:#15212c
```

- **Lacuna:** Não diz o que fazer se um item da requisição faltar no estoque.
- **Revisar:** Falta a etapa de devolver o carrinho vazio, que existe na WI001 (etapa 9).
- **Revisar:** Na etapa 3 o texto “Localizar os itens no estoque” ficou colado no fim (“teamsLocalizar”).

## WI002 · Entrega Manual e Baixa de Materiais Inventariados em uma Work Task

**Versão:** 1.0 · **Emissão:** 22/01/2026 · **Processo:** Entrega de Material · **Criação:** Turma 2026.1 · **Aprovação:** Italo da Silva · **HSSE:** Ticiana Ferreira

```mermaid
flowchart TD
  s(["Controlador envia a requisição vinculada à task<br/><small>app de requisição de manutenção</small>"]):::start
  n1["1. Receber a requisição<br/><small>Power Apps</small>"]
  n2["2. Conferir o equipamento com o solicitante<br/><small>Power Apps</small>"]
  d2{"Equipamento confere<br/>com a requisição?"}:::dec
  g2["Não descrito na WI"]:::gap
  n3["3. Atualizar a requisição no IFS<br/><small>aba Maintenance Material Requisition</small>"]
  n4["4. Checar com o solicitante<br/>quais itens ele vai precisar<br/><small>IFS</small>"]
  n5["5. Verificar o estoque disponível<br/><small>IFS · linha Quantity On Hand</small>"]
  d5{"Há saldo<br/>em estoque?"}:::dec
  g5["Não descrito na WI"]:::gap
  n6["6. Localizar o item<br/><small>Excel · planilha de inventário, pelo código</small>"]
  n7["7. Pegar o item no estoque"]
  h7>"HSSE: atenção no percurso<br/>risco de torção de tornozelo"]:::hsse
  n8["8. Entregar o material ao solicitante"]
  n9["9. Baixar o material no IFS<br/><small>Maintenance Material Requisition › botão direito › Issue</small>"]
  n10["10. Marcar a requisição como atendida<br/><small>Power Apps · aba Status</small>"]
  e(["Entrega concluída"]):::start
  s --> n1 --> n2 --> d2
  d2 -->|Sim| n3
  d2 -->|Não| g2
  n3 --> n4 --> n5 --> d5
  d5 -->|Sim| n6
  d5 -->|Não| g5
  n6 --> n7 --> n8 --> n9 --> n10 --> e
  n7 -.- h7
  classDef start fill:#0d5a8a,stroke:#0d5a8a,color:#fff
  classDef dec fill:#e0edf6,stroke:#0d5a8a,color:#15212c
  classDef hsse fill:#fdf0de,stroke:#a85a06,color:#15212c
  classDef gap fill:#fdebe9,stroke:#b42318,stroke-dasharray:5 4,color:#b42318
  classDef ref fill:#fff,stroke:#586776,stroke-dasharray:3 3,color:#15212c
```

- **Lacuna:** Etapa 2: não diz o que fazer se o equipamento não bater com a requisição.
- **Lacuna:** Etapa 5: não diz o que fazer se o Quantity On Hand estiver zerado ou abaixo do pedido.
- **Revisar:** O campo Creator está como “Turma 2026.1”, não como uma pessoa responsável.
- **Revisar:** Erro de digitação: “tosão de tornozelo”.

## WI009 · Separação de EPIs Solicitados pelo RH e Depot

**Versão:** 1.0 · **Emissão:** 04/08/2026 · **Processo:** Entrega de Material · **Criação:** Zenaide Ellen · **Aprovação:** Raphael Santos · **HSSE:** não preenchido

```mermaid
flowchart TD
  s(["RH ou Depot envia e-mail<br/><small>material e quantidade</small>"]):::start
  n1["1. Receber a solicitação<br/><small>Outlook</small>"]
  n2["2. Verificar o prazo do EPI na Cenci<br/><small>Processo › Entrega Manual › matrícula</small>"]
  d2{"EPI liberado para<br/>o colaborador?"}:::dec
  g2["Não descrito na WI"]:::gap
  n3["3. Liberar o EPI na Cenci<br/><small>quantidade, motivo da troca, Fazer entrega,<br/>senha do funcionário</small>"]
  n4["4. Separar o EPI e identificar o destino"]
  d4{"Destino?"}:::dec
  n5a["5. Pedir a entrega ao<br/>motorista do almoxarifado"]
  n5b["5. Plantonista do dia faz a entrega<br/><small>conforme a logística</small>"]
  n6["6. Entregar no local e registrar com foto"]
  e(["Entrega do EPI concluída"]):::start
  s --> n1 --> n2 --> d2
  d2 -->|Sim| n3
  d2 -->|Não| g2
  n3 --> n4 --> d4
  d4 -->|Depot| n5a --> n6
  d4 -->|RH| n5b --> n6
  n6 --> e
  classDef start fill:#0d5a8a,stroke:#0d5a8a,color:#fff
  classDef dec fill:#e0edf6,stroke:#0d5a8a,color:#15212c
  classDef hsse fill:#fdf0de,stroke:#a85a06,color:#15212c
  classDef gap fill:#fdebe9,stroke:#b42318,stroke-dasharray:5 4,color:#b42318
  classDef ref fill:#fff,stroke:#586776,stroke-dasharray:3 3,color:#15212c
```

- **Lacuna:** Etapa 2: não diz o que fazer se o EPI ainda não estiver liberado para o colaborador pelo prazo do HSSE.
- **Lacuna:** Etapa 6: não diz onde a foto da entrega deve ser registrada ou enviada.
- **Revisar:** O campo HSSE está vazio no cabeçalho.
- **Revisar:** Erros de digitação: “Verique”, “fazer entregar”, “disponivel”.

## WI007 · Recebimento e Armazenamento de Materiais Estocáveis

**Versão:** 1.0 · **Emissão:** 14/07/2026 · **Processo:** Recebimento de Material · **Criação:** Zenaide Ellen · **Aprovação:** Italo da Silva · **HSSE:** não preenchido

```mermaid
flowchart TD
  s(["Transportadora ou motorista APM<br/>entrega material com NF"]):::start
  n1["1. Receber o material com a nota fiscal"]
  n2["2. Conferir a NF com o pedido de compra<br/><small>IFS · Purchase Order: part no estocável (GPN),<br/>coordinator PEC-220</small>"]
  d2{"Item GPN e<br/>coordinator PEC-220?"}:::dec
  r2["Item de aplicação direta (GPG)<br/>ver WI006"]:::ref
  n3["3. Verificar se o material confere<br/><small>quantidade, marca, referências</small>"]
  d3{"Confere com<br/>a ordem de compra?"}:::dec
  r3["Tratar divergência<br/>ver WI005"]:::ref
  n4["4. Imprimir as etiquetas<br/><small>IFS · Inventory Part in Stock › part no ›<br/>Print Barcode Label Without Barcode ID</small>"]
  n5["5. Identificar o material com as etiquetas<br/><small>conforme as quantidades recebidas</small>"]
  n6["6. Estocar na localização correta<br/><small>Teams · planilha Nova Localização 2026,<br/>pasta Alinhamento Plantonistas</small>"]
  e(["Material armazenado"]):::start
  s --> n1 --> n2 --> d2
  d2 -->|Sim| n3
  d2 -->|Não| r2
  n3 --> d3
  d3 -->|Sim| n4
  d3 -->|Não| r3
  n4 --> n5 --> n6 --> e
  classDef start fill:#0d5a8a,stroke:#0d5a8a,color:#fff
  classDef dec fill:#e0edf6,stroke:#0d5a8a,color:#15212c
  classDef hsse fill:#fdf0de,stroke:#a85a06,color:#15212c
  classDef gap fill:#fdebe9,stroke:#b42318,stroke-dasharray:5 4,color:#b42318
  classDef ref fill:#fff,stroke:#586776,stroke-dasharray:3 3,color:#15212c
```

- **Revisar:** As saídas para a WI005 (divergência) e para a WI006 (item GPG) são deduções minhas. A WI007 não diz o que fazer quando a conferência falha.
- **Lacuna:** Etapa 6: não diz o que fazer se o item não tiver localização na planilha Nova Localização 2026.
- **Revisar:** No PDF as etapas 5 e 6 estão sem número. O campo HSSE está vazio.

## WI006 · Identificação e Separação de Itens de Aplicação Direta

**Versão:** 1.0 · **Emissão:** 10/07/2026 · **Processo:** Separação de Material · **Criação:** Zenaide Ellen · **Aprovação:** Italo da Silva · **HSSE:** não preenchido

```mermaid
flowchart TD
  s(["Transportadora ou motorista APM<br/>entrega material com NF"]):::start
  n1["1. Receber o material com a nota fiscal"]
  n2["2. Conferir a NF com o pedido de compra<br/><small>IFS · Purchase Order: part no genérico (GPG);<br/>coordinator indica a área</small>"]
  d2{"Item GPG?"}:::dec
  r2["Item estocável (GPN)<br/>ver WI007"]:::ref
  n3["3. Localizar o requisitante<br/><small>IFS · Requisition No › F9 ›<br/>Purchase Requisition › Requisitioner</small>"]
  n4["4. Identificar o material com cópia da NF<br/><small>requisitante e área escritos com pincel escuro</small>"]
  n5["5. Separar na área de aplicação direta<br/><small>conforme o nível da área solicitante</small>"]
  e(["Solicitante retira em até 24 horas"]):::start
  s --> n1 --> n2 --> d2
  d2 -->|Sim| n3
  d2 -->|Não| r2
  n3 --> n4 --> n5 --> e
  classDef start fill:#0d5a8a,stroke:#0d5a8a,color:#fff
  classDef dec fill:#e0edf6,stroke:#0d5a8a,color:#15212c
  classDef hsse fill:#fdf0de,stroke:#a85a06,color:#15212c
  classDef gap fill:#fdebe9,stroke:#b42318,stroke-dasharray:5 4,color:#b42318
  classDef ref fill:#fff,stroke:#586776,stroke-dasharray:3 3,color:#15212c
```

- **Lacuna:** Não diz o que acontece se o solicitante não retirar o material em 24 horas.
- **Revisar:** A saída para a WI007 (item GPN) é dedução minha. A WI006 não diz o que fazer se o part no não for GPG.
- **Revisar:** O campo HSSE está vazio no cabeçalho.

## WI005 · Tratativas de Divergências de Materiais Estocáveis

**Versão:** 1.0 · **Emissão:** 30/06/2026 · **Processo:** Recebimento de Material · **Criação:** Zenaide Ellen · **Aprovação:** Italo da Silva · **HSSE:** não preenchido

```mermaid
flowchart TD
  s(["Transportadora ou motorista APM<br/>entrega material com NF"]):::start
  n1["1. Receber o material com a nota fiscal"]
  n2["2. Conferir NF, material e pedido<br/><small>IFS · Purchase Order: valor, quantidade,<br/>CNPJ do fornecedor e da APM, part number</small>"]
  d2{"Há divergência?"}:::dec
  r2["Recebimento normal<br/>ver WI007"]:::ref
  n3["3. Registrar a divergência com fotos<br/><small>diferenças entre o item correto e o recebido</small>"]
  n4["4. Recusar a NF no verso<br/><small>carimbo, motivo, data e horário;<br/>fotografar a NF recusada</small>"]
  n5["5. Informar o analista de almoxarifado<br/><small>Outlook · motivo, fotos e pedido de compra</small>"]
  n6["6. Separar na área de materiais para devolução<br/><small>embalado, NF de origem, motivo escrito na caixa</small>"]
  e(["Material aguardando devolução"]):::start
  s --> n1 --> n2 --> d2
  d2 -->|Não| r2
  d2 -->|Sim| n3
  n3 --> n4 --> n5 --> n6 --> e
  classDef start fill:#0d5a8a,stroke:#0d5a8a,color:#fff
  classDef dec fill:#e0edf6,stroke:#0d5a8a,color:#15212c
  classDef hsse fill:#fdf0de,stroke:#a85a06,color:#15212c
  classDef gap fill:#fdebe9,stroke:#b42318,stroke-dasharray:5 4,color:#b42318
  classDef ref fill:#fff,stroke:#586776,stroke-dasharray:3 3,color:#15212c
```

- **Lacuna:** Não diz quem retira o material da área de devolução nem em quanto tempo.
- **Revisar:** A saída “sem divergência → WI007” é dedução minha, para fechar o fluxo.
- **Revisar:** No PDF as etapas 5 e 6 estão sem número. O campo HSSE está vazio.

## WI004 · Processo de Estorno de Materiais Estocáveis

**Versão:** 1.0 · **Emissão:** 17/06/2026 · **Processo:** Estorno de Material · **Criação:** Zenaide Ellen · **Aprovação:** Felipe Marques · **HSSE:** não preenchido

```mermaid
flowchart TD
  s(["Líder de execução envia e-mail de estorno<br/><small>motivo, task, equipamento, descrição, código</small>"]):::start
  n1["1. Receber a solicitação<br/><small>Outlook</small>"]
  n2["2. Aguardar aprovação da gerência de manutenção<br/><small>Outlook</small>"]
  d2{"Gerência aprovou?"}:::dec
  g2["Não descrito na WI"]:::gap
  n3["3. Conferir o material devolvido"]
  d3{"Limpo, embalado<br/>e sem defeito?"}:::dec
  g3["Não descrito na WI"]:::gap
  n4["4. Estornar no IFS<br/><small>Work Task › Material Requisition Unissue ›<br/>Unissue Quantity › salvar</small>"]
  n5["5. Registrar fotos e responder o e-mail<br/><small>Outlook · “Estorno Realizado!”</small>"]
  e(["Estorno concluído"]):::start
  s --> n1 --> n2 --> d2
  d2 -->|Sim| n3
  d2 -->|Não| g2
  n3 --> d3
  d3 -->|Sim| n4
  d3 -->|Não| g3
  n4 --> n5 --> e
  classDef start fill:#0d5a8a,stroke:#0d5a8a,color:#fff
  classDef dec fill:#e0edf6,stroke:#0d5a8a,color:#15212c
  classDef hsse fill:#fdf0de,stroke:#a85a06,color:#15212c
  classDef gap fill:#fdebe9,stroke:#b42318,stroke-dasharray:5 4,color:#b42318
  classDef ref fill:#fff,stroke:#586776,stroke-dasharray:3 3,color:#15212c
```

- **Lacuna:** Etapa 2: não diz o que fazer se a gerência de manutenção não aprovar o estorno.
- **Lacuna:** Etapa 3: não diz o que fazer se o material voltar sujo, sem embalagem ou com defeito.
- **Lacuna:** Não diz onde guardar fisicamente o material estornado depois do lançamento no IFS.
- **Revisar:** O campo HSSE está vazio no cabeçalho.
