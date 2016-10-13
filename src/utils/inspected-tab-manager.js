const InspectedTabConnection = require('../models/inspected-tab-connection')

const InspectedTabManager = {
  connect: function () {
    return new InspectedTabConnection()
  }
}

module.exports = InspectedTabManager
