/* eslint-disable semi */
/* eslint-env mocha */
var sites = require('src/sites');

describe('Site Loading', function () {
  it('should load sites as array', function () {
    sites.should.be.a('array')
  })
  it('thete should be 5 property an a site', function () {
    sites.forEach(site=>{
      site.should.have.all.keys(['name', 'matcher', 'content', 'settings', 'specs'])
    })
  })
})

describe('Sites', function () {
  sites.forEach(s=>{
    s.specs()
  });
})
