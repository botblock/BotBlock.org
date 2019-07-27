const slugify = text => text
    .toString()
    .toLowerCase()
    .replace(/[. ]/, '-');

const librarySlug = lib => `${slugify(lib.language)}-${slugify(lib.name)}`;

module.exports = { slugify, librarySlug }
