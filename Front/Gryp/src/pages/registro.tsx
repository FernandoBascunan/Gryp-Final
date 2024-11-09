import axios from 'axios';
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
  IonSelect,
  IonSelectOption,
  IonCheckbox,
  IonText
} from '@ionic/react';
import { useHistory } from 'react-router-dom';
import { logoFacebook, logoTwitter, logoInstagram } from 'ionicons/icons';
import './registro.css';

type Region = 'Región Metropolitana' | 'Valparaíso' | 'Biobío';

interface ComunasPorRegion {
  [key: string]: string[];
}

const Registro: React.FC = () => {
  const [username, setUsername] = useState('');
  const [rut, setRut] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [region, setRegion] = useState<Region | ''>('');
  const [comuna, setComuna] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const history = useHistory();

  const regiones: Region[] = ['Región Metropolitana', 'Valparaíso', 'Biobío'];
  const comunas: ComunasPorRegion = {
    'Región Metropolitana': ['Santiago', 'Providencia', 'Las Condes'],
    'Valparaíso': ['Viña del Mar', 'Valparaíso', 'Quilpué'],
    'Biobío': ['Concepción', 'Talcahuano', 'Chillán']
  };

  const validateRut = (rut: string) => /^[0-9]{7,8}-[0-9Kk]{1}$/.test(rut);
  const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePhone = (phone: string) => /^\+?56?\s?[2-9]\d{8}$/.test(phone);
  const validatePassword = (password: string) => password.length >= 8;

  const handleRegistro = async () => {
    console.log("Botón de registro presionado"); // Para verificar que la función se ejecuta
    console.log("Valores actuales:", { username, rut, email, phone, region, comuna, password });
    
    const newErrors: { [key: string]: string } = {};

    if (!username) newErrors.username = 'El nombre de usuario es requerido.';
    if (!validateRut(rut)) newErrors.rut = 'RUT inválido. El formato correcto es 12345678-9 o 1234567-8.';
    if (!validateEmail(email)) newErrors.email = 'Email inválido. El formato correcto es ejemplo@dominio.com.';
    if (!validatePhone(phone)) newErrors.phone = 'Número telefónico inválido.';
    if (!region) newErrors.region = 'Seleccione una región.';
    if (!comuna) newErrors.comuna = 'Seleccione una comuna.';
    if (!validatePassword(password)) newErrors.password = 'La contraseña debe tener al menos 8 caracteres.';
    if (password !== confirmPassword) newErrors.confirmPassword = 'Las contraseñas no coinciden.';
    if (!acceptTerms) newErrors.acceptTerms = 'Debe aceptar los términos y condiciones.';

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      try {
        console.log("Enviando solicitud al servidor...");
        const response = await axios.post('http://localhost:3000/api/users', {
          username,
          rut,
          email,
          phone,
          region,
          comuna,
          password
        });
        console.log("Respuesta recibida:", response);
        
        if (response.status === 201) {
          console.log('Registro exitoso');
          history.push('./iniciarsesion');
        }
      } catch (error: any) {
        console.error('Error al registrar usuario:', error);
        setErrors({ general: 'Hubo un error al registrar. Inténtelo de nuevo.' });
      }
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Gryp</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="login-page">
        <div className="form-container">
          <div className="form-content">
            <h1>Registro</h1>
            <IonItem>
              <IonLabel position="floating">Nombre de usuario</IonLabel>
              <IonInput value={username} onIonChange={e => setUsername(e.detail.value!)} />
            </IonItem>
            {errors.username && <IonText color="danger">{errors.username}</IonText>}
            <IonItem>
              <IonLabel position="floating">RUT</IonLabel>
              <IonInput value={rut} onIonChange={e => setRut(e.detail.value!)} />
            </IonItem>
            {errors.rut && <IonText color="danger">{errors.rut}</IonText>}
            <IonItem>
              <IonLabel position="floating">Email</IonLabel>
              <IonInput type="email" value={email} onIonChange={e => setEmail(e.detail.value!)} />
            </IonItem>
            {errors.email && <IonText color="danger">{errors.email}</IonText>}
            <IonItem>
              <IonLabel position="floating">Número telefónico</IonLabel>
              <IonInput type="tel" value={phone} onIonChange={e => setPhone(e.detail.value!)} />
            </IonItem>
            {errors.phone && <IonText color="danger">{errors.phone}</IonText>}
            <IonItem>
              <IonLabel>Región</IonLabel>
              <IonSelect value={region} onIonChange={e => setRegion(e.detail.value)}>
                {regiones.map((reg) => (
                  <IonSelectOption key={reg} value={reg}>{reg}</IonSelectOption>
                ))}
              </IonSelect>
            </IonItem>
            {errors.region && <IonText color="danger">{errors.region}</IonText>}
            <IonItem>
              <IonLabel>Comuna</IonLabel>
              <IonSelect value={comuna} onIonChange={e => setComuna(e.detail.value)} disabled={!region}>
                {region && comunas[region as Region].map((com) => (
                  <IonSelectOption key={com} value={com}>{com}</IonSelectOption>
                ))}
              </IonSelect>
            </IonItem>
            {errors.comuna && <IonText color="danger">{errors.comuna}</IonText>}
            <IonItem>
              <IonLabel position="floating">Contraseña</IonLabel>
              <IonInput type="password" value={password} onIonChange={e => setPassword(e.detail.value!)} />
            </IonItem>
            {errors.password && <IonText color="danger">{errors.password}</IonText>}
            <IonItem>
              <IonLabel position="floating">Confirmar Contraseña</IonLabel>
              <IonInput type="password" value={confirmPassword} onIonChange={e => setConfirmPassword(e.detail.value!)} />
            </IonItem>
            {errors.confirmPassword && <IonText color="danger">{errors.confirmPassword}</IonText>}
            <IonItem>
              <IonLabel>Acepto los términos y condiciones</IonLabel>
              <IonCheckbox checked={acceptTerms} onIonChange={e => setAcceptTerms(e.detail.checked)} />
            </IonItem>
            {errors.acceptTerms && <IonText color="danger">{errors.acceptTerms}</IonText>}
            <IonButton expand="block" onClick={handleRegistro}>
              Registrarme
            </IonButton>
            <IonButton expand="block" fill="clear" onClick={() => history.push('./iniciarsesion')}>
              Ya tengo una cuenta
            </IonButton>
          </div>
        </div>
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

export default Registro;