import React, { useState } from 'react';
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

interface Dish {
  name: string;
  image: string;
  selected: boolean;
}

const Menu: React.FC = () => {
  const [dishes, setDishes] = useState<Dish[]>([
    { name: 'Pizza', image: 'https://via.placeholder.com/150', selected: false },
    { name: 'Hamburguesa', image: 'https://via.placeholder.com/150', selected: false },
    { name: 'Ensalada', image: 'https://via.placeholder.com/150', selected: false },
    { name: 'Sushi', image: 'https://via.placeholder.com/150', selected: false },
  ]);

  const [newDish, setNewDish] = useState<Dish>({ name: '', image: 'https://via.placeholder.com/150', selected: false });
  const [showToast, setShowToast] = useState(false);

  const handleToggleChange = (index: number) => {
    const newDishes = [...dishes];
    newDishes[index].selected = !newDishes[index].selected;
    setDishes(newDishes);
  };

  const handleAddDish = () => {
    if (!newDish.name) {
      setShowToast(true); 
      return;
    }
    setDishes([...dishes, newDish]);
    setNewDish({ name: '', image: 'https://via.placeholder.com/150', selected: false });
  };

  const handleRemoveDish = (index: number) => {
    const newDishes = dishes.filter((_, i) => i !== index);
    setDishes(newDishes);
  };

  return (
    <IonPage>
      <Header/>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Menú de Platos</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        <IonGrid>
          <IonRow>
            {dishes.map((dish, index) => (
              <IonCol size="2" key={index}>
                <IonCard>
                  <img src={dish.image} alt={dish.name} />
                  <IonCardHeader>
                    <IonCardTitle>{dish.name}</IonCardTitle>
                  </IonCardHeader>
                  <IonCardContent>
                    <IonItem lines="none">
                      <IonLabel>Seleccionar</IonLabel>
                      <IonToggle 
                        checked={dish.selected} 
                        onIonChange={() => handleToggleChange(index)}
                      />
                    </IonItem>
                    <IonButton color="danger" onClick={() => handleRemoveDish(index)}>
                      Eliminar
                    </IonButton>
                  </IonCardContent>
                </IonCard>
              </IonCol>
            ))}
          </IonRow>

          <IonRow>
            <IonCol size="12">
              <IonItem>
                <IonLabel position="floating">Nombre del nuevo plato</IonLabel>
                <IonInput 
                  value={newDish.name} 
                  onIonChange={e => setNewDish({ ...newDish, name: e.detail.value! })} 
                />
              </IonItem>
              <IonButton expand="block" onClick={handleAddDish}>
                Agregar Plato
              </IonButton>
            </IonCol>
          </IonRow>
        </IonGrid>

        <IonToast
          isOpen={showToast}
          onDidDismiss={() => setShowToast(false)}
          message="Por favor ingrese el nombre del plato."
          duration={2000}
          color="warning"
        />
      </IonContent>
      <Footer/>
    </IonPage>
  );
};

export default Menu;
