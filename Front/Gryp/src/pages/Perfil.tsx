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
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import useUserData from './useUserData';

interface UserData {
  id: string;
  userName: string;
  rut: string;
  email: string;
  phone: string;
  region: string;
}

interface DecodedToken {
  id: string;
}

const Perfil: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [present] = useIonToast();
  const history = useHistory();
  const [user, setUser] = useState<UserData | null>(null);

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('');
  const [rut, setRut] = useState('');

  const users = useUserData();



  

  const handleSaveProfile = async () => {
   
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userID');
    localStorage.removeItem('user');
    history.replace('/iniciarsesion');
  };

  return (
    <IonPage>
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
              <IonInput value={user?.email} readonly type="email" />
            </IonItem>

            <IonItem>
              <IonLabel position="stacked">Nombre</IonLabel>
              <IonInput
                value={name || user?.userName}
                onIonChange={e => setName(e.detail.value!)}
                readonly={!isEditing}
              />
            </IonItem>

            <IonItem>
              <IonLabel position="stacked">Teléfono</IonLabel>
              <IonInput
                value={phone || user?.phone}
                onIonChange={e => setPhone(e.detail.value!)}
                readonly={!isEditing}
                type="tel"
              />
            </IonItem>

            <IonItem>
              <IonLabel position="stacked">Ubicación</IonLabel>
              <IonInput
                value={location || user?.region}
                onIonChange={e => setLocation(e.detail.value!)}
                readonly={!isEditing}
              />
            </IonItem>

            <IonItem>
              <IonLabel position="stacked">RUT</IonLabel>
              <IonInput
                value={rut || user?.rut}
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
    </IonPage>
  );
};

export default Perfil;