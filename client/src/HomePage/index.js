import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import Airtable from 'airtable';
import _ from 'lodash';
import Grid from '@material-ui/core/Grid';
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

  render() {
    const { status, classes } = this.props;
    const { loaded, userLoaded, users } = this.state;

    return (
      (loaded && userLoaded) ? (
        <div>
          <h3>STANDINGS</h3>
          <div>
            {_.orderBy(users, [this.calculateScore.bind(this)], ['desc']).map((user, i) => (
              <h4 key={i}>
                {status === 'closed' ? (
                  <div>
                    <Link to={`/ballot/${user.id}`} className={classes.mainLink}>{user.get('name')}</Link>
                    <span>&nbsp;-&nbsp;{this.calculateScore(user)}</span>
                  </div>
                ) : (
                  <div>
                    {user.get('name')}
                  </div>
                )}
              </h4>
            ))}
          </div>
        </div>
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
