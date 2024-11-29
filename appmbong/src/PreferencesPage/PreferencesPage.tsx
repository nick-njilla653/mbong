import React, { useState } from 'react';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  IonIcon,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonItem,
  IonLabel,
  IonInput,
  IonSelect,
  IonSelectOption,
  IonButtons,
  IonBackButton,
  IonProgressBar,
  IonRange,
  IonText,
  IonSearchbar,
  IonChip,
  IonAlert,
  useIonRouter
} from '@ionic/react';
import {
  personOutline,
  scaleOutline,
  fitnessOutline,
  arrowForward,
  arrowBack,
  bicycleOutline,
  closeCircle,
  leafOutline
} from 'ionicons/icons';
import './PreferencesPage.css'

interface UserInfo {
  age: string;
  weight: string;
  height: string;
  gender: 'male' | 'female' | 'other';
  activityLevel: string;
  goal: string;
}

interface DietaryPreferences {
  isVegetarian: boolean;
  allergies: string[];
}

const PreferencesPage: React.FC = () => {
  
  const router = useIonRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // États pour les informations personnelles
  const [userInfo, setUserInfo] = useState<UserInfo>({
    age: '',
    weight: '',
    height: '',
    gender: 'other',
    activityLevel: 'moderate',
    goal: 'maintain'
  });

  // États pour les préférences alimentaires
  const [dietaryPreferences, setDietaryPreferences] = useState<DietaryPreferences>({
    isVegetarian: false,
    allergies: []
  });
  const [searchAllergy, setSearchAllergy] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);

  const activityLevels = [
    {
      value: 'sedentary',
      label: 'Sédentaire',
      description: 'Peu ou pas d\'exercice'
    },
    {
      value: 'light',
      label: 'Légèrement actif',
      description: '1-3 jours d\'exercice par semaine'
    },
    {
      value: 'moderate',
      label: 'Modérément actif',
      description: '3-5 jours d\'exercice par semaine'
    },
    {
      value: 'very',
      label: 'Très actif',
      description: '6-7 jours d\'exercice par semaine'
    },
    {
      value: 'extra',
      label: 'Extrêmement actif',
      description: 'Exercice intense quotidien'
    }
  ];

  const commonAllergies = [
    { id: 'gluten', name: 'Gluten', icon: '🌾' },
    { id: 'dairy', name: 'Produits laitiers', icon: '🥛' },
    { id: 'eggs', name: 'Œufs', icon: '🥚' },
    { id: 'nuts', name: 'Fruits à coque', icon: '🥜' },
    { id: 'peanuts', name: 'Arachides', icon: '🥜' },
    { id: 'seafood', name: 'Fruits de mer', icon: '🦐' },
    { id: 'fish', name: 'Poisson', icon: '🐟' },
    { id: 'soy', name: 'Soja', icon: '🫘' }
  ];

  const handleInputChange = (field: keyof UserInfo, value: string) => {
    setUserInfo(prev => ({ ...prev, [field]: value }));
  };

  const validateStep1 = () => {
    if (!userInfo.age || !userInfo.weight || !userInfo.height) {
      setErrorMessage('Veuillez remplir tous les champs obligatoires');
      setShowErrorAlert(true);
      return false;
    }
    if (parseInt(userInfo.age) < 15 || parseInt(userInfo.age) > 100) {
      setErrorMessage('L\'âge doit être compris entre 15 et 100 ans');
      setShowErrorAlert(true);
      return false;
    }
    if (parseFloat(userInfo.weight) < 30 || parseFloat(userInfo.weight) > 250) {
      setErrorMessage('Le poids doit être compris entre 30 et 250 kg');
      setShowErrorAlert(true);
      return false;
    }
    if (parseInt(userInfo.height) < 100 || parseInt(userInfo.height) > 250) {
      setErrorMessage('La taille doit être comprise entre 100 et 250 cm');
      setShowErrorAlert(true);
      return false;
    }
    return true;
  };

  const handleAllergyAdd = (allergy: string) => {
    if (!dietaryPreferences.allergies.includes(allergy)) {
      setDietaryPreferences(prev => ({
        ...prev,
        allergies: [...prev.allergies, allergy]
      }));
    }
    setSearchAllergy('');
    setShowSuggestions(false);
  };

  const handleAllergyRemove = (allergy: string) => {
    setDietaryPreferences(prev => ({
      ...prev,
      allergies: prev.allergies.filter(a => a !== allergy)
    }));
  };

  const calculateBMI = () => {
    const weight = parseFloat(userInfo.weight);
    const height = parseInt(userInfo.height) / 100;
    if (weight && height) {
      return (weight / (height * height)).toFixed(1);
    }
    return null;
  };

  const getBMICategory = (bmi: number) => {
    if (bmi < 18.5) {
      return { category: 'Sous-poids', color: 'warning' };
    } else if (bmi >= 18.5 && bmi < 25) {
      return { category: 'Poids normal', color: 'success' };
    } else if (bmi >= 25 && bmi < 30) {
      return { category: 'Surpoids', color: 'warning' };
    } else {
      return { category: 'Obésité', color: 'danger' };
    }
  };


  const renderUserInfoSection = () => (
    <div className="user-info-section">
      <IonCard className="info-card">
        <IonCardHeader>
          <IonCardTitle>Informations de Base</IonCardTitle>
        </IonCardHeader>
        <IonCardContent>
          <div className="gender-selector">
            <IonText color="medium" className="section-label">Genre</IonText>
            <div className="gender-buttons">
              <button
                className={`gender-button ${userInfo.gender === 'male' ? 'active' : ''}`}
                onClick={() => handleInputChange('gender', 'male')}
              >
                <div className="gender-icon male">♂</div>
                <span>Homme</span>
              </button>
              <button
                className={`gender-button ${userInfo.gender === 'female' ? 'active' : ''}`}
                onClick={() => handleInputChange('gender', 'female')}
              >
                <div className="gender-icon female">♀</div>
                <span>Femme</span>
              </button>
              <button
                className={`gender-button ${userInfo.gender === 'other' ? 'active' : ''}`}
                onClick={() => handleInputChange('gender', 'other')}
              >
                <div className="gender-icon other">⚧</div>
                <span>Autre</span>
              </button>
            </div>
          </div>

          <div className="metrics-section">
            <div className="metric-input">
              <IonText color="medium" className="section-label">Âge</IonText>
              <div className="input-container">
                <IonIcon icon={personOutline} className="input-icon" />
                <IonInput
                  type="number"
                  value={userInfo.age}
                  onIonChange={e => handleInputChange('age', e.detail.value!)}
                  placeholder="Votre âge"
                  className="custom-input"
                  min={15}
                  max={100}
                />
                <span className="unit">ans</span>
              </div>
            </div>

            <div className="metric-input">
              <IonText color="medium" className="section-label">Poids</IonText>
              <div className="input-container">
                <IonIcon icon={scaleOutline} className="input-icon" />
                <IonInput
                  type="number"
                  value={userInfo.weight}
                  onIonChange={e => handleInputChange('weight', e.detail.value!)}
                  placeholder="Votre poids"
                  className="custom-input"
                  min="30"
                  max="250"
                  step="0.1"
                />
                <span className="unit">kg</span>
              </div>
            </div>

            <div className="metric-input">
              <IonText color="medium" className="section-label">Taille</IonText>
              <div className="input-container">
                <IonIcon icon={fitnessOutline} className="input-icon" />
                <IonInput
                  type="number"
                  value={userInfo.height}
                  onIonChange={e => handleInputChange('height', e.detail.value!)}
                  placeholder="Votre taille"
                  className="custom-input"
                  min={100}
                  max={250}
                />
                <span className="unit">cm</span>
              </div>
            </div>
          </div>

          {userInfo.weight && userInfo.height && (
            <div className="bmi-section">
              <h4>Indice de Masse Corporelle (IMC)</h4>
              <div className="bmi-value">
                {calculateBMI()}
                <IonText
                  color={getBMICategory(parseFloat(calculateBMI()!)).color}
                  className="bmi-category"
                >
                  {getBMICategory(parseFloat(calculateBMI()!)).category}
                </IonText>
              </div>
              <div className="bmi-scale">
                <div className="scale-marker underweight">18.5</div>
                <div className="scale-marker normal">25</div>
                <div className="scale-marker overweight">30</div>
              </div>
            </div>
          )}

          <div className="activity-section">
            <IonText color="medium" className="section-label">
              Niveau d'activité
            </IonText>
            <div className="activity-slider">
              <IonRange
                min={0}
                max={4}
                step={1}
                snaps={true}
                value={activityLevels.findIndex(level => level.value === userInfo.activityLevel)}
                onIonChange={e => {
                  if (typeof e.detail.value === 'number') {
                    handleInputChange('activityLevel', activityLevels[e.detail.value].value);
                  }
                }}

              >
                <IonIcon icon={bicycleOutline} slot="start" />
                <IonIcon icon={bicycleOutline} slot="end" />
              </IonRange>
              <div className="activity-label">
                {activityLevels.find(level => level.value === userInfo.activityLevel)?.label}
              </div>
              <div className="activity-description">
                {activityLevels.find(level => level.value === userInfo.activityLevel)?.description}
              </div>
            </div>
          </div>
        </IonCardContent>
      </IonCard>
    </div>
  );

  const renderDietaryPreferences = () => (
    <div className="dietary-preferences-section">
      <IonCard className="diet-card">
        <IonCardHeader>
          <IonCardTitle>Régime Alimentaire</IonCardTitle>
        </IonCardHeader>
        <IonCardContent>
          <div className="diet-option">
            <button
              className={`diet-choice-button ${dietaryPreferences.isVegetarian ? 'active' : ''}`}
              onClick={() => setDietaryPreferences(prev => ({
                ...prev,
                isVegetarian: true
              }))}
            >
              <div className="diet-icon">🥬</div>
              <div className="diet-info">
                <h3>Végétarien</h3>
                <p>Pas de viande ni de poisson</p>
              </div>
            </button>

            <button
              className={`diet-choice-button ${!dietaryPreferences.isVegetarian ? 'active' : ''}`}
              onClick={() => setDietaryPreferences(prev => ({
                ...prev,
                isVegetarian: false
              }))}
            >
              <div className="diet-icon">🍖</div>
              <div className="diet-info">
                <h3>Standard</h3>
                <p>Tous types d'aliments</p>
              </div>
            </button>
          </div>
        </IonCardContent>
      </IonCard>

      <IonCard className="allergies-card">
        <IonCardHeader>
          <IonCardTitle>Allergies et Intolérances</IonCardTitle>
        </IonCardHeader>
        <IonCardContent>
          <div className="allergies-grid">
            {commonAllergies.map(allergy => (
              <button
                key={allergy.id}
                className={`allergy-button ${dietaryPreferences.allergies.includes(allergy.name) ? 'active' : ''
                  }`}
                onClick={() => {
                  if (dietaryPreferences.allergies.includes(allergy.name)) {
                    handleAllergyRemove(allergy.name);
                  } else {
                    handleAllergyAdd(allergy.name);
                  }
                }}
              >
                <span className="allergy-icon">{allergy.icon}</span>
                <span className="allergy-name">{allergy.name}</span>
                {dietaryPreferences.allergies.includes(allergy.name) && (
                  <span className="selected-indicator">✓</span>
                )}
              </button>
            ))}
          </div>

          <div className="custom-allergy-input">
            <IonSearchbar
              value={searchAllergy}
              onIonChange={e => {
                setSearchAllergy(e.detail.value || '');
                setShowSuggestions(true);
              }}
              placeholder="Autre allergie ?"
              className="custom-searchbar"
            />
            {searchAllergy.length > 0 && (
              <IonButton
                fill="clear"
                onClick={() => handleAllergyAdd(searchAllergy)}
              >
                Ajouter
              </IonButton>
            )}
          </div>

          {dietaryPreferences.allergies.length > 0 && (
            <div className="selected-allergies">
              <h4>Allergies sélectionnées</h4>
              <div className="allergy-chips">
                {dietaryPreferences.allergies.map(allergy => (
                  <IonChip
                    key={allergy}
                    className="allergy-chip"
                    onClick={() => handleAllergyRemove(allergy)}
                  >
                    <IonLabel>{allergy}</IonLabel>
                    <IonIcon icon={closeCircle} />
                  </IonChip>
                ))}
              </div>
            </div>
          )}
        </IonCardContent>
      </IonCard>
    </div>
  );

  const handleNext = () => {
    if (currentStep === 1) {
      if (validateStep1()) {
        setCurrentStep(2);
      }
    } else {
      //Envoyer les données au serveur
      console.log('Données complètes:', {
        userInfo,
        dietaryPreferences
      });
      // Ajouter la navigation vers la page suivante
      router.push('/MealSelection');
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            {currentStep > 1 && (
              <IonButton onClick={() => setCurrentStep(currentStep - 1)}>
                <IonIcon slot="icon-only" icon={arrowBack} />
              </IonButton>
            )}
            <IonBackButton defaultHref="/" />
          </IonButtons>
          <IonTitle>
            {currentStep === 1 ? 'Profil Personnel' : 'Préférences Alimentaires'}
          </IonTitle>
        </IonToolbar>
        <IonProgressBar
          value={currentStep / 2}
          className="step-progress"
        />
      </IonHeader>

      <IonContent className="preferences-content">
        <div className="preferences-container">
          {currentStep === 1 ? renderUserInfoSection() : renderDietaryPreferences()}

          <IonButton
            expand="block"
            className="next-button"
            onClick={handleNext}
          >
            {currentStep === 2 ? 'Terminer' : 'Suivant'}
            <IonIcon slot="end" icon={arrowForward} />
          </IonButton>
        </div>

        <IonAlert
          isOpen={showErrorAlert}
          onDidDismiss={() => setShowErrorAlert(false)}
          header="Erreur"
          message={errorMessage}
          buttons={['OK']}
        />
      </IonContent>
    </IonPage>
  );
};

export default PreferencesPage;