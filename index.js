require('dotenv/config');
const nodemon = require('nodemon');
const puppeteer = require('puppeteer');

//procura as msc no yt
const yts = require( 'yt-search' )

// le as opçoes do terminal 
var readlineSync = require('readline-sync');


async function playlistList(){
    
    
    const browser = await puppeteer.launch({headless: true});
    const page = await browser.newPage();

    
    // definindo token de segurança e id da playlist
    const playlist_id = readlineSync.question('Qual O ID DA PLAYLIST? ') || process.env.PLAYLIST_ID
    const user_id =  process.env.USER_ID
    const token = process.env.ACESS_TOKEN
    
    // numero de musicas que tem na playlist
    const num = readlineSync.question('Quantas musicas tem na playlist?')
  
    // urls
    const playlistUrl = `https://api.spotify.com/v1/users/${user_id}/playlists/${playlist_id}/tracks`
    

    page.setExtraHTTPHeaders({
        "Authorization": "Bearer " + token
    })
 
   
    await page.goto(playlistUrl)

    var content = await page.content(); 

    // faz o jso aparecer no terminal
    musicJson = await page.evaluate(() =>  {
        return JSON.parse(document.querySelector("body").innerText); 
    }); 

    //array com as musicas
    let musics = []

   for(let i = 0; i < num; i++){
        musics.push(musicJson.items[i].track.name)
    }

    //array com as url
    const arrUrl =[]
    
    
    musics.forEach(async music => {
       //procura as musicas no yt e separa o primeiro link
       const r =  await yts(music)
       const videos = r.videos.slice( 0, 1 )

       
       
       // console.log(arrUrl)
       async function getAll(){
           const promises = videos.map(async (video) => {
              return arrUrl.push(video.url)
            })
            await Promise.all(promises)
            return arrUrl
        } 
        
        console.log(arrUrl)
        getAll()     
    })


    

    
    
    await browser.close();
    
}

playlistList()




// https://www.youtube.com/watch?v=FGazI4_llt8