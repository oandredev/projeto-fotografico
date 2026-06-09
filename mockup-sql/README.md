# Explicação

As etapas a seguir descrevem o processo para copiar o banco de dados para sua máquina com os dados iniciais já cadastrados. Isso permitirá que os registros existentes sejam relacionados às imagens já presentes na pasta `uploads`.

📍 **IMPORTANTE:** Este procedimento é **recomendado**, mas **opcional**. O objetivo é disponibilizar uma base de dados inicial para facilitar os testes, caso deseje a apenas a estrutura base do banco de dados, rode os comandos diretamente no arquivo `.ddl` na [pasta](/node-api/db/ddl.sql) (exceto os mockups), além disso remova as imagens da pasta uploads (pode apagar a pasta diretamente, pois ela será criada automaticamente).

---

## 1. Verifique se já existe um banco de dados chamado `fotografico_db`

Caso **não exista**, prossiga para o passo 2.

Caso **já exista**, você possui duas opções:

1. Excluir o banco existente e continuar com o procedimento normalmente.
2. Manter o banco atual:
   - Altere o nome do banco nas duas primeiras linhas do arquivo `db_mockup.sql` para o nome desejado.
   - Atualize o arquivo `.env`, alterando o valor da variável:

     ```env
     MYSQL_DB=nome_do_banco
     ```

   - Reinicie a API para que a alteração seja aplicada.

---

## 2. Gerar o clone do banco de dados (já realizado)

O arquivo foi gerado utilizando o comando abaixo:

```cmd
mysqldump -u root -p fotografico_db > db_mockup.sql
```

ou

Faça o export utilizando a interface do MySQL Workbeanch

---

## 3. Executar o script SQL exportado

Abra o arquivo:

- [db_mockup.sql](/mockup-sql/db_mockup.sql)

Em seguida:

1. Selecione todo o conteúdo (`CTRL + A`).
2. Execute o script SQL.
   - No VS Code, por exemplo, utilize o botão triangular verde de execução.

Se tudo ocorrer corretamente, o banco de dados será criado juntamente com os dados iniciais, incluindo uma conta administrativa padrão.

### Conta administrativa padrão

**E-mail:**

```
admin@fotografico.com
```

**Senha:**

```
123456
```

### Observação sobre senhas

As senhas são armazenadas utilizando a função **MD5**. Portanto, ao criar ou editar usuários diretamente no banco de dados, utilize a função `MD5()` para gerar o valor da senha antes da inserção. Caso contrário, o login não funcionará corretamente.

---

## 4. Realize os testes

Após a importação do banco, o ambiente estará pronto para utilização e testes conforme necessário.
