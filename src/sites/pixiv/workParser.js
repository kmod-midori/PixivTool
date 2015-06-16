function getPages(work) {
  var multi1, multi2;
  // Single
  if ((work.type === 'illustration' && work.page_count === 1) || work.type === 'ugoira') {
    let page = {
      url: work.image_urls.large
    };
    if (work.type === 'ugoira') {
      page.extData = ctx.m('site_pixiv_ugoira_delay', {
        delay: work.image_urls.delay
      });
    }
    return [page];
  }

  // Multi page
  multi1 = work.type === 'illustration' && work.page_count > 1;
  multi2 = work.type === 'manga';
  if (multi1 || multi2) {
    return work.metadata.pages.map(page => {
      return {
        url: page.image_urls.large
      };
    });
  }
}

function fixTime(t){
  var tz = require('timezone');
  return tz(t, 'Asia/Tokyo');
}

function cleanupMeta(work) {
  work = R.omit([
    'age_limit',
    'id',
    'book_style',
    'content_type',
    'favorite_id',
    'image_urls',
    'is_liked',
    'metadata',
    'page_count',
    'publicity',
    'stats',
    'is_manga'
  ], work);

  work.user = R.omit([
    'is_following',
    'is_follower',
    'is_friend',
    'profile_image_urls',
    'is_premium',
    'profile',
    'stats'
  ], work.user);

  // Fix time
  work.created_time = fixTime(work.created_time); // eslint-disable-line camelcase
  work.reuploaded_time = fixTime(work.reuploaded_time); // eslint-disable-line camelcase
  return work;
}

export default function(work) {
  var pages = getPages(work);
  var meta = cleanupMeta(work);
  return {pages, meta};
}
