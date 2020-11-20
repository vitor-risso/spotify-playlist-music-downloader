require('dotenv/config');
const nodemon = require('nodemon');
const puppeteer = require('puppeteer');
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

    innerText = await page.evaluate(() =>  {
        return JSON.parse(document.querySelector("body").innerText); 
    }); 

   /*  console.log("innerText now contains the JSON"); */

    const musics = []

   for(let i = 0; i < num; i++){
        musics.push(innerText.items[i].track.name)
    }

console.log(musics);

   
    
    /* await browser.close(); */

 

}
    


playlistList()