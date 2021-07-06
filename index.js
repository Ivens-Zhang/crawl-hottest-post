//引入puppeteer模块
const puppeteer = require('puppeteer');

//思否、掘金网址
const urlSegmentfault = 'https://segmentfault.com/blogs/hottest/monthly';
const urlJuejin = 'https://juejin.cn/frontend?sort=monthly_hottest';

//因为要请求信息，这里我们加入async
async function d () {
  //1. 打开浏览器
  const browser = await puppeteer.launch({
    args: ['--no-sandbox'],
    // headless: false    //以无头浏览器的形式打开浏览器，没有界面显示，在后台运行的
  });
  //2. 创建tab标签页
  const page = await browser.newPage();
  //3. 跳转到指定网址
  await page.goto(urlSegmentfault, {
    waitUntil: 'networkidle2'  //等待网络空闲时，在跳转加载页面
  });
  //4. 等待网址加载完成，开始爬取数据
  //开启延时器，延时2秒钟在开始爬取数据
  await timeout();
  
  await page.addScriptTag({url: 'https://code.jquery.com/jquery-3.2.1.min.js'});

  let result = await page.evaluate(() => {
    //对加载好的页面进行dom操作
    //所有爬取的数据数组
    let result = [];
    //获取所有热门电影的li，这里可以打开开发者选项进行标签的筛选
    // const $list = $('#nowplaying>.mod-bd>.lists>.list-item');
    const $list = $('ul.list-group.list-group-flush li');
    //这里我们只取8条数据
    for (let i = 0; i < 5; i++) {
      const liDom = $list[i];
      content = $(liDom).find('a')
      postTitle = content.html()
      let strFliter = postTitle.includes("面试");
      if (strFliter) {
        continue
      }
      postUrl = content.prop('href');
      result.push({
        postTitle,
        postUrl
      })
    }

    
    //将爬取的数据返回出去
    return result;
  })
  
  console.log(result);

  await page.goto(urlJuejin, {
    waitUntil: 'networkidle2'  //等待网络空闲时，在跳转加载页面
  });
  
  await timeout();

  await page.addScriptTag({url: 'https://code.jquery.com/jquery-3.2.1.min.js'});

  result = await page.evaluate(() => {
    //对加载好的页面进行dom操作
    //所有爬取的数据数组
    let result = [];
    //获取所有热门电影的li，这里可以打开开发者选项进行标签的筛选
    // const $list = $('#nowplaying>.mod-bd>.lists>.list-item');
    const $list = $('ul.entry-list>div>li');
    let title
    //这里我们只取8条数据
    for (let i = 0; i < 5; i++) {
      const liDom = $list[i];
      content = $(liDom).find('.title')
      postTitle = content.attr('title')

      const strFliter1 = postTitle.includes("面试");
      const strFliter2 = postTitle.includes("笔试");
      const strFliter3 = postTitle.includes("简历");
      const strFliter4 = postTitle.includes("面经");
      const strFliterResult = strFliter1 || strFliter2 || strFliter3 || strFliter4

      if (strFliterResult) {
        continue
      }
      postUrl = content.prop('href');
      result.push({
        postTitle,
        postUrl
      })
    }

    
    //将爬取的数据返回出去
    return result;
  })

  console.log(result);

  //遍历爬取到的8条数据
  // for (let i = 0; i < result.length; i++) {
  //   //获取条目信息
  //   let item = result[i];
  //   //获取电影详情页面的网址
  //   let url = item.href;
    
  //   //跳转到电影详情页
  //   await page.goto(url, {
  //     waitUntil: 'networkidle2'  //等待网络空闲时，在跳转加载页面
  //   });
  
  //   //爬取其他数据
  //   let itemResult = await page.evaluate(() => {
  //     let genre = [];
  //     //类型
  //     const $genre = $('[property="v:genre"]');
  
  //     for (let j = 0; j < $genre.length; j++) {
  //       genre.push($genre[j].innerText);
  //     }
      
  //     //简介
  //     const summary = $('[property="v:summary"]').html().replace(/\s+/g, '');
      
  //     //上映日期
  //     const releaseDate = $('[property="v:initialReleaseDate"]')[0].innerText;
      
  //     //给单个对象添加两个属性
  //     return {
  //       genre,
  //       summary,
  //       releaseDate
  //     }
      
  //   })
  
  //   // console.log(itemResult);
  //   //在最后给当前对象添加三个属性
  //   //在evaluate函数中没办法读取到服务器中的变量
  //   item.genre = itemResult.genre;
  //   item.summary = itemResult.summary;
  //   item.releaseDate = itemResult.releaseDate;
    
  // }
  
  // console.log(result);
  
  //5. 关闭浏览器
  await browser.close();
  
  //最终会将数据全部返回出去
  return result;
}

function timeout() {
  return new Promise(resolve => setTimeout(resolve, 2000))
}

d()