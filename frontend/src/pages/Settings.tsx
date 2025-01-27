// src/pages/Settings.tsx
import React, { useState } from 'react';
import {
    IonPage,
    IonContent,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonItem,
    IonLabel,
    IonToggle,
    IonSelect,
    IonSelectOption,
    useIonToast
} from '@ionic/react';
import { Card, CardContent } from '../components/ui/card';
import { Input } from '../components/ui/Input';
import '../styles/Settings.css';

const Settings: React.FC = () => {
    const [settings, setSettings] = useState({
        notifications: {
            daily: true,
            achievements: true,
            tips: true
        },
        preferences: {
            difficulty: 'medium',
            language: 'fr',
            dietaryRestrictions: [] as string[]
        }
    });
    const [present] = useIonToast();

    const handleNotificationChange = (key: string) => {
        setSettings(prev => ({
            ...prev,
            notifications: {
                ...prev.notifications,
                [key]: !prev.notifications[key as keyof typeof prev.notifications]
            }
        }));
    };

    const handlePreferenceChange = (key: string, value: any) => {
        setSettings(prev => ({
            ...prev,
            preferences: {
                ...prev.preferences,
                [key]: value
            }
        }));
    };

    const saveSettings = async () => {
        try {
            // Simulation d'appel API
            await fetch('/api/settings', {
                method: 'PUT',
                body: JSON.stringify(settings)
            });
            present({
                message: 'Paramètres sauvegardés',
                duration: 2000,
                color: 'success'
            });
        } catch (error) {
            present({
                message: 'Erreur lors de la sauvegarde',
                duration: 2000,
                color: 'danger'
            });
        }
    };

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>Paramètres</IonTitle>
                </IonToolbar>
            </IonHeader>

            <IonContent className="ion-padding">
                <Card className="mb-6">
                    <CardContent>
                        <h2 className="text-xl font-bold mb-4">Notifications</h2>

                        <div className="space-y-4">
                            <IonItem>
                                <IonLabel>Rappels quotidiens</IonLabel>
                                <IonToggle
                                    checked={settings.notifications.daily}
                                    onIonChange={() => handleNotificationChange('daily')}
                                />
                            </IonItem>
                            <IonItem>
                                <IonLabel>Notifications de succès</IonLabel>
                                <IonToggle
                                    checked={settings.notifications.achievements}
                                    onIonChange={() => handleNotificationChange('achievements')}
                                />
                            </IonItem>
                            <IonItem>
                                <IonLabel>Conseils et astuces</IonLabel>
                                <IonToggle
                                    checked={settings.notifications.tips}
                                    onIonChange={() => handleNotificationChange('tips')}
                                />
                            </IonItem>
                        </div>
                    </CardContent>
                </Card>

                <Card className="mb-6">
                    <CardContent>
                        <h2 className="text-xl font-bold mb-4">Préférences d'apprentissage</h2>
                        <div className="space-y-4">
                            <IonItem>
                                <IonLabel>Niveau de difficulté</IonLabel>
                                <IonSelect
                                    value={settings.preferences.difficulty}
                                    onIonChange={e => handlePreferenceChange('difficulty', e.detail.value)}
                                >
                                    <IonSelectOption value="easy">Facile</IonSelectOption>
                                    <IonSelectOption value="medium">Moyen</IonSelectOption>
                                    <IonSelectOption value="hard">Difficile</IonSelectOption>
                                </IonSelect>
                            </IonItem>

                            <IonItem>
                                <IonLabel>Langue</IonLabel>
                                <IonSelect
                                    value={settings.preferences.language}
                                    onIonChange={e => handlePreferenceChange('language', e.detail.value)}
                                >
                                    <IonSelectOption value="fr">Français</IonSelectOption>
                                    <IonSelectOption value="en">English</IonSelectOption>
                                </IonSelect>
                            </IonItem>

                            <IonItem>
                                <IonLabel>Restrictions alimentaires</IonLabel>
                                <IonSelect
                                    multiple={true}
                                    value={settings.preferences.dietaryRestrictions}
                                    onIonChange={e => handlePreferenceChange('dietaryRestrictions', e.detail.value)}
                                >
                                    <IonSelectOption value="vegetarian">Végétarien</IonSelectOption>
                                    <IonSelectOption value="vegan">Vegan</IonSelectOption>
                                    <IonSelectOption value="gluten-free">Sans gluten</IonSelectOption>
                                    <IonSelectOption value="lactose-free">Sans lactose</IonSelectOption>
                                </IonSelect>
                            </IonItem>
                        </div>
                    </CardContent>
                </Card>

                <div className="flex justify-center">
                    <button
                        onClick={saveSettings}
                        className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                        Sauvegarder les paramètres
                    </button>
                </div>
            </IonContent>
        </IonPage>
    );
};

export default Settings;