// src/pages/RecipesPage.tsx
import React, { useState, useEffect } from 'react';
import {
    IonPage,
    IonContent,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonSearchbar,
    IonSegment,
    IonSegmentButton,
    IonLabel,
    IonSpinner,
    useIonViewWillEnter
} from '@ionic/react';
import { Recipe } from '../types';
import RecipeGrid from '../components/features/recipe/RecipeGrid';
import { RecipeService } from '../services/recipe.service';
import { useAuth } from '../contexts/AuthContext';

import '../styles/recipes.css';

const RecipesPage: React.FC = () => {
    const [recipes, setRecipes] = useState<Recipe[]>([]);
    const [filteredRecipes, setFilteredRecipes] = useState<Recipe[]>([]);
    const [searchText, setSearchText] = useState('');
    const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();

    useIonViewWillEnter(() => {
        loadRecipes();
    });

    const loadRecipes = async () => {
        try {
            const recipeData = await RecipeService.getRecipes();
            setRecipes(recipeData);
            setFilteredRecipes(recipeData);
            setLoading(false);
        } catch (error) {
            console.error('Error loading recipes:', error);
            setLoading(false);
        }
    };

    useEffect(() => {
        filterRecipes();
    }, [searchText, selectedDifficulty, recipes]);

    const filterRecipes = () => {
        let filtered = [...recipes];

        // Filtre par recherche
        if (searchText) {
            filtered = filtered.filter(recipe =>
                recipe.title.toLowerCase().includes(searchText.toLowerCase()) ||
                recipe.region.toLowerCase().includes(searchText.toLowerCase())
            );
        }

        // Filtre par difficulté
        if (selectedDifficulty !== 'all') {
            filtered = filtered.filter(recipe => recipe.difficulty === selectedDifficulty);
        }

        setFilteredRecipes(filtered);
    };

    const handleRecipeSelect = (recipeId: string) => {
        // Gérer la sélection de recette
        console.log('Selected recipe:', recipeId);
    };

    const handleDifficultyChange = (value: string | number | undefined) => {
        if (value !== undefined) {
            setSelectedDifficulty(String(value));
        }
    };

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>Recettes</IonTitle>
                </IonToolbar>
                <IonToolbar>
                    <IonSearchbar
                        value={searchText}
                        onIonChange={e => setSearchText(e.detail.value ?? '')}
                        placeholder="Rechercher une recette..."
                    />
                </IonToolbar>
                <IonToolbar>
                    <IonSegment
                        value={selectedDifficulty}
                        onIonChange={e => handleDifficultyChange(e.detail.value)}
                    >
                        <IonSegmentButton value="all">
                            <IonLabel>Tout</IonLabel>
                        </IonSegmentButton>
                        <IonSegmentButton value="easy">
                            <IonLabel>Facile</IonLabel>
                        </IonSegmentButton>
                        <IonSegmentButton value="medium">
                            <IonLabel>Moyen</IonLabel>
                        </IonSegmentButton>
                        <IonSegmentButton value="hard">
                            <IonLabel>Difficile</IonLabel>
                        </IonSegmentButton>
                    </IonSegment>
                </IonToolbar>
            </IonHeader>

            <IonContent>
                {loading ? (
                    <div className="flex items-center justify-center h-full">
                        <IonSpinner />
                    </div>
                ) : (
                    <RecipeGrid
                        recipes={filteredRecipes}
                        onRecipeSelect={(id: string) => console.log('Selected recipe:', id)}
                    />
                )}
            </IonContent>
        </IonPage>
    );
};

export default RecipesPage;