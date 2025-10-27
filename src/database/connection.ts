import { Sequelize } from "sequelize-typescript";
// Define the dialect as a Dialect type 
import type { Dialect } from "sequelize"; 



const dialect:Dialect = (process.env.DB_DIALECT as Dialect) || 'mysql';// k database use garana lako vanya kura /Database type

const sequelize = new Sequelize({
database:process.env.DB_NAME || 'teaching-pathsala', // Database name /database ko name 
username:process.env.DB_USER || 'root',// database ko user name / Database username (default: root)
password: process.env.DB_PASSWORD || '',// database ko password  / Database password (empty in your case)
host: process.env.DB_HOST || 'localhost',// database ko location, kaha xa vanne kura , localhost (my computer )/Database host (local machine)
dialect  ,
port: Number(process.env.DB_PORT ) ,
 models: ['./src/database/model/userModels'] 
})

sequelize.authenticate()
  .then(() => {
    console.log('Authenticated successfully, connected')
  })
  .catch((error) => {
    console.log('Database connection error:', error)
  })


  sequelize.sync({alter:true}).then(()=>{
    console.log('migrated sucessfully new chnages ')
  })

export default sequelize 