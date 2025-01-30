/* // src/pages/RecipesPage.tsx
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
  IonChip,
  useIonRouter,
  useIonToast,
  SegmentChangeEventDetail
} from '@ionic/react';
import { 
  timeOutline, 
  locationOutline, 
  flameOutline, 
  leafOutline,
  peopleOutline,
  ribbonOutline 
} from 'ionicons/icons';
import { Recipe } from '../types';
import { RecipeService } from '../services/recipe.service';
import '../styles/recipes.css';

const RecipesPage: React.FC = () => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [filteredRecipes, setFilteredRecipes] = useState<Recipe[]>([]);
  const [searchText, setSearchText] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const router = useIonRouter();
  const [present] = useIonToast();

  useEffect(() => {
    loadRecipes();
  }, []);

  useEffect(() => {
    filterRecipes();
  }, [searchText, selectedDifficulty, selectedCategory, recipes]);

  const loadRecipes = async () => {
    try {
      setLoading(true);
      const recipeData = await RecipeService.getRecipes();
      setRecipes(recipeData);
      setFilteredRecipes(recipeData);
    } catch (error) {
      present({
        message: 'Erreur lors du chargement des recettes',
        duration: 2000,
        color: 'danger'
      });
      console.error('Error loading recipes:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterRecipes = () => {
    let filtered = [...recipes];

    if (searchText) {
      filtered = filtered.filter(recipe =>
        recipe.title.toLowerCase().includes(searchText.toLowerCase()) ||
        recipe.region.toLowerCase().includes(searchText.toLowerCase()) ||
        recipe.tags?.some(tag => tag.toLowerCase().includes(searchText.toLowerCase())) ||
        recipe.ingredients.main.some(ing => ing.name.toLowerCase().includes(searchText.toLowerCase())) ||
        (recipe.ingredients.sauce?.some(ing => ing.name.toLowerCase().includes(searchText.toLowerCase())))
      );
    }

    if (selectedDifficulty !== 'all') {
      filtered = filtered.filter(recipe => recipe.difficulty === selectedDifficulty);
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(recipe => recipe.category === selectedCategory);
    }

    setFilteredRecipes(filtered);
  };

  const handleDifficultyChange = (e: CustomEvent<SegmentChangeEventDetail>) => {
    const value = e.detail.value;
    if (value) {
      setSelectedDifficulty(value as string);
    }
  };

  const RecipeCard: React.FC<{ recipe: Recipe }> = ({ recipe }) => (
    <IonCard 
      className="recipe-card" 
      onClick={() => router.push(`/app/recipe/${recipe.id}`)}
    >
      <div className="relative">
        <img 
          src={recipe.imageUrl || '/api/placeholder/400/300'} 
          alt={recipe.title} 
          className="w-full h-48 object-cover"
        />
        {!recipe.unlocked && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <IonIcon icon={ribbonOutline} className="text-white w-8 h-8" />
          </div>
        )}
      </div>
      <IonCardContent>
        <div className="mb-3">
          <h3 className="font-bold text-lg mb-2">{recipe.title}</h3>
          <p className="text-sm text-gray-600 line-clamp-2">{recipe.description}</p>
        </div>

        <div className="grid grid-cols-2 gap-2 mb-3">
          <div className="flex items-center text-sm text-gray-500">
            <IonIcon icon={timeOutline} className="w-4 h-4 mr-1" />
            <span>{recipe.totalTime} min</span>
          </div>
          <div className="flex items-center text-sm text-gray-500">
            <IonIcon icon={peopleOutline} className="w-4 h-4 mr-1" />
            <span>{recipe.servings.defaultSize} pers.</span>
          </div>
          <div className="flex items-center text-sm text-gray-500">
            <IonIcon icon={locationOutline} className="w-4 h-4 mr-1" />
            <span>{recipe.region}</span>
          </div>
          <div className="flex items-center text-sm text-gray-500">
            <IonIcon icon={flameOutline} className="w-4 h-4 mr-1" />
            <span>{recipe.nutritionFacts.perServing.calories} kcal</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex flex-wrap gap-1">
            {recipe.tags?.slice(0, 2).map((tag, index) => (
              <IonChip key={index} color="primary" className="text-xs">
                {tag}
              </IonChip>
            ))}
          </div>
          <IonBadge color={
            recipe.difficulty === 'easy' ? 'success' :
            recipe.difficulty === 'medium' ? 'warning' : 'danger'
          }>
            {recipe.difficulty}
          </IonBadge>
        </div>

        {recipe.status === 'completed' && (
          <div className="mt-2 flex items-center text-green-600">
            <IonIcon icon={ribbonOutline} className="w-4 h-4 mr-1" />
            <span className="text-sm">Maîtrisée</span>
          </div>
        )}
      </IonCardContent>
    </IonCard>
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
            placeholder="Rechercher une recette, un ingrédient..."
          />
        </IonToolbar>
        <IonToolbar>
          <IonSegment
            value={selectedDifficulty}
            onIonChange={handleDifficultyChange}
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
        ) : filteredRecipes.length > 0 ? (
          <div className="p-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredRecipes.map(recipe => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <p>Aucune recette trouvée</p>
          </div>
        )}
      </IonContent>
    </IonPage>
  );
};

export default RecipesPage; */










// src/pages/RecipesPageMock.tsx
import React, { useState } from 'react';
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
  IonCard,
  IonCardContent,
  IonIcon,
  IonBadge,
  IonChip,
  SegmentChangeEventDetail
} from '@ionic/react';
import { 
  timeOutline, 
  locationOutline, 
  flameOutline, 
  peopleOutline,
  ribbonOutline 
} from 'ionicons/icons';

// Types pour le mock
interface RecipeIngredient {
  name: string;
  quantity: string;
  unit?: string;
}

interface Recipe {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  totalTime: number;
  difficulty: 'easy' | 'medium' | 'hard';
  region: string;
  servings: {
    min: number;
    max: number;
    defaultSize: number;
  };
  ingredients: {
    main: RecipeIngredient[];
    sauce?: RecipeIngredient[];
  };
  tags?: string[];
  unlocked: boolean;
  status?: 'completed' | 'in-progress';
  nutritionFacts: {
    perServing: {
      calories: number;
    };
  };
  category?: string;
}

const RecipesPage: React.FC = () => {
  // Données mockées de recettes camerounaises
  const initialRecipes: Recipe[] = [
    {
      id: '1',
      title: 'Ndolé aux Crevettes',
      description: 'Plat national à base de légumes amers et de crevettes, originaire du littoral camerounais',
      imageUrl: '/api/placeholder/400/300?text=Ndolé%20aux%20Crevettes',
      totalTime: 75,
      difficulty: 'hard',
      region: 'Littoral',
      servings: { min: 2, max: 4, defaultSize: 3 },
      ingredients: {
        main: [
          { name: 'Ndolé', quantity: '500', unit: 'g' },
          { name: 'Crevettes', quantity: '300', unit: 'g' }
        ],
        sauce: [
          { name: 'Huile de palme', quantity: '50', unit: 'ml' }
        ]
      },
      tags: ['Plat traditionnel', 'Fruits de mer'],
      unlocked: true,
      status: 'completed',
      nutritionFacts: {
        perServing: {
          calories: 380
        }
      },
      category: 'traditionnel'
    },
    {
      id: '2',
      title: 'Poulet DG',
      description: 'Plat de prestige camerounais avec du poulet et des légumes, typique de Yaoundé',
      imageUrl: '/api/placeholder/400/300?text=Poulet%20DG',
      totalTime: 60,
      difficulty: 'medium',
      region: 'Centre',
      servings: { min: 2, max: 4, defaultSize: 4 },
      ingredients: {
        main: [
          { name: 'Poulet', quantity: '1', unit: 'kg' },
          { name: 'Plantain', quantity: '2', unit: 'pièces' }
        ],
        sauce: [
          { name: 'Épices', quantity: '1', unit: 'cuillère' }
        ]
      },
      tags: ['Plat de fête', 'Viande'],
      unlocked: true,
      nutritionFacts: {
        perServing: {
          calories: 450
        }
      },
      category: 'prestige'
    },
    {
      id: '3',
      title: 'Eru',
      description: 'Délicieux plat traditionnel des régions anglophones, à base de feuilles d\'eru et de viande',
      imageUrl: '/api/placeholder/400/300?text=Eru',
      totalTime: 90,
      difficulty: 'hard',
      region: 'Nord-Ouest',
      servings: { min: 2, max: 4, defaultSize: 3 },
      ingredients: {
        main: [
          { name: 'Feuilles d\'eru', quantity: '400', unit: 'g' },
          { name: 'Viande', quantity: '250', unit: 'g' }
        ],
        sauce: [
          { name: 'Huile de palme', quantity: '100', unit: 'ml' }
        ]
      },
      tags: ['Plat traditionnel', 'Régional'],
      unlocked: false,
      nutritionFacts: {
        perServing: {
          calories: 420
        }
      },
      category: 'traditionnel'
    }
  ];

  const [recipes] = useState<Recipe[]>(initialRecipes);
  const [filteredRecipes, setFilteredRecipes] = useState<Recipe[]>(initialRecipes);
  const [searchText, setSearchText] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filterRecipes = (searchValue: string, difficulty: string, category: string) => {
    let filtered = [...recipes];

    if (searchValue) {
      filtered = filtered.filter(recipe =>
        recipe.title.toLowerCase().includes(searchValue.toLowerCase()) ||
        recipe.region.toLowerCase().includes(searchValue.toLowerCase()) ||
        recipe.tags?.some(tag => tag.toLowerCase().includes(searchValue.toLowerCase())) ||
        recipe.ingredients.main.some(ing => ing.name.toLowerCase().includes(searchValue.toLowerCase())) ||
        (recipe.ingredients.sauce?.some(ing => ing.name.toLowerCase().includes(searchValue.toLowerCase())))
      );
    }

    if (difficulty !== 'all') {
      filtered = filtered.filter(recipe => recipe.difficulty === difficulty);
    }

    if (category !== 'all') {
      filtered = filtered.filter(recipe => recipe.category === category);
    }

    setFilteredRecipes(filtered);
  };

  const handleSearchChange = (value: string) => {
    setSearchText(value);
    filterRecipes(value, selectedDifficulty, selectedCategory);
  };

  const handleDifficultyChange = (e: CustomEvent<SegmentChangeEventDetail>) => {
    const value = e.detail.value as string;
    setSelectedDifficulty(value);
    filterRecipes(searchText, value, selectedCategory);
  };

  const handleCategoryChange = (e: CustomEvent<SegmentChangeEventDetail>) => {
    const value = e.detail.value as string;
    setSelectedCategory(value);
    filterRecipes(searchText, selectedDifficulty, value);
  };

  const RecipeCard: React.FC<{ recipe: Recipe }> = ({ recipe }) => (
    <IonCard className="recipe-card">
      <div className="relative">
        <img 
          src={recipe.imageUrl || '/api/placeholder/400/300'} 
          alt={recipe.title} 
          className="w-full h-48 object-cover"
        />
        {!recipe.unlocked && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <IonIcon icon={ribbonOutline} className="text-white w-8 h-8" />
          </div>
        )}
      </div>
      <IonCardContent>
        <div className="mb-3">
          <h3 className="font-bold text-lg mb-2">{recipe.title}</h3>
          <p className="text-sm text-gray-600 line-clamp-2">{recipe.description}</p>
        </div>

        <div className="grid grid-cols-2 gap-2 mb-3">
          <div className="flex items-center text-sm text-gray-500">
            <IonIcon icon={timeOutline} className="w-4 h-4 mr-1" />
            <span>{recipe.totalTime} min</span>
          </div>
          <div className="flex items-center text-sm text-gray-500">
            <IonIcon icon={peopleOutline} className="w-4 h-4 mr-1" />
            <span>{recipe.servings.defaultSize} pers.</span>
          </div>
          <div className="flex items-center text-sm text-gray-500">
            <IonIcon icon={locationOutline} className="w-4 h-4 mr-1" />
            <span>{recipe.region}</span>
          </div>
          <div className="flex items-center text-sm text-gray-500">
            <IonIcon icon={flameOutline} className="w-4 h-4 mr-1" />
            <span>{recipe.nutritionFacts.perServing.calories} kcal</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex flex-wrap gap-1">
            {recipe.tags?.slice(0, 2).map((tag, index) => (
              <IonChip key={index} color="primary" className="text-xs">
                {tag}
              </IonChip>
            ))}
          </div>
          <IonBadge color={
            recipe.difficulty === 'easy' ? 'success' :
            recipe.difficulty === 'medium' ? 'warning' : 'danger'
          }>
            {recipe.difficulty === 'easy' ? 'Facile' : 
             recipe.difficulty === 'medium' ? 'Moyen' : 'Difficile'}
          </IonBadge>
        </div>

        {recipe.status === 'completed' && (
          <div className="mt-2 flex items-center text-green-600">
            <IonIcon icon={ribbonOutline} className="w-4 h-4 mr-1" />
            <span className="text-sm">Maîtrisée</span>
          </div>
        )}
      </IonCardContent>
    </IonCard>
  );

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Recettes Camerounaises</IonTitle>
        </IonToolbar>
        <IonToolbar>
          <IonSearchbar
            value={searchText}
            onIonChange={e => handleSearchChange(e.detail.value ?? '')}
            placeholder="Rechercher une recette camerounaise..."
          />
        </IonToolbar>
        <IonToolbar>
          <IonSegment
            value={selectedDifficulty}
            onIonChange={handleDifficultyChange}
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
        <IonToolbar>
          <IonSegment
            value={selectedCategory}
            onIonChange={handleCategoryChange}
          >
            <IonSegmentButton value="all">
              <IonLabel>Toutes</IonLabel>
            </IonSegmentButton>
            <IonSegmentButton value="traditionnel">
              <IonLabel>Traditionnelles</IonLabel>
            </IonSegmentButton>
            <IonSegmentButton value="prestige">
              <IonLabel>Prestige</IonLabel>
            </IonSegmentButton>
          </IonSegment>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        <div className="p-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredRecipes.map(recipe => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </div>

        {filteredRecipes.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <p>Aucune recette trouvée</p>
          </div>
        )}
      </IonContent>
    </IonPage>
  );
};

export default RecipesPage;