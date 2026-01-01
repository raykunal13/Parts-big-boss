import {api} from "../axios/axiosConfig";

export const searchSuggestion = async (query: string) => {
    try {
        console.log("Fetching search suggestions for:", query);
        const response = await api.get(`/api/products/search?q=${query}`);
        return response.data.results;
    } catch (error) {
        console.error("Error fetching search suggestions:", error);
        return [];
    }
};