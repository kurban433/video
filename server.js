var express=require("express")
var app=express();
var path=require("path")
var fs=require("fs")
app.set("view engine","ejs")
app.use("/",express.static(path.resolve(__dirname,"")))


app.get("/",(req,res)=>{
    res.render("index")
 })
 app.get("/video",(req,res)=>{
    const range=req.headers.range;
    if (!range) {
        res.status(400).send("requires range header")
    }
    var videoPath="bidbuck.mp4";
    var videoSize=fs.statSync("bidbuck.mp4").size;

    var CHUNK_SIZE = 10 ** 6;
    var start=Number(range.replace(/\D/g,""));
    var end =Math.min(start + CHUNK_SIZE ,videoSize - 1)

    var contentLength= end - start + 1;
    var headers={
        "Content-Range":`bytes ${start}-${end}/${videoSize}`,
        "Accept-Ranges":"bytes",
        "Content-Length":contentLength,
        "Content-Type":"video/mp4",
    }
    res.writeHead(206,headers);
    var videoStream=fs.createReadStream(videoPath,{start,end});
    videoStream.pipe(res);
 })

app.listen("8000",()=>{
    console.log("done");
})