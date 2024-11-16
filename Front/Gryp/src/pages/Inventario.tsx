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
  IonSpinner,
  IonAlert,
  IonButton,
  IonActionSheet,
} from '@ionic/react';
import Header from './Header';
import Footer from './Footer';
import useUserData from '../Hooks/useUserData';
import axios from 'axios';
import './Inventario.css';

interface Producto {
  productID: number;
  productType: string;
  loc: string;
  productName: string;
  unit: string;
  amount: number;
}

const Inventario: React.FC = () => {
  const id = useUserData()?.id;
  const [inventario, setInventario] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Producto | null>(null);
  const [actionSheetVisible, setActionSheetVisible] = useState(false);

  useEffect(() => {
    const fetchInventario = async () => {
      if (!id) return;

      setLoading(true);
      setError(null);

      try {
        const response = await axios.get(`http://localhost:3000/api/inventario/${id}`);
        if (response.data.success) {
          setInventario(response.data.storage);
        } else {
          setError('No se pudo cargar el inventario.');
        }
      } catch (err) {
        console.error('Error al cargar el inventario:', err);
        setError('Error al cargar el inventario.');
      } finally {
        setLoading(false);
      }
    };

    fetchInventario();
  }, [id]);

  const handleRowClick = (producto: Producto) => {
    setSelectedProduct(producto);
    setActionSheetVisible(true);
  };

  return (
    <IonPage>
      <Header />

      <IonContent>
        <IonHeader>
          <IonToolbar>
            <IonTitle>Inventario</IonTitle>
          </IonToolbar>
        </IonHeader>

        <div className="table-container">
          <IonButton expand="block" color="primary" className="add-button">
            Agregar Producto
          </IonButton>

          {loading && (
            <div className="spinner-container">
              <IonSpinner name="crescent" />
            </div>
          )}

          {error && (
            <IonAlert
              isOpen={!!error}
              onDidDismiss={() => setError(null)}
              header="Error"
              message={error}
              buttons={['OK']}
            />
          )}

          {!loading && !error && (
            <table className="custom-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Tipo</th>
                  <th>Ubicación</th>
                  <th>Producto</th>
                  <th>Cantidad</th>
                  <th>Unidad</th>
                </tr>
              </thead>
              <tbody>
                {inventario.map((producto) => (
                  <tr
                    key={producto.productID}
                    className="clickable-row"
                    onClick={() => handleRowClick(producto)}
                  >
                    <td>{producto.productID}</td>
                    <td>{producto.productType}</td>
                    <td>{producto.loc}</td>
                    <td>{producto.productName}</td>
                    <td>{producto.amount}</td>
                    <td>{producto.unit}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Action Sheet para Editar o Eliminar */}
        <IonActionSheet
          isOpen={actionSheetVisible}
          onDidDismiss={() => setActionSheetVisible(false)}
          buttons={[
            {
              text: 'Editar',
              handler: () => {
                console.log('Editar producto:', selectedProduct);
              },
            },
            {
              text: 'Eliminar',
              role: 'destructive',
              handler: () => {
                console.log('Eliminar producto:', selectedProduct);
              },
            },
            {
              text: 'Cancelar',
              role: 'cancel',
            },
          ]}
        />
      </IonContent>

      <Footer />
    </IonPage>
  );
};

export default Inventario;
