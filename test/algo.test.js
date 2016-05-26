const expect = require('chai').expect;

function foo() {
    return {foo: "bar"};
}

describe("client-side tally", function () {

  it("should show correct results for events that happened on the minute", function () {
    var serverData = [
      {
        "id": 7,
        "created_at": "2016-05-26T22:21:23.597Z",
        "status_id": 1,
        "user_id": 1,
        "lecture_id": 1,
        "status": "I don't get it"
      },
      {
        "id": 4,
        "created_at": "2016-05-26T22:21:03.597Z",
        "status_id": 1,
        "user_id": 1,
        "lecture_id": 1,
        "status": "I don't get it"
      }
    ]

    var expectedOutput = {

      1: { 1: 1, 2: 2, 3: 0 },

      2: { 1: 1, 2: 2, 3: 0 },

      3: { 1: 1, 2: 2, 3: 0 },

      4: { 1: 1, 2: 2, 3: 0 },

      5: { 1: 1, 2: 2, 3: 0 },

    }

    expect(foo(serverData)).to.deep.equal(expectedOutput);

  })

})
