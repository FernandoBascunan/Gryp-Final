import React, { useState, useEffect } from 'react';
import {
  IonContent,
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButton,
  IonItem,
  IonLabel,
  IonInput,
  IonLoading,
  IonIcon,
  IonAvatar,
  IonCard,
  IonCardContent,
  useIonToast,
  IonButtons
} from '@ionic/react';
import { camera, pencil, logOut } from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import Header from './Header';
import Footer from './Footer';

const Perfil: React.FC = () => {
  const [profile, setProfile] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [present] = useIonToast();
  const history = useHistory();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('');
  const [rut, setRut] = useState('');



  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Token no encontrado. Inicia sesión nuevamente.');
      }
      console.log('Token recibido:', token);
      const response = await axios.get('http://localhost:3000/api/profile', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });

      const profile = response.data;
      setProfile(profile);
      setName(profile.userName || '');
      setPhone(profile.phone || '');
      setLocation(profile.region || '');
      setRut(profile.rut || '');
    } catch (error: any) {
      present({
        message: error.response?.data?.message || 'Error al cargar el perfil',
        duration: 3000,
        color: 'danger'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');

      if (!token) {
        throw new Error('Token no encontrado. Inicia sesión nuevamente.');
      }

      const response = await axios.put('http://localhost:3000/api/profile',
        { userName: name, phone, region: location, rut },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      const updatedProfile = response.data;
      setProfile(updatedProfile);
      setIsEditing(false);

      present({
        message: 'Perfil actualizado correctamente',
        duration: 2000,
        color: 'success'
      });
    } catch (error: any) {
      present({
        message: error.response?.data?.message || 'Error al actualizar el perfil',
        duration: 3000,
        color: 'danger'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userID');
    history.replace('/iniciarsesion');
  };

  return (
    <IonPage>
      <Header />
      <IonHeader>
        <IonToolbar>
          <IonTitle>Gryp</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={() => setIsEditing(!isEditing)}>
              <IonIcon icon={pencil} />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <IonCard>
          <IonCardContent>
            <div className="ion-text-center ion-padding">
              <IonAvatar style={{ width: '100px', height: '100px', margin: '0 auto' }}>
                <img src={'/assets/default-avatar.png'} alt="Profile" />
              </IonAvatar>
              <IonButton fill="clear" size="small">
                <IonIcon icon={camera} />
              </IonButton>
            </div>

            <IonItem>
              <IonLabel position="stacked">Email</IonLabel>
              <IonInput value={profile?.email} readonly type="email" />
            </IonItem>

            <IonItem>
              <IonLabel position="stacked">Nombre</IonLabel>
              <IonInput
                value={profile?.userName}
                onIonChange={e => setName(e.detail.value!)}
                readonly={!isEditing}
              />
            </IonItem>

            <IonItem>
              <IonLabel position="stacked">Teléfono</IonLabel>
              <IonInput
                value={profile?.phone}
                onIonChange={e => setPhone(e.detail.value!)}
                readonly={!isEditing}
                type="tel"
              />
            </IonItem>

            <IonItem>
              <IonLabel position="stacked">Ubicación</IonLabel>
              <IonInput
                value={profile?.region}
                onIonChange={e => setLocation(e.detail.value!)}
                readonly={!isEditing}
              />
            </IonItem>

            <IonItem>
              <IonLabel position="stacked">RUT</IonLabel>
              <IonInput
                value={rut}
                onIonChange={e => setRut(e.detail.value!)}
                readonly={!isEditing}
              />
            </IonItem>

            {isEditing && (
              <div className="ion-padding">
                <IonButton expand="block" onClick={handleSaveProfile}>
                  Guardar Cambios
                </IonButton>
              </div>
            )}
          </IonCardContent>
        </IonCard>

        <div className="ion-padding">
          <IonButton expand="block" color="danger" onClick={handleLogout}>
            <IonIcon slot="start" icon={logOut} />
            Cerrar Sesión
          </IonButton>
        </div>

        <IonLoading isOpen={loading} message={'Cargando...'} spinner="circles" />
      </IonContent>

      <Footer />
    </IonPage>
  );
};

export default Perfil;
