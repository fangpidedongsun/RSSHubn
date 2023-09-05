const got = require('@/utils/got');
const cheerio = require('cheerio');
const timezone = require('@/utils/timezone');
const { parseDate } = require('@/utils/parse-date');

module.exports = async (ctx) => {
    const rootUrl = 'https://www.bjeea.cn/html';
    const currentUrl = `${rootUrl}/bjeeagg`;

    const response = await got({
        method: 'get',
        url: currentUrl,
    });

    const $ = cheerio.load(response.data);

    let items = $('.com-list.clearfix.text-over li')
        .not('.columnName')
        .find('a')
        .toArray()
        .map((item) => {
            item = $(item);

            return {
                title: item.text(),
                link: rootUrl+item.attr('href').replace(/./, ''),
                pubDate: new Date(item.parent().find('span').text()),

            };
        });


    ctx.state.data = {
        title: '北京市考试院公告',
        link: currentUrl,
        item: items,
    };
};
