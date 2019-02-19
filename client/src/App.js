import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class App extends Component {
  constructor() {
    super();
    this.state = { user: null };
  }

  componentDidMount() {
    fetch('/api/user', { credentials: 'same-origin' })
      .then(res => res.json())
      .then((res) => {
        this.setState({ user: res.user });
      });
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <div className="App-intro" style={{width: '500px', margin:'0 auto'}}>
          <p>To get started, edit <code>src/App.js</code> and save to reload.</p>
          <p><a href="/">back to express server</a></p>
          <pre style={{textAlign: "left", background: "#eee"}}>{JSON.stringify(this.state.user, null, 2)}</pre>
        </div>
      </div>
    );
  }
}

export default App;
