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
      value: 'female',
      questions: [],
      answers: [null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],
      loaded: false,
    };

    this.base = new Airtable({apiKey: 'keykMFBqNhPAlAjvp'}).base('appzxqfrpXeu0ZN9p');

    this.base('main').select({
      maxRecords: 9999,
      view: "Grid view"
    }).eachPage((records, fetchNextPage) => {
      this.setState({loaded: true, questions: _.map(records, (record, i) => {
        return {
          name: record.get('name'),
          options: Object.entries(record.fields).map(([key,value]) => {
            if (key === 'name') {
              return null;
            }

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
      .then((res) => {
        this.setState({ user: res.user });
      });
  }

  handleChange = event => {
    const theAnswers = this.state.answers;
    theAnswers[event.target.name] = event.target.value;
    this.setState({ answers: theAnswers });
  };

  render() {
    const { classes } = this.props;
    const { questions, loaded } = this.state;

    return (
      <MuiThemeProvider theme={muiTheme}>
        <div className="App">
          <CssBaseline />
          <header className="App-header">
            <img src={logo} className="App-logo" alt="logo" />
            <h1 className="App-title">Welcome to React</h1>
          </header>
          <Grid container spacing={24}>
            <Grid item xs={12} sm={6}>
              <div className="App-intro" style={{width: '500px', margin:'0 auto'}}>
                <p>To get started, edit <code>src/App.js</code> and save to reload.</p>
                <p><a href="/">back to express server</a></p>
                <pre style={{textAlign: "left", background: "#eee"}}>{JSON.stringify(this.state.user, null, 2)}</pre>
              </div>
            </Grid>
            <Grid item xs={12} sm={6}>
              {loaded && (
                <div className={classes.formRoot}>
                  <FormControl component="fieldset" className={classes.formControl}>
                    {questions.map((question, i) => (
                      <div key={i}>
                        <FormLabel component="legend">{question.name}</FormLabel>
                        <RadioGroup
                          aria-label={question.name}
                          name={i}
                          className={classes.formGroup}
                          value={this.state.answers[i]}
                          onChange={this.handleChange}
                        >
                          {question.options.map((option, j) => {
                            if (option) {
                              return (<FormControlLabel key={j} value={option.letter} control={<Radio />} label={option.value} />)
                            }
                            return null;
                          })}
                        </RadioGroup>
                      </div>
                    ))}
                  </FormControl>
                </div>
              )}

            </Grid>
          </Grid>
        </div>
      </MuiThemeProvider>
    );
  }
}

App.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true })(App);
