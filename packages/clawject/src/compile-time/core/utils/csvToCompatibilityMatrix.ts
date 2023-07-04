/**
 * Values in the matrix are either 'yes' or 'no'.
 *
 * The First row is column names.
 *
 * First column in first row is always empty.
 *
 * T - HeaderValue.
 *
 * The first column in other rows is row name.
 *
 * V - Row name.
 * */
export const csvToCompatibilityMatrix = <T, V>(csv: string): Map<T, Set<V>> => {
    const rows = csv.split('\n');
    const splitRows = rows.map(row => row.split(',').map(it => it.trim()));
    const header = splitRows[0];
    const matrix = new Map<T, Set<V>>();

    header.forEach((columnName, index) => {
        if (index === 0) {
            return;
        }

        const values = new Set<V>();
        matrix.set(columnName as T, values);

        splitRows.forEach((row, rowIndex) => {
            if (rowIndex === 0) {
                return;
            }

            const rowName = row[0];
            const rowValue = row[index];

            if (rowValue === 'yes') {
                values.add(rowName as V);
            }
        });
    });

    return matrix;
};
