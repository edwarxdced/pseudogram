import React from 'react';
import ReactDOM from 'react-dom';
import firebase from 'firebase';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

firebase.initializeApp({
	apiKey: "AIzaSyBURGIAzyOdumTwuxsLERFs4WhUSQ0t6wY",
    authDomain: "pseudogram-61394.firebaseapp.com",
    databaseURL: "https://pseudogram-61394.firebaseio.com",
    projectId: "pseudogram-61394",
    storageBucket: "pseudogram-61394.appspot.com",
    messagingSenderId: "467747539932"
});

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
