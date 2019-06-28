import React, { Component } from 'react';

import { Card, CardBody } from 'reactstrap';

class NotFound404 extends Component {
  state = {
    maxResults: 10
  };

  componentDidMount() {
    this.newImage();
  }

  unsplashUrl = () => {
    const r = Math.random() * (this.state.maxResults);
    //const prox = 'https://corsproxy.our.buildo.io/';
    return `https://unsplash.com/napi/search/photos?query=construction&page=${r}&per_page=1`;
  }

  newImage = async () => {
    return;

    // // get new image
    // const url = this.unsplashUrl();
    // const res = await fetch(url, {
    //   origin: '*'
    // });
    // const body = await res.json();
    // console.log(body);
    // const maxResults = parseInt(body.total);
    // const { results } = body;
    // const imgUrl = results[0].urls.raw;
    // this.setState({
    //   imgUrl,
    //   maxResults
    // });

    // // keep updating image
    // setTimeout(this.newImage(), 5 * 1000);
  }

  render() {
    const { imgUrl } = this.state;
    return (<Card className="full-width">
      <CardBody>
        route not found :(
        
        <br />

        <a target="_blank" rel="noopener noreferrer" href="https://unsplash.com/search/photos/construction">
          images of construction sites
        </a>
        {/* <img src={imgUrl} alt=" " /> */}
      </CardBody>
    </Card>);
  }
}

export default NotFound404;