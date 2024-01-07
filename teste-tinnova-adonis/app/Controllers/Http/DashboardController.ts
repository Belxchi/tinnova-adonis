import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Database from "@ioc:Adonis/Lucid/Database";

interface CulturaCount {
  nome: string;
  valor: number;
}

export default class DashboardController {
  public async index(ctx: HttpContextContract) {
    // Total de fazendas
    const totalFazendas = await Database.from("produtores")
      .count("* as total")
      .first();

    // Total de hectares
    const totalHectares = await Database.from("produtores")
      .sum("areaTotal as total")
      .first();

    // Fazendas por estado
    const fazendasPorEstado = await Database.from("produtores")
      .groupBy("estado")
      .count("* as valor")
      .select("estado as nome");

    let fazendasPorCultura: CulturaCount[] = [];
    try {
      const result = await Database.rawQuery(
        "SELECT nome, COUNT(*) as valor FROM (SELECT unnest(string_to_array(cultura, ',')) as nome FROM produtores) as sub GROUP BY nome"
      );

      // Inspeção do resultado para verificar sua estrutura
      console.log(result);

      // Ajuste conforme a estrutura do resultado
      fazendasPorCultura = result.rows.map((item) => ({
        nome: item.nome,
        valor: parseInt(item.valor, 10),
      }));
    } catch (error) {
      console.error("Erro na consulta de culturas:", error);
    }

    // Uso do solo
    const usoSolo = [
      {
        nome: "Agricultavel",
        valor: parseInt(
          await Database.from("produtores")
            .sum("areaAgricultavel as total")
            .first()
            .then((res) => res.total)
        ),
      },
      {
        nome: "Vegetação",
        valor: parseInt(
          await Database.from("produtores")
            .sum("areaVegetacao as total")
            .first()
            .then((res) => res.total)
        ),
      },
    ];

    return {
      totalFazendas: totalFazendas ? parseInt(totalFazendas.total) : 0,
      totalHectares: totalHectares ? parseInt(totalHectares.total) : 0,
      fazendasPorEstado: fazendasPorEstado.map((fe) => ({
        ...fe,
        valor: parseInt(fe.valor),
      })),
      fazendasPorCultura,
      usoSolo,
    };
  }
}
