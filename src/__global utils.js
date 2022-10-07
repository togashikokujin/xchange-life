// Started the name with __ so it would float to the top alphabetically and be included first

function toMap(obj) {
  var mapValues = [];

  for (var name in obj) {
    mapValues.push([name, obj[name]])
  }

  return new Map(mapValues)
}