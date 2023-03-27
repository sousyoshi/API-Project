"use strict";

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA; // define your schema in options object
}
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    options.tableName = "Reviews";
    return queryInterface.bulkInsert(
      options,
      [
        {
          spotId: 2,
          userId: 2,
          review: "Great place to study my rogues gallery.",
          stars: 5,
        },
        {
          spotId: 2,
          userId: 3,
          review: "Too many bats. Need more ice!",
          stars: 2,
        },
        {
          spotId: 3,
          userId: 2,
          review: "Cold. But not as cold as my heart.",
          stars: 4,
        },
        { spotId: 2,
          userId: 1,
          review: "Cool tech. Cool cars. Cool t-rex. No time machine though.",
          stars: 4,},

          {spotId: 3,
            userId: 2,
            review: "Ehhhh, honestly not that nice.",
            stars: 2

          }
      ],
      {}
    );
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
     */
  },

  async down(queryInterface, Sequelize) {
    options.tableName = 'Reviews'
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, null)
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  },
};
