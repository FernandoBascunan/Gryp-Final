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
  tableID: number;
  tableStatus: number;
  userID: number | null;
  selected: boolean;
}

const Mesas: React.FC = () => {
  const [mesas, setMesas] = useState<Mesa[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetch('http://localhost:3000/api/mesas')
      .then((response) => response.json())
      .then((data) => {
        if (Array.isArray(data.mesas)) {
          const mesasConSelected = data.mesas.map((mesa: any) => ({
            ...mesa,
            selected: false
          }));
          setMesas(mesasConSelected);
        } else {
          console.error('Los datos de las mesas no son un array:', data);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error al cargar las mesas:', error);
        setLoading(false);
      });
  }, []);


  const handleToggleChange = (tableID: number) => {
    setMesas(prevMesas => prevMesas.map(mesa => ({
      ...mesa,
      selected: mesa.tableID === tableID ? !mesa.selected : false
    })));
  };

  const cambiarDisponibilidad = (tableID: number) => {
    const mesaActual = mesas.find(mesa => mesa.tableID === tableID);
    if (!mesaActual) return;

    const nuevoEstado = mesaActual.tableStatus === 1 ? 0 : 1;


    setMesas(prevMesas => prevMesas.map(mesa => 
      mesa.tableID === tableID 
        ? { ...mesa, tableStatus: nuevoEstado }
        : mesa
    ));


    fetch(`http://localhost:3000/api/mesas/${tableID}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        tableStatus: nuevoEstado
      }),
    })
      .then(response => response.json())
      .then(data => console.log('Mesa actualizada:', data))
      .catch(error => console.error('Error al actualizar mesa:', error));
  };

  const agregarMesa = () => {
    const nuevaMesa = {
      tableStatus: 1,
      userID: null,
      selected: false
    };

    fetch('http://localhost:3000/api/mesas', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(nuevaMesa),
    })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
 
          const mesaCompleta = {
            ...nuevaMesa,
            tableID: data.mesaId
          };
          setMesas(prevMesas => [...prevMesas, mesaCompleta]);
        }
      })
      .catch(error => console.error('Error al agregar mesa:', error));
  };

  const eliminarMesa = () => {
    const mesaSeleccionada = mesas.find(mesa => mesa.selected);
    if (mesaSeleccionada) {
      fetch(`http://localhost:3000/api/mesas/${mesaSeleccionada.tableID}`, {
        method: 'DELETE',
      })
        .then(response => response.json())
        .then(data => {
          if (data.success) {
            setMesas(prevMesas => prevMesas.filter(mesa => mesa.tableID !== mesaSeleccionada.tableID));
          }
        })
        .catch(error => console.error('Error al eliminar mesa:', error));
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

        {loading ? (
          <div>Cargando...</div>
        ) : (
          <div>
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
                  <IonCol size="6" sizeSm="4" sizeMd="3" key={mesa.tableID}>
                    <div 
                      className={`mesa ${mesa.selected ? 'seleccionada' : ''} ${mesa.tableStatus === 1 ? 'desocupada' : 'ocupada'}`}
                      onClick={() => handleToggleChange(mesa.tableID)}
                    >
                      <span className="numero-mesa">Mesa {mesa.tableID}</span>
                      {mesa.selected && (
                        <span className="icono-seleccionado">
                          {mesa.tableStatus === 1 ? '✓' : '×'}
                        </span>
                      )}
                    </div>
                    <IonItem lines="none">
                      <IonLabel>Disponibilidad</IonLabel>
                      <IonToggle 
                        checked={mesa.tableStatus === 1}
                        onIonChange={() => cambiarDisponibilidad(mesa.tableID)}
                      />
                    </IonItem>
                  </IonCol>
                ))}
              </IonRow>
            </IonGrid>
          </div>
        )}
      </IonContent>
      <Footer/>
    </IonPage>
  );
};

export default Mesas;