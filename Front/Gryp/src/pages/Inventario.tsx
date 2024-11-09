import React, { useState, useEffect } from 'react';
import {
  IonContent,
  IonPage,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonGrid,
  IonRow,
  IonCol,
  IonButton,
  IonModal,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonAlert
} from '@ionic/react';
import Header from './Header';
import Footer from './Footer';


import inventarioData from '../Json/inventario.json';

interface Producto {
  id: number;
  tipo: string;
  ubicacion: string;
  producto: string;
  unidad: string;
  cantidad: number;
}

const Inventario: React.FC = () => {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [productoEdit, setProductoEdit] = useState<Producto | null>(null);
  const [nuevoProducto, setNuevoProducto] = useState<Producto>({
    id: 0,
    tipo: '',
    ubicacion: '',
    producto: '',
    unidad: '',
    cantidad: 0
  });

  useEffect(() => {
    setProductos(inventarioData);
  }, []);

  const agregarProducto = () => {
    setProductos([...productos, { ...nuevoProducto, id: productos.length + 1 }]);
    setShowModal(false);
    limpiarCampos();
  };

  const eliminarProducto = (id: number) => {
    setProductos(productos.filter(producto => producto.id !== id));
    setShowAlert(false);
  };
  const editarProducto = (producto: Producto) => {
    setProductoEdit(producto);
    setNuevoProducto(producto);
    setShowModal(true);
  };

  const guardarCambios = () => {
    setProductos(
      productos.map(p => (p.id === nuevoProducto.id ? nuevoProducto : p))
    );
    setShowModal(false);
    limpiarCampos();
  };

  const limpiarCampos = () => {
    setNuevoProducto({ id: 0, tipo: '', ubicacion: '', producto: '', unidad: '', cantidad: 0 });
    setProductoEdit(null);
  };

  return (
    <IonPage>
      <Header/>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Gestión de Inventario</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonButton expand="block" onClick={() => setShowModal(true)}>Agregar Producto</IonButton>

        <IonGrid>
          <IonRow>
            <IonCol><strong>ID</strong></IonCol>
            <IonCol><strong>Tipo de Producto</strong></IonCol>
            <IonCol><strong>Ubicación</strong></IonCol>
            <IonCol><strong>Producto</strong></IonCol>
            <IonCol><strong>Unidad</strong></IonCol>
            <IonCol><strong>Cantidad</strong></IonCol>
            <IonCol><strong>Acciones</strong></IonCol>
          </IonRow>

          {productos.map(producto => (
            <IonRow key={producto.id}>
              <IonCol>{producto.id}</IonCol>
              <IonCol>{producto.tipo}</IonCol>
              <IonCol>{producto.ubicacion}</IonCol>
              <IonCol>{producto.producto}</IonCol>
              <IonCol>{producto.unidad}</IonCol>
              <IonCol>{producto.cantidad}</IonCol>
              <IonCol>
                <IonButton color="primary" size="small" onClick={() => editarProducto(producto)}>Editar</IonButton>
                <IonButton color="danger" size="small" onClick={() => setShowAlert(true)}>Eliminar</IonButton>

                <IonAlert
                  isOpen={showAlert}
                  onDidDismiss={() => setShowAlert(false)}
                  header={'Eliminar Producto'}
                  message={`¿Estás seguro de que deseas eliminar ${producto.producto}?`}
                  buttons={[
                    { text: 'Cancelar', role: 'cancel' },
                    { text: 'Eliminar', handler: () => eliminarProducto(producto.id) }
                  ]}
                />
              </IonCol>
            </IonRow>
          ))}
        </IonGrid>

        <IonModal isOpen={showModal} onDidDismiss={() => setShowModal(false)}>
          <IonContent>
            <IonList>
              <IonItem>
                <IonLabel position="floating">Tipo de Producto</IonLabel>
                <IonInput value={nuevoProducto.tipo} onIonChange={e => setNuevoProducto({ ...nuevoProducto, tipo: e.detail.value! })} />
              </IonItem>
              <IonItem>
                <IonLabel position="floating">Ubicación</IonLabel>
                <IonInput value={nuevoProducto.ubicacion} onIonChange={e => setNuevoProducto({ ...nuevoProducto, ubicacion: e.detail.value! })} />
              </IonItem>
              <IonItem>
                <IonLabel position="floating">Producto</IonLabel>
                <IonInput value={nuevoProducto.producto} onIonChange={e => setNuevoProducto({ ...nuevoProducto, producto: e.detail.value! })} />
              </IonItem>
              <IonItem>
                <IonLabel position="floating">Unidad</IonLabel>
                <IonInput value={nuevoProducto.unidad} onIonChange={e => setNuevoProducto({ ...nuevoProducto, unidad: e.detail.value! })} />
              </IonItem>
              <IonItem>
                <IonLabel position="floating">Cantidad</IonLabel>
                <IonInput type="number" value={nuevoProducto.cantidad} onIonChange={e => setNuevoProducto({ ...nuevoProducto, cantidad: parseInt(e.detail.value!, 10) || 0 })} />
              </IonItem>
            </IonList>
            <IonButton expand="block" onClick={productoEdit ? guardarCambios : agregarProducto}>
              {productoEdit ? 'Guardar Cambios' : 'Agregar Producto'}
            </IonButton>
            <IonButton expand="block" color="light" onClick={() => setShowModal(false)}>Cancelar</IonButton>
          </IonContent>
        </IonModal>
      </IonContent>
      <Footer/>
    </IonPage>
  );
};

export default Inventario;