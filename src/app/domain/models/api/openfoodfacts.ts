export interface OpenFoodFactsResponse {
    code: string;
    status: string;
    product: Product;
}

export interface Product {
    product_name: string;
    nutriments: Nutriments;
}

export interface Nutriments {
    "alcohol": number,
    "carbohydrates": number,
    "energy": number,
    "energy_value": number,
    "energy_unit": string,
    "energy-kcal": number,
    "energy-kj": number,
    "fat": number,
    "fruits-vegetables-legumes-estimate-from-ingredients": number,
    "fruits-vegetables-nuts-estimate-from-ingredients": number,
    "nova-group": number,
    "nutrition-score-fr": string,
    "proteins": number,
    "salt": number,
    "saturated-fat": number,
    "sodium": number,
    "sugars": number,
    "carbon-footprint-from-known-ingredients_product": number,
    "carbon-footprint-from-known-ingredients_serving": number,
    "erythritol": 12.5
}
