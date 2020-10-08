const request = require('request'); // for sending request
const cheerio = require('cheerio'); //for parsing dom easily
const BASE_URL = 'https://medium.com/tag'; //base url

const tagModel = require('../../../model/tags'); //tagModel for db
function yesterday(index) {
  // function to get date for fetching so for same tag if i fetch it show todays date
  let curr = new Date();

  //let today = curr;
  //today.setDate()
  let today = new Date(curr.getTime() - index * 24 * 60 * 60 * 1000); //function of date
  let month = today.getMonth() + 1;
  if (month < 10) {
    month = '0' + month;
  }
  let day = today.getDate();
  if (day < 10) {
    day = '0' + day;
  }
  let date = today.getFullYear() + '/' + month + '/' + day;
  return date;
}

module.exports.home = async function (req, res) {
  // main function to search
  const tagName = req.params.tagName.toLowerCase();
  let index = 1;
  if (req.body && req.body.startIndex) {
    index = req.body.startIndex;
  }
  new Promise(function (resolve, reject) {
    // promise so that we first fetch from blog and then according to it act
    fetchBlogs(tagName, yesterday(index)) // itself it is a promise it come and return list of post in json form
      .then((data) => {
        // console.log('data', data);

        resolve(data);
      })
      .catch((err) => {
        reject(err);
      });
  })
    .then(async (data) => {
      if (data.blogsArray.length > 0) {
        // if it is new tag inserting in db
        let tagData = await tagModel.findOne({ tag: tagName });
        if (!tagData) {
          await tagModel.create({
            tag: tagName,
            releatedTags: data.releatedTags,
          });
        } else {
          tagData.hitCount++;
          tagData.releatedTags = data.releatedTags;
          await tagData.save();
        }
      }
      return res.status(200).json({
        // sending my response
        message: 'fetch succesfully',
        success: true,
        data: data,
      });
    })
    .catch((err) => {
      return res.status(400).json({
        message: err,
        sucesss: false,
      });
    });
};

function fetchBlogs(tagName, date) {
  //promise where i go for medium.com to fetch
  let url = `${BASE_URL}/${tagName}/archive/${date}`;
  //console.log('url', url);
  return new Promise(function (resolve, reject) {
    let responseArray = {};
    request(url, function (err, res, body) {
      //sending request
      if (err) {
        console.log('error found ', err);
        reject(err);
      }
      let $ = cheerio.load(body); //chherio to json form
      responseArray = jsonForm($);
      resolve(responseArray);
    });
  });
}

function jsonForm($) {
  let postArticles = $('.postArticle');

  //console.log('5', postArticles.html());
  let BlogsArray = new Array();
  let releatedTags = [];
  $('.js-moreTags ul.tags li').each(function (index) {
    let arrObj = {
      tag: $(this).text(),
      _id: uuidv4(),
    };
    releatedTags.push(arrObj);
    if (index > 10) {
      return false;
    }
  });
  let refUrl = $('.u-floatLeft a.button').attr('href');
  $(postArticles).each(function (indexBlog) {
    //fetching the posts
    let header = {
      author: {
        name: $(this).find('.ds-link').eq(0).text(),
        nameLink: $(this).find('.ds-link').eq(0).attr('href'),
        community: $(this).find('.ds-link').eq(1).text(),
        communityLink: $(this).find('.ds-link').eq(1).attr('href'),
      },
    };
    let blogInfo = {
      time: $(this).find('.js-postMetaInlineSupplemental>a>time').text(),
      readTime: $(this).find('.readingTime').attr('title'),
      img: $(this).find('.progressiveMedia-image').html(), // see this later
      title: $(this).find('.graf--title').text(),
      subtitle: $(this).find('.graf--trailing').text(),
      linkToRead: $(this).find('.postArticle-readMore>a').attr('href'),
      clap: $(this)
        .find('.u-floatLeft>.multirecommend span.u-relative button')
        .text(),
      response: {
        count: $(this).find('.u-floatRight a').text(),
        link: $(this).find('.u-floatRight a').attr('href'),
      },
    };

    if (blogInfo.response.count === '') {
      blogInfo.response.count = 0;
    }
    let obj = {
      header: header,
      blogInfo: blogInfo,
      _id: uuidv4(),
    };
    if (indexBlog > 100) {
      return false;
    }
    BlogsArray.push(obj);
  });

  return {
    //sending resposne
    releatedTags: releatedTags,
    blogsArray: BlogsArray,
    refUrl: refUrl,
  };
}

module.exports.mostSearch = function (req, res) {
  //most search
  console.log('res', tagModel); //tag Model
  tagModel
    .find({}, 'tag hitCount')
    .sort({ hitCount: -1 })
    .exec(function (err, data) {
      if (err) {
        return res.status(404).json({
          message: err,
          sucesss: false,
        });
      }
      return res.status(200).json({
        success: true,
        message: 'most search',
        data: data,
      });
    });
};

module.exports.content = function (req, res) {
  // go for content
  const url = req.body.url;
  request(url, function (err, response, body) {
    if (err) {
      console.log(err);
      return res.status(400).json({
        success: false,
        message: err,
      });
    }
    let $ = cheerio.load(body);
    let data = $('article').html();

    return res.status(200).json({
      success: true,
      message: 'content come sucessfully',
      data: data,
    });
  });
};

function uuidv4() {
  // a unique function to genearte id
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c == 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}
