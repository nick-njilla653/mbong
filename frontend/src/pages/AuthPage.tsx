// src/pages/AuthPage.tsx
import React, { useState } from 'react';
import { IonPage, IonContent, IonButton, useIonToast } from '@ionic/react';
import { useAuth } from '../hooks/useAuth';
import { Input } from '../components/ui/Input';
import { Card, CardHeader, CardContent } from '../components/ui/card';
import { useHistory } from 'react-router-dom';
import '../styles/AuthPage.css';

const AuthPage: React.FC = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        dietaryPreferences: '',
        allergies: ''
    });
    const { login, register, loading, error } = useAuth();
    const [present] = useIonToast();
    const history = useHistory();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            await login(formData.email, formData.password);
            present({
              message: 'Connexion réussie',
              duration: 2000,
              color: 'success'
            });
            history.replace('/app/dashboard');
          } catch (error) {
            present({
              message: error instanceof Error ? error.message : 'Erreur de connexion',
              duration: 2000,
              color: 'danger'
            });
          }
        };

    return (
        <IonPage>
            <IonContent className="bg-gradient-to-b from-green-400 to-green-600">
                <div className="flex min-h-screen items-center justify-center p-4">
                    <Card className="w-full max-w-md">
                        <CardHeader>
                            <h1 className="text-2xl font-bold text-center mb-2">
                                {isLogin ? 'Connexion' : 'Inscription'} à Mbong
                            </h1>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <Input
                                    type="email"
                                    label="Email"
                                    value={formData.email}
                                    onChange={(value) => setFormData({ ...formData, email: value })}
                                />
                                <Input
                                    type="password"
                                    label="Mot de passe"
                                    value={formData.password}
                                    onChange={(value) => setFormData({ ...formData, password: value })}
                                />

                                {!isLogin && (
                                    <>
                                        <Input
                                            type="text"
                                            label="Préférences alimentaires"
                                            value={formData.dietaryPreferences}
                                            onChange={(value) => setFormData({ ...formData, dietaryPreferences: value })}
                                        />
                                        <Input
                                            type="text"
                                            label="Allergies"
                                            value={formData.allergies}
                                            onChange={(value) => setFormData({ ...formData, allergies: value })}
                                        />
                                    </>
                                )}

                                <IonButton expand="block" className="mt-6" type="submit">
                                    {isLogin ? 'Se connecter' : "S'inscrire"}
                                </IonButton>

                                <div className="text-center mt-4">
                                    <button
                                        type="button"
                                        className="text-green-600 hover:underline"
                                        onClick={() => setIsLogin(!isLogin)}
                                    >
                                        {isLogin ? "Pas encore de compte ? S'inscrire" : 'Déjà un compte ? Se connecter'}
                                    </button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </IonContent>
        </IonPage>
    );
};

export default AuthPage;