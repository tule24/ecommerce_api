class APIFeatures {
    constructor(query, queryString) {
        this.query = query
        this.queryString = queryString
    }

    filter() {
        const queryObj = { ...this.queryString }
        const excludedFields = ["page", "sort", "limit", "fields"]
        excludedFields.forEach(el => delete queryObj[el])

        if (this.queryString.numericFilters) {
            const operatorMap = {
                '>': '$gt',
                '>=': '$gte',
                '=': '$eq',
                '<=': 'lte',
                '<': 'lt'
            }
            const regEx = /\b(<|>|>=|=|<=)/g
            const numericFilters = queryObj["numericFilters"]
            let filter = numericFilters.replace(regEx, match => `-${operatorMap[match]}-`)
            const options = ['price']
            filter = filter.split(',').forEach(item => {
                const [field, operator, value] = item.split('-')
                if (options.includes(field)) {
                    queryObj[field] = { [operator]: Number(value) }
                }
            })
        }

        this.query.find(queryObj)
        return this
    }

    sort() {
        if (this.queryString.sort) {
            const sortBy = this.queryString.sort.split(',').join(" ")
            this.query.sort(sortBy)
        } else {
            this.query.sort({ createdAt: -1 })
        }

        return this
    }

    select() {
        if (this.queryString.fields) {
            const fieldsList = this.queryString.fields.split(',').join(" ")
            this.query = this.query.select(fieldsList)
        } else {
            this.query = this.query.select('-__v')
        }

        return this
    }

    pagination() {
        const page = Number(this.queryString.page) || 1
        const limit = Number(this.queryString.limit) || 10
        const skip = (page - 1) * limit
        this.query.skip(skip).limit(limit)

        return this
    }
}

module.exports = APIFeatures