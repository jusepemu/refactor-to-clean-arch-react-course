export abstract class ValueObject<T> {
    constructor(protected props: T) {}

    equals(vo?: ValueObject<T>) {
        if (vo === null || vo === undefined || !vo?.props) return false

        return JSON.stringify(vo.props) === JSON.stringify(this.props)
    }
}