import React, { useState } from 'react';
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
  IonButtons,
  IonListHeader
} from '@ionic/react';
import { mailOutline, callOutline,  logOut, idCardOutline, compassOutline, documentOutline,peopleOutline ,camera, pencil, mail,peopleCircle} from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import useUserData from '../Hooks/useUserData';
import Footer from './Footer';
import Header from './Header';
import './Perfil.css';

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
  const userName = users?.userName;
  const email = users?.email;
  const rut = users?.rut;
  const phone = users?.phone;
  const region = users?.region;

  console.log('Datos Perfil: ', id, userName, email, rut, phone, region);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userID');
    history.replace('/iniciarsesion');
  };
  const handleProfile = () =>{
    history.push('/CrearPerfil');
  }
  const handleReportDownload = () =>{
    const link = document.createElement('a');
    link.href = '/Files/Reporte.pdf'; 
    link.download = 'Reporte.pdf';
    link.click();
  }

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
        <div className="profile-header">
          <IonAvatar className="large-avatar">
          </IonAvatar>
          <img src="https://gravatar.com/avatar/dba6bae8c566f9d4041fb9cd9ada7741?d=identicon&f=y" alt="Avatar" />
          <IonButton fill="clear" size="small">
            <IonIcon icon={camera} />
            
          </IonButton>
          <h2>Mi restaurante: {userName || 'Usuario'}</h2>
          <p>{email}</p>
        </div>

        <IonCard>
          <IonCardContent>
            <IonItem lines="full">
              <IonIcon icon={mailOutline} slot="start" className="ion-icon-custom" />
              <IonLabel position="stacked">Email</IonLabel>
              <IonInput value={email} type="email" readonly />
            </IonItem>

            <IonItem lines="full">
              <IonIcon icon={peopleCircle} slot="start" className="ion-icon-custom" />
              <IonLabel position="stacked">Nombre</IonLabel>
              <IonInput value={userName} readonly={!isEditing} />
            </IonItem>

            <IonItem lines="full">
              <IonIcon icon={callOutline} slot="start" className="ion-icon-custom" />
              <IonLabel position="stacked">Teléfono</IonLabel>
              <IonInput value={phone} readonly={!isEditing} />
            </IonItem>

            <IonItem lines="full">
              <IonIcon icon={compassOutline} slot="start" className="ion-icon-custom" />
              <IonLabel position="stacked">Ubicación</IonLabel>
              <IonInput value={region} readonly={!isEditing} />
            </IonItem>

            <IonItem lines="full">
              <IonIcon icon={idCardOutline} slot="start" className="ion-icon-custom" />
              <IonLabel position="stacked">RUT</IonLabel>
              <IonInput value={rut} readonly={!isEditing} />
            </IonItem>

            {isEditing && (
              <div className="ion-padding">
                <IonButton expand="block">
                  Guardar Cambios
                </IonButton>
              </div>
            )}
          </IonCardContent>
        </IonCard>

        <div className="ion-padding">
          <IonListHeader>Opciones</IonListHeader>
          
          <IonItem button onClick={handleLogout}>
            <IonIcon icon={logOut} slot="start" />
            <IonLabel>Cerrar Sesión</IonLabel>
          </IonItem>
          <IonItem button onClick={handleProfile}>
            <IonIcon icon={peopleOutline} slot="start" />
            <IonLabel>Gestionar Trabajadores</IonLabel>
          </IonItem>
          <IonItem button onClick={handleReportDownload}>
            <IonIcon icon={documentOutline} slot="start" />
            <IonLabel>Reportes Mensuales</IonLabel>
          </IonItem>
        </div>

        <IonLoading isOpen={loading} message={'Cargando...'} spinner="circles" />
      </IonContent>
      <Footer />
    </IonPage>
  );
};

export default Perfil;