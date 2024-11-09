
import React from 'react';
import { IonReactRouter } from '@ionic/react-router';
import { Route,Redirect } from 'react-router';
import Perfil from '../pages/Perfil';
import Mesas from '../pages/Mesas';
import Menu from '../pages/Menu';
import Inventario from '../pages/Inventario';
import iniciarsesion from '../pages/iniciarsesion';
import Registro from '../pages/registro'
import CrearPerfil from '../pages/CrearPerfil';
import Orden from '../pages/Orden';

const AppRouter:React.FC =()=>{
    return (
        <IonReactRouter>
              <Route path='/'> <Redirect to="/iniciarsesion" /></Route>
              <Route path='/registro' component={Registro} exact={true}/>
              <Route path="/Perfil" component={Perfil} exact={true} />
              <Route path="/Mesas" component={Mesas} exact={true} />
              <Route path="/Menu" component={Menu} exact={true} />
              <Route path="/Orden" component={Orden} exact={true} />
              <Route path="/Inventario" component={Inventario} exact={true} />
              <Route path="/iniciarsesion" component={iniciarsesion} exact={true} />
              <Route path="/CrearPerfil" component={CrearPerfil} />
              <Route path="/Tab1" render={() => <Redirect to="/Perfil" />} exact={true} />
        </IonReactRouter>
    )
}

export default AppRouter
