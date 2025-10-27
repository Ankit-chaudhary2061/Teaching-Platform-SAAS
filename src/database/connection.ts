import { Sequelize, type Dialect } from "sequelize";
// Define the dialect as a Dialect type 
const dialect:Dialect = (process.env.DB_DIALECT as Dialect) || 'mysql';// k database use garana lako vanya kura /Database type


const sequelize = new Sequelize({
database:process.env.DB_NAME || 'teaching-pathsala', // Database name /database ko name 
username:process.env.DB_USER || 'root',// database ko user name / Database username (default: root)
password: process.env.DB_PASSWORD || '',// database ko password  / Database password (empty in your case)
host: process.env.DB_HOST || 'localhost',// database ko location, kaha xa vanne kura , localhost (my computer )/Database host (local machine)
dialect,
port: Number(process.env.DB_PORT ) 

})

sequelize.authenticate()
.then(()=>{
    console.log('Authenticate sucessfully, connected')
})
.catch((error)=>{
    console.log(error)
})

export default sequelize