import BaseSchema from "@ioc:Adonis/Lucid/Schema";

export default class AlterCulturaColumnToStrings extends BaseSchema {
  public async up() {
    this.schema.alterTable("produtores", (table) => {
      // Altera o tipo da coluna cultura para varchar (ou text)
      table.string("cultura").alter();
    });
  }

  public async down() {
    this.schema.alterTable("produtores", (table) => {
      // Volta para o tipo original se necessário
      table.specificType("cultura", "TEXT[]").alter();
    });
  }
}
