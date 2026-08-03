import "dotenv/config";
import app from "./src/app.js";
import connectTODB from "./src/config/database.js";
const port = process.env.PORT || 3000

connectTODB();

app.listen(port,()=>{
    console.log(`http://localhost:${port}`);
})