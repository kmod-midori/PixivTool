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

function readFile(file) {
  return new Promise(function(resolve) {
    var reader = new FileReader();

    reader.onload = resolve;

    reader.readAsText(file);
  }).get('target').get('result');
}

module.exports = React.createClass({
  getInitialState: function() {
    return {
      processing: false
    };
  },
  handleDrop: async function(e) { // eslint-disable-line complexity
    var file, text;
    e.stopPropagation();
    e.preventDefault();

    if (this.state.processing) {
      return;
    }

    file = e.dataTransfer.files[0];

    if (!file.name.match(/\.db$/)) {
      return;
    }

    this.setState({
      processing: true
    });

    text = await readFile(file);

    //////////////////////////
    // Process file content //
    //////////////////////////
    /* eslint-disable no-alert */
    try {
      const HASH_LEN = 40;

      const hashOrig = text.slice(0, HASH_LEN);
      const hashRest = digest(R.drop(HASH_LEN, text));

      const client = await ctx.dnode.getClient().ready;

      if (hashOrig !== hashRest) {
        throw new Error(ctx.m('settings_hash_mismatch'));
      }

      if (confirm('Replace ?')) {
        await client.historyRestoreAsync(text);
        alert(ctx.m('common_done'));
      }
    } catch (e) {
      alert(e.message);
    } finally {

      this.setState({
        processing: false
      });

    }
    /* eslint-enable no-alert */

  },
  export: async function() {
    var {saveAs} = require('file-saver.js');
    var client = await ctx.dnode.getClient().ready;
    var text = await client.historyBackupAsync().then(encode);
    var hash = digest(text);
    text = hash + text;
    saveAs(new Blob([text], {type: 'text/plain;charset=utf-8'}), 'export.db');
  },
  render: function() {
    return <div >
      <div className = "card-box pd-2 relative" onDrop={this.handleDrop} onDragOver = {pd}>
        {!this.state.processing ? [] : <div className="card-box loading-overlay align-center"></div>}
        {ctx.m('settings_import_area')}
      </div>
      <button className="button w-100p mt-1" onClick={this.export}>{ctx.m('settings_export_button')}</button></div>;
  }
});
