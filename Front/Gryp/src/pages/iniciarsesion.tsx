import React, { useState, useEffect } from 'react';
import { 
  IonContent, 
  IonPage, 
  IonInput, 
  IonButton, 
  IonItem, 
  IonLabel, 
  IonHeader, 
  IonToolbar, 
  IonTitle, 
  IonIcon, 
  IonFooter,
  IonLoading,
  useIonToast
} from '@ionic/react';
import { useHistory } from 'react-router-dom';
import { logoFacebook, logoTwitter, logoInstagram } from 'ionicons/icons';
import './iniciarsesion.css';
import { useUser } from '../Context';

const IniciarSesion: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const { setUser } = useUser();
  const history = useHistory();
  
 
  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  const validatePassword = (password: string) => {
    const re = /^[A-Za-z\d@$!%*?&]{8,}$/;
    return re.test(password);
  };

  const handleLogin = async (e: React.FormEvent) =>{
    e.preventDefault();
    
    try {
      const response = await fetch('http://localhost:3000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setToastMessage(data.error || 'Error al iniciar sesión');
        setShowToast(true);
        return;
      }

      // Guardar datos del usuario en localStorage
      const transData=setUser(data);
      
      // Redirigir al home
      history.push('/Tab1');
      
    } catch (error) {
      setToastMessage('Error de conexión con el servidor');
      setShowToast(true);
    }
  };

  const handleRegister = () => {
    history.push('./registro');
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{
                width: '24px',
                height: '24px',
                backgroundColor: '#007bff',
                borderRadius: '50%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                marginRight: '8px',
                color: 'white',
                fontWeight: 'bold'
              }}>
                G
              </div>
              Gryp
            </div>
          </IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="login-page">
        <div className="form-container">
          <div className="form-content">
            <h1>Inicia Sesión</h1>
            
            <IonItem>
              <IonLabel position="floating">Email</IonLabel>
              <IonInput 
                type="email" 
                value={email} 
                onIonChange={(e) => setEmail(e.detail.value!)}
                required 
              />
            </IonItem>
            {emailError && <p className="error-message">{emailError}</p>}

            <IonItem>
              <IonLabel position="floating">Password</IonLabel>
              <IonInput 
                type="password" 
                value={password} 
                onIonChange={(e) => setPassword(e.detail.value!)}
                required
              />
            </IonItem>
            {passwordError && <p className="error-message">{passwordError}</p>}
            
            <a href="#" onClick={(e) => { 
              e.preventDefault(); 
              history.push('./recuperar-password');
            }}>
              ¿Olvidaste tu contraseña?
            </a>
            
            <IonButton expand="block" onClick={handleLogin} disabled={loading}>
              Iniciar Sesión
            </IonButton>
            
            <IonButton expand="block" onClick={handleRegister} disabled={loading}>
              Registrarme
            </IonButton>
          </div>
        </div>

        <IonLoading
          isOpen={loading}
          message={'Iniciando sesión...'}
          spinner="circles"
        />
      </IonContent>

      <IonFooter>
        <div className="social-icons">
          <IonIcon icon={logoInstagram} />
          <IonIcon icon={logoTwitter} />
          <IonIcon icon={logoFacebook} />
        </div>
      </IonFooter>
    </IonPage>
  );
};

export default IniciarSesion;