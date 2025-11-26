function status_api(request, response) {
  response
    .status(200)
    .json({ chave: "Alunos do curso.dev são pessoas acima da média." });
}

export default status_api;
