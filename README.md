Este é o projeto de TCC de uma editora fictícia.

Na primeira vez que forem modificar os arquivos ou o pacote node for alterado:
1.Digitar "npm install" nos diretórios frontend e backend

A cada mudança nos arquivos:
1. Verificar status das mudanças, usando "git status"
2. Verificar o branch atual com "git branch"
3. Criar, se não houver, a branch develop com "git checkout -b develop"
4. Mudar para a branch develop com "git switch develop"
5. Verificar status das mudanças novamente, usando "git status"
6. Adicionar os arquivos modificados ao stage, com "git add ."
7. Comitar os arquivos do stage com "git commit -m 'Mensagem sobre o que se fez'"
8. Realizar o pull dos arquivos de develop com "git pull origin develop"
9. Realizar o push (levar os arquivos locais para o remoto) com "git push origin develop"
10. Aguardar o proprietário da organização realizar a junção das branchs, por meio de um pull request.

*NÃO DAR PUSH DOS ARQUIVOS DIRETAMENTE NA MAIN*

*Antes de modificar os arquivos no editor de código, quer seja do codespace, quer localmente, é necessário atualizar os arquivos locais com "git pull origin develop"*
*Caso haja conflito no momento de pull (como quando a  estrutura de pastas se modifica), reservar as mudanças com "git stash" ou comitá-las como de praxe*
*Ao usar o codespace, não esquecer de interrompê-lo*
*É importante realizar os push e os pull dos repositórios local e remoto em intervalos breves, para evitar conflito na hora de subir as alterações*
