'use strict'
const path = require('path')
module.exports = function (section) {
  let pkg = require(path.join(process.cwd(), 'package.json'))
  if (!pkg.name) throw new Error(`package.json is missing a 'name' field.`)
  if (!pkg.description) throw new Error(`package.json is missing a 'description' field.`)
  // This API might change, but...
  // for now what I'm doing is saying global modules are handed the 'root' section.
  // Modules typically start with '# name of package' so there is no body, just subsections.
  // (However sometimes you will find modules that list their badges at the top, above the module name.)
  if (!section.subsections[0]) throw new Error(`README must contain a line starting with '#' in order to use the name-and-description plugin.`)
  let titleSection = section.subsections[0]
  titleSection.title = ` ${pkg.name}`
  // Use a heurstic to determine whether to insert or replace the description.
  if (titleSection.body.length === 0) {
    // insert is only choice
    titleSection.body.unshift(pkg.description)
  }
  else if (titleSection.body.length === 1 && titleSection.body[0] === '') {
    // the blank line might be there for a reason
    titleSection.body.unshift(pkg.description)
  }
  else if (titleSection.body.length === 1 && titleSection.body[0] !== '') {
    // No blank line, (Github default README style!) replace the line
    titleSection.body[0] = pkg.description
  }
  else if (titleSection.body.length > 1 && titleSection.body[0] !== '' && titleSection.body[1] === '') {
    // A single line of text, followed by a blank line.
    // That single line of text is definitely the description. Or if not, it will be now.
    titleSection.body[0] = pkg.description
  }
  else if (titleSection.body.length === 2 && titleSection.body[0] === '' && titleSection.body[1] !== '') {
    // A blank line, followed by a single line of text.
    // That single line of text is definitely the description. Or if not, it will be now.
    titleSection.body[1] = pkg.description
  }
  else if (titleSection.body.length > 2 && titleSection.body[0] === '' && titleSection.body[1] !== '' && titleSection.body[2] === '') {
    // A blank line, followed by a single line of text, followed by a blank line.
    // That single line of text is definitely the description. Or if not, it will be now.
    titleSection.body[1] = pkg.description
  }
  else {
    // Insert the line. Next time, this line should match one of the above conditions, so it will
    // be replaced and not duplicated.
    titleSection.body.unshift(pkg.description)
  }
}
