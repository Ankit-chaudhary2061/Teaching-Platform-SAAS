import { Table, DataType, Column, Model } from "sequelize-typescript";

@Table({
  tableName: 'users', // this is shown in ui form in xamp or database 
  modelName: 'User', //  'User' this is used in calling for in project 
  timestamps: true // Adds createdAt and updatedAt automatically
})
class User extends Model {
  @Column({
    primaryKey: true, 
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4
  })
  declare id: string 

  @Column({
    type: DataType.STRING,
    allowNull: false 
  })
  declare username: string

  @Column({
    type: DataType.STRING,
    allowNull: false
  })
  declare password: string

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true, // Email should be unique
    validate: {
    isEmail: true
  }
})
  declare email: string

  @Column({
    type: DataType.ENUM('teacher', 'institute', 'super-admin', 'student'),
    defaultValue: 'student'
  })
  declare role: string
  @Column({
    type :DataType.STRING
  })
  declare currentInstituteNumber :string
}

export default User