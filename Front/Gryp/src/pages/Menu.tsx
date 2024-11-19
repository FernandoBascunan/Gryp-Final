import React, { useState, useEffect } from 'react';
import { 
  IonPage, 
  IonHeader, 
  IonToolbar, 
  IonTitle, 
  IonContent, 
  IonGrid, 
  IonRow, 
  IonCol, 
  IonCard, 
  IonCardHeader, 
  IonCardTitle, 
  IonCardContent, 
  IonItem, 
  IonLabel, 
  IonToggle, 
  IonButton, 
  IonInput, 
  IonToast 
} from '@ionic/react';
import Header from './Header';
import Footer from './Footer';
import useUserData from '../Hooks/useUserData';
import axios from 'axios';

interface Dish {
  menuID: number;
  dishName: string;
  dishStatus: boolean;
}

const Menu: React.FC = () => {
  const user = useUserData();
  const userID = user?.id;

  const [dishes, setDishes] = useState<Dish[]>([]);
  const [newDishName, setNewDishName] = useState<string>('');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState<string>('');

  // Cargar platos 
  useEffect(() => {
    const fetchDishes = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/menu/${userID}`);
        if (response.data.success) {
          setDishes(response.data.storage);
        } else {
          setToastMessage('No se encontraron platos.');
          setShowToast(true);
        }
      } catch (error) {
        console.error('Error al cargar los platos:', error);
        setToastMessage('Error al cargar los platos.');
        setShowToast(true);
      }
    };

    if (userID) {
      fetchDishes();
    }
  }, [userID]);

  // Cambiar disponibilidad de un plato
  const toggleDishStatus = async (menuID: number, currentStatus: boolean) => {
    try {
      const newStatus = currentStatus ? 0 : 1; 
      console.log('Enviando datos:', { menuStatus: newStatus }); 
  
      const response = await axios.put(`http://localhost:3000/api/menu/${menuID}`, {
        menuStatus: newStatus,
      });
  
      if (response.data.success) {
        setDishes(dishes.map(dish =>
          dish.menuID === menuID ? { ...dish, dishStatus: !currentStatus } : dish
        ));
        setToastMessage('Estado del plato actualizado.');
      } else {
        setToastMessage('No se pudo actualizar el estado del plato.');
      }
    } catch (error) {
      console.error('Error al actualizar el estado del plato:', error);
      setToastMessage('Error al conectar con el servidor.');
    } finally {
      setShowToast(true);
    }
  };
  // Agregar un nuevo plato
  const addDish = async () => {
    if (!newDishName) {
      setToastMessage('Por favor ingrese el nombre del plato.');
      setShowToast(true);
      return;
    }

    try {
      const response = await axios.post(`http://localhost:3000/api/menu/${userID}`, {
        dishName: newDishName,
        dishStatus: true,
      });
      if (response.data.success) {
        const newDish: Dish = {
          menuID: response.data.menuID, 
          dishName: newDishName,
          dishStatus: true,
        };
        setDishes([...dishes, newDish]);
        setNewDishName('');
        setToastMessage('Plato agregado correctamente.');
      } else {
        setToastMessage('No se pudo agregar el plato.');
      }
    } catch (error) {
      console.error('Error al agregar el plato:', error);
      setToastMessage('Error al conectar con el servidor.');
    } finally {
      setShowToast(true);
    }
  };

  // Eliminar un plato
  const deleteDish = async (menuID: number) => {
    try {
      const response = await axios.delete(`http://localhost:3000/api/menu/${menuID}`);
      if (response.data.success) {
        setDishes(dishes.filter(dish => dish.menuID !== menuID));
        setToastMessage('Plato eliminado correctamente.');
      } else {
        setToastMessage('No se pudo eliminar el plato.');
      }
    } catch (error) {
      console.error('Error al eliminar el plato:', error);
      setToastMessage('Error al conectar con el servidor.');
    } finally {
      setShowToast(true);
    }
  };

  return (
    <IonPage>
      <Header />
      <IonHeader>
        <IonToolbar>
          <IonTitle>Menú de Platos</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        <IonGrid>
        <IonRow>
            <IonCol size="12">
              <IonItem>
                <IonLabel position="floating">Nombre del nuevo plato</IonLabel>
                <IonInput
                  value={newDishName}
                  onIonChange={e => setNewDishName(e.detail.value!)}
                />
              </IonItem>
              <IonButton expand="block" onClick={addDish}>
                Agregar Plato
              </IonButton>
            </IonCol>
          </IonRow>
          <IonRow>
            {dishes.map(dish => (
              <IonCol size="3" key={dish.menuID}>
                <IonCard>
                  <IonCardHeader>
                    <IonCardTitle>{dish.dishName}</IonCardTitle>
                  </IonCardHeader>
                  <IonCardContent>
                    <IonItem lines="none">
                      <IonLabel>Disponible</IonLabel>
                      <IonToggle
                        checked={dish.dishStatus}
                        onIonChange={() => toggleDishStatus(dish.menuID, dish.dishStatus)}
                      />
                    </IonItem>
                    <IonButton color="danger" onClick={() => deleteDish(dish.menuID)}>
                      Eliminar
                    </IonButton>
                  </IonCardContent>
                </IonCard>
              </IonCol>
            ))}
          </IonRow>

      
        </IonGrid>

        <IonToast
          isOpen={showToast}
          onDidDismiss={() => setShowToast(false)}
          message={toastMessage}
          duration={2000}
          color="success"
        />
      </IonContent>
      <Footer />
    </IonPage>
  );
};

export default Menu;
