import React, { useState, useEffect } from 'react';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonSpinner,
  IonAlert,
  IonButton,
  IonActionSheet,
  IonModal,
  IonItem,
  IonLabel,
  IonInput,
  IonSelect,
  IonSelectOption,
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

interface ProductForm {
  productType: string;
  loc: string;
  productName: string;
  unit: string;
  amount: number;
}

const INITIAL_FORM: ProductForm = {
  productType: '',
  loc: '',
  productName: '',
  unit: '',
  amount: 0,
};

const Inventario: React.FC = () => {
  const id = useUserData()?.id;
  const [inventario, setInventario] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Producto | null>(null);
  const [actionSheetVisible, setActionSheetVisible] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState<ProductForm>(INITIAL_FORM);
  const [isEditing, setIsEditing] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

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

  useEffect(() => {
    fetchInventario();
  }, [id]);

  const handleAdd = async () => {
    try {
      await axios.post(`http://localhost:3000/api/inventario/${id}`, {
        pType: formData.productType,
        loc: formData.loc,
        pName: formData.productName,
        amount: formData.amount,
        unit: formData.unit
      });
      setShowModal(false);
      setFormData(INITIAL_FORM);
      fetchInventario();
    } catch (err) {
      setError('Error al agregar el producto');
    }
  };

  const handleEdit = async () => {
    if (!selectedProduct) return;
    
    try {
      await axios.put(`http://localhost:3000/api/inventario/${selectedProduct.productID}`, {
        pType: formData.productType,
        loc: formData.loc,
        pName: formData.productName,
        amount: formData.amount,
        unit: formData.unit
      });
      setShowModal(false);
      setFormData(INITIAL_FORM);
      setSelectedProduct(null);
      fetchInventario();
    } catch (err) {
      setError('Error al editar el producto');
    }
  };

  const handleDelete = async () => {
    if (!selectedProduct) return;
    
    try {
      await axios.delete(`http://localhost:3000/api/inventario/${selectedProduct.productID}`);
      setShowConfirmDelete(false);
      setSelectedProduct(null);
      fetchInventario();
    } catch (err) {
      setError('Error al eliminar el producto');
    }
  };

  const handleRowClick = (producto: Producto) => {
    setSelectedProduct(producto);
    setActionSheetVisible(true);
  };

  const openEditModal = () => {
    if (selectedProduct) {
      setFormData({
        productType: selectedProduct.productType,
        loc: selectedProduct.loc,
        productName: selectedProduct.productName,
        unit: selectedProduct.unit,
        amount: selectedProduct.amount
      });
      setIsEditing(true);
      setShowModal(true);
      setActionSheetVisible(false);
    }
  };

  const openAddModal = () => {
    setFormData(INITIAL_FORM);
    setIsEditing(false);
    setShowModal(true);
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
          <IonButton 
            expand="block" 
            color="primary" 
            className="add-button"
            onClick={openAddModal}
          >
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
        <IonModal isOpen={showModal} onDidDismiss={() => setShowModal(false)}>
          <IonHeader>
            <IonToolbar>
              <IonTitle>{isEditing ? 'Editar Producto' : 'Agregar Producto'}</IonTitle>
            </IonToolbar>
          </IonHeader>
          <IonContent>
            <form onSubmit={(e) => {
              e.preventDefault();
              isEditing ? handleEdit() : handleAdd();
            }}>
              <IonItem>
                <IonLabel position="stacked">Tipo de Producto</IonLabel>
                <IonInput
                  value={formData.productType}
                  onIonChange={e => setFormData({...formData, productType: e.detail.value || ''})}
                  required
                />
              </IonItem>
              <IonItem>
                <IonLabel position="stacked">Ubicación</IonLabel>
                <IonInput
                  value={formData.loc}
                  onIonChange={e => setFormData({...formData, loc: e.detail.value || ''})}
                  required
                />
              </IonItem>
              <IonItem>
                <IonLabel position="stacked">Nombre del Producto</IonLabel>
                <IonInput
                  value={formData.productName}
                  onIonChange={e => setFormData({...formData, productName: e.detail.value || ''})}
                  required
                />
              </IonItem>
              <IonItem>
                <IonLabel position="stacked">Cantidad</IonLabel>
                <IonInput
                  type="number"
                  value={formData.amount}
                  onIonChange={e => setFormData({...formData, amount: parseInt(e.detail.value || '0')})}
                  required
                />
              </IonItem>
              <IonItem>
                <IonLabel position="stacked">Unidad</IonLabel>
                <IonInput
                  value={formData.unit}
                  onIonChange={e => setFormData({...formData, unit: e.detail.value || ''})}
                  required
                />
              </IonItem>
              <IonButton expand="block" type="submit">
                {isEditing ? 'Guardar Cambios' : 'Agregar'}
              </IonButton>
              <IonButton expand="block" color="medium" onClick={() => setShowModal(false)}>
                Cancelar
              </IonButton>
            </form>
          </IonContent>
        </IonModal>
        <IonActionSheet
          isOpen={actionSheetVisible}
          onDidDismiss={() => setActionSheetVisible(false)}
          buttons={[
            {
              text: 'Editar',
              handler: openEditModal
            },
            {
              text: 'Eliminar',
              role: 'destructive',
              handler: () => {
                setShowConfirmDelete(true);
                setActionSheetVisible(false);
              }
            },
            {
              text: 'Cancelar',
              role: 'cancel'
            }
          ]}
        />
        <IonAlert
          isOpen={showConfirmDelete}
          onDidDismiss={() => setShowConfirmDelete(false)}
          header="Confirmar eliminación"
          message="¿Está seguro que desea eliminar este producto?"
          buttons={[
            {
              text: 'Cancelar',
              role: 'cancel'
            },
            {
              text: 'Eliminar',
              role: 'destructive',
              handler: handleDelete
            }
          ]}
        />
      </IonContent>

      <Footer />
    </IonPage>
  );
};

export default Inventario;