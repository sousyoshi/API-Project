"use strict";

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA; // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    options.tableName = "Spots";
    return queryInterface.bulkInsert(
      options,
      [
        {
          ownerId: 1,
          address: "1111 1 Lane",
          city: "Demo-city",
          state: "Statopia",
          country: "Demoia",
          lat: 12.3323323,
          lng: 2344.44,
          name: "DemoSpot",
          description: "Beautiful home with blah blah blah.",
          price: 24.99,
        },
        {
          ownerId: 2,
          address: "200 Bat Drive",
          city: "Gotham",
          state: "New York",
          country: "USA",
          lat: 40.7128,
          lng: 74.006,
          name: "BatCave",
          description: "Spacious cave with many amentites. Great for crime fighting.",
          price: 500000,
        },
        {
          ownerId: 3,
          address: "200 Up Up and Away St",
          city: "Metropolis",
          state: "New York",
          country: "USA",
          lat: 50.7128,
          lng: 94.006,
          name: "Fortress of Solitude",
          description: "Spacious ice cave with many amentites. Great for crime fighting.",
          price: 600000,
        }, {
          ownerId: 4,
          address: "200 Up Up and Away St",
          city: "Malibu",
          state: "California",
          country: "USA",
          lat: 30.7128,
          lng: 64.006,
          name: "Palais de Stark",
          description: "Sprawling mansion overlooking the Pacific.",
          price: 900000,
        },
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
    options.tableName = "Spots";
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      ownerId: { [Op.in]: [1, 2, 3, 4] },
    });
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  },
};
