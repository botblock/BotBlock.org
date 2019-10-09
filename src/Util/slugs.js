const slugify = text => text
    .toString()
    .toLowerCase()
    .replace(/[. ]/, '-')
    .replace(/#/, 'sharp');

const librarySlug = lib => `${slugify(lib.language)}-${slugify(lib.name)}`;

module.exports = { slugify, librarySlug };
