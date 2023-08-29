const got = require('@/utils/got');
const cheerio = require('cheerio');
const timezone = require('@/utils/timezone');
const { parseDate } = require('@/utils/parse-date');

module.exports = async (ctx) => {
    const rootUrl = 'http://www.bjshy.gov.cn/web/gggs';
    const currentUrl = `${rootUrl}/zpgg/index.html`;

    const response = await got({
        method: 'get',
        url: currentUrl,
    });
    const $ = cheerio.load(response.data);

    let items = $('.list li')
        .not('.columnName')
        .find('a')
        .toArray()
        .map((item) => {
            item = $(item);

            return {
                title: item.text(),
                link: currentUrl+item.attr('href').replace(/./, ''),
                pubDate: new Date(item.parent().find('span').text()),

            };
        });


    ctx.state.data = {
        title: '顺义-公开招聘',
        link: currentUrl,
        item: items,
    };
};
