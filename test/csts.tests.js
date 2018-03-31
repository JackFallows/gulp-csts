const assert = require("assert");

describe("csts", function () {
    describe("integration tests", function () {
        it("converts basic empty class", function () {
            const csts = require("../csts")(() => {
                return [
                    "using System;",
                    "",
                    "namespace MyNamespace",
                    "{",
                    "public class MyClass",
                    "{",
                    "}",
                    "}"
                ];
            }, () => {});
            
            const actual = csts([]);
            
            const expected = `
// This is a generated file. Any manual changes you make will be overwritten.

declare module MyNamespace {
    export interface IMyClass {
        
    }
}
`;
            
            assert.equal(actual, expected);
        });
        
        const singlePropertyTests = [
            {
                is: "int",
                should: "number"
            },
            {
                is: "string",
                should: "string"
            },
            {
                is: "bool",
                should: "boolean"
            }
        ];
        
        singlePropertyTests.forEach(({ is, should }) => {
            it(`converts single property class (${is})`, function () {
                const csts = require("../csts")(() => {
                    return [
                        "using System;",
                        "",
                        "namespace MyNamespace",
                        "{",
                        "public class MyClass",
                        "{",
                        `public ${is} MyProp { get; set; }`,
                        "}",
                        "}"
                    ];
                }, () => {});

                const actual = csts([]);

                const expected = `
// This is a generated file. Any manual changes you make will be overwritten.

declare module MyNamespace {
    export interface IMyClass {
        MyProp: ${should};
    }
}
`;
                
                assert.equal(actual, expected);
            });
            
        });
    });
});