import { useEffect, useState } from "react";
import { PRODUCTS as TEST_PRODUCTS } from "../constants";
import { InventoryService } from "../services/supabase";
import { Product } from "../types";

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const useTestImages = localStorage.getItem("useTestImages") !== "false";

        if (useTestImages) {
          setProducts(TEST_PRODUCTS);
        } else {
          const supabaseProducts = await InventoryService.getProducts();
          setProducts(supabaseProducts);
        }
      } catch (err) {
        console.error("Error loading products:", err);
        setError("Failed to load products");
        // Fallback to test products
        setProducts(TEST_PRODUCTS);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();

    // Listen for storage changes
    const handleStorageChange = () => {
      loadProducts();
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  return { products, loading, error };
};
