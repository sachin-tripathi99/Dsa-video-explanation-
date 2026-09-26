class Solution {
public:
    vector<vector<string>> solveNQueens(int n) {
        vector<int> q(n);
        iota(q.begin(), q.end(), 0);
        vector<vector<string>> out;
        do {                                                 // every column permutation
            bool ok = true;
            for (int a = 0; a < n && ok; a++)
                for (int b = a + 1; b < n && ok; b++)
                    if (abs(q[a] - q[b]) == b - a) ok = false;   // shared diagonal
            if (ok) {
                vector<string> board;
                for (int c : q) { string row(n, '.'); row[c] = 'Q'; board.push_back(row); }
                out.push_back(board);
            }
        } while (next_permutation(q.begin(), q.end()));
        return out;
    }
};
