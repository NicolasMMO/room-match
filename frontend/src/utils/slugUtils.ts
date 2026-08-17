/**
 * Gera um slug a partir de um texto (sem ID)
 * Exemplo: generateSlug("Meu Quarto") => "meu-quarto"
 */
export const generateSlug = (name: string): string => {
    return name
        .toLowerCase()
        .trim()
        .replace(/\s+/g, "-")
        .replace(/[^\w-]/g, "");
};
