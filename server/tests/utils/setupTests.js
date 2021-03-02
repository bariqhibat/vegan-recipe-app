import "regenerator-runtime/runtime";
import mon from "mongoose";
import path from "path";

require("dotenv").config({ path: path.resolve(__dirname, "./.env") });

beforeAll(async () => {
  await mon.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  });
});

afterAll(async (done) => {
  await mon.connection.close();
  done();
});

describe("Environment Variables", () => {
  it("Need to pass", () => {
    expect(process.env.PORT).toBe("4000");
  });
});

beforeEach(async () => {
  // ! Dropping our current testing DB
  await mon.connection.db.dropDatabase();
});
