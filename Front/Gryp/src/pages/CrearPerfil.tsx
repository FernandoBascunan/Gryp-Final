import React, { useState, useEffect } from 'react';
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonItem,
  IonLabel,
  IonInput,
  IonButton,
  IonList,
  IonAlert
} from '@ionic/react';
import { useHistory } from 'react-router-dom';
import Header from './Header';
import useUserData from '../Hooks/useUserData';
import axios from 'axios';

interface Trabajador {
  waiterID: number;
  waiterName: string;
  wRut: string;
  wPhone: string;
}

const CrearPerfil: React.FC = () => {
  const history = useHistory();
  const user = useUserData();
  const userID = user?.id;

  const [trabajadores, setTrabajadores] = useState<Trabajador[]>([]);
  const [nuevoTrabajador, setNuevoTrabajador] = useState<Omit<Trabajador, 'waiterID'>>({
    waiterName: '',
    wRut: '',
    wPhone: ''
  });
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  // Obtener trabajadores
  useEffect(() => {
    const fetchTrabajadores = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/workers/${userID}`);
        if (response.data.success) {
          setTrabajadores(response.data.workers);
        } else {
          setAlertMessage('No se encontraron trabajadores.');
          setShowAlert(true);
        }
      } catch (error) {
        console.error('Error al cargar trabajadores:', error);
        setAlertMessage('Error al cargar los trabajadores.');
        setShowAlert(true);
      }
    };

    if (userID) {
      fetchTrabajadores();
    }
  }, [userID]);

  const handleInputChange = (e: CustomEvent, field: keyof Omit<Trabajador, 'waiterID'>) => {
    setNuevoTrabajador({
      ...nuevoTrabajador,
      [field]: e.detail.value!
    });
  };

  const validarDatos = (): boolean => {
    if (!nuevoTrabajador.waiterName || !nuevoTrabajador.wRut || !nuevoTrabajador.wPhone) {
      setAlertMessage('Todos los campos son obligatorios');
      setShowAlert(true);
      return false;
    }
    return true;
  };

  const crearTrabajador = async () => {
    if (validarDatos()) {
      try {
        const response = await axios.post(`http://localhost:3000/api/workers/${userID}`, nuevoTrabajador);
        if (response.data.success) {
          setTrabajadores([...trabajadores, { waiterID: response.data.waiterID, ...nuevoTrabajador }]);
          setNuevoTrabajador({ waiterName: '', wRut: '', wPhone: '' });
          setAlertMessage('Trabajador creado exitosamente');
        } else {
          setAlertMessage('Error al crear el trabajador.');
        }
      } catch (error) {
        console.error('Error al crear trabajador:', error);
        setAlertMessage('Error al conectar con el servidor.');
      } finally {
        setShowAlert(true);
      }
    }
  };

  const eliminarTrabajador = async (waiterID: number) => {
    try {
      const response = await axios.delete(`http://localhost:3000/api/workers/${waiterID}`);
      if (response.data.success) {
        setTrabajadores(trabajadores.filter(t => t.waiterID !== waiterID));
        setAlertMessage('Trabajador eliminado exitosamente');
      } else {
        setAlertMessage('Error al eliminar el trabajador.');
      }
    } catch (error) {
      console.error('Error al eliminar trabajador:', error);
      setAlertMessage('Error al conectar con el servidor.');
    } finally {
      setShowAlert(true);
    }
  };

  return (
    <IonPage>
      <Header />
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>Gestión de Trabajadores</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        <IonCard>
          <IonCardHeader>
            <IonCardTitle>Crear Nuevo Trabajador</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <IonItem>
              <IonLabel position="floating">Nombre</IonLabel>
              <IonInput
                value={nuevoTrabajador.waiterName}
                onIonChange={(e) => handleInputChange(e, 'waiterName')}
                type="text"
              />
            </IonItem>
            <IonItem>
              <IonLabel position="floating">RUT</IonLabel>
              <IonInput
                value={nuevoTrabajador.wRut}
                onIonChange={(e) => handleInputChange(e, 'wRut')}
                type="text"
              />
            </IonItem>
            <IonItem>
              <IonLabel position="floating">Teléfono</IonLabel>
              <IonInput
                value={nuevoTrabajador.wPhone}
                onIonChange={(e) => handleInputChange(e, 'wPhone')}
                type="tel"
              />
            </IonItem>
            <IonButton expand="block" onClick={crearTrabajador} className="ion-margin-top">
              Crear Trabajador
            </IonButton>
          </IonCardContent>
        </IonCard>

        <IonCard>
          <IonCardHeader>
            <IonCardTitle>Lista de Trabajadores</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <IonList>
              {trabajadores.map(trabajador => (
                <IonItem key={trabajador.waiterID}>
                  <IonLabel>
                    <h2>{trabajador.waiterName}</h2>
                    <p>RUT: {trabajador.wRut}</p>
                    <p>Teléfono: {trabajador.wPhone}</p>
                  </IonLabel>
                  <IonButton
                    slot="end"
                    color="danger"
                    onClick={() => eliminarTrabajador(trabajador.waiterID)}
                  >
                    Eliminar
                  </IonButton>
                </IonItem>
              ))}
            </IonList>
          </IonCardContent>
        </IonCard>

        <IonButton
          expand="block"
          color="medium"
          className="ion-margin"
          onClick={() => history.push('/perfil')}
        >
          Volver
        </IonButton>

        <IonAlert
          isOpen={showAlert}
          onDidDismiss={() => setShowAlert(false)}
          header="Información"
          message={alertMessage}
          buttons={['OK']}
        />
      </IonContent>
    </IonPage>
  );
};

export default CrearPerfil;