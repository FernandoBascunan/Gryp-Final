import React, { useState } from 'react';
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
  disponible: boolean;
  selected: boolean;
}

const Mesas: React.FC = () => {
  const [mesas, setMesas] = useState<Mesa[]>(
    Array.from({ length: 9 }, (_, index) => ({
      id: index + 1,
      disponible: true,
      selected: false,
    }))
  );

  const handleToggleChange = (mesaId: number) => {
    setMesas(mesas.map(mesa => {
      if (mesa.id === mesaId) {
        return {
          ...mesa,
          selected: !mesa.selected
        };
      }
      return {
        ...mesa,
        selected: false
      };
    }));
  };

  const cambiarDisponibilidad = (mesaId: number) => {
    setMesas(mesas.map(mesa => {
      if (mesa.id === mesaId) {
        return {
          ...mesa,
          disponible: !mesa.disponible,
          selected: false
        };
      }
      return mesa;
    }));
  };

  const agregarMesa = () => {
    const newId = mesas.length > 0 ? Math.max(...mesas.map(m => m.id)) + 1 : 1;
    setMesas([...mesas, {
      id: newId,
      disponible: true,
      selected: false
    }]);
  };

  const eliminarMesa = () => {
    const mesaSeleccionada = mesas.find(mesa => mesa.selected);
    if (mesaSeleccionada) {
      setMesas(mesas.filter(mesa => mesa.id !== mesaSeleccionada.id));
    }
  };

  const hayMesaSeleccionada = mesas.some(mesa => mesa.selected);

  return (
    <IonPage>
      <Header/>
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
                  className={`mesa ${mesa.selected ? 'seleccionada' : ''} ${
                    mesa.disponible ? 'desocupada' : 'ocupada'
                  }`}
                  onClick={() => handleToggleChange(mesa.id)}
                >
                  <span className="numero-mesa">Mesa {mesa.id}</span>
                  {mesa.selected && (
                    <span className="icono-seleccionado">
                      {mesa.disponible ? '✓' : '×'}
                    </span>
                  )}
                </div>
                <IonItem lines="none">
                  <IonLabel>Disponibilidad</IonLabel>
                  <IonToggle 
                    checked={mesa.disponible} 
                    onIonChange={() => cambiarDisponibilidad(mesa.id)}
                  />
                </IonItem>
              </IonCol>
            ))}
          </IonRow>
        </IonGrid>
      </IonContent>
      <Footer/>
    </IonPage>
  );
};

export default Mesas;