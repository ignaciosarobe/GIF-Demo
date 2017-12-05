import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import mergeImages from 'merge-images';
import GIF from 'gif.js.optimized';
import axios from 'axios';
import Camera from './components/Camera';
import FormMail from './components/Form_Mail';
import Overlay from './components/Overlay';

const SIZE_OPTIONS_WIDTH = 640;
const SIZE_OPTIONS_HEIGHT = 480;
const IMG_URL = '/img/';
const FILTERS = ['1.png', '2.png', '3.png',
  '4.png', '5.png', '6.png',
  '7.png', '8.png'];
const FILTERS_OPTIONS = [{}, {}, {}, {}, {}, {}, {}, {}];

class App extends Component {

  constructor() {
    super();
    this.state = {
      photos: [],
      video: {
        width: SIZE_OPTIONS_WIDTH,
        height: SIZE_OPTIONS_HEIGHT
      },
      photosTaken: 0,
      gif: null,
      isLoading: false,
      isWorking: false
    };
    this.onPhotoTake = this.onPhotoTake.bind(this);
    this.createGIF = this.createGIF.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  async onPhotoTake(photo) {
    this.setState({ isWorking: true });
    let currentPhotos = this.state.photos;
    switch (this.state.photos.length) {
      case 0:
        currentPhotos = currentPhotos.concat(await Promise.all([
          mergeImages([photo, `${IMG_URL}${FILTERS[0]}`], FILTERS_OPTIONS[0]),
          mergeImages([photo, `${IMG_URL}${FILTERS[1]}`], FILTERS_OPTIONS[1]),
        ]));
        await this.setState({
          photos: currentPhotos
        });
        break;
      case 2:
        currentPhotos = this.state.photos;
        currentPhotos = currentPhotos.concat(await Promise.all([
          mergeImages([photo, `${IMG_URL}${FILTERS[2]}`], FILTERS_OPTIONS[2]),
          mergeImages([photo, `${IMG_URL}${FILTERS[3]}`], FILTERS_OPTIONS[3]),
          mergeImages([photo, `${IMG_URL}${FILTERS[4]}`], FILTERS_OPTIONS[4])
        ]));
        await this.setState({
          photos: currentPhotos
        });
        break;
      case 5:
        currentPhotos = this.state.photos;
        currentPhotos = currentPhotos.concat(await Promise.all([
          mergeImages([photo, `${IMG_URL}${FILTERS[5]}`], FILTERS_OPTIONS[5]),
          mergeImages([photo, `${IMG_URL}${FILTERS[6]}`], FILTERS_OPTIONS[6])
        ]));
        await this.setState({
          photos: currentPhotos
        });
        break;
      case 7:
        currentPhotos = this.state.photos;
        currentPhotos = currentPhotos.concat(await Promise.all([
          mergeImages([photo, `${IMG_URL}${FILTERS[6]}`], FILTERS_OPTIONS[6]),
          mergeImages([photo, `${IMG_URL}${FILTERS[7]}`], FILTERS_OPTIONS[7])
        ]));
        await this.setState({
          photos: currentPhotos
        });
        await this.createGIF();
        break;
    }
    this.setState({ isWorking: false, photosTaken: this.state.photosTaken + 1 });
  }

  createGIF() {

    this.setState({ isLoading: true }, () => {
      const encoder = new GIF({
        repeat: 0,
        workers: 2,
        quality: 10,
        width: this.state.video.width,
        height: this.state.video.height,
        workerScript: '/js/gif.worker.js'
      });

      // use node-canvas
      var canvas = this.canvas;
      var ctx = canvas.getContext('2d');

      const loadingImages = this.state.photos.map((img) => {
        return new Promise((resolve, reject) => {
          const image = new Image();
          image.onload = () => {
            resolve(image);
          }
          image.src = img;
        });
      });

      return Promise.all(loadingImages).then((images) => {
        images.map((image, i) => {
          ctx.drawImage(image, 0, 0);
          if (i === 0) {
            encoder.addFrame(ctx, { copy: true, delay: 1000 });
          } else if (i === 8) {
            encoder.addFrame(ctx, { copy: true, delay: 1250 });
          } else {
            encoder.addFrame(ctx, { copy: true, delay: 200 });
          }

        })

        encoder.on('finished', (blob) => {
          const reader = new window.FileReader();
          reader.readAsDataURL(blob);
          reader.onloadend = () => {
            this.setState({
              gif: reader.result,
              isLoading: false
            });
          }
        });

        encoder.render();
      })
    });
  }

  async handleSubmit(email) {
    try {
      await this.setState({ isLoading: true }, async () => {
        const APIRequest = await axios.get('/api/sign-s3');
        const foto = await urltoFile(this.state.gif);
        const uploadResponse = await axios.put(APIRequest.data.signedRequest, foto,
          {
            headers: {
              'Content-Type': 'image/gif'
            }
          });
        if (uploadResponse.status === 200) {
          axios.post('/api/email', {
            link: APIRequest.data.url,
            mail: email
          });
          this.setState({
            photos: [],
            video: {
              width: SIZE_OPTIONS_WIDTH,
              height: SIZE_OPTIONS_HEIGHT
            },
            photosTaken: 0,
            gif: null,
            isLoading: false,
            isWorking: false
          });
        }
      });
    } catch (e) {
      console.log(e);
    }
  }

  render() {

    const over = () => {
      if (this.state.photosTaken === 0) {
        return 'overlay-1'
      } else if (this.state.photosTaken === 1) {
        return 'overlay-2';
      } else if (this.state.photosTaken === 2) {
        return 'overlay-3'
      } else {
        return 'overlay-4';
      }
    }

    const photos = this.state.photos.map((e, i) => {
      return (
        <div key={i} className="column col-4">
          <img
            src={e}
            alt=""
            className="img-responsive rounded" />
        </div>
      );
    });

    const finished = () => {
      console.log(this.state.photos.length);
      if (this.state.photos.length < 9) {
        return (
          <div>
            <div className="text-center">
              <h3>{`${this.state.photosTaken}/4`}</h3>
              <div className="divider"></div>
              <Camera
                options={this.state.video}
                onPhotoTake={this.onPhotoTake}
                overlay={over()}
                isWorking={this.state.isWorking} />
            </div>
          </div>
        );
      } else {
        return (
          <FormMail handleSubmit={this.handleSubmit}
            gif={this.state.gif} />
        );
      }
    }

    return (
      <div>
        <Overlay isLoading={this.state.isLoading} />
        <canvas className="d-hide" width="640" height="480" ref={(canvas) => { this.canvas = canvas }}></canvas>
        <div className="col-12">
          {finished()}
        </div>
      </div>
    )
  }
}

const urltoFile = (url, filename, mimeType = 'image/gif') => {
  return (fetch(url)
    .then(function (res) { return res.arrayBuffer(); })
    .then(function (buf) { return new File([buf], filename, { type: mimeType }); })
  );
}

ReactDOM.render(<App />, document.getElementById('root'));