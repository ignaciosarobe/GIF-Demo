import React, { Component } from 'react';

class Camera extends Component {

  constructor(props) {
    super(props);
    this.takePhoto = this.takePhoto.bind(this);
  }

  componentDidMount() {
    const requirements = {
      audio: false,
      video: {
        width: this.props.options.width,
        height: this.props.options.height
      }
    };
    navigator.mediaDevices.getUserMedia(requirements)
      .then((stream) => {
        this.video.srcObject = stream;
      })
      .catch((error) => {
        console.log(`Hubo un error: ${error.message}`);
      });
  }

  takePhoto() {
    const context = this.canvas.getContext('2d');
    context.drawImage(this.video, 0, 0, this.props.options.width, this.props.options.height);
    this.props.onPhotoTake(this.canvas.toDataURL('image/png'));
  }

  render() {
    return (
      <div className="columns">
        <div className="column col-12">

          <canvas
            ref={(canvas) => { this.canvas = canvas }}
            className="d-hide"
            width={this.props.options.width}
            height={this.props.options.height}></canvas>
          <div id="video-overlay">
            <div className={this.props.overlay ? this.props.overlay : 'd-hide'}></div>
            <video
              ref={(video) => { this.video = video; }}
              width={this.props.options.width}
              height={this.props.options.height}
              autoPlay="true"></video>
          </div>
        </div>
        <div className="text-center column col-4 col-mx-auto">
          <button
            onClick={() => this.takePhoto()}
            className="mx-1 btn btn-primary btn-lg btn-block"
            disabled={this.props.isWorking}><span className="material-icons">camera_alt</span></button>
        </div>
      </div>
    );

  }
}

export default Camera;