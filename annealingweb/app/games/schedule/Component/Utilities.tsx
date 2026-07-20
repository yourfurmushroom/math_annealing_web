export interface TagParameter {
    parameter_name: string;
    parameter_alias: string;
    parameter_description: string;
}

export type ConstraintParameters = Record<string, unknown>;

export interface Constraint {
    name: string;
    parameters: ConstraintParameters;
}

export interface TagProps {
    text: string;
    key: string;
    description: string;
    parameters: TagParameter[];
    evaluate: (shift: number[][], parameters: ConstraintParameters) => Promise<number>;
}

function average(arr: number[]) {
    if (arr.length === 0) return 0;

    let total = 0;
    for (const num of arr) {
        total += num;
    }
    return total / arr.length;
}

function sum_range(arr: number[], start: number, end: number) {
    let total = Number(0);
    for (let i = start; i < end; ++i) {
        total += arr[i];
    }
    return total;
}

function sum(arr: number[]) {
    let total = 0;
    for (const num of arr) {
        total += Number(num);
    }
    return total;
}

export const TagsDefinition: TagProps[] = [
    {
        text: '預期工作天數',
        key: 'expected_working_days',
        description: `員工在一個月中預期應該工作的天數。`,
        parameters: [
            {
                parameter_name: '預期工作天數',
                parameter_alias: 'ewd',
                parameter_description: '預期工作天數'
            },
        ],
        evaluate: async (shift: number[][], parameters: ConstraintParameters) => {
            const enwd = Number(parameters["ewd"]);
            if (enwd <= 0) {
                console.warn("expected_working_days: enwd 無效，返回 0");
                return 0;
            }

            const failed_rates: number[] = [];
            for (let i = 0; i < shift.length; ++i) {
                failed_rates.push(Math.abs(enwd - sum(shift[i])) / enwd);
            }
            return Math.max(0, Math.min(1, 1 - average(failed_rates)));
        }
    },
    {
        text: '自訂休假',
        key: 'customize_leave',
        description: `你可以為每個員工自訂休假，請編輯每位員工的班表。 
                      1 代表工作日，0 代表休假日。`,
        parameters: [],
        evaluate: async (shift: number[][], parameters: ConstraintParameters) => {
            const reserved_leave = parameters['reserved_leave'];
            if (!reserved_leave || typeof reserved_leave !== 'object') {
                return 1;
            }

            let failed = 0;
            let amount_of_reserved_leave = 0;
            Object.entries(reserved_leave).forEach(([key, value]) => {
                const row = Number(key);
                for (const col of value as number[]) {
                    if (col < shift[row].length && shift[row][col] !== 0) {
                        failed += 1;
                    }
                    amount_of_reserved_leave += 1;
                }
            });

            return amount_of_reserved_leave ? 1 - (failed / amount_of_reserved_leave) : 1;
        }
    },
    {
        text: '每班預期人數',
        key: 'expected_number_of_workers_per_shift',
        description: `每個班次預期應該安排的員工人數。`,
        parameters: [
            {
                parameter_name: '每班預期人數',
                parameter_alias: 'enwps',
                parameter_description: '每班預期人數'
            }
        ],
        evaluate: async (shift: number[][], parameters: ConstraintParameters) => {
            let failed = 0;
            let number_of_days = 0;
            if (shift.length > 0 && shift[0]) {
                number_of_days = shift[0].length;
            }

            for (let i = 0; i < number_of_days; ++i) {
                let total = 0;
                for (let j = 0; j < shift.length; ++j) {
                    total += Number(shift[j][i]);
                }
                if (total !== Number(parameters['enwps'])) {
                    failed += 1;
                }
            }
            return number_of_days !== 0 ? 1 - failed / number_of_days : 0;
        }
    },
    {
        text: '最長連續工作天數',
        key: 'maximum_consecutive_working_days',
        description: `最長連續工作天數。 
        例如，設定最長連續工作天數為 5，演算法會盡量避免員工連續超過 5 天工作。`,
        parameters: [
            {
                parameter_name: '最長連續工作天數',
                parameter_alias: 'mcwd',
                parameter_description: '最長連續工作天數'
            }
        ],
        evaluate: async (shift: number[][], parameters: ConstraintParameters) => {
            const maximum_consecutive_working_days = Number(parameters["mcwd"]) + 1;
            if (maximum_consecutive_working_days <= 0) {
                console.warn("maximum_consecutive_working_days: mcwd 無效，返回 0");
                return 0;
            }

            const nrows = shift.length;
            const ncols = shift[0]?.length || 0;
            if (ncols <= maximum_consecutive_working_days) {
                console.warn("maximum_consecutive_working_days: ncols 太小，返回 0");
                return 0;
            }

            let failed = 0;
            for (let i = 0; i < nrows; ++i) {
                for (let j = 0; j < ncols - maximum_consecutive_working_days; ++j) {
                    if (sum_range(shift[i], j, j + maximum_consecutive_working_days) >= maximum_consecutive_working_days) {
                        failed += 1;
                    }
                }
            }
            return Math.max(0, Math.min(1, 1 - failed / (nrows * (ncols - maximum_consecutive_working_days))));
        }
    },
    {
        text: '7 天內最少休假天數',
        key: 'minimum_n_days_leave_within_7_days',
        description: `員工在 7 天內至少應該有的休假天數。
        例如，設定為 2，表示員工在 7 天內至少有 2 天休假。`,
        parameters: [
            {
                parameter_name: '7 天內最少休假天數',
                parameter_alias: 'mndlw7d',
                parameter_description: '7 天內最少休假天數'
            }
        ],
        evaluate: async (shift: number[][], parameters: ConstraintParameters) => {
            const n = Number(parameters["mndlw7d"]);
            if (n <= 0 || n >= 7) {
                console.warn("minimum_n_days_leave_within_7_days: mndlw7d 無效，返回 0");
                return 0;
            }

            const nrows = shift.length;
            const ncols = shift[0]?.length || 0;
            let failed = 0;
            const weekend: number[] = [];
            for (let i = 0; i + 7 < ncols; i += 7) {
                weekend.push(i);
            }
            for (let i = 0; i < nrows; ++i) {
                for (let j = 0; j < weekend.length; ++j) {
                    let total = 0;
                    if (weekend[j] + 7 < ncols) {
                        total = sum_range(shift[i], weekend[j], weekend[j] + 7);
                        if (total > 7 - n) failed += 1;
                    }
                }
            }
            return Math.max(0, Math.min(1, 1 - failed / (nrows * weekend.length)));
        }
    },
    {
        text: '連續班次配對',
        key: 'successive_shift_pair',
        description: `連續班次配對：適用於喜歡連續工作天數的員工。`,
        parameters: [],
        evaluate: async (shift: number[][]) => {
            const nrows = shift.length;
            let ncols = 0;
            if (shift.length > 0 && shift[0]) {
                ncols = shift[0].length;
            }

            let failed = 0;
            for (let i = 0; i < nrows; ++i) {
                for (let j = 1; j < ncols - 1; ++j) {
                    if (shift[i][j - 1] === 0 && shift[i][j] === 1 && shift[i][j + 1] === 0) {
                        failed += 1;
                    }
                }
                if ((shift[i][0] === 1 && shift[i][1] === 0) || (shift[i][ncols - 1] === 1 && shift[i][ncols - 2] === 0)) {
                    failed += 1;
                }
            }

            return nrows * ncols > 0 ? 1 - (failed / (nrows * ncols)) : 0;
        }
    },
    {
        text: '連續休假',
        key: 'consecutive_2_days_leave',
        description: `演算法會盡量安排員工有連續休假日。`,
        parameters: [],
        evaluate: async (shift: number[][]) => {
            const nrows = shift.length;
            let all_leave = 0;
            let all_consecutive_shift_pair = 0;
            const leave_re = /0+/g;
            const consecutive_leave_re = /(?:00)+0*/g;
            for (let i = 0; i < nrows; ++i) {
                const row = shift[i].join('');
                all_consecutive_shift_pair += [...row.matchAll(consecutive_leave_re)].length;
                all_leave += [...row.matchAll(leave_re)].length;
            }
            return all_leave > 0 ? all_consecutive_shift_pair / all_leave : 0;
        }
    },
    {
        text: '不允許連續休假',
        key: 'no_consecutive_leave',
        description: `演算法會盡量避免安排員工連續休假。`,
        parameters: [],
        evaluate: async (shift: number[][]) => {
            const nrows = shift.length;
            let ncols = 0;
            if (shift.length > 0 && shift[0]) {
                ncols = shift[0].length;
            }

            let failed = 0;
            let amount_of_leave = 0;

            for (let i = 0; i < nrows; ++i) {
                for (let j = 0; j < ncols - 1; ++j) {
                    if (shift[i][j] === 0) {
                        amount_of_leave += 1;
                    }

                    if (shift[i][j] === 0 && shift[i][j + 1] === 0) {
                        failed += 1;
                    }
                }
            }
            return amount_of_leave === 0 ? 1 : 1 - (failed / amount_of_leave);
        }
    }
]
