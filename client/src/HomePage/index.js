import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import Airtable from 'airtable';
import _ from 'lodash';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import LinearProgress from '@material-ui/core/LinearProgress';
import styles from './styles';

class HomePage extends Component {
  constructor() {
    super();

    this.state = {
      user: null,
      users: [],
      loaded: false,
      userLoaded: false,
      questions: [],
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
          points: record.get('points'),
          winner: record.get('winner'),
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
            this.setState({ user: theUser, userLoaded: true, users: records });
          } else {
            this.base('users').create({
              "name": res.user.displayName,
            }, (err, record) => {
                if (err) { console.error(err); return; }
                this.setState({ user: record, userLoaded: true, users: records });
            });
          }
        }, err => {
          if (err) { console.error(err); return; }
        });

      });
  }

  calculateScore(user) {
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

  calculateCorrect(user) {
    const { questions } = this.state;

    return Object.entries(user.fields).reduce((total, [key,value]) => {
      if (key === 'name' || key === 'score') { return total; }
      if (value === _.find(questions, ['id', key]).winner) {
        total += 1;
        return total;
      }
      return total;
    }, 0);
  }

  render() {
    const { status, classes } = this.props;
    const { loaded, userLoaded, users, questions } = this.state;

    const completed = _.filter(questions, q => q.winner);
    const upcoming = _.filter(questions, q => !q.winner);

    return (
      (loaded && userLoaded) ? (
        <Grid container spacing={24}>
          <Grid item xs={12} sm={4}>
            <Typography variant="h5" className={classes.heading}>STANDINGS</Typography>
            <div>
              {_.orderBy(users, [this.calculateScore.bind(this)], ['desc']).map((user, i) => (
                <div key={i}>
                  {status === 'closed' ? (
                    <Typography variant="subtitle1">
                      <Link to={`/ballot/${user.id}`} className={classes.mainLink}>{user.get('name')}</Link>
                      <span>&nbsp;-&nbsp;<b>{this.calculateScore(user)}</b>&nbsp;[{this.calculateCorrect(user)}/24]</span>
                    </Typography>
                  ) : (
                    <Typography variant="h6">
                      {user.get('name')}
                    </Typography>
                  )}
                </div>
              ))}
            </div>
          </Grid>

          <Grid item xs={12} sm={4}>
            <Typography variant="h5" className={classes.heading}>RESULTS</Typography>
            <div>
              {completed.map((question, i) => (
                <div className={classes.completedItem} key={i}>
                  <Typography variant="body1">{question.name} ({question.points})</Typography>
                  <Typography variant="body2"><b>{question.winner && _.find(question.options, ['letter', question.winner]).value}</b></Typography>
                </div>
              ))}
            </div>
          </Grid>

          <Grid item xs={12} sm={4}>
            <Typography variant="h5" className={classes.heading}>UPCOMING</Typography>
            <div>
              {upcoming.map((question, i) => (
                <div className={classes.completedItem} key={i}>
                  <Typography variant="body1">{question.name} ({question.points})</Typography>
                </div>
              ))}
            </div>
          </Grid>
        </Grid>
      ) : (
        <LinearProgress />
      )
    );
  }
};

HomePage.propTypes = {
  status: PropTypes.string.isRequired,
};

export default withStyles(styles)(HomePage);
