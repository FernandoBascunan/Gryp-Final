import React from 'react';
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonAvatar,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonIcon,
} from '@ionic/react';
import { mailOutline, callOutline, settings, logOut, idCardOutline, compassOutline, documentOutline,peopleOutline } from 'ionicons/icons';
import './Perfil.css';
import { useHistory } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

const Perfil: React.FC = () => {
  const history = useHistory();

  const handleLoginRedirect = () => {
    history.push('/iniciarsesion');
  };
  const handleProfile = () => {
    history.push('/CrearPerfil');
  };

  const handleReportDownload = () => {

    const link = document.createElement('a');
    link.href = '/Files/Reporte.pdf'; 
    link.download = 'Reporte.pdf';
    link.click();
  };

  return (
    <IonPage>
      <Header/>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Perfil</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <div className="profile-header">
          <IonAvatar className="large-avatar">
            <img src="https://gravatar.com/avatar/dba6bae8c566f9d4041fb9cd9ada7741?d=identicon&f=y" alt="Avatar" />
          </IonAvatar>
          <h2>Nombre de Usuario</h2>
          <p>Restaurante: Mi Restaurante</p>
        </div>

        <IonList>
          <IonListHeader>Información de contacto</IonListHeader>
          <IonItem>
            <IonIcon icon={idCardOutline} slot="start" />
            <IonLabel>
              <h2>Rut</h2>
              <p>12.345.678-9</p>
            </IonLabel>
          </IonItem>
          <IonItem>
            <IonIcon icon={mailOutline} slot="start" />
            <IonLabel>
              <h2>Email</h2>
              <p>usuario@ejemplo.com</p>
            </IonLabel>
          </IonItem>
          <IonItem>
            <IonIcon icon={callOutline} slot="start" />
            <IonLabel>
              <h2>Teléfono</h2>
              <p>+1 234 567 890</p>
            </IonLabel>
          </IonItem>
          <IonItem>
            <IonIcon icon={compassOutline} slot="start" />
            <IonLabel>
              <h2>Dirección</h2>
              <p>Avenida Brasil 2241,Valparaíso</p>
            </IonLabel>
          </IonItem>
        </IonList>

        <IonList>
          <IonListHeader>Opciones</IonListHeader>
          
          <IonItem button onClick={handleLoginRedirect}>
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
        </IonList>
        
      </IonContent>
      <Footer/>
    </IonPage>
  );
};

export default Perfil;