class FormValidator {
    /**
     * Validate list data.
     * @param id Old / new list id
     * @param data
     * @param user
     * @param edit
     * @return {string[] | null}
     */
    static validateList(id, data, user, edit = true) {
        if (!data || !user) return null;
        let errors = [];
        if (edit && user.mod && !user.admin && data.id !== id) errors.push('List ID cannot be edited by mod');
        if (!data.id) errors.push('ID is required');
        if (!data.name) errors.push('Name is required');
        if (!data.url) errors.push('URL is required');
        if (!data.icon) errors.push('Icon is required');
        return errors;
    }

    /**
     * Validate feature data.
     * @param data
     * @returns {string[] | null}
     */
    static validateFeature(data) {
        if (!data) return null;
        let errors = [];
        if (!data.name) errors.push('Name is required');
        if (isNaN(data.type)) errors.push('Type is not a valid number');
        if (!isNaN(data.type)) {
            if (Number(data.type) < 0 || Number(data.type) > 2 || !Number.isInteger(Number(data.type))) errors.push('Invalid type provided');
        }
        if (isNaN(data.display)) errors.push('Display is not a valid number');
        if (!isNaN(data.display)) {
            if (Number(data.display) < 0 || !Number.isInteger(Number(data.display))) errors.push('Invalid display provided');
        }
        return errors;
    }

    /**
     * Validate about section data.
     * @param data
     * @returns {string[] | null}
     */
    static validateAboutSection(data) {
        if (!data) return null;
        let errors = [];
        if (!data.id) errors.push('ID is required');
        if (!data.title) errors.push('Title is required');
        if (isNaN(data.position)) errors.push('Position must be a valid number');
        if (!data.content) errors.push('Content is required');
        return errors;
    }
}

module.exports = FormValidator;
