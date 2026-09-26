class Solution {
    vector<vector<string>> out;
    vector<bool> cols, d1, d2;
    vector<int> q;
    void go(int n, int r) {
        if (r == n) {
            vector<string> board;
            for (int c : q) { string row(n, '.'); row[c] = 'Q'; board.push_back(row); }
            out.push_back(board);
            return;
        }
        for (int c = 0; c < n; c++) {
            if (cols[c] || d1[r - c + n] || d2[r + c]) continue;   // attacked
            cols[c] = d1[r - c + n] = d2[r + c] = true; q[r] = c;
            go(n, r + 1);
            cols[c] = d1[r - c + n] = d2[r + c] = false;
        }
    }
public:
    vector<vector<string>> solveNQueens(int n) {
        cols.assign(n, false); d1.assign(2 * n, false); d2.assign(2 * n, false); q.assign(n, 0);
        go(n, 0);
        return out;
    }
};
