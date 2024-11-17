import React, { useState, useEffect } from 'react';
import { 
  IonContent, IonHeader, IonPage, IonTitle, IonToolbar, 
  IonButton, IonInput, IonModal, IonActionSheet,
  IonCard, IonCardHeader, IonCardSubtitle, IonCardTitle, IonCardContent,
  IonItem, IonLabel, IonList, IonSelect, IonSelectOption, IonLoading
} from '@ionic/react';
import '../pages/Orden.css';
import Footer from './Footer';
import Header from './Header';

interface Order {
  orderID: number;
  waiterID: number;
  tableID: number;
  userID: number;
  waiterName?: string;
  tableNumber?: number;
  items?: string;
}

interface MenuItem {
  menuID: number;
  dishName: string;
}

interface Waiter {
  waiterID: number;
  waiterName: string;
}

const Orden: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [currentOrder, setCurrentOrder] = useState<Order>({
    orderID: 0,
    waiterID: 0,
    tableID: 0,
    userID: 1,
    items: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showActionSheet, setShowActionSheet] = useState(false);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [waiters, setWaiters] = useState<Waiter[]>([]);
  const [tables, setTables] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Obtener órdenes
      const ordersRes = await fetch('http://localhost:3000/api/orders');
      const ordersData = await ordersRes.json();
      if (ordersData.success) setOrders(ordersData.orders);

      // Obtener menú
      const menuRes = await fetch('http://localhost:3000/api/menu');
      const menuData = await menuRes.json();
      if (menuData.success) setMenuItems(menuData.menu);

      // Obtener meseros
      const waitersRes = await fetch('http://localhost:3000/api/waiters');
      const waitersData = await waitersRes.json();
      if (waitersData.success) setWaiters(waitersData.waiters);

      // Obtener mesas
      const tablesRes = await fetch('http://localhost:3000/api/mesas');
      const tablesData = await tablesRes.json();
      if (tablesData.success) setTables(tablesData.mesas);
    } catch (error) {
      console.error('Error al cargar datos:', error);
    }
    setLoading(false);
  };

  const handleAddOrder = () => {
    setIsEditing(false);
    setCurrentOrder({
      orderID: 0,
      waiterID: 0,
      tableID: 0,
      userID: 1,
      items: ''
    });
    setSelectedItems([]);
    setShowModal(true);
  };

  const handleEditOrder = (order: Order) => {
    setIsEditing(true);
    setCurrentOrder(order);
    setSelectedItems(order.items?.split(',').map(item => {
      const menuItem = menuItems.find(mi => mi.dishName === item.trim());
      return menuItem ? menuItem.menuID : 0;
    }).filter(id => id !== 0) || []);
    setShowModal(true);
    setShowActionSheet(false);
  };

  const handleDeleteOrder = async (orderID: number) => {
    try {
      const response = await fetch(`http://localhost:3000/api/orders/${orderID}`, {
        method: 'DELETE'
      });
      const data = await response.json();
      if (data.success) {
        fetchData();
      }
    } catch (error) {
      console.error('Error al eliminar orden:', error);
    }
    setShowActionSheet(false);
  };

  const handleSaveOrder = async () => {
    if (!currentOrder.waiterID || !currentOrder.tableID || selectedItems.length === 0) {
      // Show an alert here indicating missing fields if necessary
      return;
    }
  
    try {
      const method = isEditing ? 'PUT' : 'POST';
      const url = isEditing 
        ? `http://localhost:3000/api/orders/${currentOrder.orderID}`
        : 'http://localhost:3000/api/orders';
  
      // Prepare the payload
      const payload = {
        waiterID: currentOrder.waiterID,
        tableID: currentOrder.tableID,
        userID: currentOrder.userID,
        menuItems: selectedItems, // Sending IDs as an array
      };
  
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload),
      });
  
      const data = await response.json();
      if (data.success) {
        fetchData();
        setShowModal(false);
      } else {
        console.error('Server error:', data.error);
      }
    } catch (error) {
      console.error('Error al guardar orden:', error);
    }
  };
  
  const handleSelectOrder = (order: Order) => {
    setSelectedOrder(order);
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
        <IonLoading isOpen={loading} message="Cargando..." />
        
        <IonButton expand="block" onClick={handleAddOrder} className="ion-margin">
          Agregar Orden
        </IonButton>

        <div className="ordenes-container">
          {orders.map((order) => (
            <IonCard key={order.orderID} className="orden-card" onClick={() => handleSelectOrder(order)}>
              <IonCardHeader>
                <div className="orden-id">Orden #{order.orderID}</div>
                <IonCardSubtitle>Mesero: {order.waiterName}</IonCardSubtitle>
                <IonCardTitle>Mesa: {order.tableID || 'Sin asignar'}</IonCardTitle>
              </IonCardHeader>
              <IonCardContent>
  <div className="orden-items">
    Items: {order.items
      ? order.items
          .split(',')
          .map(menuID => {
            const menuItem = menuItems.find(mi => mi.menuID === parseInt(menuID.trim(), 10));
            return menuItem ? menuItem.dishName : `ID ${menuID} no encontrado`;
          })
          .join(', ')
      : 'No items'}
  </div>
</IonCardContent>
          </IonCard>          
          ))}
        </div>

        <IonModal isOpen={showModal} onDidDismiss={() => setShowModal(false)}>
          <IonHeader>
            <IonToolbar>
              <IonTitle>{isEditing ? 'Editar Orden' : 'Nueva Orden'}</IonTitle>
              <IonButton slot="end" onClick={() => setShowModal(false)}>Cerrar</IonButton>
            </IonToolbar>
          </IonHeader>
          <IonContent>
            <IonList>
              <IonItem>
                <IonLabel>Mesero</IonLabel>
                <IonSelect 
                  value={currentOrder.waiterID}
                  onIonChange={e => setCurrentOrder({...currentOrder, waiterID: e.detail.value})}
                >
                  {waiters.map(waiter => (
                    <IonSelectOption key={waiter.waiterID} value={waiter.waiterID}>
                      {waiter.waiterName}
                    </IonSelectOption>
                  ))}
                </IonSelect>
              </IonItem>

              <IonItem>
                <IonLabel>Mesa</IonLabel>
                <IonSelect
                  value={currentOrder.tableID}
                  onIonChange={e => setCurrentOrder({...currentOrder, tableID: e.detail.value})}
                >
                  {tables.map(table => (
                    <IonSelectOption key={table.tableID} value={table.tableID}>
                      Mesa {table.tableID}
                    </IonSelectOption>
                  ))}
                </IonSelect>
              </IonItem>

              <IonItem>
                <IonLabel>Items del Menú</IonLabel>
                <IonSelect
                  multiple={true}
                  value={selectedItems}
                  onIonChange={e => setSelectedItems(e.detail.value)}
                >
                  {menuItems.map(item => (
                    <IonSelectOption key={item.menuID} value={item.menuID}>
                      {item.dishName}
                    </IonSelectOption>
                  ))}
                </IonSelect>
              </IonItem>
            </IonList>

            <IonButton expand="block" onClick={handleSaveOrder} className="ion-margin">
              {isEditing ? 'Actualizar Orden' : 'Crear Orden'}
            </IonButton>
          </IonContent>
        </IonModal>

        <IonActionSheet
          isOpen={showActionSheet}
          onDidDismiss={() => setShowActionSheet(false)}
          buttons={[
            {
              text: 'Editar',
              handler: () => {
                if (selectedOrder) handleEditOrder(selectedOrder);
              }
            },
            {
              text: 'Eliminar',
              role: 'destructive',
              handler: () => {
                if (selectedOrder) handleDeleteOrder(selectedOrder.orderID);
              }
            },
            {
              text: 'Cancelar',
              role: 'cancel'
            }
          ]}
        />
      </IonContent>
      <Footer />
    </IonPage>
  );
};

export default Orden;