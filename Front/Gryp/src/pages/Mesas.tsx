import React, { useState, useEffect } from 'react';
import { 
  IonContent, 
  IonGrid, 
  IonRow, 
  IonCol, 
  IonItem, 
  IonLabel, 
  IonToggle,
  IonToolbar,
  IonTitle,
  IonHeader,
  IonPage,
  IonButton,
  IonIcon
} from '@ionic/react';
import { add, remove } from 'ionicons/icons';
import Header from './Header';
import Footer from './Footer';
import './Mesas.css';

interface Mesa {
  id: number;
  tableStatus: number; // 0 or 1 for available or occupied
  userID: number | null;
}

const Mesas: React.FC = () => {
  const [mesas, setMesas] = useState<Mesa[]>([]);

  useEffect(() => {
    // Cargar las mesas desde la base de datos
    fetch('http://localhost:3000/api/mesas')
      .then((response) => response.json())
      .then((data) => setMesas(data))
      .catch((error) => console.error('Error al cargar las mesas:', error));
  }, []);

  const handleToggleChange = (mesaId: number) => {
    setMesas(mesas.map(mesa => {
      if (mesa.id === mesaId) {
        return {
          ...mesa,
          tableStatus: mesa.tableStatus === 1 ? 0 : 1 // Cambiar estado
        };
      }
      return mesa;
    }));

    // Enviar la actualización al backend
    fetch(`http://localhost:3000/api/mesas/${mesaId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        tableStatus: mesas.find(mesa => mesa.id === mesaId)?.tableStatus === 1 ? 0 : 1
      }),
    }).catch((error) => console.error('Error al actualizar la mesa:', error));
  };

  const agregarMesa = () => {
    fetch('http://localhost:3000/api/mesas', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        tableStatus: 1,  // Disponible por defecto
        userID: 1, // Asignado al usuario 1
      }),
    })
      .then((response) => response.json())
      .then((newMesa) => setMesas([...mesas, newMesa]))
      .catch((error) => console.error('Error al agregar una mesa:', error));
  };

  const eliminarMesa = () => {
    const mesaSeleccionada = mesas.find(mesa => mesa.userID === 1); // Solo eliminar mesas del usuario actual
    if (mesaSeleccionada) {
      fetch(`http://localhost:3000/api/mesas/${mesaSeleccionada.id}`, {
        method: 'DELETE',
      })
        .then(() => {
          setMesas(mesas.filter(mesa => mesa.id !== mesaSeleccionada.id));
        })
        .catch((error) => console.error('Error al eliminar la mesa:', error));
    }
  };

  const hayMesaSeleccionada = mesas.some(mesa => mesa.userID === 1);

  return (
    <IonPage>
      <Header />
      <IonContent>
        <IonHeader>
          <IonToolbar>
            <IonTitle>Gestión de Mesas</IonTitle>
          </IonToolbar>
        </IonHeader>

        <div className="acciones">
          <IonButton 
            expand="block"
            onClick={agregarMesa}
            className="boton-accion"
          >
            <IonIcon icon={add} slot="start" />
            Agregar Mesa
          </IonButton>
          
          <IonButton 
            expand="block"
            onClick={eliminarMesa}
            className="boton-accion"
            color="danger"
            disabled={!hayMesaSeleccionada}
          >
            <IonIcon icon={remove} slot="start" />
            Eliminar Mesa 
          </IonButton>
        </div>

        <IonGrid>
          <IonRow>
            {mesas.map((mesa) => (
              <IonCol size="6" sizeSm="4" sizeMd="3" key={mesa.id}>
                <div 
                  className={`mesa ${mesa.tableStatus === 1 ? 'desocupada' : 'ocupada'}`}
                  onClick={() => handleToggleChange(mesa.id)}
                >
                  <span className="numero-mesa">Mesa {mesa.id}</span>
                  {mesa.tableStatus === 1 ? (
                    <span className="icono-seleccionado">✓</span>
                  ) : (
                    <span className="icono-seleccionado">×</span>
                  )}
                </div>
                <IonItem lines="none">
                  <IonLabel>Disponibilidad</IonLabel>
                  <IonToggle 
                    checked={mesa.tableStatus === 1} 
                    onIonChange={() => handleToggleChange(mesa.id)}
                  />
                </IonItem>
              </IonCol>
            ))}
          </IonRow>
        </IonGrid>
      </IonContent>
      <Footer />
    </IonPage>
  );
};

export default Mesas;
