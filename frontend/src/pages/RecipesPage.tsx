// // src/pages/RecipesPage.tsx
// import React, { useState, useEffect } from 'react';
// import {
//     IonPage,
//     IonContent,
//     IonHeader,
//     IonToolbar,
//     IonTitle,
//     IonSearchbar,
//     IonSegment,
//     IonSegmentButton,
//     IonLabel,
//     IonSpinner,
//     useIonViewWillEnter
// } from '@ionic/react';
// import { Recipe } from '../types';
// import RecipeGrid from '../components/features/recipe/RecipeGrid';
// import { RecipeService } from '../services/recipe.service';
// import { useAuth } from '../contexts/AuthContext';

// import '../styles/recipes.css';

// const RecipesPage: React.FC = () => {
//     const [recipes, setRecipes] = useState<Recipe[]>([]);
//     const [filteredRecipes, setFilteredRecipes] = useState<Recipe[]>([]);
//     const [searchText, setSearchText] = useState('');
//     const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
//     const [loading, setLoading] = useState(true);
//     const { user } = useAuth();

//     useIonViewWillEnter(() => {
//         loadRecipes();
//     });

//     const loadRecipes = async () => {
//         try {
//             const recipeData = await RecipeService.getRecipes();
//             setRecipes(recipeData);
//             setFilteredRecipes(recipeData);
//             setLoading(false);
//         } catch (error) {
//             console.error('Error loading recipes:', error);
//             setLoading(false);
//         }
//     };

//     useEffect(() => {
//         filterRecipes();
//     }, [searchText, selectedDifficulty, recipes]);

//     const filterRecipes = () => {
//         let filtered = [...recipes];

//         // Filtre par recherche
//         if (searchText) {
//             filtered = filtered.filter(recipe =>
//                 recipe.title.toLowerCase().includes(searchText.toLowerCase()) ||
//                 recipe.region.toLowerCase().includes(searchText.toLowerCase())
//             );
//         }

//         // Filtre par difficulté
//         if (selectedDifficulty !== 'all') {
//             filtered = filtered.filter(recipe => recipe.difficulty === selectedDifficulty);
//         }

//         setFilteredRecipes(filtered);
//     };

//     const handleRecipeSelect = (recipeId: string) => {
//         // Gérer la sélection de recette
//         console.log('Selected recipe:', recipeId);
//     };

//     const handleDifficultyChange = (value: string | number | undefined) => {
//         if (value !== undefined) {
//             setSelectedDifficulty(String(value));
//         }
//     };

//     return (
//         <IonPage>
//             <IonHeader>
//                 <IonToolbar>
//                     <IonTitle>Recettes</IonTitle>
//                 </IonToolbar>
//                 <IonToolbar>
//                     <IonSearchbar
//                         value={searchText}
//                         onIonChange={e => setSearchText(e.detail.value ?? '')}
//                         placeholder="Rechercher une recette..."
//                     />
//                 </IonToolbar>
//                 <IonToolbar>
//                     <IonSegment
//                         value={selectedDifficulty}
//                         onIonChange={e => handleDifficultyChange(e.detail.value)}
//                     >
//                         <IonSegmentButton value="all">
//                             <IonLabel>Tout</IonLabel>
//                         </IonSegmentButton>
//                         <IonSegmentButton value="easy">
//                             <IonLabel>Facile</IonLabel>
//                         </IonSegmentButton>
//                         <IonSegmentButton value="medium">
//                             <IonLabel>Moyen</IonLabel>
//                         </IonSegmentButton>
//                         <IonSegmentButton value="hard">
//                             <IonLabel>Difficile</IonLabel>
//                         </IonSegmentButton>
//                     </IonSegment>
//                 </IonToolbar>
//             </IonHeader>

//             <IonContent>
//                 {loading ? (
//                     <div className="flex items-center justify-center h-full">
//                         <IonSpinner />
//                     </div>
//                 ) : (
//                     <RecipeGrid
//                         recipes={filteredRecipes}
//                         onRecipeSelect={(id: string) => console.log('Selected recipe:', id)}
//                     />
//                 )}
//             </IonContent>
//         </IonPage>
//     );
// };

// export default RecipesPage;


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
    IonCard,
    IonCardContent,
    IonIcon,
    IonBadge,
} from '@ionic/react';
import { timeOutline, location } from 'ionicons/icons';
import '../styles/recipes.css';

// Types
interface Recipe {
    id: string;
    title: string;
    description: string;
    imageUrl: string;
    difficulty: 'easy' | 'medium' | 'hard';
    region: string;
    duration: number;
    unlocked: boolean;
    ingredients: {
        name: string;
        quantity: string;
    }[];
}

// Données mockées
const mockRecipes: Recipe[] = [
    {
        id: "1",
        title: "Ndolé traditionnel",
        description: "Le plat national camerounais par excellence",
        imageUrl: "/api/placeholder/400/300",
        difficulty: "medium",
        region: "Littoral",
        duration: 90,
        unlocked: true,
        ingredients: [
            { name: "Ndolé", quantity: "500g" },
            { name: "Poisson fumé", quantity: "300g" },
            { name: "Crevettes séchées", quantity: "200g" }
        ]
    },
    {
        id: "2",
        title: "Poulet DG",
        description: "Le célèbre Poulet Directeur Général",
        imageUrl: "/api/placeholder/400/300",
        difficulty: "hard",
        region: "Littoral",
        duration: 120,
        unlocked: false,
        ingredients: [
            { name: "Poulet", quantity: "1kg" },
            { name: "Plantains", quantity: "4 unités" },
            { name: "Carottes", quantity: "200g" }
        ]
    },
    {
        id: "3",
        title: "Eru",
        description: "Un délicieux plat du Sud-Ouest",
        imageUrl: "/api/placeholder/400/300",
        difficulty: "easy",
        region: "Sud-Ouest",
        duration: 60,
        unlocked: true,
        ingredients: [
            { name: "Feuilles d'eru", quantity: "400g" },
            { name: "Viande fumée", quantity: "300g" }
        ]
    }
];

const RecipesPage: React.FC = () => {
    const [recipes, setRecipes] = useState<Recipe[]>(mockRecipes);
    const [filteredRecipes, setFilteredRecipes] = useState<Recipe[]>(mockRecipes);
    const [searchText, setSearchText] = useState('');
    const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        filterRecipes();
    }, [searchText, selectedDifficulty]);

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

    const handleDifficultyChange = (value: string | number | undefined) => {
        if (value !== undefined) {
            setSelectedDifficulty(String(value));  // Conversion explicite en string
        }
    };

    const RecipeGrid: React.FC<{ recipes: Recipe[] }> = ({ recipes }) => (
        <div className="p-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {recipes.map(recipe => (
                <IonCard key={recipe.id} className="recipe-card">
                    <img src={recipe.imageUrl} alt={recipe.title} className="w-full h-48 object-cover" />
                    <IonCardContent>
                        <h3 className="font-bold text-lg mb-2">{recipe.title}</h3>
                        <p className="text-sm text-gray-600 mb-3">{recipe.description}</p>
                        <div className="flex justify-between items-center">
                            <div className="flex items-center space-x-3">
                                <div className="flex items-center text-gray-500">
                                    <IonIcon icon={timeOutline} className="w-4 h-4 mr-1" />
                                    <span className="text-sm">{recipe.duration} min</span>
                                </div>
                                <div className="flex items-center text-gray-500">
                                    <IonIcon icon={location} className="w-4 h-4 mr-1" />
                                    <span className="text-sm">{recipe.region}</span>
                                </div>
                            </div>
                            <IonBadge color={
                                recipe.difficulty === 'easy' ? 'success' :
                                    recipe.difficulty === 'medium' ? 'warning' : 'danger'
                            }>
                                {recipe.difficulty}
                            </IonBadge>
                        </div>
                    </IonCardContent>
                </IonCard>
            ))}
        </div>
    );

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
                    <RecipeGrid recipes={filteredRecipes} />
                )}
            </IonContent>
        </IonPage>
    );
};

export default RecipesPage;