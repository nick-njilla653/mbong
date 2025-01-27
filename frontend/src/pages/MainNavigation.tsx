import React, { useState, useEffect } from 'react';
import {
  IonTabs,
  IonIcon,
  IonLabel,
  IonTabBar,
  IonTabButton,
  IonRouterOutlet,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonPage
} from '@ionic/react';
import { home, book, trophy, person, settings, restaurant } from 'ionicons/icons';
import { Route, Redirect } from 'react-router-dom';
import { Card, CardHeader, CardContent } from '../components/ui/card';
import Profile from './Profile';
import Settings from './Settings';
import { GamificationRoutes } from '../navigation/GamificationRoutes';
import RecipeDetails from './RecipeDetails';
import LearningPath from './LearningPath';
import '../styles/MainNavigation.css';
import RecipesPage from './RecipePage';
import RecipeQuiz from '../components/features/quiz/RecipeQuiz';
import { Recipe } from '../types';
import { RecipeService } from '../services/recipe.service';


const MainNavigation: React.FC = () => {
  const [currentXP, setCurrentXP] = useState(0);
  const [streak, setStreak] = useState(0);
  const [recipes, setRecipes] = useState<Recipe[]>([]);

  useEffect(() => {
    loadRecipes();
  }, []);

  const loadRecipes = async () => {
    try {
      const recipeData = await RecipeService.getRecipes();
      setRecipes(recipeData);
    } catch (error) {
      console.error('Error loading recipes:', error);
    }
  };

  const handleQuizComplete = async (score: number) => {
    try {
      // Logique pour gérer le score du quiz
      if (score >= 70) {
        setCurrentXP(prev => prev + 50); // Récompense pour un bon score
      } else {
        setCurrentXP(prev => prev + 20); // Récompense de participation
      }
    } catch (error) {
      console.error('Error handling quiz completion:', error);
    }
  };

  const Dashboard = () => (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Tableau de bord</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <div className="flex flex-col h-screen bg-gray-50">
          {/* Header avec progression */}
          <div className="flex items-center justify-between p-4 bg-green-600 text-white">
            <div className="flex items-center space-x-4">
              <div className="text-xl font-bold">🔥 {streak}</div>
              <div className="w-32 h-4 bg-green-800 rounded-full">
                <div
                  className="h-full bg-yellow-400 rounded-full"
                  style={{ width: `${(currentXP % 100)}%` }}
                />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <IonIcon icon={trophy} className="w-6 h-6" />
              <span>{Math.floor(currentXP / 100)}</span>
            </div>
          </div>

          {/* Contenu principal */}
          <div className="flex-1 overflow-y-auto p-4">
            <Card className="mb-4">
              <CardHeader>
                <h2 className="text-xl font-bold">Parcours d'apprentissage</h2>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-4">
                  {['Débutant', 'Intermédiaire', 'Avancé'].map((niveau, index) => (
                    <div key={index} className="flex items-center p-4 bg-white rounded-lg shadow">
                      <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mr-4">
                        <span className="text-2xl">🥘</span>
                      </div>
                      <div>
                        <h3 className="font-bold">{niveau}</h3>
                        <p className="text-sm text-gray-600">Découvrez des recettes adaptées</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );

  return (
    <IonTabs>
      <IonRouterOutlet>
        <Route exact path="/app/dashboard" component={Dashboard} />
        <Route exact path="/app/learning" component={LearningPath} />
        <Route exact path="/app/recipes" component={RecipesPage} />
        <Route exact path="/app/recipe/:id" component={RecipeDetails} />
        <Route
          exact
          path="/app/recipe/:id/quiz"
          render={({ match }) => {
            const recipeId = match.params.id;
            const recipe = recipes.find(r => r.id === recipeId);
            if (!recipe) return <div>Recette non trouvée</div>;
            return <RecipeQuiz recipe={recipe} onComplete={handleQuizComplete} />;
          }}
        />
        <Route exact path="/app/profile" component={Profile} />
        <Route exact path="/app/settings" component={Settings} />
        <Route path="/app/gamification" component={GamificationRoutes} />
        <Route exact path="/app">
          <Redirect to="/app/dashboard" />
        </Route>
      </IonRouterOutlet>

      <IonTabBar slot="bottom" className="border-t">
        <IonTabButton tab="dashboard" href="/app/dashboard">
          <IonIcon icon={home} />
          <IonLabel>Accueil</IonLabel>
        </IonTabButton>
        <IonTabButton tab="learning" href="/app/learning">
          <IonIcon icon={book} />
          <IonLabel>Leçons</IonLabel>
        </IonTabButton>
        <IonTabButton tab="recipes" href="/app/recipes">
          <IonIcon icon={restaurant} />
          <IonLabel>Recettes</IonLabel>
        </IonTabButton>
        <IonTabButton tab="profile" href="/app/profile">
          <IonIcon icon={person} />
          <IonLabel>Profil</IonLabel>
        </IonTabButton>
        <IonTabButton tab="gamification" href="/app/gamification">
          <IonIcon icon={trophy} />
          <IonLabel>Progrès</IonLabel>
        </IonTabButton>
        <IonTabButton tab="settings" href="/app/settings">
          <IonIcon icon={settings} />
          <IonLabel>Paramètres</IonLabel>
        </IonTabButton>
      </IonTabBar>
    </IonTabs>
  );
};

export default MainNavigation;