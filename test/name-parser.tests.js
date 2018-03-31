const assert = require("assert");

const typeMap = require("../type-map")([]);
const extractGenerics = require("../extract-generics")(typeMap);
const { parseNamespace, parseClass } = require("../name-parser")(extractGenerics);

describe("parseNameLine", function () {
    describe("parseNamespace", function () {
        it("picks out namespace", function () {
            const lines = [
                "namespace MyNamespace",
                "{",
                "}"
            ];

            const { name } = parseNamespace(lines);

            assert.equal(name, "MyNamespace");
        });

        it("picks out namespace with usings before it", function () {
            const lines = [
                "using Abc.Thing;",
                "using Abc.Thing.OtherThing;",
                "namespace MyNamespace",
                "{",
                "}"
            ];

            const { name } = parseNamespace(lines);

            assert.equal(name, "MyNamespace");
        });
    });

    describe("parseClass", function () {
        it("picks out a standard class name", function () {
            const lines = [
                "namespace MyNamespace",
                "{",
                "public class MyClass",
                "{",
                "}",
                "}"
            ];

            const { result: { name } } = parseClass(lines);

            assert.equal(name, "MyClass");
        });

        it("picks out base class name", function () {
            const lines = [
                "namespace MyNamespace",
                "{",
                "public class MyClass : BaseClass",
                "{",
                "}",
                "}"
            ];

            const { result: { name, baseClass: base } } = parseClass(lines);

            assert.equal(name, "MyClass");
            assert.equal(base, "BaseClass");
        });


        const typeParametersTests = [
            {
                is: "single type",
                params: "T",
                number: 1,
                should: ["T"]
            },
            {
                is: "multiple types, no spaces",
                params: "T,U,V",
                number: 3,
                should: ["T", "U", "V"]
            },
            {
                is: "multiple types, standard spaces",
                params: "T, U, V",
                number: 3,
                should: ["T", "U", "V"]
            },
            {
                is: "multiple types, extra spaces",
                params: "T,  U,  V",
                number: 3,
                should: ["T", "U", "V"]
            }
        ];

        typeParametersTests.forEach(test => {
            it(`picks out type parameters (${test.is})`, function () {
                const lines = [
                    "namespace MyNamespace",
                    "{",
                    `public class MyClass<${test.params}>`,
                    "{",
                    "}",
                    "}"
                ];

                const { result: { name, baseClass: base, typeParams: types } } = parseClass(lines);

                assert.equal(name, "MyClass");
                assert.equal(base, null);
                assert.equal(types.length, test.number);
                test.should.forEach((s, i) => {
                    assert.equal(types[i], s);
                });
            });
        });
    });
});
