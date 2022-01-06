import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router,Switch, Route } from 'react-router-dom'
import { Provider } from 'react-redux';
import { combineReducers, createStore, compose, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { sessionService, sessionReducer } from 'redux-react-session';
import './index.css';
import Authenticate from './views/AuthenticatePage';
import InterestInventory from './views/InterestInventory';
import Dashboard from './layouts/Dashboard';
import * as serviceWorker from './serviceWorker';
import allReducers from './datamanagement'


// Add the sessionReducer

// const reducer = combineReducers({
//     session: sessionReducer
//   });

//  const reducer = combineReducers({
//   beneficiaryReducer: beneficiaryReducer
//    });


// const store = createStore(reducer, undefined, compose(applyMiddleware(thunkMiddleware)));

 const store = createStore(allReducers);

// Init the session service
// sessionService.initSessionService(store);

const App = () => (
    <Router>
        <Switch>
            <Route exact path="/" component={Authenticate} />
            <Route path="/dashboard" component={Dashboard} />

            
        </Switch>
    </Router>
  )



  ReactDOM.render( <Provider store={store}><App/></Provider>  , document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

