import './App.css';
import React, { Fragment, useState, useEffect } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Alert from './components/layout/Alert';
import axios from 'axios';
import Users from './components/user/Users';
import Search from './components/user/Search';
import About from './components/pages/About';
import User from './components/user/User';
import GithubState from './context/github/GithubState';

const App = () => {
  const [users, setUsers] = useState([]);
  const [user, setUser] = useState({});
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);

  // search  users on github api
  const searchUser = async (text) => {
    setLoading(true);
    const res = await axios.get(
      `https://api.github.com/search/users?q=${text}`
    );

    setUsers(res.data.items);
    setLoading(false);
  };

  // Get a single github user
  const getUser = async (login) => {
    setLoading(true);
    const res = await axios.get(`https://api.github.com/users/${login}`);

    setUser(res.data);
    setLoading(false);
  };

  // Get user repositories
  // Get a single github user
  const getUserRepos = async (login) => {
    setLoading(true);
    const res = await axios.get(
      `https://api.github.com/users/${login}/repos?per_page=5&sort=created:asc`
    );

    setRepos(res.data);
    setLoading(false);
  };

  // clear users showed on the UI
  const clearUsers = () => {
    setUsers([]);
    setLoading(false);
  };

  // set alert on empty search input submition
  const showAlert = (msg, type) => {
    setAlert({ msg, type });
    setTimeout(() => setAlert(null), 5000);
  };

  return (
    <GithubState>
    <Router>
      <div className="App">
        <Navbar />
        <div className="container">
          <Alert alert={alert} />
          <Switch>
            <Route
              exact
              path="/"
              render={(props) => (
                <Fragment>
                  <Search
                    searchUser={searchUser}
                    clearUsers={clearUsers}
                    showClear={users.length > 0 ? true : false}
                    setAlert={showAlert}
                  />
                  <Users users={users} loading={loading} />
                </Fragment>
              )}
            />
            <Route exact path="/about" component={About} />
            <Route
              exact
              path="/user/:login"
              render={(props) => (
                <User
                  {...props}
                  getUser={getUser}
                  getUserRepos={getUserRepos}
                  user={user}
                  repos={repos}
                  loading={loading}
                />
              )}
            />
          </Switch>
        </div>
      </div>
    </Router>
    </GithubState>
  );
};

export default App;
