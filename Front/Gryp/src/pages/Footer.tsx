
import {  IonTabBar, IonTabButton, IonIcon, IonLabel, IonFooter } from '@ionic/react';
import { personCircle, gridOutline, restaurantOutline, cubeOutline,newspaperOutline } from 'ionicons/icons';
import {useHistory} from 'react-router-dom';
const Footer: React.FC = () => {
    const history = useHistory();
    const profile = () => {
        history.push('./Perfil');
      };
    const tables = () => {
        history.push('./Mesas');
    };
    const onMenu = () => {
        history.push('./Menu');
    };
    const inventory = () => {
        history.push('./Inventario');
    };
    const order = () => {
      history.push('./Orden');
  };
    return(
        <IonFooter>
            <IonTabBar slot="bottom">
              <IonTabButton onClick={profile}tab="perfil" href="/Perfil">
                <IonIcon icon={personCircle} />
                <IonLabel>Perfil</IonLabel>
              </IonTabButton>


              <IonTabButton onClick={tables} tab="mesas" href="/Mesas">
                <IonIcon icon={gridOutline} />
                <IonLabel>Mesas</IonLabel>
              </IonTabButton>

              <IonTabButton onClick={order} tab="orden" href="/Orden">
                <IonIcon icon={newspaperOutline} />
                <IonLabel>Ordenes</IonLabel>
              </IonTabButton>


              <IonTabButton onClick={onMenu} tab="Menu" href="/Menu">
                <IonIcon icon={restaurantOutline} />
                <IonLabel>Menú</IonLabel>
              </IonTabButton>


              <IonTabButton onClick={inventory} tab="inventario" href="/Inventario">
                <IonIcon icon={cubeOutline} />
                <IonLabel>Inventario</IonLabel>
              </IonTabButton>
            </IonTabBar>

      </IonFooter>
    )
}
export default Footer