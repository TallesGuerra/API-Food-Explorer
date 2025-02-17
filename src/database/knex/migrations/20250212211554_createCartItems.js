exports.up = knex => knex.schema.createTable("cart_items", table => {
    table.increments("id");
  
    table.integer("cart_id").unsigned().references("id").inTable("carts").onDelete("CASCADE");
    table.integer("dish_id").unsigned().references("id").inTable("dishes").onDelete("CASCADE");
  
    table.text("name").notNullable();
    table.integer("quantity").notNullable();
  
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());
  });
  
  exports.down = knex => knex.schema.dropTable("cart_items");