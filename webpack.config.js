const path = require('path');
 
module.exports = {
  entry: {
      register_sw: './src/register_sw.js',
      sw: './src/sw.js'
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
  }
};