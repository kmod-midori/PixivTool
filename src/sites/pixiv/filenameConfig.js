module.exports = {
  preReplace: [
    [/{{tags}}/g, '<% print(tags.join(" ")) %>'],
    [/{{tags_(\d+)}}/g, '<% print(R.filter(R.where({length: R.gte($1)}), tags).join(" ")) %>'],
    [/\?\[(.*?)\]\?/g, '<% if(pageCount > 1){ %>$1<% } %>']
  ],
  keys: [
    {
      path: '{{id}}',
      msgid: 'settings_illust_id'
    },
    {
      path: '{{title}}',
      msgid: 'settings_illust_title'
    },
    {
      path: '{{tags}}',
      msgid: 'site_pixiv_illust_tags'
    }
  ],
  example: {
    'id': '30408915',
    'title': '紅白巫女',
    'user': {
      'id': '308630',
      'account': 'sakura_23',
      'name': '桜'
    },
    'tools': [
      'Photoshop',
      'SAI'
    ],
    'tags': [
      '東方',
      '博麗霊夢',
      '紅白',
      '楽園の素敵な巫女',
      '東方Project250users入り'
    ],
    'created_time': '9/27/2012 22:24',
    'pageCount': 2,
    'page': 1
  }
};
