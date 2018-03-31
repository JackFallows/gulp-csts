const makeParseNameLine = extractGenerics => {
    const makeParseName = starts => lines => {
        let name = lines
            .filter(l => l.startsWith(starts))[0]
            .slice(starts.length)
            .trim();

        let baseClass = null;
        if (name.includes(":")) {
            [name, baseClass] = name.split(":").map(n => n.trim());
        }

        let typeParams = extractGenerics(true, name);
        
        if (typeParams.length > 0) {
            name = name.slice(0, name.indexOf("<"));
        }

        return { name, baseClass, typeParams };
    };

    return {
        parseNamespace: makeParseName("namespace"),
        parseClass: lines => {
            const result = makeParseName("public class")(lines);
            return {
                result,
                parseProperty: () => {} //makeParseName(l => l.startsWith("public") && !l.startsWith("public class"))(result.typeParams)
            }
        }
    };
};

module.exports = makeParseNameLine;