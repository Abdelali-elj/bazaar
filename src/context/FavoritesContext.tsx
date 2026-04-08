"use client";
import React, { createContext, useContext, useEffect, useState } from 'react';
import { getUser } from "@/lib/actions/auth";
import { syncFavoritesAction, getFavoritesAction } from "@/lib/actions/user_data";
import { useNotification } from "@/components/NotificationContext";

interface FavoritesContextType {
    favorites: string[];
    toggleFavorite: (productId: string) => void;
    isFavorite: (productId: string) => boolean;
    isFavoritesOpen: boolean;
    setIsFavoritesOpen: (open: boolean) => void;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export const FavoritesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [favorites, setFavorites] = useState<string[]>([]);
    const [isFavoritesOpen, setIsFavoritesOpen] = useState(false);
    const { addNotification } = useNotification();
    const [userId, setUserId] = useState<string | null>(null);

    // Initial load from localStorage and Firestore
    useEffect(() => {
        const storedFavorites = localStorage.getItem('favorites');
        if (storedFavorites) {
            try {
                setFavorites(JSON.parse(storedFavorites));
            } catch (error) {
                console.error('Failed to parse favorites from localStorage', error);
            }
        }

        // Check for user
        getUser().then(user => {
            if (user?.id) {
                setUserId(user.id);
                // Load from Firestore
                getFavoritesAction(user.id).then(res => {
                    if (res?.data && res.data.length > 0) {
                        setFavorites(res.data);
                    }
                });
            }
        });
    }, []);

    // Sync to localStorage and Firestore on change
    useEffect(() => {
        if (favorites.length > 0) {
            localStorage.setItem('favorites', JSON.stringify(favorites));
        } else {
            localStorage.removeItem('favorites');
        }

        if (userId) {
            syncFavoritesAction(userId, favorites);
        }
    }, [favorites, userId]);

    const toggleFavorite = (productId: string) => {
        const isAdding = !favorites.includes(productId);
        if (isAdding) {
            addNotification("Ajouté aux favoris");
        }
        
        setFavorites((prev) => {
            const newFavorites = prev.includes(productId)
                ? prev.filter((id) => id !== productId)
                : [...prev, productId];
            return newFavorites;
        });
    };

    const isFavorite = (productId: string) => favorites.includes(productId);

    return (
        <FavoritesContext.Provider value={{ favorites, toggleFavorite, isFavorite, isFavoritesOpen, setIsFavoritesOpen }}>
            {children}
        </FavoritesContext.Provider>
    );
};

export const useFavorites = () => {
    const context = useContext(FavoritesContext);
    if (context === undefined) {
        throw new Error('useFavorites must be used within a FavoritesProvider');
    }
    return context;
};
