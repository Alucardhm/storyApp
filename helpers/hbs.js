const moment = require('moment')

module.exports = {
    formatDate: function(date,format){
        return moment(date).format(format)
    },
    truncate: function (str, len) {
        str = str.replace(/<(?:.|\n)*?>/gm,'') // strip tags
        if (str.length > len  && str.length > 0) {
          let new_str = str + ' '
          new_str = str.substr(0, len)
          return new_str + '...'
        }
        return str
      },
      editIcon: function(storyUser, loggedUser, storyId, floating = true){
          if(storyUser._id.toString() == loggedUser._id.toString()){
            if(floating){
              return `<a href="/stories/edit/${storyId}" class="btn btn-floating halfway-fab blue"><i class="fas fa-edit fa-small"></i></a>`
            }else{
              return `<a href="/stories/edit/${storyId}"><i class="fas fa-edit fa-small"></i></a>`
            }
          }
      },
      select: function(selected,options){
        return options.fn(this).replace(
          new RegExp(' value=\"' + selected + '\"'),
          '$& selected="selected"');
      }
}


