import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import { withStyles, MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import CssBaseline from '@material-ui/core/CssBaseline';
import logo from './logo.svg';
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
    };
  }

  render() {
    const { classes } = this.props;

    return (
      <MuiThemeProvider theme={muiTheme}>
        <Router>
          <div className="App">
            <CssBaseline />

            <header className="App-header">
              <img src={logo} className="App-logo" alt="logo" />
              <Link to="/home" className={classes.mainLink}>HOME</Link>
              <Link to="/ballot" className={classes.mainLink}>BALLOT</Link>
            </header>

            <div className="main-content">
              <Route
                path="/home"
                exact
                render={props => <HomePage />}
              />
              <Route
                path="/ballot"
                exact
                render={props => <BallotPage />}
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
