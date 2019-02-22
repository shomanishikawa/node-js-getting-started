import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import { withStyles, MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import Airtable from 'airtable';
import CssBaseline from '@material-ui/core/CssBaseline';
import logo from './bg.jpg';
import './App.css';
import styles from './styles';

import HomePage from './HomePage';
import BallotPage from './BallotPage';

const muiTheme = createMuiTheme({
  palette: {
    primary: { main: '#084B89' },
    secondary: { main: '#FAAF48' },
  },
  typography: {
    fontFamily: ['Lato', 'sans-serif'].join(','),
    body2: {
      fontSize: 12,
    },
    title: {
      fontSize: 14,
    }
  },
  overrides: {
    MuiCard: {
      root: {
        color: 'black',
      },
    },
  },
});

class App extends Component {
  constructor() {
    super();

    this.state = {
      user: null,
      status: 'closed',
    };

    this.base = new Airtable({apiKey: 'keykMFBqNhPAlAjvp'}).base('appzxqfrpXeu0ZN9p');

    this.setStatus();
  }

  setStatus = () => {
    this.base('state').find('rec7QkhAjU3MH7Bwc', (err, record) => {
      if (err) { console.error(err); return; }
      this.setState({status: record.get('value')});
    });
  }

  render() {
    const { classes } = this.props;
    const { status } = this.state;

    return (
      <MuiThemeProvider theme={muiTheme}>
        <Router>
          <div className="App">
            <CssBaseline />

            <header className="App-header">
              <img src={logo} className="App-logo" alt="logo" />
            </header>

            <section className={classes.linkContainer}>
              <Link to="/app" className={classes.mainLink}>HOME</Link>
              <Link to="/ballot" className={classes.mainLink}>BALLOT</Link>
            </section>

            <div className="main-content">
              <Route
                path="/app"
                exact
                render={props => <HomePage {...props} status={status} />}
              />
              <Route
                path="/ballot"
                exact
                render={props => <BallotPage {...props} status={status} />}
              />
              <Route
                path="/ballot/:id"
                render={props => <BallotPage {...props} status={status} />}
              />
            </div>

          </div>
        </Router>
      </MuiThemeProvider>
    );
  }
}

App.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true })(App);
