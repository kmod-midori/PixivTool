module.exports = (provider)->
  provider.register
    name:'Pixiv'
    match:(host, path, query)->
      if host != 'www.pixiv.net'
        return false

      paths = [
        '/mypage.php'
        '/bookmark_new_illust.php'
        '/search.php'
        '/bookmark.php'
        '/bookmark_add.php'
        '/member_illust.php'
        '/member.php'
        '/ranking.php'
        '/ranking_area.php'
        '/ranking_log.php'
      ]
      if path not in paths
        return false

      return true

    init:(emitter)->
