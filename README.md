# gulp-csts
This is a Gulp plugin for generating Typescript `*.d.ts` files from C# classes. The generated `d.ts` files will declare a module named the same as the namespace the C# class resides in. The class will become a TypeScript interface named the same, but with an "I" in front of the name. The file will be named after the class.

## Limitations

Currently, each \*.cs file must have only one class inside it. That class must only contain properties. Fields may work, but are as yet untested). Expression-bodied properties may work but, again, are untested.

## Installing

```
npm install --save-dev gulp-csts
```

## Including

```
const csts = require("gulp-csts");
```

## Using

```
gulp.src("./path/to/csharp/classes/*.cs")
  .pipe(csts({
    outputDir: "./typings",
    types: {
      "MyUntypedClass": any,
      "MyClassTypedElsewhere": "IMyClassTypedElsewhere"
    }
  });
```

## Supported options

* `outputDir`: **required** - tells csts the folder where it should output the `*.d.ts` files
* `types`: *optional* - provides a set of custom type mappings, in case e.g. the typings have already been manually created
