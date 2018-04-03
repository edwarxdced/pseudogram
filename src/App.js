import React, { Component } from 'react';
import firebase from 'firebase';
import FileUpload from './FileUpload';
import './App.css';

class App extends Component {
  constructor(){
    super();
    this.state = {
      user: null,
      pictures:[]
    }

    this.handleAuth = this.handleAuth.bind(this);
    this.handleLogout = this.handleLogout.bind(this);
    this.handleUpload = this.handleUpload.bind(this);

  }

  componentWillMount(){
    firebase.auth().onAuthStateChanged(user => {
      this.setState({ user });
    });

    firebase.database().ref('pictures').on('child_added', snapshot => {
        this.setState({
            pictures: this.state.pictures.concat(snapshot.val())
        })
    })
  }

  handleAuth () {
    const provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider)
    .then(result => console.log(`${result.user.email} ha iniciado sesión`))
    .catch(error => console.log(`Error ${error.code} : ${error.message}`))
  }

  handleLogout (){
    firebase.auth().signOut()
    .then(result => console.log(`${result.user.email} ha salido`))
    .catch(error => console.log(`${error.code} : ${error.message}`))
  }

  handleUpload (event) {
        const file = event.target.files[0];
        const storageRef = firebase.storage().ref(`/fotos/${file.name}`);
        const task = storageRef.put(file);

        task.on('state_changed', snapshot => {
            let percentage = (snapshot.bytesTransferred / snapshot.totalBytes ) * 100;
            this.setState({
             uploadValue :percentage
            })
        }, error =>{
            console.log(error.message);
        }, () => {
            const record =  {
                photoURL : this.state.user.photoURL,
                displayName : this.state.user.displayName,
                image: task.snapshot.downloadURL
            };

            const dbRef = firebase.database().ref('pictures');
            const newPicture = dbRef.push();
            newPicture.set(record);

        });
    }



  renderLoginButton(){
    if(this.state.user) {
        return(<div>
          <img className='img-profile' src={this.state.user.photoURL} alt={this.state.user.displayName} width="120px"/>
          <p>Hola {this.state.user.displayName}!</p>
          <button onClick={this.handleLogout}> Salir </button>
          
          <FileUpload onUpload={this.handleUpload}/>
          {
            this.state.pictures.map(picture => (
                <div className="block">
                    <div className="block-header">
                        <div>
                            <div>
                                <img className="img-profile" src={picture.photoURL} alt={picture.displayName} width="60px"/>
                                <span className="ml-10">{picture.displayName}</span>
                            </div>
                        </div>
                    </div>
                    <div className="block-content">
                        <img src={picture.image}/>
                    </div>
                    <br/>
                    <br/>
                </div>
            )).reverse()
          }
        </div>);
    } else {
      return (
        <button className='btn-google' onClick={this.handleAuth}>G+ Login con google</button>
      );
    }
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Pseudogram</h1>
        </header>
        <p className="App-intro">
          {this.renderLoginButton()}
        </p>
      </div>
    );
  }
}

export default App;
