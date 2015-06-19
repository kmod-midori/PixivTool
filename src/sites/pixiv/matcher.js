module.exports = function(loc) {
  var pathBlacklist = [
    'upload.php',
    'event.php',
    'event_detail.php',
    'profile_event.php',
    'event_add.php',
    'info.php',
    'help.php',
    'privacy.php',
    'guideline.php',
    'brand_terms.php',
    'premium.php',
    'msgbox.php',
    'msg_view.php',
    'search_user.php',
    'novel',
    'setting'
  ];
  var inBlacklist = R.any(p=>{
    return loc.pathname.contains(p);
  })(pathBlacklist);

  if (loc.host !== 'www.pixiv.net' || inBlacklist ) {
    return;
  }

  return true;
};
