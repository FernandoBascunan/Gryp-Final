import React, { useState } from 'react';
import { 
  IonContent, IonHeader, IonPage, IonTitle, IonToolbar, 
  IonButton, IonInput, IonTextarea, IonModal, IonActionSheet,
  IonCard, IonCardHeader, IonCardSubtitle, IonCardTitle, IonCardContent,
  IonItem, IonLabel
} from '@ionic/react';
import '../pages/Orden.css'; 
import Footer from './Footer';
import Header from './Header';



interface Orden {
  id: number;
  cajero: string;
  pedido: string;
  mesa: number;
}

const Orden: React.FC = () => {
  const [ordenes, setOrdenes] = useState<Orden[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [currentOrden, setCurrentOrden] = useState<Orden>({ id: 0, cajero: '', pedido: '', mesa: 0 });
  const [isEditing, setIsEditing] = useState(false);
  const [selectedOrden, setSelectedOrden] = useState<Orden | null>(null);
  const [showActionSheet, setShowActionSheet] = useState(false);

  const handleAddOrden = () => {
    setIsEditing(false);
    setCurrentOrden({ id: ordenes.length + 1, cajero: '', pedido: '', mesa: 0 });
    setShowModal(true);
  };

  const handleEditOrden = (orden: Orden) => {
    setIsEditing(true);
    setCurrentOrden(orden);
    setShowModal(true);
    setShowActionSheet(false);
  };

  const handleDeleteOrden = (id: number) => {
    setOrdenes(ordenes.filter(orden => orden.id !== id));
    setShowActionSheet(false);
  };

  const handleSaveOrden = () => {
    if (isEditing) {
      setOrdenes(ordenes.map(orden => orden.id === currentOrden.id ? currentOrden : orden));
    } else {
      setOrdenes([...ordenes, currentOrden]);
    }
    setShowModal(false);
  };

  const handleSelectOrden = (orden: Orden) => {
    setSelectedOrden(orden);
    setShowActionSheet(true);
  };

  return (
    <IonPage>
      <Header/>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Gestión de Órdenes</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonButton expand="block" onClick={handleAddOrden}>Agregar Orden</IonButton>
        <div className="ordenes-container">
          {ordenes.map((orden) => (
            <IonCard key={orden.id} className="orden-card" onClick={() => handleSelectOrden(orden)}>
              <IonCardHeader>
                <div className="orden-id">ID: {orden.id}</div>
                <IonCardSubtitle className="orden-cajero">{orden.cajero}</IonCardSubtitle>
                <IonCardTitle className="orden-pedido">{orden.pedido}</IonCardTitle>
              </IonCardHeader>
              <IonCardContent>
                <div className="orden-mesa">Mesa: {orden.mesa}</div>
              </IonCardContent>
            </IonCard>
          ))}
        </div>

        <IonModal isOpen={showModal}>
          <IonHeader>
            <IonToolbar>
              <IonTitle>{isEditing ? 'Editar Orden' : 'Nueva Orden'}</IonTitle>
            </IonToolbar>
          </IonHeader>
          <IonContent>
            <IonItem>
              <IonLabel position="floating">Cajero</IonLabel>
              <IonInput 
                value={currentOrden.cajero} 
                onIonChange={e => setCurrentOrden({...currentOrden, cajero: e.detail.value!})} 
              />
            </IonItem>
            <IonItem>
              <IonLabel position="floating">Pedido</IonLabel>
              <IonTextarea 
                value={currentOrden.pedido} 
                onIonChange={e => setCurrentOrden({...currentOrden, pedido: e.detail.value!})}
                rows={6}
                className="pedido-textarea"
              />
            </IonItem>
            <IonItem>
              <IonLabel position="floating">Mesa</IonLabel>
              <IonInput 
                type="number" 
                value={currentOrden.mesa} 
                onIonChange={e => setCurrentOrden({...currentOrden, mesa: parseInt(e.detail.value!, 10)})} 
              />
            </IonItem>
            <IonButton expand="block" onClick={handleSaveOrden}>Guardar</IonButton>
            <IonButton expand="block" color="medium" onClick={() => setShowModal(false)}>Cancelar</IonButton>
          </IonContent>
        </IonModal>

        <IonActionSheet
          isOpen={showActionSheet}
          onDidDismiss={() => setShowActionSheet(false)}
          buttons={[
            {
              text: 'Editar',
              handler: () => {
                if (selectedOrden) handleEditOrden(selectedOrden);
              }
            },
            {
              text: 'Eliminar',
              role: 'destructive',
              handler: () => {
                if (selectedOrden) handleDeleteOrden(selectedOrden.id);
              }
            },
            {
              text: 'Cancelar',
              role: 'cancel'
            }
          ]}
        />
      </IonContent>
      <Footer/>
    </IonPage>
  );
};

export default Orden;