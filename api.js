const API_URL = "https://fakestoreapi.com/products";

// Fetch products from the REST API
export async function fetchProducts() {
  try {
    const response = await fetch(API_URL);

    if (!response.ok) {
      throw new Error("Unable to load products.");
    }

    const products = await response.json();
    return products;
  } catch (error) {
    console.error("API error:", error);
    throw error;
  }
}