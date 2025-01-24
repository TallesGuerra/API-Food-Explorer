SQL Comandos DML(Data Manipulation Language)

C - Create » insert
R - Read » select
U - Update » Update
D - Delete » Delete

<!-- CRIANDO UMA TABELA NO BEEKEEPER

    CREATE TABLE users (
	    id INTEGER PRIMARY KEY AUTOINCREMENT,
        name VARCHAR,
        email VARCHAR,
        password VARCHAR,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        
)

---- No Beekeeper o comando DROP serve para deletar ----
 -->




Algumas das principais funções do módulo "fs" incluem:

fs.readFile(): lê um arquivo e retorna seu conteúdo.
fs.writeFile(): escreve dados em um arquivo.
fs.existsSync(): verifica se um arquivo ou diretório existe.
fs.mkdir(): cria um novo diretório.
fs.unlink(): exclui um arquivo.
fs.rename(): renomeia um arquivo ou diretório.
fs.stat(): retorna o status do arquivo.