import { useState } from 'react';
import { 
  IonContent, 
  IonPage, 
  IonItem, 
  IonLabel, 
  IonInput, 
  IonButton, 
  IonToast, 
  useIonRouter,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonFooter,
  IonIcon,
  IonSpinner
} from '@ionic/react';
import { logoFacebook, logoInstagram, logoTwitter, lockClosed } from 'ionicons/icons';
import './iniciarsesion.css';
import { useHistory } from 'react-router-dom';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useIonRouter();
  const history = useHistory();

  const handleLogin = async (e: React.FormEvent) => {
  };
 
  
  const handleRegister = () => {
    history.push('./registro');
  };
  return (
    <IonPage className="login-page">
      <IonHeader>
        <IonToolbar>
          <IonTitle>
            <span>
              <IonIcon icon={lockClosed} />
              Gryp
            </span>
          </IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <div className="form-container">
          <div className="form-content">
            <h1>Iniciar Sesión</h1>
            
            <form onSubmit={handleLogin}>
              <IonItem>
                <IonLabel position="floating">Email</IonLabel>
                <IonInput
                  type="email"
                  value={email}
                  onIonChange={e => setEmail(e.detail.value!)}
                  required
                  disabled={isLoading}
                />
              </IonItem>

              <IonItem>
                <IonLabel position="floating">Contraseña</IonLabel>
                <IonInput
                  type="password"
                  value={password}
                  onIonChange={e => setPassword(e.detail.value!)}
                  required
                  disabled={isLoading}
                />
              </IonItem>

              <IonButton 
                expand="block" 
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? (
                  <IonSpinner name="crescent" />
                ) : (
                  'Iniciar Sesión'
                )}
              </IonButton>
              <IonButton expand="block" onClick={handleRegister}>
              Registrarme
              </IonButton>

              <div className="ion-text-center ion-margin-top">
                <a href="/forgot-password">¿Olvidaste tu contraseña?</a>
              </div>
            </form>
          </div>
        </div>

        <IonToast
          isOpen={showToast}
          onDidDismiss={() => setShowToast(false)}
          message={toastMessage}
          duration={3000}
          color="danger"
        />
      </IonContent>

      <IonFooter>
        <div className="social-icons">
          <IonIcon icon={logoFacebook} />
          <IonIcon icon={logoInstagram} />
          <IonIcon icon={logoTwitter} />
        </div>
      </IonFooter>
    </IonPage>
  );
};

export default Login;