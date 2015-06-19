import {createHash} from 'crypto';

function pd(e){
  e.preventDefault();
}

function digest(text){
  return createHash('sha1').update(text).digest('hex');
}

function encode(text) {
  return (new Buffer(text)).toString('base64');
}

function decode(text) {
  var buf = new Buffer(text, 'base64');
  return buf.toString('utf8');
}

module.exports = React.createClass({
  getInitialState: function() {
    return {
      processing: false
    };
  },
  handleDrop: function (e) {
    var file, reader;
    e.stopPropagation();
    e.preventDefault();

    if (this.state.processing) {
      return;
    }

    file = e.dataTransfer.files[0];
    reader = new FileReader();
    if(!file.name.match(/\.db$/)){
      return;
    }
    reader.onload = evt => {
      (function() {
        var HASH_LEN = 40;
        var text = evt.target.result;
        var hashOrig = text.slice(0, HASH_LEN);
        var hashRest = digest(R.drop(HASH_LEN, text));
        /* eslint-disable no-alert */
        if (hashOrig !== hashRest) {
          alert('Hash mismatch!');
          return;
        }
        if (confirm('Replace ?')) {
          ctx.messaging.send('history_replace', decode(R.drop(HASH_LEN, text))).then(function () {
            alert(ctx.m('common_done'));
          });
        }
        /* eslint-enable no-alert */
      }());
      this.setState({processing: false});
    };
    this.setState({processing: true});
    reader.readAsText(file);
  },
  export: function(){
    var {saveAs} = require('file-saver.js');
    ctx.messaging.send('history_serialize').then(encode).then(text=>{
      var hash = digest(text);
      log.d(text.length);
      text = hash + text; // prepend
      saveAs(new Blob([text], {type: 'text/plain;charset=utf-8'}), 'export.db');
    });
  },
  render: function () {
    return <div>
      <div className="card-box pd-2 relative" onDrop={this.handleDrop} onDragOver={pd}>
        {!this.state.processing ? [] : <div className="card-box loading-overlay align-center"></div>}
        Drop JSON file here to import.
      </div>
      <button className="button w-100p mt-1" onClick={this.export}>Export</button>
    </div>;
  }
});
