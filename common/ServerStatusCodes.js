module.exports = {
    SERVER_STATUS_CODES: {
        // SUCCESS
        LIST_OK: 200,
        DETAIL_OK: 200,
        PURCHASE_OK: 200,

        // ERRORS
        LIST_NOT_FOUND: 404,
        DETAIL_NOT_FOUND: 404,
        PURCHASE_FAILED: 400
    },

    SERVER_ERROR_CODES: {
        // ERRORS
        LIST_NOT_FOUND: 'articles/list-not-found',
        DETAIL_NOT_FOUND: 'articles/article-not-found',
        PURCHASE_FAILED: 'purchase/purchase-failed'
    },

    SERVER_ERROR_MESSAGE: {
        // ERRORS
        LIST_NOT_FOUND: 'No articles in list',
        DETAIL_NOT_FOUND: 'No article with the given ID',
        PURCHASE_FAILED: 'Purchase Failed'
    }
};