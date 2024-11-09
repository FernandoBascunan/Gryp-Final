import React, { useState } from 'react';
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



interface Trabajador {
  id: number;
  nombre: string;
  rut: string;
  telefono: string;
}

const CrearPerfil: React.FC = () => {
    const history = useHistory();

  const trabajadoresIniciales = [
    {
      id: 1,
      nombre: "Juan Pérez",
      rut: "12.345.678-9",
      telefono: "+56912345678"
    },
    {
      id: 2,
      nombre: "María González",
      rut: "98.765.432-1",
      telefono: "+56987654321"
    }
  ];

  const [trabajadores, setTrabajadores] = useState<Trabajador[]>(trabajadoresIniciales);
  const [nuevoTrabajador, setNuevoTrabajador] = useState<Omit<Trabajador, 'id'>>({
    nombre: '',
    rut: '',
    telefono: ''
  });
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');


  const handleInputChange = (e: CustomEvent, field: keyof Omit<Trabajador, 'id'>) => {
    setNuevoTrabajador({
      ...nuevoTrabajador,
      [field]: e.detail.value!
    });
  };

  const validarDatos = (): boolean => {
    if (!nuevoTrabajador.nombre || !nuevoTrabajador.rut || !nuevoTrabajador.telefono) {
      setAlertMessage('Todos los campos son obligatorios');
      setShowAlert(true);
      return false;
    }
    return true;
  };

  const crearTrabajador = () => {
    if (validarDatos()) {
      const nuevoId = trabajadores.length > 0 ? 
        Math.max(...trabajadores.map(t => t.id)) + 1 : 1;

      const nuevoRegistro = {
        id: nuevoId,
        ...nuevoTrabajador
      };

      setTrabajadores([...trabajadores, nuevoRegistro]);
      
      setNuevoTrabajador({
        nombre: '',
        rut: '',
        telefono: ''
      });

      setAlertMessage('Trabajador creado exitosamente');
      setShowAlert(true);
    }
  };

  const eliminarTrabajador = (id: number) => {
    setTrabajadores(trabajadores.filter(t => t.id !== id));
  };

  return (
    <IonPage>
      <Header/>
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
                value={nuevoTrabajador.nombre}
                onIonChange={(e) => handleInputChange(e, 'nombre')}
                type="text"
              />
            </IonItem>
            <IonItem>
              <IonLabel position="floating">RUT</IonLabel>
              <IonInput
                value={nuevoTrabajador.rut}
                onIonChange={(e) => handleInputChange(e, 'rut')}
                type="text"
              />
            </IonItem>
            <IonItem>
              <IonLabel position="floating">Teléfono</IonLabel>
              <IonInput
                value={nuevoTrabajador.telefono}
                onIonChange={(e) => handleInputChange(e, 'telefono')}
                type="tel"
              />
            </IonItem>
            <IonButton 
              expand="block" 
              onClick={crearTrabajador} 
              className="ion-margin-top"
            >
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
                <IonItem key={trabajador.id}>
                  <IonLabel>
                    <h2>{trabajador.nombre}</h2>
                    <p>RUT: {trabajador.rut}</p>
                    <p>Teléfono: {trabajador.telefono}</p>
                  </IonLabel>
                  <IonButton 
                    slot="end" 
                    color="danger" 
                    onClick={() => eliminarTrabajador(trabajador.id)}
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