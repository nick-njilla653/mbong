// src/components/navigation/GamificationNav.tsx

import React from 'react';
import { Route, useHistory } from 'react-router-dom';
import { IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel, IonRouterOutlet } from '@ionic/react';
import { StreakTracker } from '../gamification/StreakTracker';
import { AchievementPopup } from '../gamification/AchievementPopup';
import { LevelUpModal } from '../gamification/LevelUpModal';
import { trophyOutline, flameOutline, starOutline } from 'ionicons/icons';
import { GamificationRoutes } from '../../navigation/GamificationRoutes';

export const GamificationNav: React.FC = () => {
    const history = useHistory();

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-2">
            <div className="flex justify-around">
                <button
                    onClick={() => history.push('/app/achievements')}
                    className="flex flex-col items-center p-2"
                >
                    <IonIcon icon={trophyOutline} className="w-6 h-6 text-green-600" />
                    <span className="text-xs">Succès</span>
                </button>
                <button
                    onClick={() => history.push('/app/streak')}
                    className="flex flex-col items-center p-2"
                >
                    <IonIcon icon={flameOutline} className="w-6 h-6 text-orange-500" />
                    <span className="text-xs">Séries</span>
                </button>
                <button
                    onClick={() => history.push('/app/level-progress')}
                    className="flex flex-col items-center p-2"
                >
                    <IonIcon icon={starOutline} className="w-6 h-6 text-yellow-500" />
                    <span className="text-xs">Niveau</span>
                </button>
            </div>
        </div>
    );
};

// Mise à jour du MainNavigation.tsx
export const MainNavigation: React.FC = () => {
    return (
        <IonTabs>
            <IonRouterOutlet>
                {/* Routes existantes */}
                <Route path="/app/gamification" component={GamificationRoutes} />
            </IonRouterOutlet>
            <IonTabBar slot="bottom">
                {/* Tabs existants */}
                <IonTabButton tab="gamification" href="/app/gamification">
                    <IonIcon icon={trophyOutline} />
                    <IonLabel>Progrès</IonLabel>
                </IonTabButton>
            </IonTabBar>
        </IonTabs>
    );
};