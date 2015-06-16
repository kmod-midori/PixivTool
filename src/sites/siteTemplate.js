/*global SITE_NAME, sites*/

sites.push({
  name: SITE_NAME,
  matcher: require('./' + SITE_NAME + '/matcher'),
  content: require('./' + SITE_NAME + '/content')
});
