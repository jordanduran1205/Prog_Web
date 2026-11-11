// server.js
import express from "express";

const app = express();
app.set("json spaces", 2);
app.use(express.json());

let productos = [
  { id: 1, nombre: "Teclado", precio: 80000, stock: 10 },
  { id: 2, nombre: "Mouse", precio: 35000, stock: 25 },
];
let siguienteId = 3;

// Valida nombre, precio y stock. Devuelve true si son válidos.
function datosValidos({ nombre, precio, stock }) {
  return (
    typeof nombre === "string" &&
    nombre.trim() !== "" &&
    typeof precio === "number" &&
    precio >= 0 &&
    typeof stock === "number" &&
    Number.isInteger(stock) &&
    stock >= 0
  );
}

// GET /productos -> lista todos
app.get("/productos", (req, res) => {
  res.status(200).json(productos);
});

// GET /productos/:id -> devuelve uno
app.get("/productos/:id", (req, res) => {
  const id = Number(req.params.id);
  const producto = productos.find((p) => p.id === id);

  if (!producto) {
    return res.status(404).json({ error: "Producto no encontrado" });
  }

  res.status(200).json(producto);
});

// POST /productos -> crea uno nuevo
app.post("/productos", (req, res) => {
  const { nombre, precio, stock } = req.body;

  if (!datosValidos({ nombre, precio, stock })) {
    return res.status(400).json({
      error: "Datos inválidos: nombre (texto), precio (número >= 0) y stock (entero >= 0)",
    });
  }

  const nuevo = { id: siguienteId++, nombre: nombre.trim(), precio, stock };
  productos.push(nuevo);
  res.status(201).json(nuevo);
});

// PUT /productos/:id -> reemplaza TODOS los campos
app.put("/productos/:id", (req, res) => {
  const id = Number(req.params.id);
  const indice = productos.findIndex((p) => p.id === id);

  if (indice === -1) {
    return res.status(404).json({ error: "Producto no encontrado" });
  }

  const { nombre, precio, stock } = req.body;

  if (!datosValidos({ nombre, precio, stock })) {
    return res.status(400).json({
      error: "PUT requiere todos los campos válidos: nombre, precio y stock",
    });
  }

  productos[indice] = { id, nombre: nombre.trim(), precio, stock };
  res.status(200).json(productos[indice]);
});

// PATCH /productos/:id -> cambia solo algunos campos
app.patch("/productos/:id", (req, res) => {
  const id = Number(req.params.id);
  const producto = productos.find((p) => p.id === id);

  if (!producto) {
    return res.status(404).json({ error: "Producto no encontrado" });
  }

  const cambios = {};
  if ("nombre" in req.body) cambios.nombre = req.body.nombre;
  if ("precio" in req.body) cambios.precio = req.body.precio;
  if ("stock" in req.body) cambios.stock = req.body.stock;

  if (Object.keys(cambios).length === 0) {
    return res.status(400).json({ error: "Envía al menos un campo: nombre, precio o stock" });
  }

  const actualizado = { ...producto, ...cambios };

  if (!datosValidos(actualizado)) {
    return res.status(400).json({ error: "Alguno de los datos enviados no es válido" });
  }

  actualizado.nombre = actualizado.nombre.trim();
  Object.assign(producto, actualizado);
  res.status(200).json(producto);
});

// DELETE /productos/:id -> borra
app.delete("/productos/:id", (req, res) => {
  const id = Number(req.params.id);
  const indice = productos.findIndex((p) => p.id === id);

  if (indice === -1) {
    return res.status(404).json({ error: "Producto no encontrado" });
  }

  productos.splice(indice, 1);
  res.status(204).send();
});

app.listen(3000, () => console.log("Servidor listo"));