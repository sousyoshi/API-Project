"use strict";
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA; // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    options.tableName = "Users";
    return queryInterface.bulkInsert(
      options,
      [
        {
          email: "demo@user.io",
          firstName: "Demo",
          lastName: "User",
          username: "Demo-lition",
          hashedPassword: bcrypt.hashSync("password"),
        },
        {
          username: "Batman",
          email: "Bruce@wayne.io",
          hashedPassword: bcrypt.hashSync("iamthebat"),
          firstName: "Bruce",
          lastName: "Wayne",
        },
        {
          username: "Superman",
          email: "Clark@kent.io",
          hashedPassword: bcrypt.hashSync("nokryptonite"),
          firstName: "Clark",
          lastName: "Kent",
        },
        {
          username: "IronMan",
          email: "Tony@Stark.io",
          hashedPassword: bcrypt.hashSync("jarvis"),
          firstName: "Tony",
          lastName: "Stark",
        },
        {
          username: "!SpiderMan",
          email: "Peter@Parker.io",
          hashedPassword: bcrypt.hashSync("webhead"),
          firstName: "Peter",
          lastName: "Parker",
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    options.tableName = "Users";
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      username: { [Op.in]: ["Demo-lition", "Batman", "Superman", "IronMan", "!SpiderMan"] },
    });
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  },
};
