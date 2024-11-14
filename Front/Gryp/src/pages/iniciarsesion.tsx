import React, { useState } from 'react';
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

const IniciarSesion: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [present] = useIonToast();
  const history = useHistory();

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  const validatePassword = (password: string) => {
    return password.length >= 8;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validación
    if (!validateEmail(email)) {
      present({
        message: 'Por favor ingrese un email válido',
        duration: 3000,
        color: 'danger'
      });
      return;
    }
  
    if (!validatePassword(password)) {
      present({
        message: 'La contraseña debe tener al menos 8 caracteres',
        duration: 3000,
        color: 'danger'
      });
      return;
    }
  
    setLoading(true);
  
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
        throw new Error(data.message || 'Email o contraseña incorrectos');
      }
  
      // Guardar el token en localStorage directamente
      localStorage.setItem('token',data.token);
  
      present({
        message: '¡Bienvenido!',
        duration: 2000,
        color: 'success'
      });
  
      // Redirigir al home
      history.push('/Tab1');
      
    } catch (error) {
      present({
        message: error instanceof Error ? error.message : 'Error de conexión',
        duration: 3000,
        color: 'danger'
      });
    } finally {
      setLoading(false);
    }
  };

  // Resto del JSX se mantiene igual, solo actualizamos el manejo de errores
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

            <IonItem>
              <IonLabel position="floating">Password</IonLabel>
              <IonInput 
                type="password" 
                value={password} 
                onIonChange={(e) => setPassword(e.detail.value!)}
                required
              />
            </IonItem>
            
            <a href="#" onClick={(e) => { 
              e.preventDefault(); 
              history.push('./recuperar-password');
            }}>
              ¿Olvidaste tu contraseña?
            </a>
            
            <IonButton expand="block" onClick={handleLogin} disabled={loading}>
              Iniciar Sesión
            </IonButton>
            
            <IonButton expand="block" onClick={() => history.push('./registro')} disabled={loading}>
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