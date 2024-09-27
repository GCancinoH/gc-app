export interface Alergias {
    nombre: string;
    descripcion: string;
    alimentosAEvitar: string[];
}

export const alergiasAlimenticias: Alergias[] = [
    {
        nombre: "Lácteos",
        descripcion: "Reacción adversa a la proteína de la leche de vaca",
        alimentosAEvitar: ["Leche", "Queso", "Yogurt", "Nata", "Helado", "Mantequilla"]
    },
    {
        nombre: "Huevos",
        descripcion: "Reacción adversa a la proteína del huevo",
        alimentosAEvitar: ["Huevo entero", "Clara", "Yema", "Mayonesa", "Bizcocho"]
    },
    {
        nombre: "Gluten",
        descripcion: "Intolerancia a la proteína del gluten presente en el trigo, centeno, cebada y avena",
        alimentosAEvitar: ["Pan", "Pasta", "Cereales", "Galletas", "Pizza", "Cerveza"]
    },
    {
        nombre: "Frutos secos",
        descripcion: "Reacción adversa a los frutos secos",
        alimentosAEvitar: ["Almendras", "Avellanas", "Nueces", "Castañas", "Pistachos", "Macadamia"]
    },
    {
        nombre: "Mariscos",
        descripcion: "Reacción adversa a los mariscos",
        alimentosAEvitar: ["Camarones", "Langostinos", "Cangrejo", "Langosta", "Mejillones", "Calamar"]
    },
    {
        nombre: "Pescado",
        descripcion: "Reacción adversa al pescado",
        alimentosAEvitar: ["Salmón", "Atún", "Bacalao", "Merluza", "Sardina"]
    },
    {
        nombre: "Soja",
        descripcion: "Reacción adversa a la proteína de la soja",
        alimentosAEvitar: ["Tofu", "Leche de soja", "Salsa de soja", "Edamame"]
    },
    {
        nombre: "Sésamo",
        descripcion: "Reacción adversa a las semillas de sésamo",
        alimentosAEvitar: ["Tahini, Hummus, Pan de pita, Barras energéticas"]
    },
    {
        nombre: "Maní",
        descripcion: "Reacción adversa al maní",
        alimentosAEvitar: ["Mantequilla de maní, Barritas de chocolate con maní"]
    },
    {
        nombre: "Fructosa",
        descripcion: "Intolerancia al azúcar de las frutas",
        alimentosAEvitar: ["Frutas en general", "Miel", "Jarabe de maíz de alta fructosa", "Verduras dulces"]
    }
];