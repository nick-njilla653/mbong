import { Redirect, Route } from 'react-router-dom';
import { IonApp, IonRouterOutlet, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { AuthProvider } from './contexts/AuthContext';
// import PrivateRoute from './components/PrivateRoute';
import MainNavigation from './pages/MainNavigation';
import Home from './pages/Home';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/**
 * Ionic Dark Mode
 * -----------------------------------------------------
 * For more info, please see:
 * https://ionicframework.com/docs/theming/dark-mode
 */

/* import '@ionic/react/css/palettes/dark.always.css'; */
/* import '@ionic/react/css/palettes/dark.class.css'; */
import '@ionic/react/css/palettes/dark.system.css';

/* Theme variables */
import AuthPage from './pages/AuthPage';
import LearningPath from './pages/LearningPath';
import RecipeDetails from './pages/RecipeDetails';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import Quiz from './components/features/quiz/Quiz';
import RecipeSteps from './components/features/recipe/RecipeSteps';
import RecipesPage from './pages/RecipesPage';
import RecipeLesson from './components/learning/RecipeLesson';
import { GamificationProvider } from './contexts/GamificationContext';
import './theme/variables.css';

setupIonicReact();

const App: React.FC = () => (
  <IonApp>
    <AuthProvider>
      <GamificationProvider>
        <IonReactRouter>
          <IonRouterOutlet>
            <Route exact path="/auth" component={AuthPage} />
            <Route exact path="/recipes" component={RecipesPage} />
            <Route exact path="/recipe/:id" component={RecipeLesson} />
            <Route path="/app" component={MainNavigation} />
            <Route exact path="/">
              <Redirect to="/app/dashboard" />
            </Route>
          </IonRouterOutlet>
        </IonReactRouter>
      </GamificationProvider>
    </AuthProvider>
  </IonApp>
);

export default App;
