import React from 'react';
import {IonHeader, IonToolbar, IonTitle} from '@ionic/react';




const Header: React.FC = () => {
  return (
      <IonHeader>
        <IonToolbar>
          <IonTitle>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{ 
                width: '24px', 
                height: '24px', 
                backgroundColor: '#007bff', 
                borderRadius: '50%', 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center', 
                marginRight: '8px',
                color: 'white',
                fontWeight: 'bold'
              }}>
                G
              </div>
              Gryp
            </div>
          </IonTitle>
        </IonToolbar>
      </IonHeader>
  );
};

export default Header;