'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Post extends Model {
   
    static associate(models) {
      Post.belongsTo(models.User);
    }
  }
  Post.init({
    title: DataTypes.STRING,
    body: DataTypes.STRING,
    UserId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Post',
  });
  return Post;
};