import BaseSchema from "@ioc:Adonis/Lucid/Schema";

export default class ProdutoresSchema extends BaseSchema {
  protected tableName = "produtores";

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments("id");
      table.string("cpfCnpj").unique().notNullable(); // CPF ou CNPJ
      table.string("nome").notNullable(); // Nome do produtor
      table.string("nomeFazenda").notNullable(); // Nome da Fazenda
      table.string("cidade").notNullable(); // Cidade
      table.string("estado").notNullable(); // Estado
      table.decimal("areaTotal", 10, 2).notNullable(); // Área total em hectares
      table.decimal("areaAgricultavel", 10, 2).notNullable(); // Área agricultável em hectares
      table.decimal("areaVegetacao", 10, 2).notNullable(); // Área de vegetação em hectares
      table.specificType("cultura", "TEXT[]").notNullable(); // Culturas plantadas
    });
  }

  public async down() {
    this.schema.dropTable(this.tableName);
  }
}
