import Route from "@ioc:Adonis/Core/Route";

Route.get("/", async () => {
  return { hello: "world" };
});

Route.get("/produtores", "ProdutoresController.index");
Route.post("/produtores", "ProdutoresController.create");
Route.get("/produtores/:id", "ProdutoresController.show");
Route.put("/produtores/:id", "ProdutoresController.update");
Route.delete("/produtores/:id", "ProdutoresController.delete");

Route.get("/dashboard", "DashboardController.index");
