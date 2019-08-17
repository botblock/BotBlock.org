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
}

module.exports = FormValidator;
