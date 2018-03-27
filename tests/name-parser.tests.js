const assert = require("assert");
const parseNameLine = require("../name-parser");

describe("name-parser", function () {
    describe("parseNameLine", function () {
        it("picks out a standard class name", function () {
            const lines = [
                "namespace MyNamespace",
                "{",
                "public class MyClass",
                "{",
                "}",
                "}"
            ];

            const [ name ] = parseNameLine(lines, "public class");

            assert.equal(name, "MyClass");
        });
    });
});
