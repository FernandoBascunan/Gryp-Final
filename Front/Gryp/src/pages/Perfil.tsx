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
import useUserData from '../Hooks/useUserData';
import Footer from './Footer';
import Header from './Header';

interface UserData {
  id: string;
  userName: string;
  rut: string;
  email: string;
  phone: string;
  region: string;
}

const Perfil: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const history = useHistory();



  const users = useUserData();
  const id = users?.id;
  const userName= users?.userName;
  const email=users?.email;
  const rut=users?.rut;
  const phone=users?.phone;
  const region=users?.region;

  console.log('Datos Perfil: ',id,userName,email,rut,phone,region)
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userID');
    history.replace('/iniciarsesion');
  };

  return (
    <IonPage>
      <Header/>
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
              <IonInput value={email} type="email" />
            </IonItem>

            <IonItem>
              <IonLabel position="stacked">Nombre</IonLabel>
              <IonInput value={userName}/>
            </IonItem>

            <IonItem>
              <IonLabel position="stacked">Teléfono</IonLabel>
              <IonInput value={phone}/>
            </IonItem>

            <IonItem>
              <IonLabel position="stacked">Ubicación</IonLabel>
              <IonInput value={region}/>
            </IonItem>

            <IonItem>
              <IonLabel position="stacked">RUT</IonLabel>
              <IonInput value={rut}/>
            </IonItem>

            {isEditing && (
              <div className="ion-padding">
                <IonButton expand="block" >
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
      <Footer/>
    </IonPage>
  );
};

export default Perfil;
