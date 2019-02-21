import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Airtable from 'airtable';
import _ from 'lodash';
import { withStyles, MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Grid from '@material-ui/core/Grid';
import logo from './logo.svg';
import './App.css';
import styles from './styles';

import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';

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
      questions: [],
      loaded: false,
      userLoaded: false,
    };

    this.base = new Airtable({apiKey: 'keykMFBqNhPAlAjvp'}).base('appzxqfrpXeu0ZN9p');

    this.base('main').select({
      maxRecords: 9999,
      view: "Grid view"
    }).eachPage(records => {
      this.setState({loaded: true, questions: _.map(records, (record, i) => {

        return {
          name: record.get('name'),
          id: record.get('id'),
          options: Object.entries(record.fields).map(([key,value]) => {
            if (key === 'name' || key === 'id' || key === 'points' || key === 'winner') { return null; }
            return {
              letter: key,
              value,
            };
          })
        }
      })})
    }, err => {
      if (err) { console.error(err); return; }
    });
  }

  componentDidMount() {
    fetch('/api/user', { credentials: 'same-origin' })
      .then(res => res.json())
      .then(res => {
        this.base('users').select({
          maxRecords: 9999,
          view: "Grid view"
        }).eachPage(records => {
          const theUser = _.find(records, { fields: { name: res.user.displayName } } );

          if (theUser) {
            this.setState({ user: theUser, userLoaded: true });
          } else {
            this.base('users').create({
              "name": res.user.displayName,
            }, (err, record) => {
                if (err) { console.error(err); return; }
                this.setState({ user: record, userLoaded: true });
            });
          }
        }, err => {
          if (err) { console.error(err); return; }
        });

      });
  }

  handleChange = event => {
    this.base('main').update(this.state.user.id, {
      [event.target.name]: event.target.value
    }, (err, record) => {
        if (err) { console.error(err); return; }
        this.setState({ user: record });
    });
  };

  render() {
    const { classes } = this.props;
    const { questions, loaded, userLoaded, user } = this.state;

    return (
      <MuiThemeProvider theme={muiTheme}>
        <div className="App">
          <CssBaseline />

          <header className="App-header">
            <img src={logo} className="App-logo" alt="logo" />
          </header>

          {loaded && userLoaded && (
            <Grid container spacing={24}>
              {questions.map((question, i) => (
                <Grid item xs={12} sm={6} key={i}>
                  <FormControl component="fieldset" className={classes.formControl}>
                    <FormLabel
                      component="legend"
                      classes={{
                        focused: classes.formFocus,
                        root: classes.formLabel
                      }}>
                      {question.name}
                    </FormLabel>
                    <RadioGroup
                      aria-label={question.name}
                      name={question.id}
                      className={classes.formGroup}
                      value={user.fields[question.id]}
                      onChange={this.handleChange}
                    >
                      {_.orderBy(question.options, 'letter').map((option, j) => {
                        if (option) {
                          return (
                            <FormControlLabel
                              key={j}
                              value={option.letter}
                              className={classes.formLabel}
                              control={<Radio className={classes.radio} />}
                              label={option.value} />
                          )
                        }
                        return null;
                      })}
                    </RadioGroup>
                  </FormControl>
                </Grid>
              ))}
            </Grid>
          )}
        </div>
      </MuiThemeProvider>
    );
  }
}

App.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true })(App);
