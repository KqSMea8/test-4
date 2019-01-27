'use strict'

let React = require('react');
let PropTypes = require('prop-types');
let ReactDOM = require('react-dom');
let qr = require('qr.js');

function getBackingStorePixelRatio(ctx) {
  return (
    ctx.webkitBackingStorePixelRatio ||
    ctx.mozBackingStorePixelRatio ||
    ctx.msBackingStorePixelRatio ||
    ctx.oBackingStorePixelRatio ||
    ctx.backingStorePixelRatio ||
    1
  );
}

class QRCode extends React.Component {
  shouldComponentUpdate(nextProps) {
    let that = this;
    return Object.keys(QRCode.propTypes).some(function(k) {
      return that.props[k] !== nextProps[k];
    });
  }

  componentDidMount() {
    this.update();
  }

  componentDidUpdate() {
    this.update();
  }

  utf16to8(str) {
    let out, i, len, c;
    out = "";
    len = str.length;
    for (i = 0; i < len; i++) {
      c = str.charCodeAt(i);
      if ((c >= 0x0001) && (c <= 0x007F)) {
        out += str.charAt(i);
      } else if (c > 0x07FF) {
        out += String.fromCharCode(0xE0 | ((c >> 12) & 0x0F));
        out += String.fromCharCode(0x80 | ((c >> 6) & 0x3F));
        out += String.fromCharCode(0x80 | ((c >> 0) & 0x3F));
      } else {
        out += String.fromCharCode(0xC0 | ((c >> 6) & 0x1F));
        out += String.fromCharCode(0x80 | ((c >> 0) & 0x3F));
      }
    }
    return out;
  }

  update() {
    let value = this.utf16to8(this.props.value);
    let qrcode = qr(value);
    let canvas = ReactDOM.findDOMNode(this.refs.canvas);

    let ctx = canvas.getContext('2d');
    let cells = qrcode.modules;
    let tileW = this.props.size / cells.length;
    let tileH = this.props.size / cells.length;
    let scale = (window.devicePixelRatio || 1) / getBackingStorePixelRatio(ctx);
    canvas.height = canvas.width = this.props.size * scale;
    ctx.scale(scale, scale);

    cells.forEach(function(row, rdx) {
      row.forEach(function(cell, cdx) {
        ctx.fillStyle = cell ? this.props.fgColor : this.props.bgColor;
        let w = (Math.ceil((cdx + 1) * tileW) - Math.floor(cdx * tileW));
        let h = (Math.ceil((rdx + 1) * tileH) - Math.floor(rdx * tileH));
        ctx.fillRect(Math.round(cdx * tileW), Math.round(rdx * tileH), w, h);
      }, this);
    }, this);

    if (this.props.logo) {
      let self = this;
      let size = this.props.size;
      let image = document.createElement('img');
      // image.setAttribute('crossOrigin', 'anonymous');
      // image.src = this.props.logo;
      // const image = new Image();
      fetch(this.props.logo, {
        // mode: 'cors',
        // headers: {
        //   "Content-Type": "application/json",
        // },
      }).then(response=>response.blob()).then(myBlob=> {
        let objectURL = URL.createObjectURL(myBlob);
        image.onload = function () {
          let dwidth = self.props.logoWidth || size * 0.2;
          let dheight = self.props.logoHeight || image.height / image.width * dwidth;
          let dx = (size - dwidth) / 2;
          let dy = (size - dheight) / 2;
          image.width = dwidth;
          image.height = dheight;
          ctx.drawImage(image, dx, dy, dwidth, dheight);
        };
        image.src = objectURL
      })
    }
  }

  render() {
    return React.createElement('canvas', {
      style: { height: this.props.size, width: this.props.size },
      height: this.props.size,
      width: this.props.size,
      ref: 'canvas'
    });
  }
}

QRCode.propTypes = {
  value: PropTypes.string.isRequired,
  size: PropTypes.number,
  bgColor: PropTypes.string,
  fgColor: PropTypes.string,
  logo: PropTypes.string,
  logoWidth: PropTypes.number,
  logoHeight: PropTypes.number
};

QRCode.defaultProps = {
  size: 128,
  bgColor: '#FFFFFF',
  fgColor: '#000000',
  value: 'http://facebook.github.io/react/'
};

module.exports = QRCode;
