const express = require("express");
const sqlite3 = require("sqlite3").verbose();

const app = express();
app.use(express.json());
const PORT = process.env.PORT || 3001;

// Criar banco de dados SQLite em memória
const db = new sqlite3.Database(":memory:");

// Criar tabela para armazenar nome de pessoas
db.serialize(() => {
  db.run(
    " create table if not exists pessoas (id int,nome text, sobrenome text, idade int)"
  );
});

// captura os valores passados no corpo da requisição e insere no banco de dados
app.post("/insert", (req, res) => {
  db.run("insert into pessoas values (?,?,?,?)", [
    req.body.id,
    req.body.nome,
    req.body.sobrenome,
    req.body.idade,
  ]);

  res.status(201);
  res.send({ retorno: "Registro inserido com sucesso!" });
});

app.put("/update", (req, res) => {
  db.run(
    "update  pessoas set nome = ?, sobrenome = ?, idade = ? where id = ?",
    [req.body.nome, req.body.sobrenome, req.body.idade, req.body.id]
  );

  res.status(201);
  res.send({ retorno: "Registro alterado com sucesso!" });
});

// Rota para consulta de informações com id
app.get("/select/:id", (req, res) => {
  db.all(
    "select * from pessoas where id = ?",
    [req.params.id],
    (erro, rows) => {
      if (erro) {
        res.status(204);
        res.send(erro);
      } else {
        res.status(200);
        res.send(rows);
      }
    }
  );
});

// deletar registro utilizando parâmetro
app.delete("/delete/:id", (req, res) => {
  db.run("delete from pessoas where id = ?", [req.params.id], (erro) => {
    if (erro) {
      res.status(400);
      res.send({ retorno: erro });
    } else {
      res.status(200);
      res.send({ retorno: "Registro excluído com sucesso!" });
    }
  });
});

// Iniciar o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
