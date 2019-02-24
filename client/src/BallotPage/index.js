import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import Airtable from 'airtable';
import _ from 'lodash';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import CheckIcon from '@material-ui/icons/Check';
import CloseIcon from '@material-ui/icons/Close';
import styles from './styles';

import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import LinearProgress from '@material-ui/core/LinearProgress';


class BallotPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      user: null,
      questions: [],
      loaded: false,
      userLoaded: false,
      otherUserId: props.match.params.id,
    };

    this.base = new Airtable({apiKey: 'keykMFBqNhPAlAjvp'}).base('appzxqfrpXeu0ZN9p');

    this.base('awards').select({
      maxRecords: 9999,
      view: "Grid view"
    }).eachPage(records => {
      this.setState({loaded: true, questions: _.map(records, (record, i) => {

        return {
          name: record.get('name'),
          id: record.get('id'),
          winner: record.get('winner'),
          points: record.get('points'),
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
          if (!this.state.otherUserId) {
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
          } else {
            const theUser = _.find(records, { id: this.state.otherUserId } );
            if (theUser) {
              this.setState({ user: theUser, userLoaded: true });
            }
            return;
          }
        }, err => {
          if (err) { console.error(err); return; }
        });

      });
  }

  handleChange = event => {
    if (this.props.status !== 'open') {
      return;
    }

    this.base('users').update(this.state.user.id, {
      [event.target.name]: event.target.value
    }, (err, record) => {
        if (err) { console.error(err); return; }
        this.setState({ user: record });
    });
  };

  calculateScore = (user) => {
    const { questions } = this.state;

    return Object.entries(user.fields).reduce((total, [key,value]) => {
      if (key === 'name' || key === 'score') { return total; }
      if (value === _.find(questions, ['id', key]).winner) {
        return total + parseInt(_.find(questions, ['id', key]).points);
      } else {
        return total;
      }
    }, 0);
  }

  render() {
    const { classes, status } = this.props;
    const { questions, loaded, userLoaded, user } = this.state;

    return (
      (loaded && userLoaded) ? (
        <Grid container spacing={24}>
          <Grid item xs={12} sm={12}>
            <h2>
              {user.get('name')}
              {status === 'closed' && (
                <span>&nbsp;-&nbsp;{this.calculateScore(user)}</span>
              )}
            </h2>
          </Grid>
          {questions.map((question, i) => (
            <Grid item xs={12} sm={6} key={i}>
              <FormControl component="fieldset" className={classes.formControl}>
                <FormLabel
                  component="legend"
                  classes={{
                    focused: classes.formFocus,
                    root: classes.formLabel
                  }}>
                  {status === 'closed' && question.winner && (question.winner === user.fields[question.id]) && (
                    <CheckIcon className={classes.correct}/>
                  )}
                  {status === 'closed' && question.winner && (question.winner !== user.fields[question.id]) && (
                    <CloseIcon className={classes.wrong}/>
                  )}
                  {question.name} ({question.points})
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
                          className={(status !== 'open' && question.winner && (question.winner === option.letter)) ? classes.formLabelCorrect : classes.formLabel}
                          control={<Radio className={classes.radio} disabled={status === 'closed'}/>}
                          label={option.value} />
                      )
                    }
                    return null;
                  })}
                </RadioGroup>
              </FormControl>
            </Grid>
          ))}
          <Button
            component={({ ...props }) => (
              <Link to={'/app'} {...props} />
            )}
            className={classes.button}
            variant="contained"
            size="medium"
            color="secondary"
          >
            Submit
          </Button>
        </Grid>
      ) : (
        <LinearProgress />
      )
    );
  }
}

BallotPage.propTypes = {
  classes: PropTypes.object.isRequired,
  status: PropTypes.string.isRequired,
};

export default withStyles(styles, { withTheme: true })(BallotPage);
