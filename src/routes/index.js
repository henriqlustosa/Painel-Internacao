import { Switch } from "react-router-dom";
import  Route  from './Route';

import SignIn from '../pages/SignIn';
import SignUp from "../pages/SignUp";
import Customers from "../pages/Customers";
import New from "../pages/New";
import NewVisita from "../pages/NewVisita";


import Dashboard from "../pages/Dashboard";
import Profile from "../pages/Profile";
import Visit from "../pages/Visit";


export default function Routes() {
    return(
        <Switch>
            <Route exact path="/" component={SignIn} />
            <Route exact path="/register" component={SignUp} />

            <Route exact path="/dashboard" component={Dashboard} isPrivate />
            <Route exact path="/profile" component={Profile} isPrivate />
            <Route exact path="/customers" component={Customers} isPrivate />
            <Route exact path="/new" component={New} isPrivate />
             <Route exact path="/newvisit" component={NewVisita} isPrivate />
             <Route exact path="/new/:id" component={New} isPrivate />
            <Route exact path="/newvisit/:id" component={NewVisita} isPrivate />
             <Route exact path="/visit" component={Visit} isPrivate />
        </Switch>
    );
}