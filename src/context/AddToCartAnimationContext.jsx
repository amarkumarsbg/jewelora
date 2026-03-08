import { createContext, useContext, useState, useCallback } from "react";

const AddToCartAnimationContext = createContext();

export function AddToCartAnimationProvider({ children }) {
  const [bounce, setBounce] = useState(false);

  const triggerAddAnimation = useCallback(() => {
    setBounce(true);
    const t = setTimeout(() => setBounce(false), 600);
    return () => clearTimeout(t);
  }, []);

  return (
    <AddToCartAnimationContext.Provider value={{ bounce, triggerAddAnimation }}>
      {children}
    </AddToCartAnimationContext.Provider>
  );
}

export function useAddToCartAnimation() {
  const ctx = useContext(AddToCartAnimationContext);
  if (!ctx) return { bounce: false, triggerAddAnimation: () => {} };
  return ctx;
}
