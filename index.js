'use strict'
const path = require('path')
module.exports = function (sections) {
  let pkg = require(path.join(process.cwd(), 'package.json'))
  if (!pkg.name) throw new Error(`package.json is missing a 'name' field.`)
  if (!pkg.description) throw new Error(`package.json is missing a 'description' field.`)
  let titleSectionString = `# ${pkg.name}\n${pkg.description}\n\n`
  // Create if missing.
  if (sections.length === 0) {
    sections.unshift(titleSectionString)
    return sections
  }
  // Find where the title section is. It should be the first or second.
  let position = 0
  // Modules typically start with '# name of package' but sometimes you will find modules
  // that list their badges at the top, above the module name.
  if (!sections[0].startsWith('#') && sections.length > 1) position = 1
  // This is the first header. If it doesn't contain a module name, we
  // need to insert this section.
  if (!sections[position].match(/^#\s*@?[a-zA-Z0-9-._/]+$/m)) {
    sections.splice(position, 0, titleSectionString)
    return sections
  }
  // Split apart title section
  let lines = sections[position].split(/$/gm)
  // Update the title section (simple case)
  if (lines.length < 3) {
    sections[position] = titleSectionString
    return sections
  }
  // Update the title section, being careful about extended descriptions.
  lines.splice(0, 2, `# ${pkg.name}\n${pkg.description}`)
  sections[position] = lines.join('')
  return sections
}
