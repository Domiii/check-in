import React, { Component } from 'react';
import { Container } from 'reactstrap';
import { Provider } from 'unstated';
import { BrowserRouter } from 'react-router-dom';

//import logo from './logo.svg';
import './App.css';
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';

import AppRoutes from './AppRoutes';
import Navbar from 'components/navbar';

import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';

import { blue, pink, red, green } from '@material-ui/core/colors';


// setup MUI theme

const theme = createMuiTheme({
  palette: {
    primary: blue,
    secondary: pink,
    success: green,
    danger: red
  }
});

class App extends Component {
  render() {
    return (
      <Provider>
        <BrowserRouter>
          <MuiThemeProvider theme={theme}>
            <Container className="app-cont no-padding">
              <div className="app-nav">
                <Navbar />
              </div>
              <div className="app-main">
                <AppRoutes />
              </div>
            </Container>
          </MuiThemeProvider>
        </BrowserRouter>
      </Provider>
    );
  }
}

export default App;
