import React, { Component } from 'react';
import Airtable from 'airtable';
import logo from './logo.svg';
import './App.css';

class App extends Component {
  constructor() {
    super();
    this.state = {
      user: null,
      airtable: null,
    };

    this.base = new Airtable({apiKey: 'keykMFBqNhPAlAjvp'}).base('appzxqfrpXeu0ZN9p');

    this.base('main').select({
      // Selecting the first 3 records in Grid view:
      maxRecords: 9999,
      view: "Grid view"
    }).eachPage(function page(records, fetchNextPage) {
      // This function (`page`) will get called for each page of records.
      records.forEach(function(record) {
        console.log(record);
        // console.log('Retrieved', record.get('name'));
      });

      // To fetch the next page of records, call `fetchNextPage`.
      // If there are more records, `page` will get called again.
      // If there are no more records, `done` will get called.
      // fetchNextPage();

    }, function done(err) {
      if (err) { console.error(err); return; }
    });
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
