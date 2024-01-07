import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Database from "@ioc:Adonis/Lucid/Database";
import { cpf, cnpj } from "cpf-cnpj-validator";

export default class ProdutoresController {
  public async index(ctx: HttpContextContract) {
    return Database.from("produtores").select("*");
  }

  public async create(ctx: HttpContextContract) {
    const requestBody = ctx.request.body();

    // Validação do CPF/CNPJ
    const cpfCnpj = requestBody.cpfCnpj;
    if (!cpf.isValid(cpfCnpj) && !cnpj.isValid(cpfCnpj)) {
      return ctx.response.status(400).send("CPF ou CNPJ inválido");
    }

    // Verificação da soma das áreas
    const { areaTotal, areaAgricultavel, areaVegetacao, cultura } = requestBody;
    if (areaAgricultavel + areaVegetacao > areaTotal) {
      return ctx.response
        .status(400)
        .send(
          "A soma das áreas agricultável e de vegetação não pode ser maior que a área total"
        );
    }

    // Checagem de existência
    const produtorExistente = await Database.from("produtores")
      .where("cpfCnpj", cpfCnpj)
      .first();
    if (produtorExistente) {
      return ctx.response
        .status(400)
        .send("Produtor com este CPF/CNPJ já existe");
    }

    // Convertendo o array de culturas em uma string delimitada por vírgula
    const culturaString = cultura.join(",");

    // Inserção do produtor no banco de dados
    const produtor = await Database.table("produtores").insert({
      cpfCnpj: cpfCnpj,
      nome: requestBody.nome,
      nomeFazenda: requestBody.nomeFazenda,
      cidade: requestBody.cidade,
      estado: requestBody.estado,
      areaTotal: areaTotal,
      areaAgricultavel: areaAgricultavel,
      areaVegetacao: areaVegetacao,
      cultura: culturaString,
    });

    return ctx.response.send({
      message: "Produtor cadastrado com sucesso.",
    });
  }

  public async show(ctx: HttpContextContract) {
    const id = ctx.params.id;
    const produtor = await Database.from("produtores").where("id", id).first();

    if (!produtor) {
      return ctx.response.status(404).send("Produtor não encontrado");
    }

    return produtor;
  }

  public async update(ctx: HttpContextContract) {
    const id = ctx.params.id;
    const dadosAtualizados = ctx.request.body();

    const produtor = await Database.from("produtores").where("id", id).first();
    if (!produtor) {
      return ctx.response.status(404).send("Produtor não encontrado");
    }

    await Database.from("produtores").where("id", id).update(dadosAtualizados);
    return await Database.from("produtores").where("id", id).first();
  }

  public async delete(ctx: HttpContextContract) {
    const id = ctx.params.id;

    const produtor = await Database.from("produtores").where("id", id).first();
    if (!produtor) {
      return ctx.response.status(404).send("Produtor não encontrado");
    }

    await Database.from("produtores").where("id", id).delete();
    return ctx.response.status(200).send("Produtor deletado com sucesso");
  }
}
