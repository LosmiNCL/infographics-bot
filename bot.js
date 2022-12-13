require('dotenv').config()

const Discord = require('discord.js')
const Commando = require('discord.js-commando')
const { MessageAttachment } = require('discord.js')
const client = new Discord.Client({intents: ["GUILDS", "GUILD_MESSAGES"]})
const firebase = require('firebase/compat/app')
const database = require('firebase/database')
const { getAuth } = require('firebase/auth')

// Import the functions you need from the SDKs you need
const {initializeApp} = require('firebase/compat/app')

const { getDatabase, onValue, ref } = require('firebase/database')


const { debug } = require('console')
const { get } = require('https')
const querystring = require('querystring')
//const { getAnalytics } = require('firebase/analytics')
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyCe5r-HaLnoeXdLXaau-KKH84wpUKjOwlc",
    authDomain: "infographics-1e883.firebaseapp.com",
    databaseURL: "https://infographics-1e883-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "infographics-1e883",
    storageBucket: "infographics-1e883.appspot.com",
    messagingSenderId: "12543313747",
    appId: "1:12543313747:web:8cfdfef987d86ca84483a6",
    measurementId: "G-6LJR09L8CF"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app)
const db = getDatabase()
const dbref = ref(db)



module.exports = class ImageCommand extends Commando.Command {
    constructor(client) {
        super(client, {
            name: 'image',
            group: 'misc',
            memberName: 'image',
            description: 'Sends an image',
        })
    }
}

client.on("message", msg => {


    if(msg.author.bot) return

    let prefix = msg.content.substring(0,3)
    let keyword = msg.content.substring(3)

    if(!(prefix === '!i ')) return

    if(keyword.length > 30) return

        try{


            const infographicImageRef = ref(db, '/infographics/' + keyword.toLowerCase() + '/image-url')
            var imageUrl = null

            const infographicPostRef = ref(db, '/infographics/' + keyword.toLowerCase() + '/post-url')
            var postUrl = null

            var attachment = null

            onValue(infographicImageRef, (snapshot) => {
                const imageUrl = snapshot.val()
                
                if(imageUrl === null) return
                else{
                   attachment = new MessageAttachment(imageUrl)
                }

            })

            onValue(infographicPostRef, (snapshot) => {
                const postUrl = snapshot.val()

                if(postUrl === null){
                    msg.channel.send("No such keyword!").catch((error) => {console.log("no permission");})
                }
                else{
                    msg.channel.send(postUrl, attachment).catch((error) => {console.log("no permission");})
                }

            })    

            
        }
        catch(err){
            msg.channel.send("No such keyword!").catch((error) => {console.log("no permission");})
            console.log(err)
        }

    }
)

client.login(process.env.BOT_TOKEN)